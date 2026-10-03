# 🗺️ Google Maps Platform with Gemini

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Google Maps Platform](https://img.shields.io/badge/Google%20Maps-Platform-4285F4?logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![Gemini API](https://img.shields.io/badge/Powered%20by-Gemini%20AI-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)

*Una aplicación geoespacial inteligente que integra la precisión de Google Maps con las capacidades analíticas y de generación de contenido de la API de Gemini.*

</div>

---

## 🚀 Descripción del Proyecto

Este proyecto demuestra cómo fusionar la **Google Maps Platform** con la inteligencia artificial generativa de **Gemini**. La aplicación permite realizar búsquedas de ubicaciones (geocodificación), interactuar con mapas dinámicos y enriquecer la experiencia del usuario mostrando insights contextuales, resúmenes o guías turísticas locales generadas en tiempo real por IA.

Todo este proyecto fue realizado en **modo de compilación de Google AI Studio** para explorar la herramienta y crear un prototipo rápidamente mediante instrucciones realizadas en un LLM. 


---

## ✨ Características Principales

- **🗺️ Mapas Interactivos:** Visualización fluida con controles de zoom, paneo y marcadores personalizados.
- **📍 Búsqueda y Geocodificación:** Integración con la Geocoding API para transformar direcciones o ciudades en coordenadas precisas instantáneas.
- **🤖 Insights Locales con Gemini:** Generación automática de datos curiosos, recomendaciones o descripciones personalizadas de cualquier lugar usando modelos de Gemini.
- **🎨 Interfaz Responsiva:** Diseño optimizado (ideal para distribuciones de pantalla dividida u otros layouts adaptativos).
- **🎮 Modo Trivia Interactiva:** Un juego de preguntas de opción múltiple de 3 categorías (*Cocina local, Arte y cultura, Historia local*) basado en el lugar que estás explorando, con calificación automática de respuestas.
- **🛡️ Manejo Robusto de Errores:** Notificaciones visuales en la interfaz para facilitar la resolución de problemas en llamadas a API.

<img width="1484" height="707" alt="Captura de pantalla 2026-10-03 a la(s) 1 47 56 p m" src="https://github.com/user-attachments/assets/68ddc671-ee41-4877-b7a7-ac758c3b505b" />

---

## 🛠️ Tecnologías Utilizadas

- **Google Maps APIs** (Maps JavaScript API / Geocoding V4 API)
- **Google Gemini API** (Generación de contenido contextual y creación dinámica de trivias)
- **Frontend:** React + Vite / JavaScript / HTML5 / CSS3

---

## 🧩 Historial de Desarrollo y Prompts

Este proyecto fue construido de forma iterativa utilizando inteligencia artificial mediante los siguientes prompts de desarrollo:

<details>
<summary><b>Prompt 1: Estructura base y Geocodificación</b></summary>

> Build a highly polished, responsive, split-screen application. This application should be called "Block Explorer". It is meant to be a geospatial exploration app. It will use Google Maps Platform.
> 
> Key Features & Functionality:
> - Split-Screen Layout: On desktop, a 1/3-width left-side editorial control panel and a 2/3-width right-side full-height map.
> - Include a search bar where users can type a location such as a city or neighborhood. Submitting should issue a Geocoding request to the Google Geocoding V4 API REST endpoint (https://geocode.googleapis.com/v4/geocode/address/). Then pan the map to the geocoded location.
> - Interactive Google Map: Render the Map inside an interactive container allowing users to pan, drag, and zoom freely. Place customized markers representing the currently selected/geocoded location.
> - Also include five buttons for presets the users can click on: Buenos Aires, Shibuya, Copacabana, Cologne, and Lima. Clicking on this should geocode the location and pan the map there.
> - Make sure to also include a mechanism to clearly show error messages when they occur so users can easily troubleshoot.
</details>

<details>
<summary><b>Prompt 2: Integración de Insights con Gemini</b></summary>

> Now, let's bring in the AI using the Gemini API.
> 1. Once geocoding successfully identifies the City and State (e.g., "Miami, Florida"), trigger a call to the Gemini API (using the gemini-3.8-flash model).
> 2. Use the following prompt template for the AI: "You are a local tour guide for [City, State]. Give me exactly 3 short, highly engaging, and unusual or surprising fun facts about this place. Keep each fact under 2 sentences. Format the response as a clean HTML unordered list (<ul>) so I can inject it directly."
> 3. Display these fun facts in a beautiful "Local Insights" banner on the bottom portion of the map screen. Add a subtle loading spinner while the AI is thinking.
> 4. Make sure to make this handling robust. If an API request fails, display a user-friendly error notification in the UI.
</details>

<details>
<summary><b>Prompts 3 y 4: Motor de Trivias interactivas</b></summary>

> Now let's build the actual game! We will have Gemini generate a 3-question quiz based on the real places we just got information about.
> 
> After the local insights are generated, show the user a button to "Test their local knowledge". Once clicked, offer them 3 options to choose from:
> - Local cuisine
> - Art and culture
> - Local history
> 
> Once selected, generate a 3-question quiz based on the category and the place. The quiz should be multiple choice. Once the user submits the quiz show them their score and the correct answer.
</details>

---

## ⚙️ Configuración y Requisitos Previos

Asegúrate de contar con lo siguiente antes de comenzar:

1. Una cuenta en [Google Cloud Console](https://console.cloud.google.com/) con **Google Maps Platform** habilitado.
2. Una clave de API de Google Maps con acceso a los servicios necesarios (Maps JavaScript, Geocoding, etc.).
3. Una clave de API de **Google AI Studio** para interactuar con Gemini.

**Nota:** Recuerda que al utilizar los servicios de Google y Gemini pueden surgir temas en tu billing ya que no son servicios gratuitos y posiblemente te pida ingresar una tarjeta bancaria. Consulta a tu administrador para más información.

---

## 📥 Instalación

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/Mariyselita/Google-Maps-Platform-with-Gemini.git](https://github.com/Mariyselita/Google-Maps-Platform-with-Gemini.git)
   cd Google-Maps-Platform-with-Gemini

2. Configura tus variables de entorno.

    Crea un archivo .env en la raíz del proyecto basándote en el ejemplo (.env.example):
    ```bash
    VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_maps_aqui
    VITE_GEMINI_API_KEY=tu_clave_de_gemini_aqui

3. Instala las dependencias y ejecuta el proyecto:

    ```bash
    npm install
    npm run dev
    
## 💡 Uso
Abre la aplicación en tu navegador (por defecto en http://localhost:5173).

Utiliza la barra de búsqueda para introducir cualquier ciudad, dirección o punto de interés en el mundo.

Observa cómo el mapa se desplaza a la ubicación y cómo Gemini genera al instante información y datos curiosos sobre el lugar seleccionado.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto o reportar algún detalle:

Haz un Fork del proyecto.

Crea una rama para tu nueva característica (git checkout -b feature/nueva-caracteristica).

Realiza tus cambios y guárdalos (git commit -m 'Agrega nueva característica').

Sube tus cambios (git push origin feature/nueva-caracteristica).

Abre un Pull Request.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT. Basado en el ejercicio de https://codelabs.developers.google.com/codelabs/cloud-run/build-with-google-maps-platform-and-ai?authuser=1&hl=es-419#2
