import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  agencies: User[] = [];
  clients: User[] = [];

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((data: any) => {
      if (data.success) {
        this.agencies = data.users.filter((user: User) => {
          return user.userType === 'agency' && user.registered == false;
        });
        this.clients = data.users.filter((user: User) => {
          return user.userType === 'client' && user.registered == false;
        });
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  approveRegistration(user: User): void {
    user.registered = true;
    this.authService.updateUser(user).subscribe((data: any) => {
      if (data.success) {
        this.ngOnInit();
        this.toastr.success('Korisnik registrovan');
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  denyRegistration(user: User): void {
    this.authService.deleteUser(user.username).subscribe((data: any) => {
      if (data.success) {
        this.ngOnInit();
        this.toastr.success('Zahtev odbijen');
      } else {
        this.toastr.error(data.msg);
      }
    });
  }
}
