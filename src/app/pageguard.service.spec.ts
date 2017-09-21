import { TestBed, inject } from '@angular/core/testing';

import { PageguardService } from './pageguard.service';

describe('PageguardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageguardService]
    });
  });

  it('should be created', inject([PageguardService], (service: PageguardService) => {
    expect(service).toBeTruthy();
  }));
});
