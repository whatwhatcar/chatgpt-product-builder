const products_selected = document.getElementById("products-selected");

export function clear_checkout() {
    products_selected.replaceChildren();
}

export function checkout_product(product) {
    const element = document.createElement("div");
    element.classList.add("product");
    element.textContent = product.name;
    element.dataset.product_id = product.id;
    products_selected.append(element);
}