# Política de Gestión de Ramas

## 1. Propósito

El presente documento define la política de gestión de ramas del repositorio del proyecto TramiTrack. 
Su objetivo es establecer un flujo de trabajo claro, consistente y controlado que permita la integración continua del código, reduzca conflictos 
y garantice la estabilidad de la rama principal.

Esta política aplica a todos los integrantes del equipo de desarrollo.

## 2. Modelo de Ramificación Adoptado

Se adoptó un enfoque Trunk-Based Development (TBD)

Este enfoque se basa en el uso de una única rama principal `main` sobre la cual se integra continuamente el trabajo del equipo. Las ramas secundarias son temporales y 
de corta duración, con el fin de minimizar divergencias y conflictos de integración.

Se selecciona Trunk-Based Development debido a:

- Su simplicidad y claridad operativa.
- Adecuación para equipos pequeños.
- Reducción de conflictos de merge.
- Facilitación de integración continua.
- Entregas incrementales frecuentes.

## 3. Estructura de Ramas

El repositorio mantiene la siguiente estructura:

### 3.1. main

  - Representa el estado estable del proyecto.
  - Siempre debe contener código que compile y funcione.
  - Todo lo que esté en ramas de infraestructura o pruebas debe integrarse a `main` como parte del código base.
  
### 3.2. Ramas Temporales

Para desarrollar tareas, abrimos ramas que deben:

- Crearse a partir de `main`.
- Tener una duración máxima recomendada de 1 a 3 días.
- Integrarse nuevamente a `main` lo antes posible.

### Nomenclatura de ramas:

* `feat/nombre-tarea` : Nuevas funcionalidades.
* `fix/descripcion-error` : Corrección de fallos.
* `test/nombre-prueba` : Pruebas de concepto o experimentos.
* `docs/cambio-leeme` : Actualizaciones de documentación.

## 4. Flujo de Trabajo Sugerido

Antes de empezar, asegurarse de tener lo último de la nube:

git checkout main\
git pull origin main

## 5. Convenciones

- Usar minúsculas.
- Separar palabras con guiones.
- Utilizar descripciones claras y concisas.

## 6. Actualización de la Política

Esta política podrá ser modificada por consenso del equipo en caso de que las necesidades del proyecto cambien.
