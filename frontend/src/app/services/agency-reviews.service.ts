import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Review from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class AgencyReviewsService {
  private uri = 'http://localhost:4000/reviews';

  constructor(private http: HttpClient) {}

  updateReview(review: Review) {
    const url = `${this.uri}/update`;
    return this.http.put(url, review);
  }

  deleteReview(id: string) {
    const url = `${this.uri}/delete/${id}`;
    return this.http.delete(url);
  }

  getAllReviews(agency: string, personalized: boolean) {
    const url = `${this.uri}/all/${agency}/${personalized}`;
    return this.http.get(url);
  }

  createReview(review: Review) {
    const url = `${this.uri}/create`;
    return this.http.post(url, review);
  }
}
