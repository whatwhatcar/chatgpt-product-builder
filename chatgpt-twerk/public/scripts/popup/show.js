const popup = document.getElementById("popup");

const popup_name = document.getElementById("popup-name");
const popup_brand = document.getElementById("popup-brand");
const popup_category = document.getElementById("popup-category");
const popup_image = document.getElementById("popup-image");
const popup_description = document.getElementById("popup-description");

export function show_product(product) {
    popup_name.textContent = product.name;
    popup_brand.textContent = product.brand;
    popup_category.textContent = product.category;
    popup_image.textContent = product.image;
    popup_description.textContent = product.description;

    popup.style.display = 'grid';
}