import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SettingpopupService } from '../settingpopup.service';
import { SettingOptionsService } from '../setting-options.service';

@Component({
  selector: 'app-settingpopup',
  templateUrl: './settingpopup.component.html',
  styleUrls: ['./settingpopup.component.css']
})
export class SettingpopupComponent implements OnInit{
  isPopupVisible: boolean = false;
  newOpen: boolean = false;

  //general
  disabled = false;
  showTicks = false;
  step = 1;
  thumbLabel = true;

  //boardSize
  maxBoardSize = 8;
  minBoardSize = 2;
  size:number = 0;

  //numGen
  maxNumGen = 5;
  minNumGen = 1;
  generate: number = 0;

  //timer
  timeMode:boolean = false;
  maxTimer = 120;
  minTimer = 1;
  stepTimer = 1;
  time: number = 0;

  completion:boolean = false;

  ngOnInit(): void {
    this.setDefaults();
  }

  constructor(private elRef: ElementRef, private popupService: SettingpopupService, private settingService: SettingOptionsService) {
    
    this.popupService.popupVisible$.subscribe((isVisible) => {
      this.isPopupVisible = isVisible;
      if (isVisible) {
        this.newOpen = true;
      }
    });
  }

  setDefaults() {
    this.size = this.settingService.getBoardSize();
    this.generate = this.settingService.getNumberGen();
    this.time = this.settingService.getTurnTimer();
    this.timeMode = this.settingService.getTimerMode();
    this.completion = this.settingService.getCompletionMode();
  }

  saveSettings() {
    this.settingService.setBoardSize(this.size);
    this.settingService.setNumberGen(this.generate);
    this.settingService.setTurnTimer(this.time);
    this.settingService.setTimerMode(this.timeMode);
    this.settingService.setCompletionMode(this.completion);
    this.closePopup();
  }

  closePopup() {
    this.setDefaults();
    this.popupService.closePopup();
  }

  toggleTimeMode() {
    this.timeMode = !this.timeMode;
  }

  toggleCompletionMode() {
    this.completion = !this.completion;
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
