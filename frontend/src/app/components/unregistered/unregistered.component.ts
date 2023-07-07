import { Component, OnInit } from '@angular/core';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['./unregistered.component.css'],
})
export class UnregisteredComponent implements OnInit {
  constructor(public authService: AuthService) {}

  agencies: User[] = [];

  searchName: string = '';
  searchAddress: string = '';
  sortBy: string = '';
  sortAsc: boolean = true;

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe((data: any) => {
      if (data.success) {
        this.agencies = data.users.filter((user: User) => {
          return user.userType === 'agency' && user.registered == true;
        });
      }
    });
  }

  searchAgencies(): void {
    this.authService.getAllUsers().subscribe((data: any) => {
      if (data.success) {
        this.sortAsc = true;
        this.sortBy = '';
        this.agencies = data.users.filter((user: User) => {
          return (
            user.userType === 'agency' &&
            user.registered == true &&
            user.agencyInfo?.agencyName
              .toLowerCase()
              .includes(this.searchName.toLowerCase()) &&
            user.agencyInfo?.street
              .toLowerCase()
              .includes(this.searchAddress.toLowerCase())
          );
        });
      }
    });
  }

  sortAgencies(column: string) {
    if (this.sortBy === column) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortBy = column;
      this.sortAsc = true;
    }

    this.agencies.sort((a: User, b: User) => {
      const valA =
        column === 'agencyName'
          ? a.agencyInfo?.agencyName
          : a.agencyInfo?.street;
      const valB =
        column === 'agencyName'
          ? b.agencyInfo?.agencyName
          : b.agencyInfo?.street;

      if (valA && valB) {
        if (this.sortAsc) {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      } else {
        return 0;
      }
    });
  }
}
