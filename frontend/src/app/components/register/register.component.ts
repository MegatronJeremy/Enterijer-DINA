import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';
import { Router } from '@angular/router';
import User from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  selectedFile?: File;

  @Input() admin: boolean = false;

  username: string = '';
  password1: string = '';
  password2: string = '';
  contactPhone: string = '';
  emailAddress: string = '';

  registrationType: string = '';

  firstName: string = '';
  lastName: string = '';

  agencyName: string = '';
  agencyCountry: string = '';
  agencyCity: string = '';
  agencyStreet: string = '';
  registrationNumber: string = '';
  description: string = '';

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onRegisterSubmit(): Promise<boolean> {
    const user: User = new User();
    user.username = this.username;
    user.password = this.password1;
    user.phone = this.contactPhone;
    user.email = this.emailAddress;
    user.userType = this.registrationType;

    switch (this.registrationType) {
      case 'client':
        user.clientInfo = {
          firstName: this.firstName,
          lastName: this.lastName,
        };
        break;
      case 'agency':
        user.agencyInfo = {
          agencyName: this.agencyName,
          country: this.agencyCountry,
          city: this.agencyCity,
          street: this.agencyStreet,
          registrationNumber: this.registrationNumber,
          description: this.description,
        };
        break;
      case 'admin':
        break;
    }

    if (!this.validateService.validateRequired(user)) {
      this.toastr.error('Unesite sva polja');
      return false;
    }

    if (!this.validateService.validateEmail(this.emailAddress)) {
      this.toastr.error('Unesite validnu email adresu');
      return false;
    }

    if (!this.validateService.validatePhone(this.contactPhone)) {
      this.toastr.error('Unesite validan broj telefona');
      return false;
    }

    if (!this.validateService.validatePassword(this.password1)) {
      this.toastr.error(
        'Lozinka mora da sadrzi: jedan broj, jedno veliko slovo, jedno malo slovo i jedan specijalni karakter, i imati duzinu od 7 do 12 karaktera'
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

    if (this.registrationType === 'agency') {
      if (
        !this.validateService.validateRegistrationNumber(
          this.registrationNumber
        )
      ) {
        this.toastr.error('Matični broj mora biti broj od minimum 6 cifara');
        return false;
      }
    }

    if (this.selectedFile) {
      if (!this.validateService.validateFileIsImage(this.selectedFile)) {
        this.toastr.error('Fajl mora biti slika formata png ili jpg');
        this.selectedFile = undefined;
        return false;
      }
      if (!(await this.validateService.validateImgSize(this.selectedFile))) {
        this.selectedFile = undefined;
        this.toastr.error(
          'Slika mora biti dimenzija između 100x100px i 300x300px'
        );
        return false;
      }
    }

    if (this.admin) {
      user.registered = true;
    } else {
      user.registered = false;
    }

    console.log(this.admin);

    this.authService.registerUser(user).subscribe((data: any) => {
      if (data.success) {
        if (this.selectedFile) {
          this.authService
            .changeProfilePicture(user.username, this.selectedFile!)
            .subscribe((data: any) => {
              if (data.success) {
                if (!this.admin) {
                  this.toastr.success('Zahtev za registraciju je poslat');
                  this.router.navigate(['/login']);
                } else {
                  this.toastr.success('Korisnik je registrovan');
                  window.location.reload();
                }
              } else {
                this.toastr.error('Neuspešno slanje slike');
                this.router.navigate(['/register']);
              }
            });
        } else {
          if (!this.admin) {
            this.toastr.success('Zahtev za registraciju je poslat');
            this.router.navigate(['/login']);
          } else {
            this.toastr.success('Korisnik je registrovan');
            window.location.reload();
          }
        }
      } else {
        this.toastr.error(data.msg);
        this.router.navigate(['/register']);
      }
    });

    return true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }
}
