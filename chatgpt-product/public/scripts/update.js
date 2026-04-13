export function save_selected(selected_products) {
    localStorage.setItem('selected_products', JSON.stringify([...selected_products]));
}

export function update_data(data, product_list, selected_products, product_categories) {
    data.products.forEach(product => {
        product_list.set(product.id, product);
        if (product_categories.has(product.category)) return;
        product_categories.add(product.category);
    });
    load_selected().forEach(id => {
        if (product_list.has(id)) selected_products.add(id);
    });
}

function load_selected() {
    try {
        const saved = localStorage.getItem('selected_products');
        if (saved) return new Set(JSON.parse(saved));
    } catch { }
    return new Set();
}