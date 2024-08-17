import { Injectable } from '@angular/core';
import User from "../../interfaces/user";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../app.config";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User | undefined = undefined;
  constructor(private http: HttpClient) { }

  getUser(): User | undefined {
    return this.user;
  }

  login(user: {identifier: string, password: string}): void {
    const obj = {
      email: user.identifier.includes('@') ? user.identifier : null,
      username: user.identifier.includes('@') ? null : user.identifier,
      password: user.password,
    }
    this.http.post(`${API_BASE_URL}Identity/Login`, obj, {headers: {'Content-Type': 'application/json'}}).subscribe((res: any) => {
      this.user = {};
      this.user.username = res?.username;
      localStorage.setItem('token', JSON.stringify(res?.token));
    })
  }
}
