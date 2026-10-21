
(function global() {
    "use strict";

    const S = Subtitulos.Subtitulos;
    const $ = (id) => document.getElementById(id);

    // Evita que el texto se interprete como HTML
    function escapar(texto) {
        return String(texto).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[c]);
    }

    // Formatea números con separadores de miles
    const formatoMiles = (n) => n.toLocaleString("es-MX");

    // Muestra mensajes de error
    function mostrarError(destino, error) {
        destino.innerHTML = `
            <div class="Error">
                !${escapar(error.message)}
            </div>
        `;
    }

    // Convierte una dirección IP a binario
    // Colorea los bits de red y los bits de host
    function binarioColorado(ip, prefijo) {
        const bits = S.ipABinario(ip).replace(/\./g, "");

        let html = "";

        for (let i = 0; i < 32; i++) {
            if (i > 0 && i % 8 === 0) {
                html += ".";
            }

            html += `<span class="${i < prefijo ? 'bits-red' : 'bits-host'}">${bits[i]}</span>`;
        }

        return html;
    }

    // Genera una tarjeta con la información de la red base
    function tarjetaRedBase(ip, prefijo) {
        const clase = S.claseDeRed(ip);

        return `
            <div class="tarjeta">

                <h3>Red Base ${escapar(ip)}/${prefijo}</h3>

                <div class="datos">

                    <div>
                        <dt>Clase (Histórica)</dt>
                        <dd>
                            ${clase.clase}${clase.prefijoPorDefecto
                                ? `/${clase.prefijoPorDefecto} por defecto`
                                : ""}
                        </dd>
                    </div>

                    <div>
                        <dt>Tipo</dt>
                        <dd>
                            ${S.esPrivada(ip) ? 'Privada' : 'Pública'}
                        </dd>
                    </div>

                    <div>
                        <dt>Máscara</dt>
                        <dd>
                            ${S.prefijoAMascara(prefijo)}
                        </dd>
                    </div>

                    <div>
                        <dt>Direcciones en total</dt>
                        <dd>
                            ${formatoMiles(2 ** (32 - prefijo))}
                        </dd>
                    </div>

                </div>

                <p class="binario">
                    IP:&nbsp;&nbsp;&nbsp;&nbsp;
                    ${binarioColorado(ip, prefijo)}
                </p>

                <p class="binario">
                    Máscara:&nbsp;
                    ${binarioColorado(
                        S.prefijoAMascara(prefijo),
                        prefijo
                    )}
                </p>

                <p class="leyenda">
                    <span class="bits-red">Azul</span>
                    = bits de red --
                    <span class="bits-host">naranja</span>
                    = bits de host
                </p>

            </div>
        `;
    }

    // Genera una tabla con los resultados de las subredes
    function tablaSubredes(subredes, conSolicitados) {

        // Recorre las subredes y crea una fila para cada una
        const filas = subredes.map((s, i) => `
            <tr>
                <td>${i + 1}</td>

                <td>${escapar(s.nombre)}</td>

                ${conSolicitados
                    ? `
                        <td>${formatoMiles(s.hostsSolicitados)}</td>
                        <td>${formatoMiles(s.hostsPerdidos)}</td>
                      `
                    : ""}

                <td class="ip">${escapar(s.red)}</td>

                <td class="ip">${escapar(s.mascara)}</td>

                <td class="ip">${escapar(s.primerHost)}</td>

                <td class="ip">${escapar(s.ultimoHost)}</td>

                <td class="ip">${escapar(s.broadcast)}</td>

                <td>${formatoMiles(s.host)}</td>

            </tr>
        `).join("");

        // Construye la tabla HTML completa
        return `
            <div class="tabla-envoltura">

                <table class="resultado">

                    <thead>
                        <tr>
                            <th>#</th>

                            <th>Subred</th>

                            ${conSolicitados
                                ? `
                                    <th>Host Solicitados</th>
                                    <th>Host Perdidos</th>
                                  `
                                : ""}

                            <th>Red</th>

                            <th>Máscara</th>

                            <th>Primer host</th>

                            <th>Último host</th>

                            <th>Broadcast</th>

                            <th>Host útiles</th>

                        </tr>
                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>

                </table>

            </div>
        `;
    }

    // Pestañas
    document.querySelectorAll('.pestana').forEach((boton) => {
        boton.addEventListener('click', () =>
            activarPanel(boton.dataset.panel));
    });
function activarPanel(id) {
    document.querySelectorAll('.pestana').forEach((b) => {
        b.classList.toggle('activa', b.dataset.panel === id);
    });

    document.querySelectorAll('.panel').forEach((p) => {
        p.classList.toggle('activo', p.id === id);
    });
} 

})();
