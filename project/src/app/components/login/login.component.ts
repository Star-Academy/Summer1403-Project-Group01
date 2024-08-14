import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import { heroUser, heroLockClosed, heroArrowLeftEndOnRectangle } from '@ng-icons/heroicons/outline';
import {Router} from "@angular/router";

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

  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    if (this.formGroup.valid) {
      this.userService.login(this.formGroup.value);
      this.router.navigateByUrl('dashboard');
    } else {
      alert(JSON.stringify(this.formGroup.value));
    }
  }
}
