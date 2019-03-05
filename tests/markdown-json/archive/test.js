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




























let thing = [{
    depth: 1,
    name: 'list1'
},
{
    depth: 2,
    name: 'sublist1'
},
{
    depth: 2,
    name: 'sublist2'
},
{
    depth: 3,
    name: 'subsublist1'
},
{
    depth: 2,
    name: 'sublist3'
},
{
    depth: 3,
    name: 'subsublist2'
},
{
    depth: 3,
    name: 'subsublist3'
},
{
    depth: 4,
    name: 'subsubsublist1'
},
{
    depth: 4,
    name: 'subsubsublist2'
}
]



// // thing = thing.map(item =>  Object.assign({id:shortid.generate()}, item))
// myFeatures = myFeatures.map(item =>  Object.assign({id: item.depth-1}, item))
// // console.log(thing)


// var ltt = new LTT(myFeatures, {
//     key_id: 'depth',
//     key_parent: 'id'
// });
// var tree = ltt.GetTree();

// console.log( beautify(tree, null, 2, 20) );

// get the index of where each feature should live under
// function mapFeaturesToParent(arr){
//     // let output = arr.slice(0,)
//     let currentParent;
//     let output = arr.reduce( (result, item, idx, arr) => {
//         if(item.depth == 1){
//             currentParent = item;
//             result.push(currentParent)
//         }
//         else {
//             // console.log(currentParent)
//             // if(item.depth - 1 == currentParent.depth ){
//             //     item.parentIndex = currentParent.depth;
//             //     result.push(item)
//             // }
//             result.forEach( thing => {
//                 if(item.depth -1 == thing.depth){
//                     item.parentIndex = currentParent.depth;
//                     result.push(item)
//                 }
//             })
//         }

//         return result;
//     },[]);

//     return output
// }

// let t = mapFeaturesToParent(thing)
// console.log(t)



// let currentParent;
// let parentHeadings = []
// let output = thing.reduce( (result, item, idx, arr) => {
//     if(item.depth == 1){
//         item.features = [];
//         currentParent = item;
//         result = currentParent;
//         parentHeadings.push(result);
//     } else {

//     }

//     return result
// }, {})

// console.log(output)
// console.log(parentHeadings)



// function nester2(featureCollection){


//     let output = featureCollection.reduce((result, item, index, array) => {
//         // console.log(result.depth, item.depth, item)




//         return result;
//     });

//     return output;
// }

// let test  = nester2(thing);
// console.log(beautify(test, null, 2, 40));






// function nester(featureCollection) {
//     let mainParent;
//     let currentParent;

//     let output = featureCollection.reduce((result, item, index, array) => {
//         if (index == 0) {
//             mainParent = item;
//             mainParent.features = [];
//             result = mainParent
//         } else {
//             if (item.depth - 1 == mainParent.depth) {
//                 currentParent = item;
//                 currentParent.features = [];
//                 mainParent.features.push(currentParent)
//             } else {

//                 if (item.depth - 1 == currentParent.depth) {
//                     let currentList = [];
//                     let checks = array.slice(index + 1, )

//                     // console.log(checks)

//                     for (let i = 0; i < checks.length; i++) {
//                         let check = checks[i];
//                         if (check.depth > item.depth) {
//                             // console.log(true)
//                             currentList.push(check);

//                         } else {
//                             break
//                         }
//                     }

//                     console.log(item.depth, currentParent.depth)
//                     if (currentParent) {
//                         item.features = currentList;
//                         currentParent.features.push(item);
//                     }
//                 }

//             }
//         }

//         return result;
//     }, {})

//     return output;
// }


// let test = nester(myFeatures);
// console.log(beautify(test, null, 2, 40))

// function nestFeatures(featureCollection){
//     let mainParent;
//     let currentParent;


//     let output = featureCollection.reduce( (result, item, index, array) => {
//         // initial state
//         if(index == 0){
//             mainParent = array[0];
//             mainParent.features = [];
//             result = mainParent;
//         }

//         if(item.depth - 1 == mainParent.depth){
//             currentParent = item;
//             currentParent.features = [];
//             mainParent.features.push(currentParent);
//         } else {

//         }


//         return result
//     }, {})
//     return output
// }

// let test = nestFeatures(myFeatures)
// console.log(test);


// Step 2: nest them according to their parent depth
// function nestFeatures(featureCollection){
//     let mainParent;
//     let currentParent;
//     let output = featureCollection.reduce((result, item, index, array) => {
//         if(item.depth == 1){
//             item.features = [];
//             mainParent = item;
//             result = mainParent;
//         } else{
//             let dist = item.depth - mainParent.depth;
//             console.log(dist)
//             if(item.depth - 1 == mainParent.depth){
//                 currentParent = item;
//                 currentParent.features = []
//                 mainParent.features.push(currentParent);
//             }
//             else {

//                 currentParent.features.push(item);

//             }
//         }

//         return result;
//     }, {})

//     return output;
// }

// let nestedFeatures = nestFeatures(myFeatures);
// console.log(beautify(nestedFeatures, null, 2, 40))


// console.log(myFeatures.slice(6,))