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

class SolicitudService {
  private baseUrl = `${API_URL}/api/solicitudes`;

  async create(payload: SolicitudPayload, comprobante?: File) {
    const formData = new FormData();

    // append the plain fields
    formData.append("tramiteType_id", payload.tramiteType_id);
    formData.append("estudiante_id", payload.estudiante_id);
    // datos_formulario as JSON string to preserve nesting
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
  }

  async getMy(estudiante_id: string) {
    const response = await axios.get(`${this.baseUrl}/mis`, {
      params: { estudiante_id },
    });
    return response.data;
  }

  async getById(id: string) {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // other methods can be added here as needed
}

export default new SolicitudService();
