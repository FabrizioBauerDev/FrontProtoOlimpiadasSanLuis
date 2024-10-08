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
  if (input.startsWith("_")) {
    input = input.slice(1);
  }
  // Reemplaza los '_' restantes por espacios
  return input.replace(/_/g, " ");
}

const validMarcaValues = ["", "NM", "DNS", "DNF", "DQ", "FP"];

// Función para convertir los tiempos a segundos
function convertirATiempoEnSegundos(tiempo) {
  if (!tiempo || validMarcaValues.includes(tiempo)) return Infinity; // Devuelve un valor muy alto si el tiempo es null o undefined
  if (tiempo.includes(":")) {
    const [minutos, segundos] = tiempo.split(":");
    return parseInt(minutos) * 60 + parseFloat(segundos);
  } else {
    return parseFloat(tiempo);
  }
}

// Comparator para ordenar los tiempos
const comparadorDeTiempos = (tiempoA, tiempoB) => {
  const tiempoEnSegundosA = convertirATiempoEnSegundos(tiempoA);
  const tiempoEnSegundosB = convertirATiempoEnSegundos(tiempoB);

  return tiempoEnSegundosA - tiempoEnSegundosB;
};

// Función para convertir la distancia a un número sin el 'm'
function convertirADistanciaEnMetros(distancia) {
  if (!distancia || validMarcaValues.includes(distancia)) return -Infinity; // Devuelve un valor muy bajo si la distancia es null o undefined
  return parseFloat(distancia.replace("m", ""));
}

// Comparator para ordenar las distancias
const comparadorDeDistancias = (distanciaA, distanciaB) => {
  const distanciaEnMetrosA = convertirADistanciaEnMetros(distanciaA);
  const distanciaEnMetrosB = convertirADistanciaEnMetros(distanciaB);

  // Orden descendente: de mayor a menor
  return distanciaEnMetrosB - distanciaEnMetrosA;
};

// Comparator dinámico que decide cuál comparador usar según el tipo de prueba
const comparadorDinamico = (marcaA, marcaB, pruebaTipo) => {
  if (pruebaTipo === "Lanzamientos" || pruebaTipo === "SaltosHorizontales") {
    return comparadorDeDistancias(marcaA, marcaB);
  }
  if (
    pruebaTipo === "PistaConAndarivel" ||
    pruebaTipo === "PistaSinAndarivel"
  ) {
    return comparadorDeTiempos(marcaA, marcaB);
  }
  return 0; // Si el tipo de prueba no coincide, no se ordena
};

const capitalizeWords = (string) => {
    if (!string) return ''; // Maneja el caso de un string vacío
    return string
        .toLowerCase()
        .split(' ') // Divide el string en un array de palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
        .join(' '); // Une las palabras de nuevo en un string
}

export {
  reemplazarGuionesBajos,
  formatearFecha,
  formatNombrePrueba,
  comparadorDinamico,
  capitalizeWords
};
