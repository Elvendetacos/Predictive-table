const predictiveParser = require('./analizer.js');

const input = "alter table juan add maria varchar"
let tokens = input.split(" ");

for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "alter" && tokens[i + 1] === "table") {
        tokens[i] = "'alter table'";
        tokens.splice(i + 1, 1);
    }
}

let result = predictiveParser(tokens);