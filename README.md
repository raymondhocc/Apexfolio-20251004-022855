# Apexfolio: Simulated Trading Dashboard

[cloudflarebutton]

Apexfolio is a visually stunning and minimalist web application designed as a dashboard for monitoring a simulated auto-trading bot for Interactive Brokers. It provides a clean, intuitive interface for tracking simulated portfolio performance, viewing trade history, and configuring bot parameters. The application emphasizes data visualization and a serene user experience, making complex trading data easy to digest.

**Crucially, this is a simulation tool only and does not connect to live brokerage accounts or execute real trades.** All data is mocked and persisted within a Cloudflare Durable Object to simulate a live environment.

## ✨ Key Features

*   **Interactive Dashboard:** A high-level overview of simulated portfolio performance with key metrics, charts, and recent activity.
*   **Detailed Trade History:** A comprehensive, filterable, and sortable view of all historical simulated trades.
*   **Bot Configuration:** An intuitive interface to define and adjust parameters for the simulated trading bot.
*   **Simulation Logs:** A raw, time-stamped log viewer for debugging and understanding the bot's decision-making process.
*   **Minimalist UI/UX:** A clean, responsive, and professional design with a sophisticated dark/light theme.
*   **Persistent State:** All simulation data is persisted using a single global Cloudflare Durable Object.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, React Router, Tailwind CSS
*   **UI Components:** shadcn/ui, Framer Motion, Lucide React
*   **Data Visualization:** Recharts
*   **State Management:** Zustand
*   **Backend:** Cloudflare Workers, Hono
*   **Database/Persistence:** Cloudflare Durable Objects
*   **Language:** TypeScript

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/apexfolio-trader-dashboard.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd apexfolio-trader-dashboard
    ```
3.  **Install dependencies:**
    ```bash
    bun install
    ```
4.  **Run the development server:**
    The frontend and a local version of the worker will be available.
    ```bash
    bun dev
    ```
    The application will be running on `http://localhost:3000`.

## 💻 Development

The application is structured into three main parts: the frontend client, the backend worker, and a shared types directory.

*   **Frontend (`/src`):** Contains all React components, pages, hooks, and styles.
    *   Pages are located in `/src/pages`.
    *   Reusable components are in `/src/components`.
*   **Backend (`/worker`):** Contains the Hono application running on Cloudflare Workers.
    *   API routes are defined in `/worker/userRoutes.ts`.
    *   Stateful logic is handled by the Durable Object in `/worker/durableObject.ts`.
*   **Shared (`/shared`):** Contains TypeScript types shared between the frontend and backend to ensure type safety.

When adding new features, define the necessary types in `/shared/types.ts`, implement the backend logic and API endpoints in `/worker`, and then build the UI components in `/src` to consume the new endpoints.

## ☁️ Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Build the project:**
    ```bash
    bun build
    ```
2.  **Deploy to Cloudflare:**
    Run the deploy command. Wrangler will handle the process of uploading your static assets and worker code.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]

## ⚠️ Disclaimer

This application is for demonstration and educational purposes only. It is a **simulation** and does not connect to any live brokerage accounts or execute real financial trades. The data displayed is mocked and should not be used for financial decisions. The creators are not liable for any financial losses or misinterpretations resulting from the use of this software.