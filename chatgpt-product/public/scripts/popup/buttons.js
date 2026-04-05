import { add_to_cart } from '../main.js'

const popup = document.getElementById("popup");
const close_button = document.getElementById("popup-close");
const add_button = document.getElementById("popup-add");

let current_product;

export function change_current(product_id) {
    current_product = product_id;
}

close_button.addEventListener('click', () => popup.style.display = 'none');
add_button.addEventListener('click',  () => add_to_cart(current_product));