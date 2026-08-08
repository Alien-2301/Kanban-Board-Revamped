using Microsoft.AspNetCore.SignalR;

namespace TodoApi.Models;

public enum TodoStatus
{
    Todo,
    InProgress,
    Pending, 
    Done
}

public class TodoItem
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public string? Category { get; set; }
    public TodoStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
    public int Priority { get; set; } = 2;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public string? Notes { get; set; }
    public string? Secret {get; set; }
    
}
