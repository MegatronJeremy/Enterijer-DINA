import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CanvasObject from 'src/app/models/canvasObject';
import { AuthService } from 'src/app/services/auth.service';
import { CanvasObjectService } from 'src/app/services/canvas-object.service';
import { CanvasValidateService } from 'src/app/services/canvas-validate.service';

@Component({
  selector: 'app-new-object',
  templateUrl: './new-object.component.html',
  styleUrls: ['./new-object.component.css'],
})
export class NewObjectComponent implements OnInit {
  selectedObj: CanvasObject = new CanvasObject();

  constructor(
    private toastr: ToastrService,
    private canvasValidateService: CanvasValidateService,
    private canvasObjectService: CanvasObjectService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.selectedObj.user = user!.username;
  }

  createObj(): void {
    try {
      this.canvasValidateService.validateCanvasObject(this.selectedObj);

      this.canvasObjectService
        .createCanvasObject(this.selectedObj)
        .subscribe((data: any) => {
          if (data.success) {
            this.toastr.success(data.msg);
            this.router.navigate(['/objects']);
          } else {
            this.toastr.error(data.msg);
          }
        });
    } catch (err: any) {
      this.toastr.error(err.message);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const contents = e.target?.result as string;
        const jsonData = JSON.parse(contents);

        this.selectedObj = jsonData as CanvasObject;
        this.toastr.success('JSON fajl uspešno ucitan');
      } catch (error) {
        console.log(error);
        this.toastr.error('JSON fajl nije validnog formata');
      }
    };

    reader.readAsText(file);
  }
}
