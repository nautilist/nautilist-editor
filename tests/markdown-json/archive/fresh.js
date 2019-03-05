const marked = require('marked');
const beautify = require("json-beautify");
const cheerio = require('cheerio')
const traverse = require('traverse');
const shortid = require('shortid')

const multilist = `
# list 1
> description for list 1

## sublist 1
> description for sublist 1

### sublist 1 - feature 1
> description for sublist 1 feature 1

- https://itp.nyu.edu

### sublist 1 - feature 2
> description for sublist 1 feature 2

- https://editor.p5js.org

### sublist 1 - feature 3
> description for sublist 1 feature 3

- https://p5js.org

### sublist 1 - feature 4
> description for sublist 1 nested list 1

#### sublist 1 - feature 4 - item 1
> description for sublist 1 - nested list 1 - item 1

- https://thecodingtrain.com/

#### sublist 1 - feature 4 - item 2
> description for sublist 1 - nested list 1 - item 1

- https://thecodingtrain.com/


## sublist 2
> description for sublist 2

### sublist 2 - feature 1
> description for sublist 2 feature 1

- https://processing.org

### sublist 2 - feature 2
> description for sublist 2 feature 2

- https://openframeworks.cc/

### sublist 2 - feature 3
> description for sublist 3 feature 3

- https://nautilists.com
`


let json = marked.lexer(multilist);

console.log(json);


var parse = function (mdContent) {
    var json = marked.lexer(mdContent);
    var currentHeading, headings = [],
        isOrdered = true;
    var output = json.reduce(function (result, item, index, array) {
        switch (item.type) {
            case 'heading':
                if (!currentHeading || item.depth == 1) {
                    headings = [];
                    result[item.text] = {};
                    currentHeading = result[item.text];
                    headings.push(item.text);
                } else {
                    var parentHeading = getParentHeading(headings, item, result);
                    headings = parentHeading.headings;
                    currentHeading = parentHeading.parent;
                    currentHeading[item.text] = {};
                    currentHeading = currentHeading[item.text];
                }
                break;
            case 'list_start':

                break;
            case 'text':
                currentHeading.url = item.text;
                break;
            case 'table':

                break;
            case 'space':

                break;
            case 'paragraph':
                currentHeading.description = item.text;
                break;
            default:
                break;
        }
        return result;
    }, {});
    return output;
}

function getParentHeading(headings, item, result) {
    var parent, index = item.depth - 1;
    var currentHeading = headings[index];
    if (currentHeading) {
        headings.splice(index, headings.length - index);
    }
    headings.push(item.text);
    for (var i = 0; i < index; i++) {
        if (!parent) {
            parent = result[headings[i]];
        } else {
            parent = parent[headings[i]];
        }
    }
    return {
        headings: headings,
        parent: parent
    };
}



let test = parse(multilist)

// console.log(beautify(test, null, 2, 40))
// 
function makeFresh(_obj) {
    // let obj = Object.assign({}, _obj);
    let obj = _obj
    let result = {};

    for(let p in obj){
        
        item = obj[p];

        let subHeaders = Object.keys(item).filter(feat => {
            if(feat !== "description" && feat !== "url"){
                return feat
            }
        })

        if(typeof item == 'object'){
            result.name = p;
            result.description = item.description
            result.url = item.url || ''

            result.features = subHeaders.map( feat => feat  ) 
        }
    }
    
    return result;
}


// function makeFresh2(_obj){

//     return;
// }

let dreams = makeFresh(test);
// let dreams = makeFresh2(test);

console.log(beautify(dreams, null, 2, 40))