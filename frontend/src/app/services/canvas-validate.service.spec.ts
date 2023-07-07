import { TestBed } from '@angular/core/testing';

import { CanvasValidateService } from './canvas-validate.service';

describe('CanvasValidateService', () => {
  let service: CanvasValidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasValidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
