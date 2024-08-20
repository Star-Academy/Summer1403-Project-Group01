import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user!: User | undefined;

  constructor(private userService: UserService) {
    this.user = this.userService.getUser();
  }

  handleLogout() {
    this.userService.logout();
  }
}
