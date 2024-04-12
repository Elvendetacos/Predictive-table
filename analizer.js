const productions = {
    "E": ["C D"],
    "D": ["I A V"],
    "I": ["L R"],
    "L": ["a..z"],
    "R": ["L R", "ε"],
    "A": ["add"],
    "C": ["'alter table'"],
    "V": ["I T"],
    "T": ["varchar", "date"],
}

const predictiveTable = {
    "E": {"'alter table'": ["C", "D"]},
    "D": {"a..z": ["I", "A", "V"]},
    "I": {"a..z": ["L", "R"]},
    "L": {"a..z": ["a..z"]},
    "R": {"a..z": ["L", "R"], "add": ["ε"], "varchar": ["ε"], "date": ["ε"]},
    "A": {"add": ["add"]},
    "C": {"'alter table'": ["'alter table'"]},
    "V": {"a..z": ["I", "T"]},
    "T": {"varchar": ["varchar"], "date": ["date"]},
}

terminals = ["a..z", "add", "'alter table'", "varchar", "date"]
non_terminals = ["E", "D", "I", "L", "R", "A", "C", "V", "T"]

function predictiveParser(input) {
    let stack = ["$", "E"];
    let pointer = 0;
    let stack_temp = [];

    while (stack.length > 0) {
        let top = stack[stack.length - 1];
        console.log(pointer);
        console.log(stack);
        stack_temp.push(stack.join(" "));
        let current = input[pointer];
        before = stack[stack.length - 1];

        if (!terminals.includes(input[pointer]) && input[pointer] != undefined) {
            current = "a..z";
        }

        if (terminals.includes(top)) {
            if (top === current) {
                stack.pop();
                pointer++;
            } else {
                return ["Error de sintaxis", stack_temp];
            }
        } else if (non_terminals.includes(top)) {
            if (predictiveTable[top] && predictiveTable[top][current]) {
                if (predictiveTable[top][current][0] === "ε") {
                    stack.pop();
                    continue;
                }else{
                    stack.pop();
                }
                let symbols = predictiveTable[top][current];
                for (let i = symbols.length - 1; i >= 0; i--) {
                    stack.push(symbols[i]);
                }
            } else {
                let expectedSymbols = Object.keys(predictiveTable[top]);
                for (let i = 0; i < expectedSymbols.length; i++) {
                    if (expectedSymbols[i] == input[pointer-1]) {
                        console.log(expectedSymbols[i] + " " + input[pointer-1] + " " + pointer);
                        expectedSymbols.splice(i, 1);
                    }
                }
                if (input[pointer] == undefined){
                    return [`Error de sintaxis '${input[pointer-1]}'. Se esperaba ${expectedSymbols}, pero se encontro el final`, stack_temp];
                }else{
                    return [`Error de sintaxis '${input[pointer-1]}'. Se esperaba ${expectedSymbols}, pero se encontro ${input[pointer]}`, stack_temp];
                }
            }
        } else {
            if (stack[stack.length - 1] === "$"){
                return ["Todo bien", stack_temp];
            }else{
                return ["Error de sintaxis", stack_temp];
            }
        }
    }
}

["'alter table'", "a..z", "add", "a..z", "varchar|date"]