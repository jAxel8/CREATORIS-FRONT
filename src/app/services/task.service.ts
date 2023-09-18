import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stats, Task } from '../interfaces/Task';
const API_URL = `${environment.server}task`
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  create(data: Task): Observable<any> {
    const url = `${API_URL}/create`;

    return this.http.post(url, data)
  }

  get(date: Date): Observable<Task[]> {
    const url = `${API_URL}/get`;

    const params = new HttpParams().set('date', date.toISOString());

    return this.http.get<Task[]>(url, { params });
  }


  getTaskStats(date: Date): Observable<Stats> {
    const url = `${API_URL}/task-stats`;

    const params = new HttpParams().set('date', date.toISOString());

    return this.http.get<Stats>(url, { params });
  }
  update(data: Task, id: string): Observable<any> {
    const url = `${API_URL}/update/${id}`;
    return this.http.put(url, data)
  }
  updateDoneStatus(id: string, done: boolean): Observable<any> {
    const url = `${API_URL}/update-status/${id}`;
    const data = { done };
    return this.http.put(url, data);
  }

  delete(id: string): Observable<any> {
    const url = `${API_URL}/delete/${id}`;
    return this.http.delete(url)
  }
}
