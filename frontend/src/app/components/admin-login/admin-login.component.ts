import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  onLoginSubmit(): void {
    const userLoginData = {
      username: this.username,
      password: this.password,
      admin: true,
    };

    this.authService.authenticateUser(userLoginData).subscribe((data: any) => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.toastr.success('Uspesno ste se ulogovali kao admin');
        this.router.navigate(['/admin']);
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
