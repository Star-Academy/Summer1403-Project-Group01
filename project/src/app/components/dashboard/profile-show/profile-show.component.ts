import { Component } from '@angular/core';
import User from "../../../interfaces/user";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import { heroMagnifyingGlassSolid, heroUserCircleSolid, heroCircleStackSolid } from '@ng-icons/heroicons/solid';


@Component({
  selector: 'app-profile-show',
  standalone: true,
  imports: [RouterLink,
    RouterLinkActive,
    NgIconComponent, ProfileShowComponent],
  templateUrl: './profile-show.component.html',
  styleUrl: './profile-show.component.scss',
  providers: [provideIcons({heroUserCircleSolid, heroMagnifyingGlassSolid, heroCircleStackSolid})]

})

export class ProfileShowComponent {
  user!: User | undefined;
  
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  handleLogout() {
    this.userService.logout();
  }
}

