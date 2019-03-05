const yaml = require('js-yaml');
const slugify = require('slugify');
const shortid = require('shortid');
const helpers = require('../helpers');
const md2jt = require('../helpers/md2jt');
module.exports = store

store.storeName = 'workspace'
function store (state, emitter) {
  const initialMd= setInitialMd('single');

  state.workspace = {
    json: md2jt.md2json(initialMd),
    md:initialMd
  }

  state.events.workspace_md_update = 'workspace:md:update'
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

  emitter.on(state.events.workspace_md_update, function(_payload){
    if(!_payload){_payload = "type: list"}

    state.workspace.json = md2jt.md2json(_payload),
    state.workspace.md = _payload
  })

  emitter.on(state.events.workspace_all_update, function(_payload){
    state.workspace.json = addClientId(_payload);
    state.workspace.md = md2jt.json2md(_payload);
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

function setInitialMd(selection){
  const singleList = `
# Nautilist Simple Boilerplate
> description: A boilerplate list of lists for nautilist

## My Special List
> description: A list 1 description

### ITP/IMA
> Website to NYU's ITP/IMA program      
- www.itp.nyu.edu
      
### Nautilist homepage
> Nautilist is a tool for ...
- url: www.nautilist.github.io/
  `

  const multilist=`
# Nautilist Simple Boilerplate
> description: A boilerplate list of lists for nautilist

## My Special List
> description: A list 1 description

### ITP/IMA
> Website to NYU's ITP/IMA program      
- www.itp.nyu.edu
      
### Nautilist homepage
> Nautilist is a tool for ...
- url: www.nautilist.github.io/

## My Other Special List
>  A list 2 description

### name: ITP/IMA for list 2
> description: Website to NYU's ITP/IMA program
- www.itp.nyu.edu

### Nautilist homepage for list 2
> Nautilist is a tool for ...
- www.nautilist.github.io/
  `

  if(selection == "single"){
    return singleList.trim()
  } else{
    return multilist.trim()
  }

}


