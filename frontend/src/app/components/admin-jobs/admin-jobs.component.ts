import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import CanvasObject from 'src/app/models/canvasObject';
import Job from 'src/app/models/job';
import { JobsService } from 'src/app/services/jobs.service';
import { WorkersService } from 'src/app/services/workers.service';

@Component({
  selector: 'app-admin-jobs',
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.css'],
})
export class AdminJobsComponent implements OnInit {
  selectedObj?: CanvasObject;

  jobs: Job[] = [];

  jobToCancel?: Job;

  Job = Job;

  constructor(
    private jobsService: JobsService,
    private toastr: ToastrService,
    private workersService: WorkersService
  ) {}

  ngOnInit(): void {
    this.jobsService.getAllJobs().subscribe((data: any) => {
      if (data.success) {
        this.jobs = data.jobs;
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  onClickSelect(object?: CanvasObject): void {
    if (this.selectedObj === object) {
      this.selectedObj = undefined;
    } else {
      this.selectedObj = object;
      this.jobToCancel = undefined;
    }
  }

  selectToCancel(job: Job) {
    if (this.jobToCancel === job) {
      this.jobToCancel = undefined;
      this.selectedObj = undefined;
    } else {
      this.jobToCancel = job;
      this.selectedObj = job.object;
    }
  }

  acceptCancellation() {
    if (!this.jobToCancel || !this.jobToCancel.object) {
      return;
    }

    const rooms = this.jobToCancel.object.rooms;

    for (let room of rooms) {
      room.workers!.map((worker) => {
        worker.working = false;
        this.workersService.updateWorker(worker).subscribe((data: any) => {
          if (!data.success) {
            this.toastr.error(data.msg);
          }
        });
      });
    }

    this.jobsService.deleteJob(this.jobToCancel._id).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Uspešno otkazan posao');
        this.jobs = this.jobs.filter(
          (job) => job._id !== this.jobToCancel!._id
        );
        this.jobToCancel = undefined;
        this.selectedObj = undefined;
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  rejectCancellation() {
    if (!this.jobToCancel) {
      return;
    }
    this.jobToCancel.cancellationReason = undefined;

    this.jobsService.updateJob(this.jobToCancel).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success(data.msg);
        this.jobToCancel = undefined;
        this.selectedObj = undefined;
      } else {
        this.toastr.error(data.msg);
      }
    });
  }
}
