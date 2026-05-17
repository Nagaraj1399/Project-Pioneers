# 🤖 Toy Store of the Future — Code Vipassana Showcase

[![Deploy Link](https://img.shields.io/badge/Live-Demo--blue?style=for-the-badge&logo=vercel&color=8b5cf6)](https://project-pioneers.vercel.app)
[![Vite Build](https://img.shields.io/badge/Vite-Build--Success-06b6d4?style=for-the-badge&logo=vite)](https://github.com/Nagaraj1399/Project-Pioneers)

Welcome to the **Toy Store of the Future**, built by **Project Pioneers**. This React-TypeScript dashboard serves as a high-fidelity reference implementation showcasing **Serverless Cloud Databases, Vector Embeddings, and Multimodal Generative AI pipelines** based on the **Code Vipassana** developer curriculum.

---

## 🚀 Live Showcase & Deployment

*   **Live Deployment URL:** [https://project-pioneers.vercel.app](https://project-pioneers.vercel.app)
*   **GitHub Repository:** [https://github.com/Nagaraj1399/Project-Pioneers](https://github.com/Nagaraj1399/Project-Pioneers)

> [!TIP]
> The app contains **dual execution modes**:
> 1. **Simulation Mode**: Fully active offline out of the box using local vector projections and high-fidelity custom assets.
> 2. **Live Mode**: Paste your **Google Gemini API Key** directly in the top-right settings drawer in the UI to connect live models (Gemini 2.5 Flash and Imagen 3)!

---

## 🛠️ Outstanding Architectural Features

1.  **Semantic Vector Storefront**: Looks at abstract search intent (e.g. "soft flying nightlight") and maps it to a normalized 12-dimensional vector embedding. It sorts the inventory in real-time based on calculated **Cosine Similarity**, demonstrating how **AlloyDB + pgvector** bypasses traditional strict character-matching restrictions.
2.  **Multimodal Image search**: Upload a photo of a toy. Gemini vision extracts product details, suggests query tags, and executes a vector matching scan to find identical stock.
3.  **Imagen 3 Concept Lab**: Input a custom product concept prompt. Witness the automated database ingestion pipeline (Prompt Parsing $\rightarrow$ Imagen Mockup synthesis $\rightarrow$ Vectorization $\rightarrow$ DB catalog insert).
4.  **pgvector DB Explorer**: Demystifies vector databases by exposing the 12 query coordinate weights, calculating cosine angles, and emulating raw PostgreSQL SQL queries.
5.  **AI Dev Mentor**: An in-app educational drawer with interactive Q&A buttons to guide developers through the AlloyDB and serverless runtimes setup process.

---

## 📐 Cosine Similarity Mathematics

To match the behavior of AlloyDB's native pgvector `<=>` index, our search coordinates are mapped as normalized unit vectors, and similarity is computed using:

$$\text{Similarity} = \frac{Q \cdot P}{\|Q\| \|P\|} = \sum_{i=1}^{12} Q_i P_i$$

---

## 📦 Local Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Nagaraj1399/Project-Pioneers.git
    cd Project-Pioneers
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Launch Local Dev Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4.  **Build Production Bundle**:
    ```bash
    npm run build
    ```

---

## 🛡️ Tech Stack & Integrations

-   **Frontend**: React 19, TypeScript, Vanilla CSS (Premium dark-theme glassmorphic tokens)
-   **Bundler**: Vite 8 & Rolldown
-   **AI Services**: Official `@google/genai` (Gemini 2.5 Flash, Imagen 3, Multimodal image analysis)
-   **Database Reference**: PostgreSQL with `pgvector` extension (Google Cloud AlloyDB)
