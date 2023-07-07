import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.css'],
})
export class ForgotPasswordFormComponent implements OnInit {
  email: string = '';

  constructor(
    private toastr: ToastrService,
    private validateService: ValidateService,
    private authSerivce: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  resetPassword() {
    if (!this.validateService.validateEmail(this.email)) {
      this.toastr.error('Email nije validan');
      return;
    }

    this.authSerivce.forgotPassword(this.email).subscribe((response: any) => {
      if (response.success) {
        this.toastr.success(response.msg);
        this.router.navigate(['/']);
      } else {
        this.toastr.error(response.msg);
      }
    });
  }
}
