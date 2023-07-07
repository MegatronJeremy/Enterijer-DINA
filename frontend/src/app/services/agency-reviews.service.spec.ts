import { TestBed } from '@angular/core/testing';

import { AgencyReviewsService } from './agency-reviews.service';

describe('AgencyReviewsService', () => {
  let service: AgencyReviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgencyReviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
