import { get_product } from '../../main.js'
import { change_current } from '../../popup/buttons.js'

const product_list = document.getElementById("product-list");

product_list.addEventListener('click', (event) => {
    const product = event.target.closest('.product');
    if (!product) return;
    change_current(Number(product.dataset.product_id));
    get_product(Number(product.dataset.product_id));
});