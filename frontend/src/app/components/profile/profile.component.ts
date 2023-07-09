import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @Input() user?: User;
  @Input() inputMode: boolean = false;
  selectedFile?: File;

  User = User;

  constructor(
    private authService: AuthService,
    private validateService: ValidateService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.inputMode) {
      return;
    }
    this.authService.getProfile().subscribe({
      next: (profile: any) => (this.user = profile.user),
      error: (err: any) => console.log(err),
    });
  }

  async updateProfile(): Promise<boolean> {
    if (!this.validateService.validateRequired(this.user!)) {
      this.toastr.error('Unesite sva polja');
      return false;
    }

    if (!this.validateService.validateEmail(this.user!.email)) {
      this.toastr.error('Unesite validnu email adresu');
      return false;
    }

    if (!this.validateService.validatePhone(this.user!.phone)) {
      this.toastr.error('Unesite validan broj telefona');
      return false;
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
          'Slika mora biti dimenzija izmedju 100x100px i 300x300px'
        );
        return false;
      }
    }

    this.authService.updateUser(this.user!).subscribe((data: any) => {
      if (data.success) {
        if (this.selectedFile) {
          this.authService
            .changeProfilePicture(this.user!.username, this.selectedFile!)
            .subscribe((data: any) => {
              if (data.success) {
                this.ngOnInit();
                this.toastr.success('Profil uspesno ažuriran');
                if (this.inputMode) {
                  window.location.reload();
                }
              } else {
                this.toastr.error('Ažuriranje profila neuspešno');
              }
            });
        } else {
          this.ngOnInit();
          this.toastr.success('Profil uspesno ažuriran');
          if (this.inputMode) {
            window.location.reload();
          }
        }
      } else {
        this.toastr.error('Ažuriranje profila neuspešno');
      }
    });

    return true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }
}
