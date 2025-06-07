async function obtenerPais(nombre) {
    try {
        const respuesta = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(nombre)}`);
        if (!respuesta.ok) {
            return null;
        }
        const datos = await respuesta.json();
        return Array.isArray(datos) && datos.length ? datos[0] : null;
    } catch (e) {
        console.error('Error al consultar país:', e);
        return null;
    }
}

async function mostrarInformacion() {
    const input = document.getElementById('countryInput');
    const infoDiv = document.getElementById('countryInfo');
    const nombre = input.value.trim();

    if (!nombre) {
        infoDiv.innerHTML = '<div class="alert alert-warning">Ingrese un país válido.</div>';
        return;
    }

    const pais = await obtenerPais(nombre);
    if (!pais) {
        infoDiv.innerHTML = '<div class="alert alert-warning">País no encontrado</div>';
        return;
    }

    const datos = {
        nombre: pais.name.common,
        capital: pais.capital ? pais.capital[0] : 'N/A',
        region: pais.region,
        poblacion: pais.population,
        bandera: pais.flags && pais.flags.png ? pais.flags.png : '',
        idioma: pais.languages ? Object.values(pais.languages).join(', ') : 'N/A'
    };

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
    document.getElementById('showInfo').addEventListener('click', mostrarInformacion);
});
