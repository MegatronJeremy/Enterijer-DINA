import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WorkersService {
  private uri = 'http://localhost:4000/workers';

  constructor(private http: HttpClient) {}

  getAllWorkers(agency: string) {
    return this.http.get(`${this.uri}/all/${agency}`);
  }

  createWorker(worker: any) {
    return this.http.post(`${this.uri}/create`, worker);
  }

  deleteWorker(id: string) {
    return this.http.delete(`${this.uri}/delete/${id}`);
  }

  updateWorker(worker: any) {
    return this.http.put(`${this.uri}/update`, worker);
  }

  getVacancyRequests(agency: string) {
    return this.http.get(`${this.uri}/get-vac/${agency}`);
  }

  createVacancyRequest(vacancy: any) {
    return this.http.post(`${this.uri}/create-vac`, vacancy);
  }

  updateVacancyRequest(vacancy: any) {
    return this.http.put(`${this.uri}/update-vac`, vacancy);
  }
}
