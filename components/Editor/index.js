
const html = require('choo/html')
const EditorWorkspace = require('./EditorWorkspace');
const EditorMenu = require('./EditorMenu');
const EditorSidebar = require('./EditorSidebar');

module.exports = Editor;

function Editor(state, emit){
    return html`
        <main class="w-100 h-auto flex flex-column justify-start items-start" style="flex:1">
            <!-- editor buttons -->
            ${state.cache(EditorMenu, "EditorMenu", state, emit).render()}
            <!-- editor section -->
            <section class="w-100 h-100 flex flex-row-ns flex-column justify-start items-start min-height-0">
                <!-- resources sidebar -->
                <div class="w-100 w-third-ns h-100-ns pa1">
                    ${state.cache(EditorSidebar, 'EditorSidebar', state, emit).render()}
                </div>
                <!-- workspace -->
                <div class="w-100 w-two-thirds-ns h-100 pa1">
                    ${state.cache(EditorWorkspace, 'EditorWorkspace', state, emit).render()}
                </div>
            </section>
        </main>
    `
}

