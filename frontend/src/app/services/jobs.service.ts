import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Job from '../models/job';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private uri = 'http://localhost:4000/jobs';

  constructor(private http: HttpClient) {}

  getAllJobs() {
    return this.http.get(`${this.uri}/all`);
  }

  createJob(job: any) {
    return this.http.post(`${this.uri}/create`, job);
  }

  deleteJob(id: string) {
    return this.http.delete(`${this.uri}/delete/${id}`);
  }

  updateJob(job: Job) {
    return this.http.put(`${this.uri}/update`, job);
  }

  finishJob(job: Job) {
    job.status = 'completed';
    job.object!.beingCreated = false;
    job.object!.rooms.map((room) => {
      room.roomState = 'not started';
    });

    return this.http.put(`${this.uri}/update`, job);
  }
}
