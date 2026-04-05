const category_list = document.getElementById('category-list');

export function add_category(category) {
    const option = document.createElement('option');
    option.text = category;
    option.value = category;
    category_list.appendChild(option);
}