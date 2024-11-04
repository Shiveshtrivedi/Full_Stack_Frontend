import axios from "axios";

const API_URL = process.env.REACT_APP_USER_API_URL ?? '';


export const api = axios.create({
    baseURL: API_URL,
  });