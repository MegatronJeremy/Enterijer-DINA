import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CanvasObject from 'src/app/models/canvasObject';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CanvasObjectService } from 'src/app/services/canvas-object.service';
import { JobsService } from 'src/app/services/jobs.service';

@Component({
  selector: 'app-submit-job',
  templateUrl: './submit-job.component.html',
  styleUrls: ['./submit-job.component.css'],
})
export class SubmitJobComponent implements OnInit {
  objects: CanvasObject[] = [];
  selectedObj?: CanvasObject;

  timeStart?: string;
  timeEnd?: string;

  user?: User;
  agency_id: string = '';
  agencyName: string = '';

  constructor(
    private canvasObjectService: CanvasObjectService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private jobsService: JobsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.toastr.error('Niste ulogovani');
      return;
    }

    this.canvasObjectService
      .getAllForUser(this.user?.username)
      .subscribe((data: any) => {
        if (data.success) {
          this.objects = data.canvasObjects;
          this.objects = this.objects.filter((obj) => !obj.beingCreated);
        } else {
          this.toastr.error(data.msg);
          this.router.navigate(['/']);
        }
      });

    this.route.queryParams.subscribe((params) => {
      this.agency_id = params['agency'];
      this.agencyName = params['agencyName'];
    });
  }

  onClickSubmit(): void {
    if (!this.user) {
      this.toastr.error('Niste ulogovani');
      return;
    }

    if (!this.selectedObj) {
      this.toastr.error('Niste izabrali objekat');
      return;
    }

    if (!this.timeStart || !this.timeEnd) {
      this.toastr.error('Niste izabrali vreme');
      return;
    }

    const startDate = new Date(this.timeStart);
    const endDate = new Date(this.timeEnd);

    if (startDate.getTime() > endDate.getTime()) {
      this.toastr.error('Vreme početka ne može biti posle vremena kraja');
      return;
    }

    if (startDate.getTime() < Date.now()) {
      this.toastr.error('Vreme početka ne može biti u prošlosti');
      return;
    }

    let data = {
      object_id: this.selectedObj?._id,
      agency_id: this.agency_id,
      client_id: this.user!._id,
      startDate: startDate,
      endDate: endDate,
    };

    this.jobsService.createJob(data).subscribe((data: any) => {
      if (data.success) {
        this.toastr.success('Posao uspešno kreiran');
        this.router.navigate(['/agencies']);
      } else {
        this.toastr.error(data.msg);
      }
    });
  }

  onClickSelect(obj: CanvasObject): void {
    if (this.selectedObj === obj) {
      this.selectedObj = undefined;
    } else {
      this.selectedObj = obj;
    }
  }
}
