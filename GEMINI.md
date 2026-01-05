# GEMINI Project Context

This document provides a comprehensive overview of the project, its structure, and conventions to be used as a reference for future development and AI-assisted tasks.

## 1. Project Overview

This is a modern backend API service built with [Elysia.js](https://elysiajs.com/), a high-performance framework designed for the [Bun](https://bun.sh/) runtime. The project is written in TypeScript and follows a layered architectural pattern inspired by Clean Architecture.

### Core Technologies:

- **Runtime:** Bun
- **Framework:** Elysia.js
- **Language:** TypeScript
- **Testing:** `bun:test`
- **Containerization:** Docker

### Architectural Structure:

The codebase is organized into distinct layers to promote separation of concerns:

- `src/domain`: Contains core business logic, entities, and value objects (e.g., `current-date.vo.ts`).
- `src/application`: Holds application-specific use cases that orchestrate the domain logic (e.g., `get-system-status.usecase.ts`).
- `src/infrastructure`: Implements external-facing concerns like HTTP routes (`systems.routes.ts`) and database adapters.
- `src/main`: The entry point of the application (`server.ts`), including configuration and shared utilities.

## 2. Building and Running

All commands should be executed using the `bun` runtime.

### Installation

Install all dependencies using the following command:

```bash
bun install
```

### Running the Application

**Development Mode:**

To run the server in development mode with live-reloading, use the `dev` script:

```bash
bun run dev
```

The server will start, and you can see the output in the console, typically indicating it's running on `localhost:3000`.

**Docker:**

The application is containerized with Docker. To build and run the service using Docker Compose:

```bash
docker compose up --build
```

The API will be accessible at `http://localhost:8080`.

## 3. Development Conventions

### Testing

The project uses Bun's built-in test runner. Tests are located in the `test/` directory, mirroring the `src/` structure.

- **Unit Tests:** `test/unit/`
- **Integration Tests:** `test/integration/`
- **End-to-End Tests:** `test/e2e/`

To run all tests, execute:

```bash
bun test
```

### Code Style and Structure

- **TypeScript:** The project uses strict TypeScript rules, as defined in `tsconfig.json`.
- **Path Aliases:** Use path aliases for clean imports between layers (e.g., `@domain`, `@application`).
- **Layered Architecture:** Strictly adhere to the separation of concerns. Infrastructure should depend on the application layer, and the application layer on the domain. The domain should have no external dependencies.
- **Asynchronous Operations:** Use cases return an `Either` monad (`Either<Error, Success>`) to handle success and failure states explicitly, avoiding uncaught exceptions.
- **Schema Validation:** Elysia uses `TypeBox` to define schemas for request and response validation, ensuring type safety at the API boundary.
