import { Component } from '@angular/core';
import { RandomNumberGeneratorService } from '../random-number-generator-service.service';
import { SettingOptionsService } from '../setting-options.service';
import { WebsocketService } from '../websocket.service';

type gridSquare = {
  value: number;
  marked: boolean;
  complete: boolean;
  children: gridNumber[];
};

type gridNumber = {
  value: number;
  marked: boolean;
  hold: boolean;
  used: boolean;
};

type phantomNumber = {
  value: number;
  marked: boolean;
  track: gridNumber[];
  hold?: boolean;
  used?: boolean;
}

type selectNumber = phantomNumber | gridNumber;

@Component({
  selector: 'bingo-board',
  templateUrl: './bingo-board.component.html',
  styleUrls: ['./bingo-board.component.css']
})
export class BingoBoardComponent {
  online: boolean = false;
  sessionId: number = 0;
  you: number = -1;

  size: number = 3;
  numberGen: number = 3;
  timer: number = 60;
  timeM: boolean = false; // TODO
  completion: boolean = false;

  squares: gridSquare[] = [];
  numbers: gridNumber[] = [];
  phantom: phantomNumber[] = [];
  select: selectNumber[] = [];

  turn: number = 0;
  countDown: number = 60;
  timerHold: any;
  timerStarted: boolean = false;
  foundBingo: boolean = false;
  setBingo: boolean = false;

  constructor(private randomNumberGeneratorService: RandomNumberGeneratorService, private settingService: SettingOptionsService, private ws: WebsocketService) {
    this.settingService.boardSize$.subscribe((boardSize) => {
      if (!this.online) {
        this.reset();
        this.makeBoard(boardSize);
        this.size = boardSize;
      }
    });

    this.settingService.numberGeneration$.subscribe((numberGeneration) => {
      if (!this.online) {
        this.reset();
        this.numberGen = numberGeneration;
      }
    });

    this.settingService.turnTimer$.subscribe((turnTimer) => {
      if (!this.online) {
        this.reset();
        this.timer = turnTimer;
        this.countDown = turnTimer;
      }
    });

    this.settingService.isTimerMode$.subscribe((isTimerMode) => {
      if (!this.online) {
        this.reset();
        this.timeM = isTimerMode;
      }
    });

    this.settingService.isCompletionMode$.subscribe((isCompletionMode) => {
      if (!this.online) {
        this.reset();
        this.completion = isCompletionMode;
      }
    });

    this.ws.messageSubject$.subscribe((message) => {
      if (message != "") {
        this.handleMessage(message);
      }
    });

    this.ws.isConnected$.subscribe((connected) => {
      this.online = connected;
      if (!this.online) {
        this.reset();
        this.size = settingService.getBoardSize();
        this.numberGen = settingService.getNumberGen();
        this.timer = settingService.getTurnTimer();
        this.countDown = this.timer;
        this.timeM = settingService.getTimerMode();
        this.completion = settingService.getCompletionMode();
        this.makeBoard(this.size);
      }
    });
  }

  makeBoard(size: number) {
    this.squares = [];
    const sqaureValues = this.randomNumberGeneratorService.generateNonDuplicateIntegers(1, size * size * 2, size * size);
    for (let i = 0; i < size * size; i++) {
      this.squares.push({
        value: sqaureValues[i],
        marked: false,
        complete: false,
        children: [],
      });
    }
  }

  generateNumbers() { 
    const gridNumbers = this.randomNumberGeneratorService.generateNonDuplicateIntegers(1, 2 * this.size + 1, this.numberGen);
    for (let i = 0; i < this.numberGen; i++) {
      this.numbers.push({
        value: gridNumbers[i],
        marked: false,
        hold: false,
        used: false
      });
    }
  }

  nextTurn() {
    if (this.timeM) {
      if (this.timerStarted) {
        this.stopTimer();
      }
      else {
        this.startTimer();
        if (this.countDown == this.timer) {
          this.generateNumbers();
        }
      }
      this.timerStarted = !this.timerStarted;
    }
    else {
      this.turn += 1;
      this.generateNumbers();
    }
  }

  toggleSquare(square: gridSquare) {
    square.marked = !square.marked;
    if (square.children.length != 0) {
      square.children.forEach((c) => {
        c.marked = !c.marked;
      });
    }
  }

  toggleNumber(number: gridNumber) {
    if (!number.used && !number.hold) {
      number.marked = !number.marked;
      if (number.marked) {
        this.select.push(number);
      }
      else {
        this.select = this.select.filter(obj => obj !== number);
      }
    }
  }

  togglePhantom(phantom: phantomNumber) {
    phantom.marked = !phantom.marked;
    if (phantom.marked) {
      this.select.push(phantom);
    }
    else {
      this.select = this.select.filter(obj => obj !== phantom);
    }
  }

  clearGrid() {
    this.squares.forEach((s) => {
      s.complete = false;
      s.marked = false;
      s.children = [];
    });
  }

  clearNumbers() {
    this.numbers.forEach((s) => {
      s.marked = false;
      s.used = false;
      s.hold = false;
    })
  }

  reset() {
    this.numbers = [];
    this.phantom = [];
    this.select = [];

    this.turn = 0;
    this.foundBingo = false;
    this.setBingo = false;
    this.clearAll();

    if (this.timeM) {
      this.stopTimer();
      this.countDown = this.timer;
    }
  }

  leaveOnline() {
    this.leaveSession();
  }

  checkBingo() {
    if (this.completion) {
      this.foundBingo = true;
      this.squares.forEach((s) => {
        if (!s.complete) {
          this.foundBingo = false;
          return;
        }
      });
    }
    else {
      if (this.checkRow()) {
        this.foundBingo = true;
      }
      else if (this.checkCol()) {
        this.foundBingo = true;
      }
      else if (this.checkDia()) {
        this.foundBingo = true;
      }
    }
  }

  finishBingo() {
    if (this.foundBingo) {
      this.setBingo = true;
      if (this.online) {
        const messageObject = {
          action: 'win',
          sessionId: this.sessionId,
          name: "TIMMY"
        };
        this.ws.sendMessage(JSON.stringify(messageObject));
      }
    }
    if (this.timeM) {
      this.stopTimer();
    }
  }

  checkRow() {
    for (let i = 0; i < this.size; i++) {
      let rowBingo = true;
      for (let j = 0; j < this.size; j++) {
        if (!this.squares[i * this.size + j].complete) {
          rowBingo = false;
          break;
        }
      }
      if (rowBingo) {
        return true;
      }
    }
    return false;
  }

  checkCol() {
    for (let i = 0; i < this.size; i++) {
      let colBingo = true;
      for (let j = 0; j < this.size; j++) {
        if (!this.squares[j * this.size + i].complete) {
          colBingo = false;
          break;
        }
      }
      if (colBingo) {
        return true;
      }
    }
    return false;
  }

  checkDia() {
    let d1 = true;
    let d2 = true;

    for (let i = 0; i < this.size; i++) {
      if (!this.squares[i * this.size + i].complete) {
        d1 = false;
      }
      if (!this.squares[i * this.size + (this.size - i - 1)].complete) {
        d2 = false;
      }
    }

    return d1 || d2;
  }

  verify() {
    let found: boolean = false;
    let grid: gridSquare = this.squares[0];
    this.squares.forEach((s) => {
      if (s.value == this.select[0].value && !s.complete) {
        s.complete = true;
        s.marked = false;
        found = true;
        grid = s;
      }
    });
    if (found) {
      if (this.select[0].used != null) { // gridNumber
        this.select[0].marked = false;
        this.select[0].hold = false;
        this.select[0].used = true;
        grid.children.push(this.select[0] as gridNumber);
      }
      else { // phantomNumber
        this.phantom = this.phantom.filter(obj => obj !== this.select[0]);
        this.select[0].track.forEach((s) => {
          s.hold = false;
          s.marked = false;
          s.used = true;
          grid.children.push(s);
        });
      }
      this.select = [];
      this.checkBingo();
    }
    else {
      console.log("no match");
    }
  }

  clear() {
    this.phantom = [];
    this.numbers.forEach((s) => {
      if (s.marked && s.used) {
        s.used = false;
      }
      s.marked = false;
      s.hold = false;
    })
    this.select = [];
    this.squares.forEach((s) => {
      if (s.marked && s.complete) {
        s.complete = false;
        s.children = [];
      }
      s.marked = false;
    })
  }

  clearAll() {
    this.phantom = [];
    this.clearNumbers();
    this.clearGrid();
    this.select = [];
  }

  add() {
    let sum: number = 0;
    let list: gridNumber[] = [];
    this.select.forEach((s) => {
      sum += s.value;
      this.filterSelect(s, list);
    });
    this.phantom.push({ value: sum, marked: false, track: list });
    this.select = [];
  }

  subtract() {
    let value: number = this.select[0].value - this.select[1].value;
    let list: gridNumber[] = [];
    this.select.forEach((s) => {
      this.filterSelect(s, list);
    });
    this.phantom.push({ value: value, marked: false, track: list });
    this.select = [];
  }

  multiply() {
    let product: number = 1;
    let list: gridNumber[] = [];
    this.select.forEach((s) => {
      product *= s.value;
      this.filterSelect(s, list);
    });
    this.phantom.push({ value: product, marked: false, track: list });
    this.select = [];
  }

  divide() {
    let value: number = this.select[0].value / this.select[1].value;
    let list: gridNumber[] = [];
    this.select.forEach((s) => {
      this.filterSelect(s, list);
    });
    this.phantom.push({ value: value, marked: false, track: list });
    this.select = [];
  }

  filterSelect(selectNum: selectNumber, list: gridNumber[]) {
    if (selectNum.used != null) { // gridNumber
      list.push(selectNum as gridNumber);
      selectNum.marked = false;
      selectNum.hold = true;
      selectNum.used = false;
    }
    else { // phantomNumber
      list.push(...selectNum.track);
      this.phantom = this.phantom.filter(obj => obj !== selectNum);
    }
  }

  textOutput(): string {
    if (this.setBingo) {
      return 'BINGO';
    }
    const selectedNames = this.select.map(item => item.value);
    if (selectedNames.length == 0) {
      if (this.completion) {
        return "Completion Bingo: Finish the entire board!"
      }
      return "Regular Bingo: You know what counts!"
    }
    return selectedNames.join(', ');
  }

  startTimer() {
    this.timerHold = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        this.restartTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerHold);
  }

  restartTimer() {
    this.stopTimer();
    this.countDown = this.timer;
    if (!this.online) {
      this.generateNumbers();
    }
    this.startTimer();
  }

  leaveSession() {
    this.ws.disconnect();
  }

  handleMessage(message: string) {
    const data = JSON.parse(message);
    console.log(data);
    if (data.sessionId) {
      this.sessionId = data.sessionId;
    }
    if (data.board) {
      this.squares = [];
      this.size = data.boardSize;
      data.board.forEach((b:gridSquare) => {
        this.squares.push(b);
      })
    }
    if (data.numbers) {
      data.numbers.forEach((n:gridNumber) => {
        this.numbers.push(n);
      });
    }
    if (data.timer) {
      this.timer = data.timer;
      this.countDown = this.timer;
      this.timeM = true; //only option atm
    }
    if (data.completion) {
      this.completion = data.completion;
    }
    if (data.action == 'start') { //start of a new game
      this.reset();
      this.startTimer();
    }
    if (data.action == 'end') {
      this.stopTimer();
      this.setBingo = true;
    }
    if (data.playerNumber) { //start of a new game
      // this.playerCount = data.countPlayers;
      this.you = data.playerNumber;
    }
  }

  playAgain() {
    const messageObject = {
      action: 'playAgain',
      sessionId: this.sessionId
    };
    this.ws.sendMessage(JSON.stringify(messageObject));
  }
}
