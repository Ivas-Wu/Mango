import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoHeaderComponent } from './bingo-header.component';

describe('BingoHeaderComponent', () => {
  let component: BingoHeaderComponent;
  let fixture: ComponentFixture<BingoHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BingoHeaderComponent]
    });
    fixture = TestBed.createComponent(BingoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
