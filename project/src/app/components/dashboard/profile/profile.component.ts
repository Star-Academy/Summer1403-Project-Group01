import { Component } from '@angular/core';
import User from "../../../interfaces/user";
import {UserService} from "../../../services/user/user.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import { heroMagnifyingGlassSolid, heroUserCircleSolid, heroCircleStackSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [provideIcons({heroUserCircleSolid, heroMagnifyingGlassSolid, heroCircleStackSolid})]
})
export class ProfileComponent {
  user!: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }
}
