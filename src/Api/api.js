import axiosInstance from '../config/clienteAxios';

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