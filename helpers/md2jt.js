const marked = require('marked');
const beautify = require("json-beautify");
const shortid = require('shortid');
const arrayToTree = require('array-to-tree');

/**
 * Convert markdown to jsonTree
 * @param {*} mdContent 
 */
const md2json = function (mdContent) {
    // use marked lexer to convert markdown to json array
    let json = marked.lexer(mdContent);

    // restructure json array of markdown tags to nautilist {name, description, features, url} structure
    let myFeatures = createFeatures(json);

    // generate a unique ID
    myFeatures = myFeatures.map(item => Object.assign({
        _clientId: shortid.generate()
    }, item));

    // assign the parent based on the order of the features and their depth
    myFeatures = assignParents(myFeatures);
    // console.log(myFeatures)

    // create a tree structure from the features
    const tree = arrayToTree(myFeatures, {
        parentProperty: 'parent',
        customID: '_clientId',
        childrenProperty: 'features'
    });

    // return the first object of the output 
    return tree[0];

    /** ------- main functions ------- */
    /**
     * assignParents()
     * take the features with generated Ids to assign them to parents
     * @param {*} jsonArr 
     */
    function findParent(currentItem, arr) {
        const preceeding = arr.reverse();
        let parent;

        for (let i = 0; i < preceeding.length; i++) {
            let item = preceeding[i];

            if (currentItem.depth - 1 == item.depth) {
                // console.log(currentItem.depth, item.depth)
                parent = item;
                break;
            }
        }

        return parent;

    }

    function assignParents(jsonArr) {
        let myFeatures = jsonArr.slice(0, );

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
                item.parent = currentParent._clientId

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

/**
 * Convert json tree to md
 * @param {*} jsonTree 
 */
const json2md = function (jsonTree) {
    let mdText = ''

    if (jsonTree.depth == 1) {
        mdText += `# ${jsonTree.name}\n> ${jsonTree.description}\n\n`
    }

    mdText = recursiveMake(mdText, jsonTree.features);

    // return markdown text
    return mdText


    function recursiveMake(mdText, featuresArray) {
        // let mdTextCopy = mdText;
        // let mdText = '';
        // console.log(mdText) 
        for (let p in featuresArray) {
            let item = featuresArray[p];
            // let url = item.url ? `- ${item.url}` : ' ';
            let hashes = "#".repeat(item.depth);

            mdText += `${hashes} ${item.name}`
            if(item.description !== '' && item.description !== undefined){
                mdText+=`\n> ${item.description}`
            } else {
                mdText+=`\n\n`
            }
            if(item.url !== '' && item.url !== undefined){
                mdText+=`\n- ${item.url}\n\n`
            }else {
                mdText+=`\n\n`
            }

            if (typeof item == "object") {
                mdText = recursiveMake(mdText, item.features);
            }
        }

        return mdText;
    }

}

module.exports = {
    json2md,
    md2json
}