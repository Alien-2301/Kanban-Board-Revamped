# Kanban-Board-Revamped
A personal Kanban task-management app built with an ASP.NET Core Web API, Entity Framework Core, SQLite, and Angular.

## Creating the ASP.NET Core Project

```bash
dotnet new webapi --use-controllers -o TodoApi
cd TodoApi
dotnet add package Microsoft.EntityFrameworkCore.InMemory
code -r .
```

* `dotnet new webapi` — Creates a new ASP.NET Core Web API project.
* `--use-controllers` — Uses the controller-based API structure.
* `-o TodoApi` — Creates the project inside a `TodoApi` folder.
* `cd TodoApi` — Moves into the project folder.
* `dotnet add package ...` — Adds Entity Framework Core's in-memory database package.
* `code -r .` — Opens the current project in VS Code.

## Trusting HTTPS

```bash
dotnet dev-certs https --trust
```

Creates/trusts the local HTTPS development certificate so the API can run securely over `https://localhost`.

## Running the Application

```bash
dotnet run --launch-profile https
```

Starts the ASP.NET Core API using the `https` launch profile defined by the project.

## Building Project after adding packages
```bash
dotnet aspnet-codegenerator controller -name TodoItemsController -async -api -m TodoItem -dc TodoContext -outDir Controllers
```


# Fix: EF Core namespace missing

Missing EF Core package ref in `.csproj`. Add:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="10.0.0" />
```

Then `dotnet restore`.

Other providers: `.SqlServer`, `.Sqlite`, `Npgsql.EntityFrameworkCore.PostgreSQL`

If version fails: drop `Version` attr or `dotnet add package Microsoft.EntityFrameworkCore.InMemory`

```bash
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet tool uninstall -g dotnet-aspnet-codegenerator
dotnet tool install -g dotnet-aspnet-codegenerator
dotnet tool update -g dotnet-aspnet-codegenerator
```
