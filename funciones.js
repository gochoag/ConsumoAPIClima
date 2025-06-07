/**
 * Realiza una consulta a la API de restcountries para obtener
 * información de un país por su nombre.
 * @param {string} nombre Nombre del país a buscar
 * @returns {Object|null} Información del país o null si no se encuentra
 */
async function obtenerPais(nombre) {
    try {
        // Llamada a la API codificando el nombre del país
        const respuesta = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(nombre)}`);
        // Si la respuesta no es correcta retornamos null
        if (!respuesta.ok) {
            return null;
        }
        // Convertimos la respuesta a JSON y obtenemos el primer elemento
        const datos = await respuesta.json();
        return Array.isArray(datos) && datos.length ? datos[0] : null;
    } catch (e) {
        // En caso de error escribimos en consola y devolvemos null
        console.error('Error al consultar país:', e);
        return null;
    }
}
/**
 * Obtiene el nombre ingresado por el usuario y muestra la información del país en la página.
 */
async function mostrarInformacion() {
    const input = document.getElementById('countryInput');
    const infoDiv = document.getElementById('countryInfo');
    const nombre = input.value.trim();

    // Validación simple del campo de texto, asegurando que no esté vacío
    if (!nombre) {
        infoDiv.innerHTML = '<div class="alert alert-warning">Ingrese un país válido.</div>';
        return;
    }
    // Consultamos la API para obtener los datos del país
    // Si el pais no existe, mostramos un mensaje de advertencia
    const pais = await obtenerPais(nombre);
    if (!pais) {
        infoDiv.innerHTML = '<div class="alert alert-warning">País no encontrado</div>';
        return;
    }
    // Preparamos los datos que vamos a mostrar en la tabla
    const datos = {
        nombre: pais.name.common,
        capital: pais.capital ? pais.capital[0] : 'N/A',
        region: pais.region,
        poblacion: pais.population,
        bandera: pais.flags && pais.flags.png ? pais.flags.png : '',
        idioma: pais.languages ? Object.values(pais.languages).join(', ') : 'N/A'
    };
    // Generamos el HTML con la información del país
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
// Cuando el documento esté listo añadimos el evento al botón
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showInfo').addEventListener('click', mostrarInformacion);
});
