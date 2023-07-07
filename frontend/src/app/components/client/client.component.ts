import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import CanvasObject from 'src/app/models/canvasObject';
import User from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CanvasObjectService } from 'src/app/services/canvas-object.service';
import { CanvasValidateService } from 'src/app/services/canvas-validate.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit {
  objects: CanvasObject[] = [];
  selectedObj: CanvasObject | undefined;

  private user?: User;

  constructor(
    private canvasObjectService: CanvasObjectService,
    private canvasValidateService: CanvasValidateService,
    private authService: AuthService,
    private toastr: ToastrService
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
        }
      });
  }

  onClickDelete(obj: CanvasObject): void {
    this.canvasObjectService
      .deleteCanvasObject(obj._id)
      .subscribe((data: any) => {
        if (data.success) {
          this.toastr.success(data.msg);
          this.objects = this.objects.filter(
            (o: CanvasObject) => o._id !== obj._id
          );
          this.selectedObj = undefined;
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  onClickSelect(obj: CanvasObject): void {
    let same: boolean = this.selectedObj === obj;
    this.selectedObj = undefined;
    if (!same) {
      this.selectedObj = obj;
    }
  }

  updateSelectedObj(): void {
    try {
      this.canvasValidateService.validateCanvasObject(this.selectedObj!);
      this.canvasObjectService
        .updateCanvasObject(this.selectedObj!)
        .subscribe((data: any) => {
          if (data.success) {
            this.toastr.success(data.msg);
          } else {
            this.toastr.error(data.msg);
          }
        });
    } catch (err: any) {
      this.toastr.error(err.message);
    }
  }
}
