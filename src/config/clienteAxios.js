import axios from "axios";

class AxiosSingleton {
    constructor() {
        if (!AxiosSingleton.instance) {
            AxiosSingleton.instance = axios.create({
                baseURL: "http://localhost:8080/api",
                headers: {
                    'Content-Type': 'application/json',
                    // Otros encabezados que necesites
                },
            });

        }
    }

    getInstance() {
        return AxiosSingleton.instance;
    }
}

const axiosInstance = new AxiosSingleton().getInstance();

export default axiosInstance;