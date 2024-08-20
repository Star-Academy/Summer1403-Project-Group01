import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../../app.config";

@Component({
  selector: 'app-show-data',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './show-data.component.html',
  styleUrl: './show-data.component.scss'
})
export class ShowDataComponent {
  user!: User | undefined;
  @ViewChild('labelElement') labelElement!: ElementRef<HTMLLabelElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  constructor(private userService: UserService, private http: HttpClient) {
    this.user = this.userService.getUser();
  }

  handleChange() {
    if (this?.inputElement?.nativeElement?.files && this?.inputElement?.nativeElement?.files?.length > 0) {
      this.labelElement.nativeElement.textContent = this?.inputElement?.nativeElement?.files[0].name;
    }
  }

  onSubmit(): void {
    const formData: FormData = new FormData();
    if (this.inputElement.nativeElement.files) {
      const file = this.inputElement.nativeElement.files[0];
      formData.append('file', file);
      this.http.post(API_BASE_URL + 'Transaction/ImportTransactions', formData).subscribe((response) => {
        console.log(response);
      })
    }
  }
}
