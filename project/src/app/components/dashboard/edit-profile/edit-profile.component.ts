import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {ModifyUserService} from "../../../services/modify-user/modify-user.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
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
    if (this.formGroup.valid) {
      const data = {
        firstName: this.formGroup.value.firstName || this.userService.getUser()?.firstName,
        lastName: this.formGroup.value.lastName || this.userService.getUser()?.lastName,
        userName: this.formGroup.value.userName || this.userService.getUser()?.userName
      }
      this.modifyService.modifyUser(data);
      this.router.navigate(['dashboard/home']);
    } else {
      alert("اشکالی در ورودی های شما وجود دارد.")
    }
  }
}
