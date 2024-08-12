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
}
