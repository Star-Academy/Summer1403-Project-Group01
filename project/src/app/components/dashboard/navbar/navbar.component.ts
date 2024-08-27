import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowLeft, heroHome, heroUser } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIconComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [provideIcons({heroHome,heroUser,heroArrowLeft})]

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
