import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../cards/card.component';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

import { TodoItem } from '../../models/todo-item.model';

@Component({
    selector: 'app-column',
    standalone: true, 
    imports: [CommonModule, CardComponent, CdkDropList, CdkDrag],
    templateUrl: './column.component.html',
    styleUrl: './column.component.css'
})

export class ColumnComponent {
    // parent --> child
    @Input() title = '';
    @Input() items: TodoItem[] = [];
    
    // cdk implementation (1)
    @Input() listID = '';
    @Input() connectedColumn: string[] = [];

    @Output() dropped = new EventEmitter<CdkDragDrop<TodoItem[]>>();
    @Output() deleteCard = new EventEmitter<number>();
    @Output() editCard = new EventEmitter<TodoItem>();
}