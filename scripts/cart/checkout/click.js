import { get_product } from '../../main.js'
import { change_current } from '../../popup/buttons.js'

const products_selected = document.getElementById("products-selected");

products_selected.addEventListener('click', (event) => {
    const product = event.target.closest('.product');
    if (!product) return;
    change_current(Number(product.dataset.product_id));
    get_product(Number(product.dataset.product_id));
});