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
  selector: 'app-agency-jobs',
  templateUrl: './agency-jobs.component.html',
  styleUrls: ['./agency-jobs.component.css'],
})
export class AgencyJobsComponent implements OnInit {
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
          (job: Job) => job.agency?._id === this.user?._id
        );
        this.selectedJobs.set(
          'pending',
          this.jobs.filter(
            (job: Job) => job.status === 'pending' || job.status === 'created'
          )
        );
        this.selectedJobs.set(
          'active',
          this.jobs.filter((job: Job) => job.status === 'active')
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

  onClickReject(job: Job): void {
    job.status = 'rejected';
    this.jobsService.updateJob(job).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Zahtev uspešno odbijen');
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

  paidCondition(job: Job): boolean {
    return job.payOffer !== undefined && job.status !== 'active';
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

  sendOffer(job: Job): void {
    job.status = 'pending';
    this.jobsService.updateJob(job).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Ponuda uspešno poslata');
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
}
