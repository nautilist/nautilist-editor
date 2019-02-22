const yaml = require('js-yaml');
const slugify = require('slugify');
const shortid = require('shortid');
const helpers = require('../helpers');
module.exports = store

store.storeName = 'workspace'
function store (state, emitter) {
  const initialYaml= setInitialYaml('single');

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
    state.workspace.json = addClientId(state.workspace.json);  
  })()
  

  emitter.on(state.events.addClientId, function(_payload){
    state.workspace.json = addClientId(_payload);
  })

  emitter.on(state.events.workspace_yaml_update, function(_payload){
    if(!_payload){_payload = "type: list"}
    let safeYaml = yaml.safeLoad(_payload)
    state.workspace.json = safeYaml;
    state.workspace.yaml = yaml.safeDump(safeYaml)
  })

  emitter.on(state.events.workspace_all_update, function(_payload){
    state.workspace.json = addClientId(_payload);
    const cleanJson = helpers.removeClientId(_payload);
    const newYaml = yaml.safeDump(cleanJson , {'noRefs': true});
    state.workspace.yaml = newYaml;
    emitter.emit(state.events.addClientId, state.workspace.json)
    emitter.emit(state.events.RENDER)
  });

} // end store


/**
 * Recursively remove the clientIds for YAML display
 * @param {*} _json 
 */
function addClientId(parent){
  // always make a copy and return a new object
  let parentCopy = Object.assign({}, parent);
  // remove the top clientId
  parentCopy.clientId = shortid.generate();

  if(parentCopy.hasOwnProperty('features')){
    parentCopy.features = parentCopy.features.map( child =>  addClientId(child));
  }
  
  return parentCopy;
}

function setInitialYaml(selection){
  const singleList = `
type: list
name: Nautilist Simple Boilerplate
description: A boilerplate list for nautilist
features:
  - url: www.itp.nyu.edu
    name: ITP/IMA
    description: Website to NYU's ITP/IMA program
  - url: www.nautilist.github.io/
    name: Nautilist homepage
    description: Nautilist is a tool for ...
  `

  const multilist=`
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

  if(selection == "single"){
    return singleList
  } else{
    return multilist
  }

}


