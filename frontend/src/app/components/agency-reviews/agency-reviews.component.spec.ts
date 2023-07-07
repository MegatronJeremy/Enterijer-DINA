import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyReviewsComponent } from './agency-reviews.component';

describe('AgencyReviewsComponent', () => {
  let component: AgencyReviewsComponent;
  let fixture: ComponentFixture<AgencyReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
