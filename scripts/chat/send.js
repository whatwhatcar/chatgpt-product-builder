import { receive_message } from '../main.js'

const input_field = document.getElementById("input-field");
const send_button = document.getElementById("send-button");

const actions = {
    Escape: () => {
        input_field.value = "";
        input_field.blur();
    },
    Enter: () => {
        const input_text = input_field.value.trim();
        if (input_text === "") return;
        input_field.value = "";
        receive_message(input_text);
    }
}

input_field.addEventListener('keydown', ({ key }) => actions[key]?.());
send_button.addEventListener('click', actions.Enter);