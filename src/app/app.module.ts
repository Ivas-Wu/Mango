import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BingoBoardComponent } from './bingo-board/bingo-board.component';
import { BingoHeaderComponent } from './bingo-header/bingo-header.component';
import { InfopopupComponent } from './infopopup/infopopup.component';
import { SettingpopupComponent } from './settingpopup/settingpopup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    BingoBoardComponent,
    BingoHeaderComponent,
    InfopopupComponent,
    SettingpopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
