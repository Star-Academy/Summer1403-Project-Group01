import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import User from "../../../interfaces/user";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../../app.config";
import {RialPipePipe} from "./pipes/rial-pipe.pipe";
import {PersianDatePipe} from "./pipes/persian-date.pipe";
import {heroXMark} from "@ng-icons/heroicons/outline";
import {NgIconComponent, provideIcons} from "@ng-icons/core";
import {BlurClickDirective} from "../../../directives/blur-click.directive";

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
    FormsModule,
    RialPipePipe,
    PersianDatePipe,
    NgIconComponent,
    BlurClickDirective
  ],
  templateUrl: './show-data.component.html',
  styleUrl: './show-data.component.scss',
  providers: [provideIcons({heroXMark})]
})
export class ShowDataComponent {
  user!: User | undefined;
  data: Transaction[] | undefined = undefined;
  dataGot = false;

  @ViewChild('labelElement') labelElement!: ElementRef<HTMLLabelElement>;
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('selectElement') selectElement!: ElementRef<HTMLSelectElement>;
  @ViewChild('dataElement') dataElement!: ElementRef<HTMLDivElement>;

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
    const token: string | null = this.getToken();
    if (this.inputElement.nativeElement.files) {
      const file = this.inputElement.nativeElement.files[0];
      formData.append('file', file);
      if (this.selectElement.nativeElement.value === "transaction") {
        this.http.post(API_BASE_URL + 'Transaction/ImportTransactions', formData, {headers: {"Authorization": "Bearer " + token}}).subscribe((response) => {
          console.log(response);
        })
      } else if (this.selectElement.nativeElement.value === "account") {
        this.http.post(API_BASE_URL + 'Account/ImportAccounts', formData, {headers: {"Authorization": "Bearer " + token}}).subscribe((response) => {
          console.log(response);
        })
      }
    }
  }

  updateData(): void {
    this.dataGot = false;
    const token: string | null = this.getToken();
    this.http.get<Transaction[]>(API_BASE_URL + 'Transaction/GetAllTransactions', {headers: {"Authorization": "Bearer " + token}}).subscribe((response) => {
      this.data = response;
      this.dataGot = true;
    })
  }

  showData(): void {
    if (this.data === undefined) {
      this.updateData();
    }
    this.dataElement.nativeElement.style.display = 'flex';
  }

  handleClose(): void {
    this.dataElement.nativeElement.style.display = 'none';
  }

  getToken(): string | null {
    let token = localStorage.getItem("token");
    if (token) {
      token = token.substring(1, token.length - 1);
    }

    return token;
  }
}
