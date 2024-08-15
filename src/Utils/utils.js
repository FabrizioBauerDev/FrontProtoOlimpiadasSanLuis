function reemplazarGuionesBajos(texto) {
    return texto.replace(/_/g, " ");
}

function formatearFecha(fecha) {
    // Dividir la fecha en año, mes y día
    let partes = fecha.split("-");
    let año = partes[0];
    let mes = partes[1];
    let dia = partes[2];

    // Formar la fecha en formato DD-MM-YYYY
    let fechaFormateada = `${dia}/${mes}/${año}`;
    
    return fechaFormateada;
}

function formatNombrePrueba(input) {
    // Elimina el primer carácter si es un '_'
    if (input.startsWith('_')) {
        input = input.slice(1);
    }
    // Reemplaza los '_' restantes por espacios
    return input.replace(/_/g, ' ');
}
export { reemplazarGuionesBajos, formatearFecha, formatNombrePrueba};