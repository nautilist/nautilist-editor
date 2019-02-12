const yaml = require('js-yaml');

module.exports = store

store.storeName = 'workspace'
function store (state, emitter) {
  let initialYaml = `
type: list
name:
description:
features:
- url:
  name:
  description:
- url:
  name:
  description:
  `
  state.workspace = {
    json:yaml.load(initialYaml),
    yaml:initialYaml.trim()
  }
  state.events.workspace_yaml_update = 'workspace:yaml:update'


  emitter.on('DOMContentLoaded', function () {})
  
  emitter.on(state.events.workspace_yaml_update, function(_payload){
    
    // yaml.safeLoadAll(state.workspace.yaml, function (doc) {
    //   console.log(doc);
    // });
    let safeYaml = yaml.load(_payload)
    state.workspace.json = safeYaml;
    // state.workspace.yaml = yaml.safeDump(safeYaml)
  })
}