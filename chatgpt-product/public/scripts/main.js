import { show_product } from './popup/show.js'
import { update_button } from './popup/update.js'

import { highlight, filter_product, hide_products, render_product } from './cart/shopping/show.js'
import { checkout_product, hide_checkout, render_item } from './cart/checkout/show.js'

import { prompt_message, reply_message } from './chat/receive.js'
import { get_message } from './message.js'

import { update_data, save_selected } from './update.js'
import { add_category } from './search/category.js'

let messages = [];
let request_in_flight = false;

const product_list = new Map(); //id, product
const selected_products = new Set(); // multiple id
const product_categories = new Set(); //category names

function update(data) {
    update_data(data, product_list, selected_products, product_categories)
    product_categories.forEach(category => add_category(category));
    product_list.forEach(product => {
        render_product(product);
        render_item(product);
    });
    selected_products.forEach(id => {
        highlight(id, true);
        checkout_product(id);
    });
}

fetch('products.json')
    .then(res => res.json())
    .then(data => update(data))
    .catch(err => console.error("Failed to fetch products: ", err)
    );

export function clear_all() {
    selected_products.forEach(id => highlight(id, false));
    selected_products.clear();
    save_selected(selected_products);
    hide_checkout();
}

export function get_product(product_id) {
    const product = product_list.get(product_id); if (!product) return;
    show_product(product);
    update_button(selected_products.has(product_id));
}

export function add_to_cart(product_id) {
    selected_products.has(product_id) ? selected_products.delete(product_id) : selected_products.add(product_id); // add/remove product
    save_selected(selected_products);
    const selected = selected_products.has(product_id);
    update_button(selected);

    highlight(product_id, selected);

    hide_checkout();
    selected_products.forEach(id => {
        const product = product_list.get(id);
        if (product) checkout_product(id);
    });
}
// both cateory and name are automatically lowercased
export function search_products(category, name) {
    hide_products();
    for (const [id, product] of product_list) {
        if ((!category || product.category.toLowerCase() === category) &&
            (!name || product.name.toLowerCase().includes(name))) {
            filter_product(id);
        }
    }
}

export function receive_message(input_text) {
    if (request_in_flight) return;
    request_in_flight = true;

    prompt_message(input_text);
    messages.push({ role: "user", content: input_text });

    //errors are sent out as messages and handled by get_messages
    (async () => {
        try {
            const message = await get_message(
                messages,
                Array.from(product_list.values()),
                Array.from(selected_products, id => product_list.get(id))
            );
            reply_message(message);
        } finally {
            request_in_flight = false;
        }
    })();
}

export function generate_routine() {
    const input_text = "Generate a routine for me.";
    receive_message(input_text);
}