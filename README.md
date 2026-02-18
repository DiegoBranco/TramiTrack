# TramiTrack - Gestión de Trámites Académicos

TramiTrack es una solución desarrollada por el Equipo C para la asignatura de Aplicaciones con Tecnología Internet 2. La plataforma utiliza el stack MEVN (MongoDB, Express, Vue.js, Node.js) acompañado de Vite para ofrecer una experiencia de usuario rápida y reactiva.

# Tecnologías Utilizadas
**Frontend:** Vue.js 3 + Vite.

**Backend:** Node.js + Express.js.

**Base de Datos:** MongoDB.

**Contenedores:** Docker & Docker Compose.


# Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:

- Docker Desktop
- Git

---

# Instalación y Despliegue
Sigue estos pasos para levantar el entorno local:

## 1. Clonar el repositorio
```
git clone https://github.com/tu-usuario/tramitrack.git
cd tramitrack
```
## 2. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto `/tramitrack/.env` basado en el siguiente ejemplo:

**Ejemplo de .env**
```
SERVER_PORT=3001
VITE_API_URL=http://localhost:3001
MONGO_USER=
MONGO_PASSWORD=
MONGO_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@localhost:27017/tramitrack
```


## 3. Levantar con Docker
Ejecuta el siguiente comando para construir y levantar los contenedores:

```
docker compose up --build
```
---
# Puntos de Acceso
Una vez que los contenedores estén corriendo, podrás acceder a:

Frontend de Vue en  http://localhost:3000/
Backend de  Express.js en  http://localhost:3001/
MongoDB accesible en  http://localhost:27017/
Jenkins accesible en  http://localhost:8080/

si jenkins no tiene permiso de Docker: 
docker run --rm -u root -v tramitrack_jenkins_data:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock alpine sh -c "chown -R 1000:1000 /var/jenkins_home && chmod 666 /var/run/docker.sock"

