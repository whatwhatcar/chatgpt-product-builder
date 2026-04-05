const add_button = document.getElementById("popup-add");

export function update_button(selected) {
    add_button.classList.toggle("selected", selected);
}