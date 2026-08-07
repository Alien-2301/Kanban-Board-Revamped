# Kanban-Board-Revamped
A personal Kanban task-management app built with an ASP.NET Core Web API, Entity Framework Core, SQLite, and Angular.


# Fix: EF Core namespace missing

Missing EF Core package ref in `.csproj`. Add:

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="10.0.0" />
```

Then `dotnet restore`.

Other providers: `.SqlServer`, `.Sqlite`, `Npgsql.EntityFrameworkCore.PostgreSQL`

If version fails: drop `Version` attr or `dotnet add package Microsoft.EntityFrameworkCore.InMemory`

