import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomNumberGeneratorService {

  constructor() { }

  generateNonDuplicateIntegers(start: number, end: number, count: number): number[] {
    if (count > end - start + 1) {
      throw new Error("Cannot generate more integers than the range allows.");
    }

    const numbers: Set<number> = new Set();
    while (numbers.size < count) {
      const number = Math.floor(Math.random() * (end - start + 1)) + start;
      if (!numbers.has(number)) {
        numbers.add(number);
      }
    }

    return Array.from(numbers);
  }
}
