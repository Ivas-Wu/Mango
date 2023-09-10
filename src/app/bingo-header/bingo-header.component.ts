import { Component } from '@angular/core';
import { InfopopupService } from '../infopopup.service';
import { SettingpopupService } from '../settingpopup.service';

@Component({
  selector: 'app-bingo-header',
  templateUrl: './bingo-header.component.html',
  styleUrls: ['./bingo-header.component.css']
})
export class BingoHeaderComponent {
  constructor(private infoPopupService: InfopopupService, private settingPopupService: SettingpopupService) {}

  openInfoPopup() {
    this.infoPopupService.openPopup();
  }

  openSettingPopup() {
    this.settingPopupService.openPopup();
  }
}
