import { generate_routine } from '../../main.js'

const input = "generate a routine with the following products: "

const routine_button = document.getElementById("routine-button");
routine_button.addEventListener('click', generate_routine);