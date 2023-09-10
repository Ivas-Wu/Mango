import { TestBed } from '@angular/core/testing';

import { SettingOptionsService } from './setting-options.service';

describe('SettingOptionsService', () => {
  let service: SettingOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
