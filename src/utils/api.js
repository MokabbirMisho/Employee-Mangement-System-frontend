import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: true, // if you use cookies/JWT in cookies
});

export default API;
