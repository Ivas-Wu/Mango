import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePopupComponent } from './online-popup.component';

describe('OnlinePopupComponent', () => {
  let component: OnlinePopupComponent;
  let fixture: ComponentFixture<OnlinePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlinePopupComponent]
    });
    fixture = TestBed.createComponent(OnlinePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
