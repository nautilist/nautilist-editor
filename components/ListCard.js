const html = require('choo/html');

module.exports = ListCard;

function ListCard(list){
  
    function handleRedirect(e){
      const {id, type} = e.currentTarget.dataset
      console.log('go to selected list!', id, type)
      emit('fetch-list',id);
    }
    
    function checkOwner(list){
      if(list.hasOwnProperty('owner')){
        return `${list.ownerDetails.username}`
      } else {
        return '🤖'
      }
    }

    function showCollaborators(list){
      if(list.collaboratorDetails.length > 0){
        return `+ ${list.collaboratorDetails.length} collaborators`
      }
      
    }

    const {name, description, _id, selectedColor, colors} = list;

    return html`
    <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/lists/${_id}">
    <div class="h-100 shadow-5 bg-near-white ma2" data-type="lists" data-id=${_id} onclick=${handleRedirect}>
      <header class="w-100 h2  br--top" style="background-color:${colors[selectedColor]};"></header>
      <div class="hide-child">
        <section class="pa2">
          <h3 class="ma0">${name}</h3>
          <small class="ma0">by <a class="link black underline" href="/users/${list.ownerDetails.username}">${checkOwner(list)}</a> ${showCollaborators(list)}</small>
        </section>
        <p class="ma0 pa2 child f7 overflow-y-scroll">${description}</p>
      </div>
    </div>
    </a>
    `
  }