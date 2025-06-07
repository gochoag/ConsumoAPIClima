async function cargarPaises() {
    try {
        const respuesta = await fetch('https://restcountries.com/v3.1/all');
        const datos = await respuesta.json();
        const select = document.getElementById('countrySelect');
        datos.sort((a, b) => a.name.common.localeCompare(b.name.common));
        datos.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.cca3;
            option.textContent = pais.name.common;
            option.dataset.info = JSON.stringify({
                nombre: pais.name.common,
                capital: pais.capital ? pais.capital[0] : 'N/A',
                region: pais.region,
                poblacion: pais.population,
                bandera: pais.flags && pais.flags.png ? pais.flags.png : '',
                idioma: pais.languages ? Object.values(pais.languages).join(', ') : 'N/A'
            });
            select.appendChild(option);
        });
    } catch (e) {
        console.error('Error al cargar países:', e);
    }
}

function mostrarInformacion() {
    const select = document.getElementById('countrySelect');
    const infoDiv = document.getElementById('countryInfo');
    const opcion = select.options[select.selectedIndex];
    if (!opcion || !opcion.dataset.info) {
        infoDiv.innerHTML = '<div class="alert alert-warning">Seleccione un país válido.</div>';
        return;
    }
    const datos = JSON.parse(opcion.dataset.info);
    infoDiv.innerHTML = `
        <table class="table table-bordered">
            <tr><th>Nombre</th><td>${datos.nombre}</td></tr>
            <tr><th>Capital</th><td>${datos.capital}</td></tr>
            <tr><th>Región</th><td>${datos.region}</td></tr>
            <tr><th>Población</th><td>${datos.poblacion.toLocaleString()}</td></tr>
            <tr><th>Idioma(s)</th><td>${datos.idioma}</td></tr>
            ${datos.bandera ? `<tr><th>Bandera</th><td><img src="${datos.bandera}" alt="Bandera" style="width:100px"></td></tr>` : ''}
        </table>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();
    document.getElementById('showInfo').addEventListener('click', mostrarInformacion);
});
