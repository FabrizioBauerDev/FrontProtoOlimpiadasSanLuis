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