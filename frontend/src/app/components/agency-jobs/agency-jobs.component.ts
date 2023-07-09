import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import CanvasObject from 'src/app/models/canvasObject';
import { Room } from 'src/app/models/canvasObject';
import Job from 'src/app/models/job';
import Review from 'src/app/models/review';
import User from 'src/app/models/user';
import Workers from 'src/app/models/worker';
import { AuthService } from 'src/app/services/auth.service';
import { JobsService } from 'src/app/services/jobs.service';
import { WorkersService } from 'src/app/services/workers.service';
import { ObjectComponent } from '../object/object.component';
import { CanvasObjectService } from 'src/app/services/canvas-object.service';

@Component({
  selector: 'app-agency-jobs',
  templateUrl: './agency-jobs.component.html',
  styleUrls: ['./agency-jobs.component.css'],
})
export class AgencyJobsComponent implements OnInit {
  @ViewChild('canvas') canvasComponent?: ObjectComponent;

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

  workers: Workers[] = [];

  constructor(
    private jobsService: JobsService,
    private toastr: ToastrService,
    private authService: AuthService,
    private workersService: WorkersService,
    private canvasObjectService: CanvasObjectService
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
        this.workersService
          .getAllWorkers(this.user!._id)
          .subscribe((data: any) => {
            if (data.success) {
              this.workers = data.workers.filter(
                (worker: Workers) => worker.working === false
              );
              this.updateWorkerNum();
            } else {
              this.toastr.error(data.msg);
            }
          });
      } else {
        this.toastr.error(data.msg);
      }
    });

    this.deselectAll();
  }

  minWorkersCondition(obj?: CanvasObject): boolean {
    if (!obj) {
      return false;
    }
    return (
      this.workers.length >=
      obj.rooms.filter(
        (room) => room.workers === undefined || room.workers.length === 0
      ).length
    );
  }

  assignWorker(worker: Workers) {
    if (!this.canvasComponent?.selectedRoom) {
      return;
    }

    let room: Room = this.canvasComponent?.selectedRoom;
    if (!room.workers) {
      room.workers = [];
    }
    room.workers.push(worker);
    worker.working = true;
    this.workers.splice(this.workers.indexOf(worker), 1);

    this.updateWorkerNum();

    this.canvasObjectService
      .updateCanvasObject(this.selectedObj!)
      .subscribe((data: any) => {
        if (data.success) {
          this.workersService.updateWorker(worker).subscribe((data: any) => {
            if (data.success) {
              this.toastr.success('Radnik uspešno dodeljen');
            } else {
              this.toastr.error(data.msg);
            }
          });
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  deassignWorker(worker: Workers) {
    if (!this.canvasComponent?.selectedRoom) {
      return;
    }

    let room: Room = this.canvasComponent?.selectedRoom;

    if (!room.workers) {
      return;
    }

    room.workers.splice(room.workers.indexOf(worker), 1);
    worker.working = false;
    this.workers.push(worker);
    this.updateWorkerNum();

    this.canvasObjectService
      .updateCanvasObject(this.selectedObj!)
      .subscribe((data: any) => {
        if (data.success) {
          this.workersService.updateWorker(worker).subscribe((data: any) => {
            if (data.success) {
              this.toastr.success('Radnik uspešno uklonjen');
            } else {
              this.toastr.error(data.msg);
            }
          });
        } else {
          this.toastr.error(data.msg);
        }
      });
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

  updateWorkerNum(): void {
    this.selectedJobs.get('active')!.map((job: Job) => {
      if (job.object?.activelyWorkedOn) {
        return;
      }

      if (!this.minWorkersCondition(job.object)) {
        this.setRoomState(job, 'invalid');
      } else {
        this.setDefaultRoomState(job);
      }
    });
    this.canvasComponent?.drawObject();
  }

  setRoomState(job: Job, state: string) {
    for (let room of job.object!.rooms) {
      room.roomState = state;
    }
  }

  setDefaultRoomState(job: Job) {
    for (let room of job.object!.rooms) {
      if (!room.workers || room.workers.length === 0) {
        room.roomState = 'not started';
      } else {
        room.roomState = 'working';
      }
    }
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
    return job.status !== 'active';
  }

  assignCondition(obj?: CanvasObject): boolean {
    if (obj === undefined) {
      return false;
    }
    return (
      !this.selectedObj?.activelyWorkedOn &&
      this.selectedGroup === 'active' &&
      this.workers.length > 0
    );
  }

  showAssignedCondition(): boolean {
    return this.selectedGroup === 'active' && this.selectedObj !== undefined;
  }

  sendOffer(job: Job): void {
    if (!job.payOffer || job.payOffer <= 0) {
      this.toastr.error('Ponuda mora biti pozitivan broj');
      return;
    }

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

  startCondition(): boolean {
    return (
      !this.selectedObj?.activelyWorkedOn &&
      this.selectedObj !== undefined &&
      this.selectedObj.rooms.every(
        (room) => room.workers && room.workers.length > 0
      )
    );
  }

  startWork(): void {
    this.selectedObj!.rooms.map((room) => {
      room.roomState = 'working';
    });
    this.selectedObj!.activelyWorkedOn = true;

    this.canvasObjectService
      .updateCanvasObject(this.selectedObj!)
      .subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Posao na prostorijama započet');
          this.canvasComponent?.drawObject();
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  workedOnCondition(): boolean {
    return this.selectedObj?.activelyWorkedOn === true;
  }

  endWork(): void {
    this.canvasComponent!.selectedRoom!.roomState = 'finished';
    this.canvasComponent!.selectedRoom!.workers!.map((worker) => {
      worker.working = false;
      this.workersService.updateWorker(worker).subscribe((data: any) => {
        if (!data.success) {
          this.toastr.error(data.msg);
        }
      });
    });
    this.workers = this.workers.concat(
      this.canvasComponent!.selectedRoom!.workers!
    );
    this.canvasComponent!.selectedRoom!.workers = [];
    this.updateWorkerNum();

    this.canvasObjectService
      .updateCanvasObject(this.selectedObj!)
      .subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Posao na prostoriji završen');
        } else {
          this.toastr.error(data.msg);
        }
      });
  }
}
