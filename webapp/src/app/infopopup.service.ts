import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfopopupService {
  private popupVisibleSubject = new BehaviorSubject<boolean>(false);
  private onlinePopupVisibleSubject = new BehaviorSubject<boolean>(false);
  
  public popupVisible$ = this.popupVisibleSubject.asObservable();
  public onlinePopupVisibleSubject$ = this.onlinePopupVisibleSubject.asObservable();

  constructor() { }

  openPopup() {
    this.popupVisibleSubject.next(true);
  }

  closePopup() {
    this.popupVisibleSubject.next(false);
  }

  openOnlinePopup() {
    this.onlinePopupVisibleSubject.next(true);
  }

  closeOnlinePopup() {
    this.onlinePopupVisibleSubject.next(false);
  }
}
