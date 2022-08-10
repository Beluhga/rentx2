import axios from "axios";

const api = axios.create({
  baseURL: 'http://192.168.0.7:3333'
})

export { api };

/*
 colocar no serve do Expo
 --host 192.168.0.53
*/