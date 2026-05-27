import axios, { AxiosInstance } from "axios";
import { CreateContactRequest, Contact, User } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiService {
  public api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
      if (this.token) {
        this.setAuthHeader(this.token);
      }
    }

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  async register(username: string, email: string, password: string) {
    const response = await this.api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", {
      email,
      password,
    });
    const { access_token, user } = response.data.data;
    this.token = access_token;
    this.setAuthHeader(access_token);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
  }

  logout() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  async getUsers() {
    const response = await this.api.get("/users");
    return response.data;
  }

  async getUser(userId: string) {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId: string, user: Partial<User>) {
    const response = await this.api.put(`/users/${userId}`, user);
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.api.delete(`/users/${userId}`);
    return response.data;
  }

  async getContacts(userId: string) {
    const response = await this.api.get(`/contacts/${userId}`);
    return response.data;
  }

  async getContact(userId: string, contactId: string) {
    const response = await this.api.get(`/contacts/${userId}/${contactId}`);
    return response.data;
  }

  async createContact(userId: string, contact: CreateContactRequest) {
    const response = await this.api.post(`/contacts/${userId}`, contact);
    return response.data;
  }

  async updateContact(
    userId: string,
    contactId: string,
    contact: CreateContactRequest
  ) {
    const response = await this.api.put(
      `/contacts/${userId}/${contactId}`,
      contact
    );
    return response.data;
  }

  async deleteContact(userId: string, contactId: string) {
    const response = await this.api.delete(`/contacts/${userId}/${contactId}`);
    return response.data;
  }

  async searchContacts(userId: string, query: string) {
    const response = await this.api.get(
      `/contacts/${userId}/search?q=${query}`
    );
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
