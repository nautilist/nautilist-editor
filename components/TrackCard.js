const html = require('choo/html');

module.exports = function(link){
    function handleRedirect(e){
        const {id, type} = e.currentTarget.dataset
        console.log('go to selected list!', id, type)
        emit('fetch-track',id);
      }
      
      function checkOwner(track){
        if(track.hasOwnProperty('owner')){
          return `${track.ownerDetails.username}`
        } else {
          return '🤖'
        }
      }

      function saveTrack(e){
          alert('save track modal')
      }


    const {name, description, _id, selectedColor, colors, ownerDetails} = track;

    return html`
    <a class="fl w-100 w-25-l w-third-m h5 link black mb4" href="/tracks/${_id}">
    <div class="h-100 dropshadow bg-near-white ma2 flex flex-column justify-between" data-type="tracks" data-id=${_id} onclick=${handleRedirect}>
        <div class="flex flex-column w-100">
            <button class="w-100 dn f7 bn bg-navy dark-pink">save for later</button>
            <button class="bn f7 w-100 h2 br--top" style="background-color:${colors[selectedColor]};"></button>

      <div class="hide-child">
        <section class="pa2">
          <h3 class="ma0 overflow-y-scroll" style="max-height:4rem">${name}</h3>
          <small class="ma0">by <a class="link black underline" href="/users/${ownerDetails.username}">${checkOwner(track)}</a></small>
        </section>
        <p class="ma0 pa2 child f7 overflow-y-scroll" style="max-height:4rem">${description}</p>
      </div>
      </div>
      <div class="w-100 pa2 flex flex-row justify-end">
        <button class="h2 w2 br-100 f7 bn bg-moon-gray white grow" onclick=${saveTrack}>+</button>
      </div>
    </div>
    </a>
    `
}