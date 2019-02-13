const yaml = require('js-yaml');
const slugify = require('slugify');

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
//   let initialYaml = `
// type: list
// name: 
// description: 
// features:
// - url: 
//   name: 
//   description: 
// - url: 
//   name: 
//   description: 
//   `
  state.workspace = {
    json:yaml.load(initialYaml),
    yaml:initialYaml.trim()
  }
  state.events.workspace_yaml_update = 'workspace:yaml:update'
  state.events.workspace_json_reorder = 'workspace:json:reorder'
  state.events.workspace_all_update = 'workspace:all:update'


  emitter.on('DOMContentLoaded', function () {})
  
  emitter.on(state.events.workspace_yaml_update, function(_payload){
    let safeYaml = yaml.load(_payload)
    state.workspace.json = safeYaml;
    state.workspace.yaml = yaml.safeDump(safeYaml)
  })

  emitter.on(state.events.workspace_json_reorder, function(_payload){
    const {parentname, featurename, newPosition} = _payload;

    let newJson = Object.assign({}, state.workspace.json);

    // first find the parent array
    // let parentListIndex =  

    
    
    const parentList = newJson.features.find(item => {
      return slugify(item.name) == parentname;
    })

    const parentIndex = newJson.features.findIndex(item => {
      return slugify(item.name) == parentname;
    })
    
    // then find the specified resource index
    const currentPosition = parentList.features.findIndex(item => {
      return slugify(item.name) == featurename
    });

    // move the value
    moveVal(parentList.features, currentPosition, newPosition);  

    // update the copy
    newJson.features[parentIndex].features = parentList.features;
    
    // then update the store!
    emitter.emit(state.events.workspace_all_update, newJson)
  
    console.log(`Reordering ${featurename} in ${parentname} to position ${newPosition}`)
  })

  emitter.on(state.events.workspace_all_update, function(_payload){
    state.workspace.json = _payload;
    state.workspace.yaml = yaml.safeDump(_payload);
    emitter.emit('render');
  });

  // helper functions
  function moveVal(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
  };
}

