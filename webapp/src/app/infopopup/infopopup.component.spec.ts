import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopopupComponent } from './infopopup.component';

describe('InfopopupComponent', () => {
  let component: InfopopupComponent;
  let fixture: ComponentFixture<InfopopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfopopupComponent]
    });
    fixture = TestBed.createComponent(InfopopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
