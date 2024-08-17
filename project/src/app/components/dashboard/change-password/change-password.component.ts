import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModifyUserService} from "../../../services/modify-user/modify-user.service";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  formGroup = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).+')]),
    confirmPassword: new FormControl('', [Validators.required,
      Validators.minLength(8),
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W).+')]),
  });

  constructor(private modifyService: ModifyUserService, private router: Router) {}

  onSubmit(): void {
    if (this.formGroup.valid && this.formGroup.value.newPassword === this.formGroup.value.confirmPassword) {
      console.log(this.formGroup.value);
      const data = {
        currentPassword: this.formGroup.value.currentPassword,
        newPassword: this.formGroup.value.newPassword
      }
      this.modifyService.changePassword(data);
      this.router.navigate(['dashboard/profile'])
    } else {
      alert("مشکلی در ورودی های شما وجود دارد.")
    }
  }
}
