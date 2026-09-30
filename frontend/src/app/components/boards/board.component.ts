
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { ColumnComponent } from '../column/column.component';
import { CardEditorComponent } from '../card-editor/card-editor.component';

import { TodoItem, TodoStatus, TodoColumn } from '../../models/todo-item.model';
import { TodoService } from '../../service/todo.service'

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, ColumnComponent, CardEditorComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent implements OnInit {

  columns = signal<TodoColumn[]>([
    { id: 'todo', title: 'To Do', status: TodoStatus.Todo, items: [] },
    { id: 'inProgress', title: 'In Progress', status: TodoStatus.InProgress, items: [] },
    { id: 'pending', title: 'Pending', status: TodoStatus.Pending, items: [] },
    { id: 'done', title: 'Done', status: TodoStatus.Done, items: [] },
  ]);


  showEditor = false //for ngIf="showEditor"
  editingItem: TodoItem | null = null

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.getAll().subscribe((allItems) => {
      this.columns.update((cols) =>
        cols.map((col) => ({
          ...col,
          items: allItems.filter((i) => i.status === col.status),
        }))
      );
    });
  }

  private findColByIdx(columnId: string): number {
    return this.columns().findIndex((col) => col.id === columnId)
  }

  // loadItems(): void {
  //   //changed using .set() method for writable signals
  //   this.todoService.getAll().subscribe((items) => {
  //     this.todo.set(items.filter((i) => i.status === 'Todo'));
  //     this.inProgress.set(items.filter((i) => i.status === 'InProgress'));
  //     this.pending.set(items.filter((i) => i.status === 'Pending'));
  //     this.done.set(items.filter((i) => i.status === 'Done'));
  //   });
  //   console.log('Assignment done. Current todo array:', this.todo, 'Time:', new Date().toISOString())
  // }

  onDrop(event: CdkDragDrop<TodoItem[]>): void {
    const item: TodoItem = event.item.data;
    const fromIndex = this.findColByIdx(event.previousContainer.id);
    const currentIndex = this.findColByIdx(event.container.id)

    console.log('previousContainer.id:', event.previousContainer.id, '→ fromIndex:', fromIndex);
    console.log('container.id:', event.container.id, '→ currentIndex:', currentIndex);

    // checking the change in column
    this.columns.update((cols) => {
      const next = cols.map((col) => ({ ...col, items: [...col.items] })) // shallow-clone each column
      console.log("before change", next)
      if (fromIndex === currentIndex) {
        moveItemInArray(next[currentIndex].items, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(next[fromIndex].items, next[currentIndex].items, event.previousIndex, event.currentIndex);
        item.status = next[currentIndex].status;
      }
      console.log("after change", next)
      return next 
    })

    this.todoService.move(item.id,
      { status: item.status, order: event.currentIndex })
      .subscribe({
        error: () => this.ngOnInit() //if failed, fallback to previous state
      })
  }

  // from column to here 
  deleteCard(id: number): void {
    this.todoService.delete(id).subscribe(() => this.ngOnInit());
  }

  //creating new 
  openNewCard(): void {
    this.showEditor = true;
    this.editingItem = null
    console.log("adding new card")
  }

  //editing exisitng one
  openEditCard(item: TodoItem): void {
    this.showEditor = true;
    this.editingItem = item;
  }

  closeEditor(): void {
    this.showEditor = false;
    this.editingItem = null
  }

  saveCard(draft: Partial<TodoItem>): void {
    if (this.editingItem) {
      const updated = { ...this.editingItem, ...draft } as TodoItem;
      this.todoService.update(updated).subscribe(() => this.ngOnInit());
    } else {
      const todoColumn = this.columns().find((c) => c.status === TodoStatus.Todo)
      this.todoService.create({
        ...draft,
        status: TodoStatus.Todo,
        order: todoColumn ? todoColumn.items.length : 0
      }).subscribe(() => this.ngOnInit())
    }
    this.closeEditor()
  }

  otherColumnIds(currentId: string): string[] {
    return this.columns()
      .filter((c) => c.id !== currentId)
      .map((c) => c.id);
  }
  
  trackByColumnId(index: number, col: TodoColumn): string {
  return col.id;
}
}
