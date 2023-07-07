import { Injectable } from '@angular/core';
import CanvasObject from '../models/canvasObject';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CanvasObjectService {
  private uri: string = 'http://localhost:4000/objects';

  constructor(private http: HttpClient) {}

  updateCanvasObject(canvasObject: CanvasObject) {
    return this.http.post(`${this.uri}/update`, canvasObject);
  }

  deleteCanvasObject(id: string) {
    return this.http.post(`${this.uri}/delete`, { id });
  }

  getAllCanvasObjects() {
    return this.http.get(`${this.uri}/all`);
  }

  getAllForUser(username: string) {
    return this.http.get(`${this.uri}/get/${username}`);
  }

  createCanvasObject(canvasObject: CanvasObject) {
    return this.http.post(`${this.uri}/create`, canvasObject);
  }
}
