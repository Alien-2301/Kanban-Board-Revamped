# Kanban Board Revamped

A personal Kanban task manager. Cards move between four columns by drag and drop, and every move is saved to a SQLite database through an ASP.NET Core API.

## Features

- Four columns: **To Do**, **In Progress**, **Pending**, **Done**
- Drag and drop between and within columns (Angular CDK)
- Card order is saved, and the server renumbers both the source and destination columns on every move
- Create, edit and delete cards (name, category, priority, due date, notes)
- `CompletedAt` is set automatically when a card enters **Done** and cleared when it leaves
- Failed moves roll back by reloading the board from the server
- Swagger UI for the API in development

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 (standalone components, signals), Angular CDK, RxJS, TypeScript 5.9 |
| Backend | ASP.NET Core Web API (.NET 10), controller-based |
| Data | Entity Framework Core 10 with SQLite (`TodoList.db`) |
| API docs | OpenAPI + NSwag Swagger UI |
| Testing | Vitest + jsdom (frontend) |

## Project Structure

```
Kanban-Board-Revamped/
├── backend/                     # ASP.NET Core Web API
│   ├── Controllers/
│   │   └── TodoItemsController.cs
│   ├── Models/
│   │   ├── TodoItem.cs          # EF entity (includes a server-only Secret field)
│   │   ├── TodoItemDTO.cs       # what the API exposes
│   │   ├── TodoStatus.cs        # Todo | InProgress | Pending | Done
│   │   ├── MoveRequest.cs       # payload for drag-and-drop
│   │   └── TodoContext.cs
│   ├── Migrations/
│   ├── Program.cs               # DI, SQLite, CORS, OpenAPI
│   └── TodoList.db
└── frontend/                    # Angular app
    └── src/app/
        ├── components/
        │   ├── boards/          # loads data, handles drops
        │   ├── column/          # one CDK drop list
        │   ├── cards/           # single card
        │   └── card-editor/     # create/edit form
        ├── models/todo-item.model.ts
        └── service/todo.service.ts   # HTTP client for the API
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20.19+ (or 22.12+) and npm

## Getting Started

### 1. Run the backend

```bash
cd backend
dotnet restore
dotnet run --launch-profile http
```

The API runs at **http://localhost:5175** and Swagger UI at **http://localhost:5175/swagger**.

> Use the `http` profile. The frontend calls `http://localhost:5175`, and the `https` profile redirects that to HTTPS, which breaks the browser's CORS preflight request.

If you need to create or update the database from the migrations:

```bash
dotnet tool install --global dotnet-ef   # once
dotnet ef database update
```

### 2. Run the frontend

```bash
cd frontend
npm install
npm start
```

Open **http://localhost:4200**.

### 3. Run the frontend tests

```bash
cd frontend
npm test
```

## API Reference

Base URL: `http://localhost:5175/api/TodoItems`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/TodoItems` | List all cards, ordered by status, then position |
| `GET` | `/api/TodoItems/{id}` | Get one card |
| `POST` | `/api/TodoItems` | Create a card (appended to the end of its column) |
| `PUT` | `/api/TodoItems/{id}` | Update name, category, due date, priority, notes |
| `PATCH` | `/api/TodoItems/{id}/move` | Move a card to a column and position |
| `DELETE` | `/api/TodoItems/{id}` | Delete a card |

### Data model

| Field | Type | Notes |
|---|---|---|
| `id` | long | Auto-generated |
| `name` | string | Card title |
| `category` | string? | Optional label |
| `status` | enum | `Todo`, `InProgress`, `Pending`, `Done` (sent as strings) |
| `order` | int | Position within the column, 0-based |
| `dueDate` | datetime? | Optional |
| `priority` | int | 1 = Low, 2 = Medium (default), 3 = High |
| `createdAt` | datetime | Set by the server (UTC) |
| `completedAt` | datetime? | Set when moved to **Done** (Singapore time), cleared otherwise |
| `notes` | string? | Optional |

`PUT` ignores `status` and `order`. They can only be changed through the `/move` endpoint. The internal `Secret` field is never returned by the API.

### Move request

```http
PATCH /api/TodoItems/3/move
Content-Type: application/json

{ "status": "InProgress", "order": 1 }
```

## How a Drag and Drop Works

1. `BoardComponent.onDrop()` updates the columns signal immediately, so the UI feels instant.
2. It calls `PATCH /move` with the new status and index.
3. The API inserts the card at that index, renumbers the destination column (and the source column if the status changed), and updates `CompletedAt`.
4. If the request fails, the board reloads from the server.

## Configuration

| Setting | Location | Default |
|---|---|---|
| API base URL | `frontend/src/app/service/todo.service.ts` | `http://localhost:5175/api/todoitems` |
| Allowed CORS origin | `backend/Program.cs` | `http://localhost:4200` |
| Database | `backend/Program.cs` | SQLite, `Data Source=TodoList.db` |
| Launch URLs | `backend/Properties/launchSettings.json` | `5175` (http), `7225` (https) |

`Program.cs` also has commented-out lines for switching to the in-memory provider or SQL Server.

## Known Limitations

- The edit form opens empty. `board.component.html` doesn't pass `editingItem` to `<app-card-editor>`, so existing values aren't pre-filled.
- The editor only collects name and category. Priority, due date and notes are supported by the API but have no inputs yet.
- Cards show the priority as a plain number, not an icon or colour.
- The new-card button is always created in **To Do**.
- There is no authentication, so it's meant for local, personal use.
- `CompletedAt` is stored in Singapore time while `CreatedAt` is UTC.
