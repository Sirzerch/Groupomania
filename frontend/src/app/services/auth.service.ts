import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth = new BehaviorSubject<boolean>(false);
  authToken: string;
  userId: string;

  constructor(private http: HttpClient,
    private router: Router) { 
      this.authToken = '';
      this.userId = '';
    }

  createUser(email: string, username: string, password: string, bio: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:5000/api/users/register', { email: email, username: username, password: password, bio: bio }).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getToken() {
    return this.authToken;
  }

  getUserId() {
    return this.userId;
  }


  loginUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post<any>('http://localhost:5000/api/users/login', { email: email, password: password }).subscribe(
        (response: { userId: string, token: string }) => {
          this.userId = response.userId;
          this.authToken = response.token;
          this.isAuth.next(true);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      )
    })
  }

  logoutUser() {
    this.isAuth.next(false);
    this.router.navigate([''])
  }
}