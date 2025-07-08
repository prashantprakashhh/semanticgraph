# Interactive Semantic Knowledge Graph Explorer

This project is a full-stack web application that allows users to ingest unstructured text, automatically extract entities and relationships, store them in a SPARQL-compliant RDF Triplestore (Apache Jena Fuseki), and explore the resulting knowledge graph through an interactive visual interface.

## Features

-   **User Authentication**: Secure JWT-based registration and login.
-   **Text Ingestion**: Simple interface to paste text for analysis.
-   **NLP Extraction (MVP)**: A basic rule-based service extracts entities (`Person`, `Organization`) and relationships (`worksAt`).
-   **SPARQL Integration**: Uses SPARQL to `INSERT` and `SELECT` data from an RDF triplestore.
-   **Graph Database**: Powered by **Apache Jena Fuseki**.
-   **Interactive Visualization**: A rich, interactive graph explorer built with **React Flow**.

## Technical Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, React Flow
-   **Backend**: Node.js, Express, TypeScript, Zod, JWT
-   **Database**: Apache Jena Fuseki (or any SPARQL 1.1 compliant triplestore)

---

### Setup & Installation

#### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Docker](https://www.docker.com/) (for running the database)

#### 1. Database Setup (GraphDB)

 docker run -d -p 7200:7200 --name graphdb ontotext/graphdb:10.1.2


#### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a .env file from the contents in the project description
# and update FUSEKI_URL if you used a different dataset name.
# FUSEKI_URL="http://localhost:3030/ds"

# Install dependencies
npm install

# Run the development server
npm run dev
```
The backend will be running on `http://localhost:3001`.

#### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

### How to Use the Application

1.  **Register & Login**: Open the app in your browser, register a new user, and log in.
2.  **Ingest Data**: Navigate to the **Ingestion** page. Paste text containing recognizable patterns, such as `"Steve Jobs works at Apple Inc."`. Click "Ingest Text".
3.  **Explore Graph**: Navigate to the **Explore Graph** page. The graph will update to show the new nodes and relationships you just created. You can drag nodes, zoom, and pan to explore the connections.

### API Endpoints

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Log in and receive a JWT.
-   `POST /api/ingest`: (Protected) Ingests text to extract and store knowledge.
-   `GET /api/graph/data`: (Protected) Retrieves all nodes and relationships for visualization.

### NLP Simplification Note

The Natural Language Processing (NLP) in this project (`backend/src/services/nlp.ts`) is a **simplified placeholder**. It uses basic regular expressions to identify entities and relationships. For a production environment, this module should be replaced with a more robust solution like SpaCy, a cloud-based NLP service (Google NLP, Amazon Comprehend), or a more advanced NLP library.



TO CLEAR DB - 
curl -X DELETE http://localhost:3001/api/clear-db