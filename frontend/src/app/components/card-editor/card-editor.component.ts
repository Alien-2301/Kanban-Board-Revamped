import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoItem } from '../../models/todo-item.model';


@Component({
    selector: 'app-card-editor',
    standalone: true, 
    imports: [FormsModule, CommonModule],
    templateUrl: './card-editor.component.html',
    styleUrl: './card-editor.component.css'
})

// for creating only
export class CardEditorComponent {
    // editing current or creating new one
    @Input() item: TodoItem | null = null;
    
    name = ''
    category = ''

    //Event emitter = messenger
    @Output() save = new EventEmitter <{name: string, category?: string}>();
    @Output() cancel = new EventEmitter<void>();

    // changes based on parent's input (board or column)
    ngOnChanges(): void {
        this.name       = this.item?.name ?? '';
        this.category   = this.item?.category ?? '';
    }
    //editing card
    onSave(): void {
        // if the name of the task doesnt exist, return
        if (!this.name.trim()) return;
        //emit = sending message using the Event emitter
        this.save.emit({name: this.name, category: this.category || undefined})
    }
}