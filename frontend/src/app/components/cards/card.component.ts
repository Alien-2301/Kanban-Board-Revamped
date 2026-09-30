import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoItem } from '../../models/todo-item.model';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card.component.html',
    styleUrl: './card.component.css'
})

export class CardComponent{

    @Input() item!: TodoItem;
    @Output() delete = new EventEmitter<number>() //Angular event: delete, num value
    @Output() edit = new EventEmitter<TodoItem>();

    onDelete(): void {
        console.log('Delete button clicked');
        console.log('Item ID:', this.item.id);

        this.delete.emit(this.item.id);
    }

    onEdit(): void {
        this.edit.emit(this.item);
    }

    /*
        onDelete()
        │
        │ I created this method (activate on the button)
        ▼ 
        this.delete.emit(...)
        │
        │ Angular EventEmitter with num value
        ▼
        delete event → parent component 
    */

    /*
        CARD
        <button>
        ↓
        onDelete()
        ↓
        this.delete.emit(item.id)
        ↓
        COLUMN
        (delete)="deleteCard.emit($event)"
        ↓
        this.deleteCard.emit(item.id)
        ↓
        PARENT / BOARD
    */
}