const html = require('choo/html');

module.exports = showCollaborators
function showCollaborators(details){
    if(details.length <=0){
        return ''
    }

    const collaborators = details.map( (person, idx)  => {
        return html`
            <a class="link black underline" href="/users/${person.username}">${person.username} ${idx < details.length - 1 ? '·' : ''}</a>
        `
    });

    return html`
        <p class="ma0 f6">Together with ${collaborators}</p>
    `
}