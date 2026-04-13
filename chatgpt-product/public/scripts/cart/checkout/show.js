const products_selected = document.getElementById("products-selected");
const product_elements = new Map();

export function render_item(product) {
    if (product_elements.has(product.id)) return;

    const element = document.createElement("div");
    element.dataset.productId = product.id;
    element.textContent = product.name;
    element.classList.add("product");
    element.classList.add("hidden");
    
    products_selected.appendChild(element);
    product_elements.set(product.id, element);
}

export function hide_checkout() {
    for (const element of product_elements.values())
        element.classList.add("hidden");
}

export function checkout_product(id) {
    const element = product_elements.get(id);
    if (element) element.classList.remove("hidden");
}