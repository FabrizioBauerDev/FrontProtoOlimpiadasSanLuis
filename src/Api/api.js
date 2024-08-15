import axiosInstance from '../config/clienteAxios';

// OLIMPIADAS
export const fetchAllOlimpiadas = async () => {
  try {
    const response = await axiosInstance.get('/olimpiada/getAll');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchAllEtapasIdOlimpiada = async (id) => {
  try {
    const response = await axiosInstance.get(`/olimpiada/getEtapaByIdOlimpiada/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// ETAPAS
export const fetchEtapaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/etapa/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// PRUEBAS
export const fetchPruebasByEtapa = async (id) => {
  try {
    const response = await axiosInstance.get(`/prueba/getPruebasByIdEtapa/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// INSCRIPTOS
export const fetchInscriptosByPruebaId = async (id) => {
  try {
    const response = await axiosInstance.get(`/inscripciones/getByIdPrueba/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// SERIES
export const fetchSeriesByPruebaId = async (id) => {
  try {
    const response = await axiosInstance.get(`/serie/getAllByPruebaId/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const updateVientoSerie = async (serie, viento) => {
  // CARGAR EL VIENTO DE LA SERIE
  serie.viento = viento;
  try {
    // Hacer el POST al servidor
    const response = await axiosInstance.put(`/serie/${serie.id}`, serie);
    return response;
  } catch (error) {
    console.error("Error al actualizar el valor:", error);
    return;
  }
}

// PARTICIPA
export const multipleUpdateParticipa = async (serieId, participaciones) => {
  try {
    // Hacer el POST al servidor
    const response = await axiosInstance.put(`/participa/${serieId}`, participaciones);
    return response;
  } catch (error) {
    console.error("Error al actualizar el valor:", error);
    return;
  }
}

// Esto es para todos los participantes de una serie, retorna ParticipacionesDTO
export const fetchParticipacionesBySerieId = async (id) => {
  try {
    const response = await axiosInstance.get(`/participa/getByIdSerie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
// Esto es para todos los participantes de una prueba por serie, retorna ParticipacionesDTO
export const fetchParticipacionesByPruebaId = async (id) => {
  try {
    const response = await axiosInstance.get(`/participa/getByIdPrueba/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Generaciones de series
export const fetchgenerateSeries = async (url, idPrueba, cantidad) => {
  const data = {cant: cantidad};
  try {
    const response = await axiosInstance.post(`/utils/${url}?idPrueba=${idPrueba}`, data);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}