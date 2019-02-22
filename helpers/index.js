module.exports = {
    removeFromTree,
    removeClientId,
    updateFeature,
    pushNewFeature,
    moveFeature,
    findFeature
}


/**
 * Recursively remove an object from a JSON tree
 * @param {*} parent - usually will be state.workspace.json
 * @param {*} featureid - the generated clientId
 */
function removeFromTree(parent, featureid){
    // always make a copy and return a new object
    let parentCopy = Object.assign({}, parent);

    if(parentCopy.clientId == featureid){
        // delete parent
        // return just and empty list item
        return {type:'list', name:'', description:'', features:[{url:'#',name:'', description:''}]}
    }

    if(parentCopy.hasOwnProperty('features')){
        parentCopy.features = parentCopy.features
        .filter(function(child){ return child.clientId !== featureid})
        .map(function(child){ return removeFromTree(child, featureid)});
    
    }
    return parentCopy;
}

/**
 * Recursively remove the clientIds for YAML display
 * @param {*} _json 
 */
function removeClientId(parent){
    // always make a copy and return a new object
    let parentCopy = Object.assign({}, parent);
    // remove the top clientId
    if(parentCopy.hasOwnProperty('clientId')){
        delete parentCopy.clientId
    }
    
    if(parentCopy.hasOwnProperty('features')){
      parentCopy.features = parentCopy.features.map( child => {
            return removeClientId(child);
        });
    }
    
    return parentCopy;
}

/**
 * Recursively search through the JSON tree and update the properties
 * @param {*} parent 
 * @param {*} featureid 
 * @param {*} newFeature 
 */
function updateFeature(parent, featureid, newFeature){
    let parentCopy = Object.assign({}, parent);
  
    // remove the top clientId
    if(parentCopy.clientId === featureid){
      console.log(parentCopy.clientId, " vs ", featureid)
      
      if(parentCopy.type !== "list"){
        parentCopy.url = newFeature.url
      }
  
      parentCopy.name = newFeature.name
      parentCopy.description = newFeature.description
      
      return parentCopy;
    }
  
    if(parentCopy.hasOwnProperty('features')){
      parentCopy.features = parentCopy.features
            .map((child) => updateFeature(child, featureid, newFeature));
    }
  
    return parentCopy;
  } // end updateFeature


  /**
 * Recursively search through the JSON tree and push new feature
 * @param {*} parent 
 * @param {*} featureid 
 * @param {*} newFeature 
 */
function pushNewFeature(parent, featureParentId, newFeature){
    let parentCopy = Object.assign({}, parent);
  
    // remove the top clientId
    if(parentCopy.clientId === featureParentId){
      parentCopy.features.push(newFeature)
      return parentCopy
    }
  
    if(parentCopy.hasOwnProperty('features')){
      parentCopy.features = parentCopy.features
            .map((child) => updateFeature(child, featureParentId, newFeature));
    }
  
    return parentCopy;
  } // end updateFeature
  




 /**
 * 
 * @param {*} parent 
 * @param {*} featureParentId 
 * @param {*} origin 
 * @param {*} destination 
 */
function moveVal(arr, from, to) {
    let arrayCopy = Array.from(arr);
    arrayCopy.splice(to, 0, arrayCopy.splice(from, 1)[0]);
    return arrayCopy;
  };
function moveFeature(parent, featureParentId, origin, destination){
    let parentCopy = Object.assign({}, parent);

    if(parentCopy.clientId === featureParentId){
        const newFeatures = moveVal(parentCopy.features, origin, destination)
        parentCopy.features = newFeatures
        return parentCopy;
    }

    if(parentCopy.hasOwnProperty('features')){
        parentCopy.features = parentCopy.features
            .map((child) => moveFeature(child, featureParentId, origin, destination));
    }

    return parentCopy
}



function findFeature(parent, featureid){
    const parentCopy = Object.assign({}, parent);
    let p, result;

    if(parentCopy.clientId === featureid){
        console.log('found', featureid )
        return parentCopy;
    }

    for(p in parentCopy){
      if(parentCopy.hasOwnProperty(p) && typeof parentCopy[p] === 'object'){
        result = findFeature(parentCopy[p], featureid);
        
        if(result){
          return result;
        }
        
      }
    }
    return result
}


// function findRecursive(_myList, _parentId){
//     const listCopy = Object.assign({}, _myList);
//     let result;
//     let p;
  
//     // early return
//     if(listCopy.clientId === _parentId){
//       return listCopy;
//     }
    
//     for(p in listCopy){
//       if(listCopy.hasOwnProperty(p) && typeof listCopy[p] === 'object'){
//         result = findRecursive(listCopy[p], _parentId);
        
//         if(result){
//           return result;
//         }
//       }
//     }
//     return result
  
//   }