import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import User from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: string | null = null;
  user: User | null = null;

  private uri: string = 'http://localhost:4000/users';

  constructor(private http: HttpClient) {}

  registerUser(user: User) {
    return this.http.post(`${this.uri}/register`, user);
  }

  deleteUser(username: string) {
    return this.http.post(`${this.uri}/delete`, { username });
  }

  authenticateUser(user: any) {
    return this.http.post(`${this.uri}/authenticate`, user);
  }

  storeUserData(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getUserType() {
    const user = localStorage.getItem('user');
    if (!user || !this.loggedIn()) {
      return 'unregistered';
    } else {
      return JSON.parse(user).userType;
    }
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (!user || !this.loggedIn()) {
      return null;
    } else {
      return JSON.parse(user);
    }
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

  getProfile() {
    this.loadToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authToken}`
    );
    return this.http.get(`${this.uri}/profile`, { headers });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.uri}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post(`${this.uri}/reset-password`, { token, password });
  }

  changePassword(oldPassword: string, newPassword: string) {
    const user = localStorage.getItem('user');
    const username = JSON.parse(user!).username;
    return this.http.post(`${this.uri}/change-password`, {
      username,
      oldPassword,
      newPassword,
    });
  }

  changeProfilePicture(username: string, profilePicture: File) {
    let fd = new FormData();
    fd.append('profilePicture', profilePicture);
    return this.http.post(
      `${this.uri}/${username}/change-profile-picture/`,
      fd
    );
  }

  getAllUsers() {
    return this.http.get(`${this.uri}/all-users`);
  }

  updateUser(user: User) {
    return this.http.post(`${this.uri}/update-user`, user);
  }

  loggedIn() {
    this.loadToken();
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.authToken); //False if Token is good, True if not good
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
