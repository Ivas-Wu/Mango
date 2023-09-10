import { TestBed } from '@angular/core/testing';

import { SettingpopupService } from './settingpopup.service';

describe('SettingpopupService', () => {
  let service: SettingpopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingpopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
