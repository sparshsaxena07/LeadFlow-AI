import axios from "axios";

/**
 * Pre-configured Axios instance for communicating with the backend API.
 * Future service calls should import this client.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});
