const yaml = require('js-yaml');
const slugify = require('slugify');
const shortid = require('shortid');

module.exports = store

store.storeName = 'workspace'
function store (state, emitter) {
  let initialYaml=`
type: "list"
name: "The P5.js Landscape"
description: "This is a list of the P5.js landscape."
features:
- type: "list" 
  name: "Handy P5.js Tools"
  description: "This is a list of handy p5.js Tools ranging from commandline tools, project generators, and web editors."
  features:
    - url: "https://p5js.org/"
      name: "p5js website"
      description: "p5js is a javascript library to make coding more accessible to everyone"
    - url: "https://editor.p5js.org/"
      name: "The p5js web editor"
      description: "A handy web editor for writing code in the browser and seeing your magic come alive"
    - url: "https://www.npmjs.com/package/p5-manager"
      name: "P5 Manager commandline tool"
      description: "Commandline scaffolding tool for generating p5js projects"
    - url: "http://1023.io/p5-inspector/"
      name: "P5 playground"
      description: "A What you see is what you get editor for p5.js"
- type: "list"
  name: "P5 Libraries"
  description: "A list of libraries built for P5.js."
  features:
    - url: "https://p5js.org/libraries/"
      name: "P5 Libraries"
      description: "officially on the website"
    - url: "https://github.com/generative-design/generative-design-library.js"
      name: "Generative Design Library"
      description: "Generative Design library bundled with lots of other tools built for p5.js"
  `
//     let initialYaml = `
// type: list
// name: Nautilist Simple Boilerplate
// description: A boilerplate list for nautilist
// features:
//   - url: www.itp.nyu.edu
//     name: ITP/IMA
//     description: Website to NYU's ITP/IMA program
//   - url: www.nautilist.github.io/
//     name: Nautilist homepage
//     description: Nautilist is a tool for ...
//   `
  state.workspace = {
    json:yaml.safeLoad(initialYaml),
    yaml:initialYaml.trim()
  }
  state.events.workspace_yaml_update = 'workspace:yaml:update'
  state.events.workspace_json_reorder = 'workspace:json:reorder'
  state.events.workspace_all_update = 'workspace:all:update'
  state.events.addClientId = "json:addClientId";
  state.events.workspace_json_addfeature = "workspace:json:addfeature";

  // initialize by adding in clientId
  (function(){
    addClientId(state.workspace.json);  
  })()
  


  emitter.on(state.events.addClientId, addClientId)

  emitter.on(state.events.workspace_yaml_update, function(_payload){
    if(!_payload){_payload = "type: list"}
    let safeYaml = yaml.safeLoad(_payload)
    state.workspace.json = safeYaml;
    state.workspace.yaml = yaml.safeDump(safeYaml)
  })

  emitter.on(state.events.workspace_all_update, function(_payload){
    addClientId(_payload);
    state.workspace.json = _payload;
    const cleanJson = Object.assign({}, _payload)
    removeClientId(cleanJson);
    const newYaml = yaml.safeDump(cleanJson , {'noRefs': true});
    state.workspace.yaml = newYaml;
    emitter.emit(state.events.addClientId, state.workspace.json)
    emitter.emit(state.events.RENDER)
  });

  // emitter.on(state.events.workspace_json_addfeature, function(_payload){
  //   let {parentid, featureType} = _payload;
  //   let newFeature = {}

  //   let newLink = {
  //     url: "",
  //     name: "",
  //     description: ""
  //   }

  //   if(featureType == "link"){
  //     newFeature = newLink;
  //   } else if (featureType == "list") {
  //     newFeature = {
  //       type: "",
  //       name: "",
  //       description: "",
  //       features:[
  //         newLink
  //       ]
  //     }
  //   }

  //   console.log(newFeature);
  //   addNewFeature(state.workspace.json, parentid, newFeature);
  //   // console.log(state.workspace.json)
  //   const cleanJson =  Object.assign({}, state.workspace.json)
  //   removeClientId(cleanJson)
  //   // state.workspace.json = _payload;
  //   const newYaml = yaml.safeDump(cleanJson, {'noRefs': true});
  //   state.workspace.yaml = newYaml
  //   emitter.emit(state.events.RENDER)
  // })

  // emitter.on('DOMContentLoaded', function () {})
} // end store

// helper functions
// function addNewFeature(_json, _parentid, _newFeature){
//   // remove the top clientId
//   if(_json.clientId = _parentid){
//     _json.features.push(_newFeature)
//     return _json;
//   }
  
//   if(newObj.features){
//     newObj.features.forEach(item => {
//       if(item.hasOwnProperty('features')){
//         addNewFeature(item);
//       }
//       item.features.push(_newFeature)
//     })
//   }
// return _json;
// } // end addNewFeature

// helper functions
function addClientId(_json){
    // remove the top clientId
    _json.clientId = shortid.generate();

    if(_json.hasOwnProperty('features')){
      _json.features.forEach(item => {
        if(item.hasOwnProperty('features')){
          addClientId(item);
        }
        item.clientId = shortid.generate();
      })
    }
    return _json;
} // end addClientId

function removeClientId(_json){
  let newObj = _json
  // remove the top clientId
  delete newObj.clientId

  newObj.features.forEach(item => {
    if(item.hasOwnProperty('features')){
      removeClientId(item);
    }
    delete item.clientId
  })
  
  return newObj;
}





  let initialYaml=`
type: "list"
name: "The P5.js Landscape"
description: "This is a list of the P5.js landscape."
features:
- type: "list" 
  name: "Handy P5.js Tools"
  description: "This is a list of handy p5.js Tools ranging from commandline tools, project generators, and web editors."
  features:
    - url: "https://p5js.org/"
      name: "p5js website"
      description: "p5js is a javascript library to make coding more accessible to everyone"
    - url: "https://editor.p5js.org/"
      name: "The p5js web editor"
      description: "A handy web editor for writing code in the browser and seeing your magic come alive"
    - url: "https://www.npmjs.com/package/p5-manager"
      name: "P5 Manager commandline tool"
      description: "Commandline scaffolding tool for generating p5js projects"
    - url: "http://1023.io/p5-inspector/"
      name: "P5 playground"
      description: "A What you see is what you get editor for p5.js"
- type: "list"
  name: "P5 Libraries"
  description: "A list of libraries built for P5.js."
  features:
    - url: "https://p5js.org/libraries/"
      name: "P5 Libraries"
      description: "officially on the website"
    - url: "https://github.com/generative-design/generative-design-library.js"
      name: "Generative Design Library"
      description: "Generative Design library bundled with lots of other tools built for p5.js"
  `