using TodoApi.Models;

public class MoveRequest
{
    public TodoStatus Status{get; set; }
    public int Order {get; set; }
}