const marked = require('marked');
// const cheerio = require('cheerio')
const beautify = require("json-beautify");
const traverse = require('traverse');
const shortid = require('shortid')
// var markdowneyjr = require("markdowneyjr");

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




function getParent(_headings, _item, _result){
    
    let headings =  _headings.slice(0,)
    let item = Object.assign({}, _item);
    let result = Object.assign({}, _result);
    let parent;

    let newObject = {
        name: item.text,
        depth: item.depth,
        description:'',
        _id: item._id,
        features:[]
    }


    headings.push(newObject);

    // console.log(headings, item.depth);
    headings.forEach(thing => {
        if(thing.depth == item.depth - 1){
            parent = thing;
        }
    })

    let checks = headings.slice(1,);
    // take the headings and mash them into the item at index 0
    headings[0].features = headings[0].features.map( feat => {
        let latestFeat;
        
        checks.forEach(check => {
            if(feat._id == check._id){
                latestFeat = Object.assign({},check)
            }
        });

        return latestFeat
    })

    // console.log(headings);
    // console.log(parent.depth, item.depth, result)
    return {
        headings, parent, item, result
    }
}

const parseToJson = function(mdContent){
    let json = marked.lexer(mdContent);

    let currentParent;
    let headings = []; 

    
    json = json.map(item => Object.assign({_id: shortid.generate()}, item));

    const output = json.reduce( (result, item, index, array) => {

        switch(item.type){
            case 'heading':
                // currentParent = newObject;
                // set the first state
                let newObject = {
                    name: item.text,
                    depth: item.depth,
                    _id: item._id,
                    description:'',
                    features:[]
                }
                if(!currentParent || item.depth == 1){
            
                    currentParent = Object.assign({}, newObject);
                    result = currentParent;
                    headings.push(currentParent);
            
                } else {
                    let test = getParent(headings, item, result);
                    headings = test.headings
                    currentParent = test.parent
                    currentParent.features.push(newObject)
                    
                }
                
                break;
            case 'paragraph':
                currentParent.description = item.text;
                break;
            default:
                break;
        }

        return result;
    },{});

    console.log("=================")
    console.log(beautify(headings, null, 2, 40))
    // console.log(parentPosition)
    // console.log(currentParent)
    console.log("=================")
    return output;
}




let output = parseToJson(multilist)
// let test = toMd(output);
// console.log( beautify(output, null, 2, 60) )




// const toMd = function(jsonObj){
//     let mdText = ''

//     if(jsonObj.depth == 1){
//         mdText += `# ${jsonObj.name}\n> ${jsonObj.description}\n\n`
//     }

//     mdText = recursiveMake(mdText, jsonObj.features);

//     return mdText
// }

// function recursiveMake(mdText,featuresArray){
//     // let mdTextCopy = mdText;
//     // let mdText = '';
//     // console.log(mdText) 
//     for(let p in featuresArray){
//         let item = featuresArray[p];
//         let url = item.url ? `- ${item.url}` :' ';
//         let hashes = "#".repeat(item.depth)
//         mdText += `${hashes} ${item.name}\n> ${item.description}\n\n${url}\n\n`
//         if(typeof item == "object"){
//             mdText = recursiveMake(mdText, item.features);
//         }
//     }

//     return mdText;
// }



// let output = parseToJson(multilist)
// // let test = toMd(output);
// console.log( beautify(output, null, 2, 60) )
