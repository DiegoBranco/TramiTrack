import { defineStore } from "pinia";
import axios from "axios";

// configure default base URL for API calls if provided by env
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

interface User {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  cedula?: number;
  createdAt?: string;
  updatedAt?: string;
  // cedula intentionally omitted from store
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(
      localStorage.getItem("auth_user") || "null",
    ) as User | null,
  }),
  getters: {
    isAdmin: (state): boolean => state.user?.rol === "admin",
    isAuthenticated: (state): boolean => !!state.user,
  },
  actions: {
    async login(correo: string, password: string) {
      const response = await axios.post("/api/users/login", {
        correo,
        password,
      });

      this.user = response.data.user;

      localStorage.setItem("auth_user", JSON.stringify(this.user));
      return this.user;
    },
    logout() {
      this.user = null;
      localStorage.removeItem("auth_user");
    },
  },
});
