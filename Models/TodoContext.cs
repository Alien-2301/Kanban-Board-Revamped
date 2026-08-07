using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

// Inheritted from the the DBContext
public class TodoContext : DbContext 
{
    public TodoContext(DbContextOptions<TodoContext> options): base(options)
    {
    }
    public DbSet<TodoItem> TodoItems {get; set;} = null!;
}

