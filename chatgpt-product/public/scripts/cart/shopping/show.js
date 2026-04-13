const product_list = document.getElementById("product-list");
const product_elements = new Map();

export function render_product(product) {
    if (product_elements.has(product.id)) return;

    const element = document.createElement("div");
    element.dataset.productId = product.id;
    element.textContent = product.name;
    element.classList.add("product");
    element.classList.remove("hidden");
    
    product_list.appendChild(element);
    product_elements.set(product.id, element);
}

export function hide_products() {
    for (const element of product_elements.values())
        element.classList.add("hidden");
}

export function filter_product(id) {
    const element = product_elements.get(id);
    if (element) element.classList.remove("hidden");
}

export function highlight(id, selected) {
    const element = product_elements.get(id);
    if (element) element.classList.toggle("cart", selected);
}