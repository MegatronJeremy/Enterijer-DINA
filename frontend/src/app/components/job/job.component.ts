import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import CanvasObject from 'src/app/models/canvasObject';
import Job from 'src/app/models/job';
import Review from 'src/app/models/review';
import User from 'src/app/models/user';
import { AgencyReviewsService } from 'src/app/services/agency-reviews.service';
import { AuthService } from 'src/app/services/auth.service';
import { JobsService } from 'src/app/services/jobs.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements OnInit {
  jobs: Job[] = [];
  selectedJobs: Map<string, Job[]> = new Map<string, Job[]>();

  user?: User;

  selectedObj?: CanvasObject;
  selectedGroup: string = 'pending';
  cancellationReason: string = '';

  jobToPay?: Job;
  jobToCancel?: Job;
  finishedJob?: Job;

  jobToReview?: Job;
  review: Review = new Review();

  constructor(
    private jobsService: JobsService,
    private toastr: ToastrService,
    private authService: AuthService,
    private reviewService: AgencyReviewsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.jobsService.getAllJobs().subscribe((data: any) => {
      if (data.success) {
        this.jobs = data.jobs.filter(
          (job: Job) => job.client?._id === this.user?._id
        );
        this.selectedJobs.set(
          'pending',
          this.jobs.filter(
            (job: Job) =>
              job.status === 'pending' ||
              job.status === 'rejected' ||
              job.status === 'created'
          )
        );
        this.selectedJobs.set(
          'active',
          this.jobs.filter((job: Job) => job.status === 'active')
        );
        this.selectedJobs.set(
          'completed',
          this.jobs.filter((job: Job) => job.status === 'completed')
        );
        this.selectedJobs.set(
          'cancelled',
          this.jobs.filter((job: Job) => job.status === 'cancelled')
        );
      } else {
        this.toastr.error(data.msg);
      }
    });

    this.deselectAll();
  }

  deselectAll(): void {
    this.selectedObj = undefined;
    this.jobToPay = undefined;
    this.finishedJob = undefined;
    this.jobToCancel = undefined;
    this.jobToReview = undefined;
    this.review = new Review();
    this.cancellationReason = '';
  }

  onClickSelect(object?: CanvasObject): void {
    if (this.selectedObj === object) {
      this.selectedObj = undefined;
    } else {
      this.selectedObj = object;
    }
  }

  onClickDelete(job: Job): void {
    this.jobsService.deleteJob(job._id).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success(data.msg);
        this.ngOnInit();
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  selectToPay(job: Job): void {
    if (this.jobToPay === job) {
      this.jobToPay = undefined;
    } else {
      this.jobToPay = job;
    }
  }

  selectFinished(job: Job): void {
    if (this.finishedJob === job) {
      this.finishedJob = undefined;
    } else {
      this.finishedJob = job;
    }
  }

  selectToCancel(job: Job): void {
    if (this.jobToCancel === job) {
      this.jobToCancel = undefined;
    } else {
      this.cancellationReason = '';
      this.jobToCancel = job;
    }
  }

  selectToReview(job: Job): void {
    if (this.jobToReview === job) {
      this.jobToReview = undefined;
    } else {
      this.review = new Review();
      this.jobToReview = job;

      this.reviewService
        .getAllReviews(job.agency!.username, true)
        .subscribe((data: any) => {
          if (data.success) {
            let reviews: Review[] = data.reviews;

            let userReview = reviews.filter(
              (review: Review) => review.client === this.user?.username
            );
            if (userReview.length > 0) {
              this.review = userReview[0];
            }
          } else {
            this.toastr.error(data.msg);
          }
        });
    }
  }

  payCondition(job: Job): boolean {
    return job.status === 'pending';
  }

  cancelCondition(job: Job): boolean {
    return job.status === 'active';
  }

  finishedCondition(job: Job): boolean {
    return (
      job.cancellationReason === undefined &&
      job.status === 'active' &&
      job.object !== undefined &&
      job.object?.rooms.every((room) => room.roomState === 'finished')
    );
  }

  reviewCondition(job: Job): boolean {
    return job.status === 'completed';
  }

  getColor(job: Job): string {
    switch (job.status) {
      case 'pending':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'black';
    }
  }

  acceptJob(job: Job): void {
    job.status = 'active';
    this.jobsService.updateJob(job).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Posao uspešno prihvaćen');
        this.ngOnInit();
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  finishJob(job: Job): void {
    this.jobsService.finishJob(job).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Posao uspešno završen');
        this.ngOnInit();
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  sendCancellation(job: Job): void {
    if (this.cancellationReason === '') {
      this.toastr.error('Morate uneti razlog otkazivanja');
      return;
    }

    job.cancellationReason = this.cancellationReason;
    this.jobsService.updateJob(job).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Zahtev za otkazivanje posla uspešno poslat');
        this.ngOnInit();
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  submitReview(): void {
    if (
      this.review.text === '' ||
      this.review.rating === 0 ||
      this.jobToReview?.agency === undefined ||
      this.user === undefined
    ) {
      this.toastr.error('Morate popuniti sve podatke');
      return;
    }

    if (this.review._id === '') {
      this.review.agency = this.jobToReview?.agency?.username;
      this.review.client = this.user?.username;
      this.reviewService.createReview(this.review).subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Recenzija uspešno kreirana');
          this.ngOnInit();
        } else {
          this.toastr.error(data.msg);
        }
      });
    } else {
      this.reviewService.updateReview(this.review).subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Recenzija uspešno ažurirana');
          this.ngOnInit();
        } else {
          this.toastr.error(data.msg);
        }
      });
    }
  }

  deleteReview(): void {
    this.reviewService.deleteReview(this.review._id).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Recenzija uspešno obrisana');
        this.ngOnInit();
      } else {
        this.toastr.error(data.msg);
      }
    });
  }
}
