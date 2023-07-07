import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-password-change-form',
  templateUrl: './password-change-form.component.html',
  styleUrls: ['./password-change-form.component.css'],
})
export class PasswordChangeFormComponent implements OnInit {
  passwordOld: string = '';
  password1: string = '';
  password2: string = '';

  loggedIn?: User;

  constructor(
    private validateService: ValidateService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  changePassword(): boolean {
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

    if (
      this.validateService.validatePasswordMatch(
        this.password1,
        this.passwordOld
      )
    ) {
      this.toastr.error('Nova lozinka ne sme biti ista kao stara');
      return false;
    }

    this.authService
      .changePassword(this.passwordOld, this.password1)
      .subscribe((response: any) => {
        if (response.success) {
          this.authService.logout();
          this.router.navigate(['/login']);
          this.toastr.success(response.msg);
        } else {
          this.toastr.error(response.msg);
        }
      });

    return true;
  }
}
