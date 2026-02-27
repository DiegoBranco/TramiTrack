import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface DatosFormulario {
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  cuenta_bancaria: string;
  referencia_pago: string;
  monto: number;
  fecha_pago: string;
}

export interface SolicitudPayload {
  estudiante_id: string;
  tramiteType_id: string;
  datos_formulario: DatosFormulario;
}

export interface TramiteResponse {
  _id: string;
  numero_seguimiento: string;
  estado: "pendiente" | "en_proceso" | "completado" | "rechazado" | "entregado";
  fecha_solicitud: string;
  fecha_estimada?: string;
  createdAt: string;
  updatedAt: string;
  tramiteType_id: {
    _id: string;
    nombre: string;
    descripcion: string;
    costo: number;
    dias_habiles: number;
  };
  estudiante_id: {
    _id: string;
    nombre: string;
    apellido: string;
  };
  datos_formulario: DatosFormulario;
  observaciones?: string;
  comprobante_id?: any;
  documento_final?: string;
}

class SolicitudService {
  private baseUrl = `${API_URL}/api/solicitudes`;

  /**
   * Crear una nueva solicitud con opción de adjuntar comprobante
   */
  async create(payload: SolicitudPayload, comprobante?: File) {
    try {
      const formData = new FormData();

      formData.append("tramiteType_id", payload.tramiteType_id);
      formData.append("estudiante_id", payload.estudiante_id);
      formData.append(
        "datos_formulario",
        JSON.stringify(payload.datos_formulario),
      );

      if (comprobante) {
        formData.append("comprobante", comprobante);
      }

      const response = await axios.post(this.baseUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error en solicitudService.create:", error);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes del estudiante actual
   */
  async getMy(estudiante_id: string): Promise<TramiteResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/mis`, {
        params: { estudiante_id },
      });
      return response.data;
    } catch (error) {
      console.error("Error en solicitudService.getMy:", error);
      throw error;
    }
  }

  /**
   * Obtener una solicitud por ID
   */
  async getById(id: string): Promise<TramiteResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error en solicitudService.getById:", error);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes (vista admin)
   */
  async getAll(params?: {
    estado?: string;
    tramiteType_id?: string;
  }): Promise<TramiteResponse[]> {
    try {
      const response = await axios.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error("Error en solicitudService.getAll:", error);
      throw error;
    }
  }

  /**
   * Actualizar estado y observaciones (admin)
   */
  async updateEstado(id: string, payload: { estado: string; observaciones: string }) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${id}/estado`, payload);
      return response.data;
    } catch (error) {
      console.error("Error en solicitudService.updateEstado:", error);
      throw error;
    }
  }

  /**
   * Subir documento final del trámite (admin)
   */
  async uploadDocumentoFinal(id: string, file: File) {
    try {
      const formData = new FormData();
      formData.append("documentoFinal", file);
      const response = await axios.post(`${this.baseUrl}/${id}/documento`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error en solicitudService.uploadDocumentoFinal:", error);
      throw error;
    }
  }

  /**
   * Formatear estado para mostrar en UI
   */
  formatEstado(estado: string): string {
    const estados: Record<string, string> = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completado: "Completado",
      rechazado: "Rechazado",
      entregado: "Entregado",
    };
    return estados[estado] || estado;
  }

  /**
   * Obtener color según el estado
   */
  getStatusColor(estado: string): string {
    switch (estado) {
      case "completado":
        return "success";
      case "en_proceso":
        return "accent";
      case "pendiente":
        return "secondary";
      case "rechazado":
        return "error";
      case "entregado":
        return "primary";
      default:
        return "grey";
    }
  }

  /**
   * Formatear fecha para mostrar
   */
  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  /**
   * Transformar datos del backend para la tabla
   */
  transformToTableFormat(solicitudes: TramiteResponse[]): any[] {
    return solicitudes.map((solicitud) => ({
      _id: solicitud._id,
      numero_seguimiento: solicitud.numero_seguimiento || "N/A",
      tipo: solicitud.tramiteType_id?.nombre || "Trámite sin especificar",
      fecha_solicitud: solicitud.fecha_solicitud || solicitud.createdAt,
      estado: solicitud.estado,
      original: solicitud,
    }));
  }
}

export default new SolicitudService();
