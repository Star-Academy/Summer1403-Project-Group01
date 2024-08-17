import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {ModifyUserService} from "../../../services/modify-user/modify-user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  formGroup!: FormGroup;

  constructor(private userService: UserService, private modifyService: ModifyUserService, private router: Router) {
    const user = this.userService.getUser();

    this.formGroup = new FormGroup({
      userName: new FormControl(user?.userName, Validators.required),
      firstName: new FormControl(user?.firstName, Validators.required),
      lastName: new FormControl(user?.lastName, Validators.required),
    });
  }

  onSubmit(): void {

  }
}
