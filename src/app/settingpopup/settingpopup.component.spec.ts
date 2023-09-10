import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingpopupComponent } from './settingpopup.component';

describe('SettingpopupComponent', () => {
  let component: SettingpopupComponent;
  let fixture: ComponentFixture<SettingpopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingpopupComponent]
    });
    fixture = TestBed.createComponent(SettingpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
