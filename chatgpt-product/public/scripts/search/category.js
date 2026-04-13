const category_list = document.getElementById('category-list');

export function add_category(category) {
    const option = document.createElement('option');
    option.textContent = category.toLowerCase();
    option.value = category.toLowerCase();
    category_list.appendChild(option);
}