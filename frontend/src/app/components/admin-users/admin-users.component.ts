import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];

  userToEdit?: User;
  userToAdd: boolean = false;

  User = User;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((data: any) => {
      if (data.success) {
        this.users = data.users.filter((user: User) => {
          return user.userType !== 'admin';
        });
        this.users.sort((a: User, b: User) => {
          return a.username.localeCompare(b.username);
        });
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  selectToEdit(user: User): void {
    if (this.userToEdit === user) {
      this.userToEdit = undefined;
    } else {
      this.userToEdit = user;
    }
    this.userToAdd = false;
  }

  addAgency() {
    if (this.userToAdd) {
      this.userToAdd = false;
    } else {
      this.userToAdd = true;
    }
  }

  onClickDelete(user: User) {
    this.authService.deleteUser(user.username).subscribe((data: any) => {
      if (data.success) {
        this.users = this.users.filter(
          (agency: User) => agency._id !== user._id
        );
        this.toastr.success(data.msg);
      } else {
        this.toastr.error(data.msg);
      }
    });
  }
}
