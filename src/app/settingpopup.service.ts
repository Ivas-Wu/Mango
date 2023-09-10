import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingpopupService {
  private popupVisibleSubject = new BehaviorSubject<boolean>(false);
  public popupVisible$ = this.popupVisibleSubject.asObservable();

  constructor() { }

  openPopup() {
    this.popupVisibleSubject.next(true);
  }

  closePopup() {
    this.popupVisibleSubject.next(false);
  }
}
