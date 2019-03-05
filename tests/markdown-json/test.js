const marked = require('marked');
const beautify = require("json-beautify");
const shortid = require('shortid');
var arrayToTree = require('array-to-tree');

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

#### subsublist 1 - feature 1
> description for sublist 1 feature 2

- https://editor.p5js.org

#### subsublist 1 - feature 2
> description for sublist 1 feature 2

- https://editor.p5js.org

## sublist 2
> description for sublist 1

### sublist 2 - feature 1
> description for sublist 2 feature 1

- https://itp.nyu.edu

### sublist 2 - feature 2
> description for sublist 2 feature 2

#### subsublist 1 - feature 1
> description for sublist 1 feature 2

- https://editor.p5js.org

#### subsublist 2 - feature 2
> description for sublist 1 feature 2

##### subsubsublist 3 - feature 1
> description for sublist 1 feature 2

- https://editor.p5js.org

`



const md2json = function (mdContent) {
    // use marked lexer to convert markdown to json array
    let json = marked.lexer(mdContent);

    // restructure json array of markdown tags to nautilist {name, description, features, url} structure
    let myFeatures = createFeatures(json);

    // generate a unique ID
    myFeatures = myFeatures.map(item => Object.assign({
        _id: shortid.generate()
    }, item));

    // assign the parent based on the order of the features and their depth
    myFeatures = assignParents(myFeatures);
    // console.log(myFeatures)
    
    // create a tree structure from the features
    const tree = arrayToTree(myFeatures, {
        parentProperty: 'parent',
        customID: '_id',
        childrenProperty: 'features'
    });
    
    // return the output
    return tree;

    /** ------- main functions ------- */
    /**
     * assignParents()
     * take the features with generated Ids to assign them to parents
     * @param {*} jsonArr 
     */
    function findParent(currentItem, arr){
        const preceeding = arr.reverse();
        let parent;

        for(let i = 0; i < preceeding.length; i++){
            let item = preceeding[i];
            
            if(currentItem.depth -1 == item.depth){
                console.log(currentItem.depth, item.depth)    
                parent = item;
                break;
            }
        }

        return parent;

    }
    function assignParents(jsonArr){
        let myFeatures = jsonArr.slice(0,);

        let mainParent;
        let currentParent;

        myFeatures = myFeatures.reduce((result, item, idx, arr) => {
            if (idx == 0) {
                result.push(item);
                currentParent = item;
            } else {
                let preceeding = arr.slice(0, idx);
                // console.log(preceeding)
                let currentParent = findParent(item, preceeding)
                item.parent = currentParent._id

                result.push(item)

            }
            return result;
        }, []);

        return myFeatures
    } // end assignParents()

    /**
     * createFeatures()
     * take the marked.lexer() output and parse them into nautilist structure
     * @param {*} jsonArr 
     */
    function createFeatures(jsonArr) {
        let newItem = {}
        let output = jsonArr.reduce((result, item, index, arr) => {

            if (result.length == 0 && item.type == "heading") {
                newItem = {}
                newItem.name = item.text;
                newItem.depth = item.depth;
                result.push(newItem);
            } else if (result.length > 0 && item.type == "heading") {
                newItem = {}
                newItem.name = item.text;
                newItem.depth = item.depth;
                result.push(newItem);
            }

            if (item.type == 'paragraph') {
                newItem.description = item.text;
            }

            if (item.type == 'text') {
                newItem.url = item.text;
            }

            return result;
        }, []);

        return output;
    } // end createFeatures()

}

let test = md2json(multilist)
console.log(beautify( test, null, 2, 40 )) ;

const json2md = function (jsonTree) {

}


























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