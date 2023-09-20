import { Component, ElementRef, HostListener } from '@angular/core';
import { InfopopupService } from '../infopopup.service';

@Component({
  selector: 'app-infopopup',
  templateUrl: './infopopup.component.html',
  styleUrls: ['./infopopup.component.css']
})
export class InfopopupComponent {
  isPopupVisible: boolean = false;
  newOpen: boolean = false;

  constructor(private elRef: ElementRef, private popupService: InfopopupService) {
    this.popupService.popupVisible$.subscribe((isVisible) => {
      this.isPopupVisible = isVisible;
      if (isVisible) {
        this.newOpen = true;
      }
    });
  }

  // openPopup() {
  //   this.popupService.openPopup();
  // }

  closePopup() {
    this.popupService.closePopup();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.newOpen){
      if (this.isPopupVisible && !this.elRef.nativeElement.contains(event.target)) {
        this.closePopup();
      }
    }
    else {
      this.newOpen = false;
    }
    
  }
}