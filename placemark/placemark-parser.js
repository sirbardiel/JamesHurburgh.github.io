    
    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function chooseRandom(list) {
        return list[randBetween(0, list.length)];
    }

    function shuffle(array){
        var currentIndex = array.length, temporaryValue, randomIndex;

        while(0 !== currentIndex){
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    
    function parse(output){
        var tables = [];

        var tablesRegex = new RegExp(/{{{([^{}]*?:::[^{}]*?)}}}/);
        var tableMatch;
        while (tableMatch = tablesRegex.exec(output)) {
            var tableDef = tableMatch[1].split(":::");
            var name = tableDef[0];
            var list = tableDef[1];

            tables[name] = list.split("|");

            output = output.replace(tableMatch[0], "");
        }

        var placeMarkRegex = new RegExp(/{{([^{}]*?)}}/);
        var placeMarkMatch;
        while (placeMarkMatch = placeMarkRegex.exec(output)) {
            var choice;
            var fullMatch = placeMarkMatch[0];
            var innerText = placeMarkMatch[1];
            var functionCall = innerText.split("::");
            if (functionCall == innerText) {
                var list = innerText.split("|");
                if(list.constructor != Array){
                    list = [list]; // If the array only has one item it will be treated as a char array, instead of an array of one string.
                }
                choice = chooseRandom(list);
            } else {                
                switch (functionCall[0]) {
                    case "":
                    case "lookup":
                    var list = tables[functionCall[1]];
                        if (!list) {
                            choice = "[[ERR: No table definition found for '" + functionCall[1] + "']]"
                        } else {
                            choice = chooseRandom(list);
                        }
                        break;
                    case "range":
                        choice = randBetween(Number(functionCall[1].split("-")[0]), Number(functionCall[1].split("-")[1]));
                        break;
                    case "roll":
                        var iterations = Number(functionCall[1].split("d")[0]);
                        var dieValue = Number(functionCall[1].split("d")[1]);
                        var total = 0;
                        for (var i = 0; i < iterations; i++) {
                            total += randBetween(1, dieValue);
                        }
                        choice = total;
                        break;
                    case "shuffle":
                        // TODO allow for custom seperator
                        var list = functionCall[1].split("|");
                        var seperator = ", ";
                        choice = shuffle(list).join(seperator);
                        break;    
                    case "repeat":
                        choice = "Repeat function currently under construction.";
                        break;                    
                    case "eval":
                        choice = eval(functionCall[1]);
                        break;
                    case "comment":
                        choice = "";
                        break;
                }
            }

            output = output.replace(fullMatch, choice);
        }

        return output;

    }