import axios from "axios";

export let AdminClient = axios.create({
  baseURL: process.env.API_URL,
  method: "POST",
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
  timeout: 30 * 1000,
});

export let UserClient = axios.create({
  method: "POST",
  timeout: 30 * 1000,
  withCredentials: true,
});
