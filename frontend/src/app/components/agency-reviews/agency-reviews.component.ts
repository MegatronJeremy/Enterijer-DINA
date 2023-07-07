import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Review from 'src/app/models/review';
import { AgencyReviewsService } from 'src/app/services/agency-reviews.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-agency-reviews',
  templateUrl: './agency-reviews.component.html',
  styleUrls: ['./agency-reviews.component.css'],
})
export class AgencyReviewsComponent implements OnInit {
  agency: string = '';
  agencyName: string = '';

  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private reviewsService: AgencyReviewsService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.agency = params['agency'];
      this.agencyName = params['agencyName'];
      const personalized: boolean = this.authService.loggedIn();
      this.reviewsService
        .getAllReviews(this.agency, personalized)
        .subscribe((data: any) => {
          if (data.success) {
            this.reviews = data.reviews;
          } else {
            this.toastr.error(data.msg);
          }
        });
    });
  }
}
