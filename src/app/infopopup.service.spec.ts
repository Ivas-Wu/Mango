import { TestBed } from '@angular/core/testing';

import { InfopopupService } from './infopopup.service';

describe('InfopopupService', () => {
  let service: InfopopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfopopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
