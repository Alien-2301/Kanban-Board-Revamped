import { Component, signal } from '@angular/core';
import { BoardComponent } from './components/boards/board.component';

@Component({
  selector: 'app-root',
  imports: [BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly title = signal('kanban-app');
}
