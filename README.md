# The Narrative Compass 🧭

> **An AI-powered co-authoring environment that transforms static text into a living, breathing fictional universe.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2-blue)
![Gemini API](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20%26%203.0-8E75B2)
![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind-38B2AC)

---

## 📖 Table of Contents

1. [Introduction](#-introduction)
2. [The Core Concept](#-the-core-concept)
3. [Key Features](#-key-features)
    - [Live World Tracking](#1-live-world-tracking)
    - [Deep Character Insights](#2-deep-character-insights)
    - [Lore & Object Expansion](#3-lore--object-expansion)
    - [Narrative Health Analysis](#4-narrative-health-analysis)
4. [User Experience Guide](#-user-experience-guide)
5. [Technical Architecture](#-technical-architecture)
    - [Frontend Stack](#frontend-stack)
    - [AI Integration Layer](#ai-integration-layer)
    - [Prompt Engineering Strategy](#prompt-engineering-strategy)
6. [AI Implementation Details](#-ai-implementation-details)
    - [Gemini 2.5 Flash: The Speed Demon](#gemini-25-flash-the-speed-demon)
    - [Gemini 3.0 Pro: The Logic Engine](#gemini-30-pro-the-logic-engine)
    - [Structured Data & Continuity](#structured-data--continuity)
7. [Installation & Setup](#-installation--setup)
8. [Project Structure](#-project-structure)
9. [Future Roadmap](#-future-roadmap)

---

## 🌟 Introduction

**The Narrative Compass** isn't just a text editor; it's a creative partner that understands the logic of your story. 

Traditional writing tools treat your manuscript as a string of characters. The Narrative Compass treats it as a **database of entities**. As you type, the AI reads along, identifying characters, locations, and magical objects, building a "World Knowledge Map" in real-time.

It solves the two biggest problems in long-form fiction writing:
1.  **Continuity Drift**: Forgetting that a character lost their sword in Chapter 3.
2.  **Writer's Block**: Getting stuck on "what happens next" or how a character should react.

---

## 🧠 The Core Concept

**"Write inside the simulation, not just on the page."**

In a standard workflow, the author holds the entire universe in their head. The Narrative Compass offloads this cognitive load to the AI. 

When you write a scene where *Commander Vex enters the Obsidian Spire*, the system:
1.  **Recognizes** "Commander Vex" (Character) and "Obsidian Spire" (Location).
2.  **Updates** their status (e.g., Vex is now "Active", Spire is "Occupied").
3.  **Analyzes** the interaction for consistency (e.g., "Wait, Vex was imprisoned in the previous chapter, how is he here?").

This feedback loop allows authors to write faster and with greater complexity, knowing the system is watching the threads of the tapestry.

---

## ✨ Key Features

### 1. Live World Tracking
The system continuously scans your manuscript to maintain a dynamic sidebar of "World Entities".
*   **Entity Extraction**: Automatically identifies Characters, Locations, Objects, and Lore.
*   **State Tracking**: Updates status tags (e.g., "Injured", "Lost", "Cursed") based on narrative events.
*   **Relationship Mapping**: Tracks who knows whom and how objects relate to owners.

### 2. Deep Character Insights
Click on any character to open a dedicated modal that goes beyond simple bios.
*   **Dynamic Dialogue**: Generates 3 lines of dialogue relevant *specifically* to the current scene context.
*   **Hidden Secrets**: AI invents potential secrets the character is hiding, fueling subplots.
*   **Flaws & Weaknesses**: Identifies character flaws (e.g., "Arrogance", "Fear of Fire") to create conflict.
*   **Future Arcs**: Suggests where the character's story could go next based on their current trajectory.

### 3. Lore & Object Expansion
World-building often happens on the fly. The Compass helps flesh out the details.
*   **Instant History**: Generates a micro-history for any object or location.
*   **Cultural Significance**: Explains how the world views this item (e.g., "Feared by the peasantry").
*   **Hidden Properties**: Suggests magical or technological traits not yet revealed (e.g., "Glows when orcs are near").

### 4. Narrative Health Analysis
A "Check Engine Light" for your story.
*   **Pacing Score**: A 0-100 visualization of story tension. Low scores indicate stagnation; high scores indicate breathless action.
*   **Plot Hole Detection**: Uses advanced reasoning models to spot logic errors (e.g., timeline anachronisms).
*   **Continuity Status**: A simple traffic light system (Stable, Risk, Broken) to gauge narrative integrity.

---

## 🎮 User Experience Guide

1.  **The Workspace**: You start with a clean, distraction-free editor on the left and an empty Compass on the right.
2.  **Writing**: Begin typing your story. As you write, the system is passive.
3.  **Sync & Analyze**: When you finish a scene or get stuck, click **"Sync & Analyze"**.
    *   The button pulses as it sends data to the Gemini API.
    *   *Flash* models extract entities.
    *   *Pro* models analyze logic.
4.  **Review**:
    *   New characters appear in the sidebar.
    *   Click the **Analysis** tab to see if your pacing is dragging.
    *   See a **"BROKEN"** continuity status? Read the plot hole report to fix the timeline.
5.  **Ideation**: Stuck on dialogue? Click a character card to see what they might say next.

---

## 🏗 Technical Architecture

The Narrative Compass is built as a modern Single Page Application (SPA) prioritizing speed and aesthetic minimalism.

### Frontend Stack
*   **React 19**: Utilizing the latest hooks for state management and transitions.
*   **TypeScript**: Ensuring type safety across the complex data structures of World Entities and Analysis results.
*   **Tailwind CSS**: For a dark-mode-first, high-contrast UI designed for long writing sessions.
*   **Lucide React**: Consistent, lightweight iconography.

### AI Integration Layer
The app communicates directly with the Google Gemini API via the `@google/genai` SDK. 

*   **Service Pattern**: All AI logic is encapsulated in `services/geminiService.ts`.
*   **No Backend**: The app runs entirely client-side (for this demo version), using the user's API key or a proxy.

### Prompt Engineering Strategy
We use a **"System-Expert" Persona** approach.
*   *The Analyst*: For plot holes, the AI is told it is a "Continuity Editor."
*   *The World Builder*: For lore, the AI is told it is a "Fantasy Historian."

**JSON Enforcement**: All prompts request `application/json` output schemas to ensure the UI can render structured data (lists, scores, tags) rather than raw text.

---

## 🤖 AI Implementation Details

The secret sauce is the hybrid use of different Gemini models to balance **latency** vs **intelligence**.

### Gemini 2.5 Flash: The Speed Demon
Used for: **World Updates, Character Extraction, Lore Generation.**
*   **Why?** When the user clicks "Sync", they want the sidebar to update immediately. Flash is incredibly fast and cheap.
*   **Task**: It reads the text, extracts Nouns (Entities), and categorizes them. It doesn't need deep reasoning, just strong pattern recognition.

### Gemini 3.0 Pro: The Logic Engine
Used for: **Plot Hole Analysis, Continuity Checks.**
*   **Why?** Detecting a plot hole requires understanding cause-and-effect across time. "He has the key now, but he gave it away in Chapter 1." This requires a larger context window and "Thinking" capabilities.
*   **Task**: It reads the *entire* context summary + the new text and performs a logical audit.

### Structured Data & Continuity
To maintain continuity without a database, the app uses a **"Context Rolling"** technique.
1.  Current World State is summarized into a compact text block (e.g., "John: Alive, Loc: Cave").
2.  This summary is passed to the AI along with the new text.
3.  The AI is asked to *delta* the state: "Given the old state and new text, what is the *new* state?"

---

## 💻 Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   A Google AI Studio API Key (Get one [here](https://aistudio.google.com/))

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/achuajays/narrative-compass.git
    cd narrative-compass
    ```

2.  **Install Dependencies**
    (Note: This project uses standard React dependencies. Ensure you have `react`, `react-dom`, and `@google/genai`.)
    ```bash
    npm install
    ```

3.  **Configure API Key**
    Create a `.env` file in the root directory:
    ```env
    # .env
    API_KEY=your_google_gemini_api_key_here
    ```
    *Note: In a production build, you would use a backend proxy to hide this key.*

4.  **Run the Development Server**
    ```bash
    npm start
    ```

5.  **Open in Browser**
    Navigate to `http://localhost:3000`.

---

## 📂 Project Structure

```
/
├── index.html              # Entry point (Tailwind CDN included here)
├── index.tsx               # React Root mount
├── App.tsx                 # Main Layout & State Container
├── types.ts                # Shared TypeScript Interfaces (WorldEntity, PlotAnalysis)
├── metadata.json           # App metadata configuration
│
├── components/
│   ├── Editor.tsx          # The main text area with analysis triggers
│   ├── WorldSidebar.tsx    # The right-hand panel (Entity List + Analysis Tabs)
│   ├── CharacterModal.tsx  # AI Dialogue & Character Insight View
│   └── LoreModal.tsx       # AI History & Lore Expansion View
│
└── services/
    └── geminiService.ts    # ALL AI Logic. Connects to Google GenAI SDK.
                            # Contains: updateWorldKnowledge, analyzeNarrative, etc.
```

### Key File Breakdown

*   **`services/geminiService.ts`**: The brain. This file contains the prompt templates. If you want to change how the AI analyzes plot holes, edit the `analyzeNarrative` function here.
*   **`types.ts`**: The skeleton. Defines the shape of the data (e.g., what fields a `Character` has). Adding a new field like `age` requires updating this file and the AI prompt schema.
*   **`components/WorldSidebar.tsx`**: The nervous system. It handles the switching between "World Data" and "Compass Analysis" and manages the modal states.

---

## 🚀 Future Roadmap

While the current version is a powerful demo, the vision for **The Narrative Compass** extends much further:

1.  **Long-form Persistence**:
    *   Integration with IndexedDB or a cloud database to save stories across sessions.
    *   Chapter management to handle novel-length context windows (RAG - Retrieval Augmented Generation).

2.  **Visual Generation**:
    *   Using Imagen 3 to generate character portraits and location concept art directly in the sidebar.

3.  **Voice Mode**:
    *   Dictation support where the user speaks the story, and the AI transcribes + analyzes simultaneously.

4.  **Export Options**:
    *   Export the "World Bible" as a PDF or Wiki format for fans or reference.

5.  **Collaborative Mode**:
    *   Two writers working in the same doc, with the AI acting as the referee for continuity.

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

*Built with ❤️ and 🤖 by Adarsh Ajay.*
*Powered by Google Gemini.*
