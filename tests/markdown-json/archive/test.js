const marked = require('marked');
const beautify = require("json-beautify");


let myData = [
    {depth:1, text:"item1"},
    {depth:2, text:"item2"},
    {depth:2, text:"item3"},
    {depth:3, text:"item4"},
    {depth:3, text:"item5"},
    {depth:3, text:"item6"},
]


let currentParent;
let currentSelection;
let headings = []; 

function getParent(_headings, _item, _result){
    
    let headings =  _headings.slice(0,)
    let item = Object.assign({}, _item);
    let result = Object.assign({}, _result);
    let parent;

    let newObject = {
        name: item.text,
        depth: item.depth,
        description:'',
        features:[]
    }

    headings.push(newObject);

    // console.log(headings, item.depth);
    headings.forEach(thing => {
        if(thing.depth == item.depth - 1){
            parent = thing;
        }
    })


    let checks = headings.slice(1,)
    // take the headings and mash them into the item at index 0
    headings[0].features = headings[0].features.map( feat => {
        let latestFeat;
        checks.forEach(check => {
            if(feat.name == check.name){
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

let output = myData.reduce( (result, item, index, array) => {
    
    let newObject = {
        name: item.text,
        depth: item.depth,
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

    return result;
}, {})

// console.log(currentParent)
// console.log(beautify(headings, null, 2, 40))
console.log(headings)

console.log(beautify(output, null, 2, 40) )