import { TestBed, inject } from '@angular/core/testing';

import { LoginguardService } from './loginguard.service';

describe('LoginguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginguardService]
    });
  });

  it('should be created', inject([LoginguardService], (service: LoginguardService) => {
    expect(service).toBeTruthy();
  }));
});
