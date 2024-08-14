import { Injectable } from '@angular/core';
import User from "../../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User | undefined = undefined;
  constructor() { }

  getUser(): User | undefined {
    return this.user;
  }

  setUser(): void {
    this.user = {
      id: 1,
      firstName: "ali",
      lastName: "analy",
      email: "analyzer@gmail.com",
      password: "",
      role: "root"
    };
  }
}
