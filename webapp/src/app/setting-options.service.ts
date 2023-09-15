import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingOptionsService {
  private boardSize = new BehaviorSubject<number>(localStorage.getItem('boardSize') ? Number(JSON.parse(localStorage.getItem('boardSize')!)) : 3);
  private numberGeneration = new BehaviorSubject<number>(localStorage.getItem('numberGenerator') ? Number(JSON.parse(localStorage.getItem('numberGenerator')!)) : 3);
  private turnTimer = new BehaviorSubject<number>(localStorage.getItem('turnTimer') ? Number(JSON.parse(localStorage.getItem('turnTimer')!)) : 15);
  private isTimerMode = new BehaviorSubject<boolean>(localStorage.getItem('timerMode') ? Boolean(JSON.parse(localStorage.getItem('timerMode')!)) : false);
  private isCompletionMode = new BehaviorSubject<boolean>(localStorage.getItem('completionMode') ? Boolean(JSON.parse(localStorage.getItem('completionMode')!)) : false);

  boardSize$ = this.boardSize.asObservable();
  numberGeneration$ = this.numberGeneration.asObservable();
  turnTimer$ = this.turnTimer.asObservable();
  isTimerMode$ = this.isTimerMode.asObservable();
  isCompletionMode$ = this.isCompletionMode.asObservable();

  setBoardSize(val: number) {
    localStorage.setItem('boardSize', JSON.stringify(val));
    this.boardSize.next(val);
  }

  getBoardSize(): number {
    return this.boardSize.value;
  }

  setNumberGen(val: number) {
    localStorage.setItem('numberGenerator', JSON.stringify(val));
    this.numberGeneration.next(val);
  }

  getNumberGen(): number {
    return this.numberGeneration.value;
  }

  setTurnTimer(val: number) {
    localStorage.setItem('turnTimer', JSON.stringify(val));
    this.turnTimer.next(val);
  }

  getTurnTimer(): number {
    return this.turnTimer.value;
  }

  setTimerMode(val: boolean) {
    localStorage.setItem('timerMode', JSON.stringify(val));
    this.isTimerMode.next(val);
  }

  getTimerMode(): boolean {
    return this.isTimerMode.value;
  }

  setCompletionMode(val: boolean) {
    localStorage.setItem('completionMode', JSON.stringify(val));
    this.isCompletionMode.next(val);
  }

  getCompletionMode(): boolean {
    return this.isCompletionMode.value;
  }

  constructor() { }
}
