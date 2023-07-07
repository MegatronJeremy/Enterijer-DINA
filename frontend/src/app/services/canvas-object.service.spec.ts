import { TestBed } from '@angular/core/testing';

import { CanvasObjectService } from './canvas-object.service';

describe('CanvasObjectService', () => {
  let service: CanvasObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
