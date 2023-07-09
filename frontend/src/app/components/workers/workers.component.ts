import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import User from 'src/app/models/user';
import Vacancies from 'src/app/models/vacancies';
import Workers from 'src/app/models/worker';
import { AuthService } from 'src/app/services/auth.service';
import { ValidateService } from 'src/app/services/validate.service';
import { WorkersService } from 'src/app/services/workers.service';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css'],
})
export class WorkersComponent implements OnInit {
  workers: Workers[] = [];

  @Input() _user?: User;

  @Input() set user(user: User | undefined) {
    this._user = user;
    this.initWorkers();
  }

  get user(): User | undefined {
    return this._user;
  }

  @Input() inputMode: boolean = false;
  vacancy: Vacancies = new Vacancies();
  vacancyNum: number = 0;
  workerToEdit?: Workers;
  workerToAdd?: Workers;

  constructor(
    private workersService: WorkersService,
    private toastr: ToastrService,
    private authService: AuthService,
    private validateService: ValidateService
  ) {}

  ngOnInit(): void {
    if (this.inputMode) {
      return;
    }

    this.user = this.authService.getUser();
    if (!this.user) {
      this.toastr.error('Niste prijavljeni');
      return;
    }

    this.initWorkers();
  }

  private initWorkers() {
    this.workersService.getAllWorkers(this.user!._id).subscribe((data: any) => {
      if (data.success) {
        this.workers = data.workers;
      } else {
        this.toastr.error(data.msg);
      }
    });

    this.workersService
      .getVacancyRequests(this.user!._id)
      .subscribe((data: any) => {
        if (data.success) {
          if (data.vacancy) {
            this.vacancy = data.vacancy;
          } else {
            this.vacancy.agency = this.user!._id;
            this.workersService
              .createVacancyRequest(this.vacancy)
              .subscribe((data: any) => {
                if (data.success) {
                  this.vacancy = data.vacancy;
                } else {
                  this.toastr.error(data.msg);
                }
              });
          }
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  acceptRequest() {
    this.vacancy.vacancies += this.vacancy.vacanciesRequested;
    this.vacancy.vacanciesRequested = 0;

    this.workersService
      .updateVacancyRequest(this.vacancy)
      .subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Zahtev je prihvaćen');
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  denyRequest() {
    this.vacancy.vacanciesRequested = 0;

    this.workersService
      .updateVacancyRequest(this.vacancy)
      .subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Zahtev je odbijen');
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  submitVacancyRequest() {
    if (this.vacancyNum <= 0) {
      this.toastr.error('Broj radnika mora biti veći od 0');
      return;
    }

    this.vacancy.vacanciesRequested = this.vacancyNum;

    this.workersService
      .updateVacancyRequest(this.vacancy)
      .subscribe((data: any) => {
        if (data.success) {
          this.toastr.success('Zahtev za otvaranje radnih mesta je poslat');
          this.vacancyNum = 0;
        } else {
          this.toastr.error(data.msg);
        }
      });
  }

  selectToEdit(worker: Workers) {
    if (this.workerToEdit !== undefined) {
      if (
        this.workerToEdit.firstName === '' ||
        this.workerToEdit.lastName === '' ||
        this.workerToEdit.email === '' ||
        this.workerToEdit.phone === '' ||
        this.workerToEdit.specialty === ''
      ) {
        this.toastr.error('Unesite sva polja');
        return;
      }

      if (!this.validateService.validateEmail(this.workerToEdit.email)) {
        this.toastr.error('Unesite validnu email adresu');
        return;
      }

      if (!this.validateService.validatePhone(this.workerToEdit.phone)) {
        this.toastr.error('Unesite validan broj telefona');
        return;
      }

      if (!this.workerToAdd) {
        this.workersService
          .updateWorker(this.workerToEdit)
          .subscribe((data: any) => {
            if (data.success) {
              this.toastr.success(data.msg);
            } else {
              this.toastr.error(data.msg);
              return; // don't allow the action
            }
          });
      } else {
        this.workersService
          .createWorker(this.workerToEdit)
          .subscribe((data: any) => {
            if (data.success) {
              this.toastr.success(data.msg);
              this.vacancy.vacancies--;
              this.workerToAdd = undefined;
              this.workersService
                .updateVacancyRequest(this.vacancy)
                .subscribe((data: any) => {
                  if (!data.success) {
                    this.toastr.error(data.msg);
                  }
                });
            } else {
              this.toastr.error(data.msg);
              return; // don't allow the action
            }
          });
      }
    }

    if (this.workerToEdit === worker) {
      this.workerToEdit = undefined;
    } else {
      this.workerToEdit = worker;
    }
  }

  onClickDelete(worker: Workers) {
    this.workersService.deleteWorker(worker._id).subscribe((data: any) => {
      if (data.success) {
        this.vacancy.vacancies++;
        this.workersService
          .updateVacancyRequest(this.vacancy)
          .subscribe((data: any) => {
            if (data.success) {
              this.toastr.success(data.msg);
            } else {
              this.toastr.error(data.msg);
            }
          });
      } else {
        this.toastr.error(data.msg);
      }
    });

    this.workers = this.workers.filter((w) => w._id !== worker._id);
    this.workerToEdit = undefined;
    this.workerToAdd = undefined;
  }

  addWorker() {
    this.workerToAdd = new Workers();
    this.workerToAdd.agency = this.user!._id;
    this.workers.push(this.workerToAdd);
    this.workerToEdit = this.workerToAdd;
  }
}
