import { TestBed } from '@angular/core/testing';

import { RandomNumberGeneratorService } from './random-number-generator-service.service';

describe('RandomNumberGeneratorService', () => {
  let service: RandomNumberGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomNumberGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
