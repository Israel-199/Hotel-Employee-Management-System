import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError<ApiErrorResponse>) => {
    const backendMessage = error.response?.data?.message;

    if (backendMessage) {
      return Promise.reject(new Error(backendMessage));
    }

    if (error.response?.status === 400) {
      return Promise.reject(
        new Error("Invalid request. Please check the information you entered.")
      );
    }

    if (error.response?.status === 401) {
      return Promise.reject(
        new Error("You are not authorized. Please log in again.")
      );
    }

    if (error.response?.status === 403) {
      return Promise.reject(
        new Error("You do not have permission to perform this action.")
      );
    }

    if (error.response?.status === 404) {
      return Promise.reject(
        new Error("The requested resource was not found.")
      );
    }

    if (error.response?.status === 409) {
      return Promise.reject(
        new Error("This record already exists.")
      );
    }

    if (error.response?.status && error.response.status >= 500) {
      return Promise.reject(
        new Error("A server error occurred. Please try again later.")
      );
    }

    if (error.message === "Network Error") {
      return Promise.reject(
        new Error(
          "Unable to connect to the server. Please check your connection."
        )
      );
    }

    return Promise.reject(
      new Error("Something went wrong. Please try again.")
    );
  }
);