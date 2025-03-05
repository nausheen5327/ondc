import axios from "axios";
import Cookies from "js-cookie";
import { deleteAllCookies } from "../utils/cookies";
import { NextApiRequest, NextApiResponse } from 'next';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Important for CORS
});

const apiStrapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Important for CORS
});

const apiStrapiTest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TEST_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Important for CORS
});


const apiStrapiSearch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_SEARCH_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Important for CORS
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      unAuthorizedResponse();
    }
    return Promise.reject(error);
  }
);

function unAuthorizedResponse() {
  deleteAllCookies();
  localStorage.removeItem("product_list");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("token");
  window.location.pathname = "/";
}



export function getCall(url, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      // Build the query parameters string for the URL
      const queryParams = params
        ? Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
        : '';

      const fullUrl = queryParams ? `${process.env.NEXT_PUBLIC_BASE_URL}?${queryParams}` : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

      // Log the cURL command
      const headers = {
        Authorization: 'Bearer YOUR_TOKEN', // Add authorization or other headers if necessary
      };
      const headerString = Object.entries(headers)
        .map(([key, value]) => `-H "${key}: ${value}"`)
        .join(' ');
      console.log(`cURL: curl -X GET "${fullUrl}" ${headerString}`);

      const response = await api.get(url, { params });
      return resolve(response.data);
    } catch (error) {
      console.log("error123",error);
      handleApiError(error);
      return reject(error);
    }
  });
}

export function getCallTest(url, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      // Build the query parameters string for the URL
      const queryParams = params
        ? Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
        : '';

      const fullUrl = queryParams ? `${process.env.NEXT_PUBLIC_BASE_URL}?${queryParams}` : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

      // Log the cURL command
      const headers = {
        Authorization: 'Bearer YOUR_TOKEN', // Add authorization or other headers if necessary
      };
      const headerString = Object.entries(headers)
        .map(([key, value]) => `-H "${key}: ${value}"`)
        .join(' ');
      console.log(`cURL: curl -X GET "${fullUrl}" ${headerString}`);

      const response = await apiStrapiTest.get(url, { params });
      return resolve(response.data);
    } catch (error) {
      console.log("error123",error);
      handleApiError(error);
      return reject(error);
    }
  });
}
export function getCallStrapi(url, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      // Build the query parameters string for the URL
      const queryParams = params
        ? Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
        : '';

      const fullUrl = queryParams ? `${process.env.NEXT_PUBLIC_BASE_URL}?${queryParams}` : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

      // Log the cURL command
      const headers = {
        Authorization: 'Bearer YOUR_TOKEN', // Add authorization or other headers if necessary
      };
      const headerString = Object.entries(headers)
        .map(([key, value]) => `-H "${key}: ${value}"`)
        .join(' ');
      console.log(`cURL: curl -X GET "${fullUrl}" ${headerString}`);

      const response = await apiStrapi.get(url, { params });
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

export function getCallStrapiSearch(url, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await apiStrapiSearch.get(url, { params });
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

export function postCall(url, params) {
  return new Promise(async (resolve, reject) => {
    console.log(resolve, reject, "testing");
    try {
      const response = await api.post(url, params);
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

export function putCall(url, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(url, params);
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

export function deleteCall(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.delete(url);
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

// Helper function to handle API errors
function handleApiError(error) {
  if (error.response) {
    // Server responded with error
    console.error('Server Error:', {
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    // Request made but no response
    console.error('No Response:', error.request);
  } else {
    // Error in request configuration
    console.error('Request Error:', error.message);
  }
}

export function makeCancelable(promise) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => !isCanceled && resolve(val))
      .catch(error => !isCanceled && reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

// Optional: Add retry logic for failed requests
export function withRetry(apiCall, maxRetries = 3) {
  return async (...args) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall(...args);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        if (error.response?.status === 401) throw error; // Don't retry auth errors
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };
}

// Usage example with retry
export const getWithRetry = withRetry(getCall);
export const postWithRetry = withRetry(postCall);