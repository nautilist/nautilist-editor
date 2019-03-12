var html = require('choo/html')

module.exports = view

function view (state, emit) {
  return html`
  <body class="w-100 h-100 code lh-copy" onload=${() => emit('fetch-user', state.params.username) }>
      ${state.selectedUser.username}
    </body>
  `
}