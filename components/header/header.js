/**
 * header.js: Componente Header con approccio "Render" (stile React)
 */

const defaultImage = `<svg class="icon-leaf" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21V11M12 11C12 11 9 7 5 7C5 7 5 11 9 13C10.5 13.75 12 11 12 11ZM12 11C12 11 15 5 19 5C19 5 20 10 16 12C14.5 12.75 12 11 12 11Z" stroke="#719b6e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`

function initHeader(container,input = {left:undefined,rigth : defaultImage }) {
    // 1. Lo "Stato" del componente
    let state = {
        //left: ,
        left: input.left !== undefined ? input.left : "",
        rigth: input.rigth !== undefined ? input.rigth : defaultImage ,  
    };

    /*

    */

    // 2. La funzione Render (Template Literals)
    function render() {
        container.innerHTML = `
            <div class="tod-hea header-container">
                <div class="status-bar-spacer"></div>
                <div class="greeting-row">
                    <span class="greeting-text">${state.left}</span>
                    <div class="icon-container">
                        ${state.rigth}
                    </div>
                </div>
            </div>

            <style>
                .tod-hea .status-bar-spacer {
                    height: 20px;
                }
                .tod-hea.header-container {
                    padding: 20px 24px 10px;
                }
                .tod-hea .greeting-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .tod-hea .greeting-text {
                    font-size: 19px;
                    font-weight: 500;
                    color: #333;
                }
            </style>
        `;
    }

    // 3. Funzione per aggiornare lo stato (simile a setState)
    window.updateHeader = function(newState) {
        state = { ...state, ...newState };
        render(); // Re-render automatico al cambio di stato
    };

    // Render iniziale
    render();
}

// Esponiamo la funzione di inizializzazione
window.initHeader = initHeader;
