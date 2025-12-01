# DeepAuto: Agentic Data Warehouse & Knowledge Base

**DeepAuto** is a next-generation, AI-powered interface designed for modern data warehousing and knowledge management. It combines an "Agentic" approach to data pipelines with a rich, interactive Knowledge Base, all wrapped in a premium, customizable UI.

## 🚀 Project Overview

DeepAuto aims to bridge the gap between complex data engineering and intuitive knowledge discovery. It features two main modules:

1.  **Agentic Data Warehouse**: A visual interface for managing data pipelines, configuring sources (e.g., PostgreSQL, Snowflake) and targets, and monitoring "Agent" activities (Refinery, DB Writer).
2.  **Knowledge Base**: A Reddit-style feed and interactive Ontology Graph for exploring organizational knowledge, grounded in real data and verified by AI agents.

## ✨ Key Features

### 1. Main Workflow (`index.html`)
The central console for Private Equity operations, divided into four key stages:
*   **Sourcing**: AI-driven deal sourcing with automated scoring and lead generation.
*   **Evaluation**: Initial screening and metric analysis of potential deals.
*   **Diligence**: Deep-dive due diligence, including financial modeling and risk assessment.
*   **Portfolio**: Management and performance tracking of active investments.

### 2. Agentic Data Warehouse (`agentic-data-warehouse.html`)
*   **Visual Pipeline Management**: Interactive visualization of the data flow from Source -> Refinery Agent -> DB Agent -> Target.
*   **Source & Target Configuration**: persistent left sidebar for managing data connections.
*   **Live Monitoring**: Real-time status updates for data ingestion and transformation tasks.
*   **Agent Configuration**: Detailed settings for "Refinery Agents" (cleaning, transformation) and "DB Agents" (schema management, writing).

### 2. Knowledge Base (`knowledge-base.html`)
*   **Reddit-Style Feed**: A continuous, scrollable feed of knowledge posts with rich metadata (Author, Role, Score).
*   **Interactive Ontology Graph**:
    *   **Force-Directed Layout**: Physically simulated graph with repulsion and spring forces.
    *   **Ontology Style**: Directional arrows showing relationships (e.g., "Derived From").
    *   **Focus Mode**: Hovering dims unrelated nodes to highlight specific knowledge lineages.
    *   **Multi-line Labels**: Smart text wrapping for readable node titles.
*   **Rich Post Details**:
    *   **Diverse Authorship**: Distinguishes between Human, System, and Agent contributors.
    *   **Data Grounding**: Links to external sources (e.g., TechCrunch) and internal datasets.
    *   **Consolidated Insights**: AI-synthesized summaries of discussions.
    *   **Related Knowledge**: Clickable links to connected posts, fully integrated with the graph.
*   **Nested Comments**: Threaded discussions for in-depth analysis.

### 3. Premium Design System
*   **Tailwind CSS**: Built with a utility-first approach for rapid, consistent styling.
*   **Theme Support**:
    *   **Light/Dark Mode**: Fully supported across all components.
    *   **Design Themes**: Switch between "Modern Fintech", "Institutional", and "Terminal" aesthetics.
*   **Responsive Layout**: Adaptive 3-column layout (Sidebar, Main Feed, Detail/Graph).

## 📂 File Structure

```
DeepAuto_Project/
├── agentic-data-warehouse.html  # Main entry for Data Warehouse interface
├── knowledge-base.html          # Main entry for Knowledge Base interface
├── css/
│   └── styles.css               # Custom overrides and animations
├── js/
│   ├── design-system.js         # Theme management and UI utilities
│   ├── knowledge.js             # Core logic for Knowledge Base (Feed, Graph)
│   └── data/
│       └── knowledge-data.js    # Mock data for posts, comments, and graph nodes
└── README.md                    # Project documentation
```

## 🛠️ Setup & Usage

1.  **No Build Step Required**: This project uses vanilla HTML, JavaScript, and Tailwind CSS (via CDN).
2.  **Run**: Simply open `agentic-data-warehouse.html` or `knowledge-base.html` in any modern web browser.
3.  **Navigation**: Use the left sidebar icon rail to switch between the Dashboard (placeholder), Data Warehouse, and Knowledge Base.

## 💡 Interaction Guide

*   **Knowledge Graph**:
    *   **Toggle**: Use the "Feed / Graph" toggle in the top header.
    *   **Pan/Zoom**: (Coming soon) currently auto-centered.
    *   **Click**: Click a node to view its details in the right sidebar.
*   **Feed**:
    *   **Scroll**: Infinite scroll style.
    *   **Related Posts**: Click chips at the bottom of a post to jump to related content.

## 🎨 Customization

*   **Themes**: Use the dropdown in the header to change the visual style.
*   **Data**: Edit `js/data/knowledge-data.js` to add or modify knowledge posts and relationships.
