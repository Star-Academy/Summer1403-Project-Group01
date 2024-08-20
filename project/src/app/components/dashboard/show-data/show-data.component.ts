import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../../app.config";

interface Transaction {
  TransactionId: number,
  sourceAccountId: number,
  destinationAccountId: number,
  amount: number,
  date: string,
  type: string
}

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
  data: Transaction | undefined = undefined;

  @ViewChild('labelElement') labelElement!: ElementRef<HTMLLabelElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('selectElement') selectElement!: ElementRef<HTMLSelectElement>;

  constructor(private userService: UserService, private http: HttpClient) {
    this.user = this.userService.getUser();
  }

  handleChange(): void {
    if (this?.inputElement?.nativeElement?.files && this?.inputElement?.nativeElement?.files?.length > 0) {
      this.labelElement.nativeElement.textContent = this?.inputElement?.nativeElement?.files[0].name;
    }
  }

  handleDisabled(): boolean {
    return !(this?.inputElement?.nativeElement?.files && this?.inputElement?.nativeElement?.files?.length > 0);
  }

  onSubmit(): void {
    const formData: FormData = new FormData();
    if (this.inputElement.nativeElement.files) {
      const file = this.inputElement.nativeElement.files[0];
      formData.append('file', file);
      if (this.selectElement.nativeElement.value === "transaction") {
        this.http.post(API_BASE_URL + 'Transaction/ImportTransactions', formData).subscribe((response) => {
          console.log(response);
        })
      } else if (this.selectElement.nativeElement.value === "account") {
        this.http.post(API_BASE_URL + 'Account/ImportAccounts', formData).subscribe((response) => {
          console.log(response);
        })
      }
    }
  }

  updateData(): void {

  }
}
