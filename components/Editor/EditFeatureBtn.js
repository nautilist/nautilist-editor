const html = require('choo/html')

module.exports = EditFeatureBtn

// triggers opening the edit modal that is passed into this component
// function openEditModal(parentid, featureid){
//     return e => {
//       console.log("opening edit modal for", featureid);
//       this.editFeatureModal.displayed = 'flex';
//       let selectedItem = helpers.findFeature(this.state.workspace.json, featureid);
//       this.editFeatureModal.render(selectedItem);
//     }
//   } // end openEditModal



function EditFeatureBtn(state, emit, feat){
        
        function openEditModal(){
            return e => {
                
                state.components.EditFeatureModal.open();
            }
            
        }

        return html`
        <button class="workspace-view dn bn bg-transparent underline" onclick=${openEditModal()}>edit</button>
        `
}