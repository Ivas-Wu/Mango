import { Component, ElementRef, HostListener } from '@angular/core';
import { InfopopupService } from '../infopopup.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-online-popup',
  templateUrl: './online-popup.component.html',
  styleUrls: ['./online-popup.component.css']
})
export class OnlinePopupComponent {
  isPopupVisible: boolean = false;
  // newOpen: boolean = false;

  //general
  showTicks = false;
  step = 1;
  thumbLabel = true;

  //boardSize
  maxBoardSize = 8;
  minBoardSize = 2;
  size:number = 3;

  //numGen
  maxNumGen = 5;
  minNumGen = 1;
  generate: number = 3;

  //timer
  timeMode:boolean = false;
  maxTimer = 120;
  minTimer = 1;
  stepTimer = 1;
  time: number = 15;

  completion:boolean = false;
  inSession: boolean = false; //TODO close it when connection closes
  sessionID:string = "";
  playerCount = 0;
  you = -1;

  constructor(private elRef: ElementRef, private popupService: InfopopupService, private ws: WebsocketService) {
    
    this.popupService.onlinePopupVisibleSubject$.subscribe((isVisible) => {
      this.isPopupVisible = isVisible;
      // if (isVisible) {
      //   this.newOpen = true;
      // }
    });

    this.ws.messageSubject$.subscribe((message)=> {
      if (message != ""){
        this.handleMessage(message);
      }
    })

    this.ws.isConnected$.subscribe((connected) => {
      this.inSession = connected;
      console.log(this.inSession);
    })
  }

  joinSession() {
    const messageObject = {
      action: 'join',
      sessionId: this.sessionID,
    };
    this.ws.connect(JSON.stringify(messageObject));
  }

  startGame() {
    if (this.inSession) {
      this.closePopup();
      const messageObject = {
        action: 'start',
        sessionId: this.sessionID,
        boardSize: this.size,
        numGen: this.generate,
        timer: this.time,
        completion: this.completion,
      };
      this.ws.sendMessage(JSON.stringify(messageObject));
    }
  }

  // closeSession() {
  //   if (this.inSession) {
  //     this.disconnect();
  //   }
  //   this.closePopup();
  // }

  disconnect() {
    this.ws.disconnect();
  }

  handleMessage(message: string) {
    const data = JSON.parse(message);
    if (data.action == 'start') { //start of a new game
      this.closePopup();
    }
    if (data.countPlayers) { //start of a new game
      this.playerCount = data.countPlayers;
      this.you = data.playerNumber;
    }
    // Other settings values from the leader if you are not the leader TODO
  }

  closePopup() {
    this.popupService.closeOnlinePopup();
  }

  toggleCompletionMode() {
    this.completion = !this.completion;
  }

  // @HostListener('document:click', ['$event'])
  // onClick(event: Event) {
  //   if (!this.newOpen){
  //     if (this.isPopupVisible && !this.elRef.nativeElement.contains(event.target)) {
  //       this.closePopup();
  //     }
  //   }
  //   else {
  //     this.newOpen = false;
  //   }
    
  // }
}
