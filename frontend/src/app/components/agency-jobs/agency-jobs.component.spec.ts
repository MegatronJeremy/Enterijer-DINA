import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyJobsComponent } from './agency-jobs.component';

describe('AgencyJobsComponent', () => {
  let component: AgencyJobsComponent;
  let fixture: ComponentFixture<AgencyJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
