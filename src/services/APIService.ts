// src/services/ApiService.ts
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'

axios.defaults.withCredentials = true

// Define types for request/response data
export interface ApiResponse<T> {
    data: T
    requestedAt: string
    results: number
    status: string
}
// FIXME doesn't work on other pages
const API_BASE_URL = `${window.location.href.replace('3000', '3001')}api/v1/`

export class ApiService {
    private api: AxiosInstance
    page: number = 0
    limit: number = 10
    baseURL = 'http://localhost:3001/api/v1/'
    // baseURL =
    // 'https://scaling-telegram-wgqjr956qqx3g4qg-3001.app.github.dev/api/v1/'
    // baseURL = API_BASE_URL

    constructor() {
        this.api = axios.create({
            baseURL: this.baseURL,
            headers: {
                // 'Content-Type': 'application/json',
                // Accept: 'application/json',
                // 'Content-Type': 'multipart/form-data', // Optional: Usually, axios handles this
            },
        })

        // Interceptors for handling request/response before .then or .cath
        this.api.interceptors.request.use(this.handleRequest, this.handleError)
        this.api.interceptors.response.use(
            this.handleResponse,
            this.handleError,
        )
    }

    // Handle request before sending (e.g., attach tokens)
    // AxiosRequestConfig first variant
    private handleRequest(config: InternalAxiosRequestConfig) {
        // Optionally attach an authorization token here
        // config.headers.Authorization = `Bearer ${token}`;
        return config
    }

    // Handle responses
    private handleResponse<T>(response: AxiosResponse<T>) {
        return response.data
    }

    // Handle errors
    private handleError(error: unknown) {
        console.error('API Error:', error)
        // You can perform global error handling here (e.g., logging, redirecting)
        return Promise.reject(error)
    }

    // GET request
    public async get<T>(
        path: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        // FIXME revrite to .data
        // return (await this.api.get(path, config)).data
        return this.api.get(path, config)
    }

    // POST request
    public async post<T>(
        path: string,
        data: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.api.post(path, data, config)
    }

    // PUT request
    public async put<T>(
        path: string,
        data: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.api.put(path, data, config)
    }

    public async patch<T>(
        path: string,
        data: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.api.patch(path, data, config)
    }

    // DELETE request
    public async delete<T>(
        path: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        return this.api.delete(path, config)
    }
}

// Example: Export a singleton instance of ApiService
// const apiService = new ApiService('http://localhost:3001/api/v1/')
// export default apiService
