import { search_products } from '../main.js';

const search_bar = document.getElementById('search-bar');
const category_list = document.getElementById('category-list');

const trigger_search = () => search_products(category_list.value, search_bar.value.trim().toLowerCase());

search_bar.addEventListener('input', trigger_search);
category_list.addEventListener('change', trigger_search);