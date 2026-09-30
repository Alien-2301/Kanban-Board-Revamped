import { Component } from '@angular/core';
import { BoardComponent } from './components/boards/board.component'


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {}