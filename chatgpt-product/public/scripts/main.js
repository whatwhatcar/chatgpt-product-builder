import { show_product } from './popup/show.js'
import { update_button } from './popup/update.js'

import { checkout_product, clear_checkout } from './cart/checkout/show.js'
import { render_product, highlight, filter_product, clear_products } from './cart/shopping/show.js'

import { add_category } from './search/category.js'
import { prompt_message, reply_message } from './chat/receive.js'

let product_list = new Map(); //id, product
let selected_products = new Set(); // multiple id
let product_categories = new Set(); // category names

function save_selected() {
    localStorage.setItem('selected_products', JSON.stringify([...selected_products]));
}

function load_selected() {
    try {
        const saved = localStorage.getItem('selected_products');
        if (saved) return new Set(JSON.parse(saved));
    } catch { }
    return new Set();
}

function update(data) {
    const saved = load_selected();
    data.products.forEach(product => {
        product_list.set(product.id, product);
        render_product(product);
        if (product_categories.has(product.category)) return;
        product_categories.add(product.category);
        add_category(product.category);
    });
    saved.forEach(id => {
        if (!product_list.has(id)) return;
        selected_products.add(id);
        highlight(id);
        checkout_product(product_list.get(id));
    });
}

fetch('products.json')
    .then(res => res.json())
    .then(data => update(data))
    .catch(err => console.error("Failed to fetch products: ", err)
    );

export function clear_all() {
    selected_products.forEach(highlight);
    selected_products.clear();
    save_selected();
    clear_checkout();
    selected_products.forEach(id => {
        checkout_product(product_list.get(id));
    });
}

export function get_product(product_id) {
    const selected = selected_products.has(product_id);
    show_product(product_list.get(product_id));
    update_button(selected);
}

export function add_to_cart(product_id) {
    const selected = selected_products.has(product_id);
    selected ? selected_products.delete(product_id) : selected_products.add(product_id);
    save_selected();
    update_button(!selected);

    highlight(product_id);

    clear_checkout();
    selected_products.forEach(id => {
        checkout_product(product_list.get(id));
    });
}

export function search_products(category, name) {
    clear_products();
    for (const [id, product] of product_list) {
        if (
            (!category || product.category === category) &&
            (!name || product.name.toLowerCase().includes(name))
        ) {
            filter_product(id);
        }
    };
}

import { get_message } from './message.js'

let messages = [];
let request_in_flight = false;

export function receive_message(input_text) {
    if (request_in_flight) return;
    request_in_flight = true;

    prompt_message(input_text);
    messages.push({ role: "user", content: input_text });

    console.log(input_text);
    console.log(selected_products);

    (async () => {
        try {
            const data = await get_message(
                messages,
                [...product_list.values()], // ✅ Map → array of product objects
                [...selected_products].map(id => product_list.get(id))
            );
            // ✅ removed the wrong messages.push here — get_message already does it
            reply_message(data);
        } finally {
            request_in_flight = false;
        }
    })();
}
