const html = require('choo/html');

module.exports = showCollaborators
function showCollaborators(details){
    if(details.length <=0){
        return ''
    }

    const collaborators = details.map( (person, idx)  => {
        return html`
            <a class="pa0 ma0 link black" href="/users/${person.username}"><span class="underline">${person.username}</span>${idx < details.length - 1 ? ' · ' : ''}</a>
        `
    });

    return html`
        <p class="ma0 pa0 f6">Together with ${collaborators}</p>
    `
}