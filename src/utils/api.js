import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //  backend URL
  withCredentials: true, // use cookies/JWT in cookies
});

export default API;
