const html = require('choo/html');

module.exports = function(state, emit){
    
    function goBack(e){
        history.back();
    }

    return html`
        <div class="w-100">
            <button class="bn black f6" onclick=${goBack}>← <span class="underline">Go Back</span> </button>
        </div>
    `
}