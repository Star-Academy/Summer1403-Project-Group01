import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import { heroUser, heroLockClosed, heroArrowLeftEndOnRectangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [provideIcons({heroUser, heroLockClosed, heroArrowLeftEndOnRectangle})]
})
export class LoginComponent {
  formGroup: FormGroup = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private userService: UserService) { }

  onSubmit() {
    if (this.formGroup.valid) {
      console.log(this.formGroup.value);
    } else {
      alert("مشکلی در ورودی های شما وجود دارد.");
    }
  }
}
