const html = require('choo/html');

module.exports = function (state, emit, details){
    function displayFollowerList(e){
        state.components.ShowFollowersModal.open();
    }

    return html`
        <button onclick=${displayFollowerList} class="ma0 pa0 bn  bg-white f6">${details.length} Followers</button>
    `
}
