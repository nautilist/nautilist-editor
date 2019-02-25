const marked = require('marked');
const prettyjson = require('prettyjson');
const traverse = require('traverse');

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



const parseToJson = function(mdContent){
    let json = marked.lexer(mdContent);
    let currentParent;
    let output = json.reduce( (result, item, index, array) => {
        switch (item.type) {
            case 'heading':
                if (!currentParent || item.depth == 1) {
                    headings = [];
                    // result[item.text] = {};
                    result.name = item.text;
                    result.description = '';
                    result.features = [];
                    result.depth = item.depth;
                    currentParent = result;
                } else {
                    // TODO need to make recursive
                    if( result.depth == item.depth-1){
                        let newObject = {
                            name: item.text,
                            description: '',
                            depth: item.depth,
                            features:[]
                        }
                        currentParent = newObject;
                        result.features.push(newObject);
                    } else {
                        // console.log(currentParent)
                        let newObject = {
                            name: item.text,
                            description: '',
                            depth: item.depth,
                            features:[],
                            url:''
                        }
                        // // currentParent.features.push(newObject)
                        let l = result.features.length-1;
                        currentParent = newObject;
                        result.features[l].features.push(newObject)
                    }
                }
                break;
            case 'paragraph':
                // console.log(currentParent)
                currentParent.description = item.text;
                break;
            case 'text':
                currentParent.url = item.text
        }
        return result
    
    
    }, {});
    return output
}


const toMd = function(jsonObj){
    let mdText = ''

    if(jsonObj.depth == 1){
        mdText += `# ${jsonObj.name}\n> ${jsonObj.description}\n\n`
    }

    mdText = recursiveMake(mdText, jsonObj.features);

    return mdText
}

function recursiveMake(mdText,featuresArray){
    // let mdTextCopy = mdText;
    // let mdText = '';
    // console.log(mdText) 
    for(let p in featuresArray){
        let item = featuresArray[p];
        let url = item.url ? `- ${item.url}` :' ';
        let hashes = "#".repeat(item.depth)
        mdText += `${hashes} ${item.name}\n> ${item.description}\n\n${url}\n\n`
        if(typeof item == "object"){
            mdText = recursiveMake(mdText, item.features);
        }
    }

    return mdText;
}

// function toMd(jsonObject) {
//     var mdText = '';
//     traverse(jsonObject).reduce(function(acc, value) {
//         if (this.isLeaf && this.key === 'raw') {
//             mdText += value;
//         } else {
//             mdText += getHash(this.level) + ' ' + this.key + '\n\n';
//         }
//         return;
//     });
//     return mdText;
// }
// // exports.toMd = toMd;

// function getHash(level) {
//     var hash = '';
//     for (var i = 0; i < level; i++) {
//         hash += '#';
//     }
//     return hash;
// }

// console.log(headings)
// console.log(currentParent)
let output = parseToJson(multilist)

let test = toMd(output);
console.log(test)
// console.log(test)
// console.log(JSON.stringify(output))
// console.log(prettyjson.render(output));

