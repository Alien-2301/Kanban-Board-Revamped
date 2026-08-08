using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

// Inheritted from the the DBContext
public class TodoContext : DbContext 
{
    public TodoContext(DbContextOptions<TodoContext> options): base(options)
    {
    }
    public DbSet<TodoItem> TodoItems {get; set;} = null!;

    //https://learn.microsoft.com/en-us/ef/core/modeling/
    #region Required 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>()
            .Property(b => b.Url)
            .IsRequired();
    }
    #endregion
}

