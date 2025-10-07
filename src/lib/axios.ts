import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// * Requeste se dispara antes de la petición al servidor
// * Response luego de la petición al servidor
api.interceptors.request.use(config => {
      const token = localStorage.getItem("authTokenUpTask");  
      if(token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config
})

export default api