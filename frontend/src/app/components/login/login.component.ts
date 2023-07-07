import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
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
      admin: false,
    };

    this.authService.authenticateUser(userLoginData).subscribe((data: any) => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.toastr.success('Uspesno ste se ulogovali');
        this.router.navigate(['/home']);
      } else {
        this.toastr.error(data.msg);
        this.router.navigate(['/login']);
      }
    });
  }

  onForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
