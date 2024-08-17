import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserService} from "../../../services/user/user.service";

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
  constructor(private userService: UserService) {
  }

  handleLogout() {
    this.userService.logout();
  }
}
