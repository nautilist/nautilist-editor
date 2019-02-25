let myJson = {
    "type": "list",
    "name": "The P5.js Landscape",
    "description": "This is a list of the P5.js landscape.",
    "features": [
      {
        "type": "list",
        "name": "Handy P5.js Tools",
        "description": "This is a list of handy p5.js Tools ranging from commandline tools, project generators, and web editors.",
        "features": [
          {
            "url": "https://p5js.org/",
            "name": "p5js website ✅",
            "description": "p5js is a javascript library to make coding more accessible to everyone",
            "clientId": "5gxQd02yqj"
          },
          {
            "url": "https://www.npmjs.com/package/p5-manager",
            "name": "P5 Manager commandline tool",
            "description": "Commandline scaffolding tool for generating p5js projects",
            "clientId": "moxtnVEDyl"
          },
          {
            "url": "http://1023.io/p5-inspector/",
            "name": "P5 playground",
            "description": "A What you see is what you get editor for p5.js",
            "clientId": "HOHy0C-B3h"
          },
          {
            "url": "#",
            "name": "New URL!",
            "description": "A description for your new URL?",
            "clientId": "no-MnmX-saQ"
          }
        ],
        "clientId": "zifyZ0V6mfv"
      },
      {
        "type": "list",
        "name": "P5 Libraries",
        "description": "A list of libraries built for P5.js.",
        "features": [
          {
            "url": "https://p5js.org/libraries/",
            "name": "P5 Libraries ❤️️️❤️️️❤️️️",
            "description": "officially on the website",
            "clientId": "RBkPBiPJrJU"
          },
          {
            "url": "https://github.com/generative-design/generative-design-library.js",
            "name": "Generative Design Library🌈🌈🌈",
            "description": "Generative Design library bundled with lots of other tools built for p5.js",
            "clientId": "tJnqZDdXH2L"
          }
        ],
        "clientId": "Ob3cg_Jtu1e"
      }
    ],
    "clientId": "ggQlEMcHt0"
  }



  
  // let cleanJson = removeClientId(myJson)
  // console.log(cleanJson);


  
  // const newFeatureList = {
  //   type:'list',
  //   name: '❤️️️️️️️️NEW❤️NEW❤️',
  //   description:'I love this list'
  // }

  // const newFeature = {
  //   name: '🌈NEW🌈NEW',
  //   description:'I love this list',
  //   url:"#"
  // }

  // let newParent = moveFeature(myJson, 'Ob3cg_Jtu1e', 1, 0);
  console.log(JSON.stringify(myJson));
  console.log("\n\n")

  let foundFeature = findFeature(myJson, 'tJnqZDdXH2L')
  console.log(JSON.stringify(foundFeature));


  function findFeature(parent, featureid){
    const parentCopy = Object.assign({}, parent);
    let result;

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
      let newFeatures = moveVal(parentCopy.features, origin, destination)
      // console.log(newFeatures)
      parentCopy.features = newFeatures
      return parentCopy;
  }

  if(parentCopy.hasOwnProperty('features')){
      parentCopy.features = parentCopy.features
          .map((child) => moveFeature(child, featureParentId, origin, destination));
  }

  return parentCopy
}


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
} // end addNewFeature




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


  // console.log( '\n\n\n\n' )
  // let newJson = Object.assign({}, myJson);
  // newJson = removeFromTree(newJson, 'zifyZ0V6mfv')
  // console.log( JSON.stringify(newJson) )

  function removeFromTree(parent, featureid){
    let parentCopy = Object.assign({}, parent);

    if(parentCopy.clientId == featureid){
      // delete parent
      return {}
    }
  
    if(parentCopy.features){
      parentCopy.features = parentCopy.features
        .filter(function(child){ return child.clientId !== featureid})
        .map(function(child){ return removeFromTree(child, featureid)});
    
    }
    return parentCopy;
  }

