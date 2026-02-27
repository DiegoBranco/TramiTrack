import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface TramiteType {
  _id: string;
  nombre: string;
  descripcion: string;
  requisitos?: string;
  costo: number;
  dias_habiles: number;
  icono?: string;
}

class TramiteTypeService {
  private baseUrl = `${API_URL}/api/tramite-types`;

  async getAll(): Promise<TramiteType[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<TramiteType> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error ${id}:`, error);
      throw error;
    }
  }

  async create(payload: Partial<TramiteType>): Promise<TramiteType> {
    try {
      const response = await axios.post(this.baseUrl, payload);
      return response.data;
    } catch (error) {
      console.error("Error creating tramite type:", error);
      throw error;
    }
  }

  async update(id: string, payload: Partial<TramiteType>): Promise<TramiteType> {
    try {
      const response = await axios.put(`${this.baseUrl}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${id}:`, error);
      throw error;
    }
  }
}

export default new TramiteTypeService();
