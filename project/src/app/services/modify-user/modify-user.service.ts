import { Injectable } from '@angular/core';
import {UserService} from "../user/user.service";
import {HttpClient} from "@angular/common/http";
import {API_BASE_URL} from "../../app.config";
import {ToastrService} from "ngx-toastr";

interface ChangeData {
  firstName: string,
  lastName: string,
  userName: string
}

interface ChangePassword {
  currentPassword: string | null | undefined,
  newPassword: string | null | undefined,
}

@Injectable({
  providedIn: 'root'
})
export class ModifyUserService {

  constructor(private userService: UserService, private http: HttpClient, private toast: ToastrService) {}

  getToken(): string | null {
    let token = localStorage.getItem('token');
    if (token) {
      token = token.substring(1, token.length - 1);
    }
    return token;
  }

  modifyUser(data: ChangeData): void {
    const token = this.getToken();
    this.http.put<ChangeData>(API_BASE_URL + 'profile/edit-info', data,
      {headers: {'Authorization': "Bearer " + token, "Accept": "application/json"}})
      .subscribe({
        next: () => {
          const user = this.userService.getUser();
          user!.firstName = data.firstName;
          user!.lastName = data.lastName;
          user!.userName = data.userName;
          this.userService.setUser(user!);
          this.toast.success("اطلاعات با موفقیت تغییر یافت.")
        },
        error: (error) => {
          if (error.status === 401) {
            this.toast.error("لطفا مجددا وارد شوید.")
          } else {
            this.toast.error("مشکلی در هنگام تغییر اطلاعات پیش امد.")
          }
        }
      });
  }

  changePassword(data: ChangePassword): void {
    const token = this.getToken();
    this.http.put(API_BASE_URL + 'profile/change-password', data,
      {headers: {'Authorization': "Bearer " + token, "Accept": "application/json"}})
      .subscribe({
        next: () => {
          this.toast.success("تغییر رمز عبور با موفقیت انجام شد.")
        },
        error: (error) => {
          if (error.status === 401) {
            this.userService.logout();
            this.toast.error("لطفا مجددا وارد شوید.")
          } else {
            this.toast.error("مشکلی در هنگام تغییر رمز پیش امد.")
          }
        }
      });
  }

  alterRole(userName: string, role: string): void {
    const token = this.getToken();
    const data = {
      userName,
      role
    }

    this.http.patch(API_BASE_URL + 'users/change-role', data,
      {headers: {'Authorization': "Bearer " + token, "Accept": "application/json"}})
      .subscribe({
        next: () => {
          this.toast.success("تغییر نقش با موفقیت انجام شد.")
        },
        error: (error) => {
          if (error.status === 401) {
            this.userService.logout();
            this.toast.error("لطفا محددا وارد شوید.")
          } else {
            this.toast.error("مشکلی در هنگام تغییر نقش پیش امد.")
          }
        }
      })
  }
}
