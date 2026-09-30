using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/TodoItems
        // Status: Which Column
        // Order: Position inside the column
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItemDTO>>> GetTodoItems()
        {
            return await _context.TodoItems
            .OrderBy(t => t.Status)
            .ThenBy(t => t.Order)
            .Select(t => ItemToDTO(t))
            .ToListAsync();
        }

        // GET: api/TodoItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItemDTO>> GetTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            return ItemToDTO(todoItem);
        }

        // PUT: api/TodoItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItemDTO todoDTO)
        {
            if (id != todoDTO.Id)
            {
                return BadRequest();
            }

            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            /* excluding 
            - secret
            - created, completed at
            - status, order
            */
            todoItem.Name = todoDTO.Name;
            todoItem.Category = todoDTO.Category;
            todoItem.DueDate = todoDTO.DueDate;
            todoItem.Priority = todoDTO.Priority;
            todoItem.Notes = todoDTO.Notes;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!TodoItemExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }


        // POST: api/TodoItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TodoItemDTO>> PostTodoItem(TodoItemDTO todoDTO)
        {
            var todoItem = new TodoItem
            {
                Name = todoDTO.Name,
                Category = todoDTO.Category,
                Status = todoDTO.Status,
                DueDate = todoDTO.DueDate,
                Priority = todoDTO.Priority,
                CreatedAt =  DateTime.UtcNow,
                CompletedAt = todoDTO.CompletedAt,
                Notes = todoDTO.Notes
            };
            var totalOrder = await _context.TodoItems
                    .Where(t => t.Status == todoItem.Status)
                    .Select(t => (int?)t.Order)
                    .MaxAsync() ?? -1; //returning null for empty column
            
            todoItem.Order = totalOrder + 1;

            //using singaporean timing (for personal usage)
            TimeZoneInfo singaporeZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");
            DateTime singaporeTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, singaporeZone);
            Console.WriteLine("Singapore Time: " + singaporeTime);

            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();

            // return CreatedAtAction("GetTodoItem", new { id = todoItem.Id }, todoItem);
            // safer way of referring to GetTodoItems
             return CreatedAtAction(
                nameof(GetTodoItem), 
                new { id = todoItem.Id }, 
                ItemToDTO(todoItem));
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool TodoItemExists(long id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }

        // PATCH: api/TodoItems/5/move
        // Called on every drag-and-drop. 
        // Re-sort and number the destination columns
        [HttpPatch("{id}/move")]
        public async Task<IActionResult> MoveTodoItem(long id, MoveRequest move)
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null) return NotFound();

            var beforeStatus = todoItem.Status;

            //list of items in destination columns
            var destItems = await _context.TodoItems
            .Where( t => t.Status == move.Status && t.Id != id)
            .OrderBy (t => t.Order)
            .ToListAsync();

            // inserting item into the column
            // accordingly to the min,max range of destItems
            destItems.Insert(Math.Clamp(move.Order, 0, destItems.Count), todoItem);

            for (int i = 0; i < destItems.Count; i++)
            {
                destItems[i].Order = i;
            }
             //using singaporean timing (for personal usage)
            TimeZoneInfo singaporeZone = TimeZoneInfo.FindSystemTimeZoneById("Singapore Standard Time");
            DateTime singaporeTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, singaporeZone);
            Console.WriteLine("Singapore Time: " + singaporeTime);
            
            todoItem.CompletedAt = move.Status == TodoStatus.Done 
            ? (todoItem.CompletedAt ?? singaporeTime) : null; 

            if (beforeStatus != move.Status)
            {
                var oldColumnItems = await _context.TodoItems
                .Where(t => t.Status == beforeStatus && t.Id != id)
                .OrderBy(t => t.Order)
                .ToListAsync();

                for (int i = 0; i < oldColumnItems.Count; i++)
                {
                    oldColumnItems[i].Order = i;
                }
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static TodoItemDTO ItemToDTO(TodoItem todoItem) =>
        new TodoItemDTO
        {
            Id = todoItem.Id,
            Name = todoItem.Name,
            Category = todoItem.Category,
            Status = todoItem.Status,
            Order = todoItem.Order,
            DueDate = todoItem.DueDate,
            Priority = todoItem.Priority,
            CreatedAt = todoItem.CreatedAt,
            CompletedAt = todoItem.CompletedAt,
            Notes = todoItem.Notes
        };
    }
}
