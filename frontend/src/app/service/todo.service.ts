//bridge between backend and frontend

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Observable} from 'rxjs'

import { TodoItem, MoveRequest } from "../models/todo-item.model";


//root url
const API_BASE_URL = 'http://localhost:5175/api/todoitems';


/**
 * can be created and managed by Angular's DI
 * root: frontend can access it
 * Crud system
 */
// https://angular.dev/guide/http
@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private http: HttpClient) {}

  //requires TodoItem arr, return root
  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(API_BASE_URL);
  }

  //require: Todoitem, return root,item
  create(item: Partial<TodoItem>): Observable<TodoItem> {
    return this.http.post<TodoItem>(API_BASE_URL, item);
  }

  //requires full Todolist, return root/item.id/item
  update(item: TodoItem): Observable<void> {
    return this.http.put<void>(`${API_BASE_URL}/${item.id}`, item);
  }

  //requires id, moveRequest, return root/id/move
  //utilise cdk
  move(id: number, move: MoveRequest): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/${id}/move`, move);
  }

  //requires id, return root.id
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/${id}`);
  }
}
