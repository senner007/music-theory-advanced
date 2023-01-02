import { MathFloor } from "./random-funcs";
import { noteAllAccidental, noteAllAccidentalOctave, note_transpose, toOctave, random_index, octave } from "./utils";

declare global {

    interface Array<T> {
      toOctave(this: noteAllAccidental[], octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
      transposeBy<U extends noteAllAccidental[] | noteAllAccidentalOctave[]>(this: U, interval: string): Readonly<U>;
      commaSequence(): string;
      shuffleArray(): Readonly<Array<T>>;
      randomItem(): T;
    }
    interface ReadonlyArray<T> {
      shuffleArray(): Readonly<Array<T>>;
      randomItem(): T;
      commaSequence(): string;
      toOctave(this: Readonly<noteAllAccidental[]>, octave: octave): Readonly<Array<noteAllAccidentalOctave>>;
      transposeBy<U extends Readonly<noteAllAccidental[]> | Readonly<noteAllAccidentalOctave[]>>(this: U, interval: string): Readonly<U>;
    }
  }

  Array.prototype.transposeBy = function<U extends noteAllAccidental[] | noteAllAccidentalOctave[]> (
    this: U,
    interval: string
  ) : Readonly<U> {
    return this.map(n => note_transpose(n, interval)) as Readonly<U>;
  };
  
  
  Array.prototype.toOctave = function (
    octave: octave
  ): Readonly<noteAllAccidentalOctave[]> {
    return this.map((n) => toOctave(n, octave));
  };
  
  Array.prototype.commaSequence = function (): string {
    return this.join(", ");
  };
  
  
  Array.prototype.shuffleArray = function () {
    const arrayClone = [...this];
    for (let i = arrayClone.length - 1; i > 0; i--) {
      const j = MathFloor(Math.random() * (i + 1));
      const temp = arrayClone[i];
      arrayClone[i] = arrayClone[j];
      arrayClone[j] = temp;
    }
    return arrayClone;
  };
  
  Array.prototype.randomItem = function () {
    const randomIndex = random_index(this);
    return this[randomIndex];
  };