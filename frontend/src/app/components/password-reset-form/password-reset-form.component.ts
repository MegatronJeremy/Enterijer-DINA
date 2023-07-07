// password-reset-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ValidateService } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.css'],
})
export class PasswordResetFormComponent implements OnInit {
  password1: string = '';
  password2: string = '';
  token: string = '';

  constructor(
    private toastr: ToastrService,
    private validateService: ValidateService,
    private authSerivce: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  resetPassword(): boolean {
    if (!this.validateService.validatePassword(this.password1)) {
      this.toastr.error(
        'Lozinka mora da sadrzi sledece: jedan broj, jedno veliko slovo, jedno malo slovo, jedan specijalni karakter, i mora imati duzinu od 7 do 12 karaktera'
      );
      return false;
    }

    if (
      !this.validateService.validatePasswordMatch(
        this.password1,
        this.password2
      )
    ) {
      this.toastr.error('Lozinke se ne podudaraju');
      return false;
    }

    this.authSerivce
      .resetPassword(this.token, this.password1)
      .subscribe((response: any) => {
        if (response.success) {
          this.toastr.success(response.msg);
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(response.msg);
        }
      });

    return true;
  }
}
