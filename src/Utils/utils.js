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

export { reemplazarGuionesBajos, formatearFecha };