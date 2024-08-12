import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fomtGroup: FormGroup = new FormGroup({
    identifier: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private userSerivce: UserService) { }

  onSubmit() {
    if (this.fomtGroup.valid) {

    } else {
      alert("مشکلی در ورودی های شما وجود دارد.");
    }
  }
}
