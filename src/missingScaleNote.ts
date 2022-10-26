
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandom, getNoteVariants, circleOfFifth } from "./utilis"
import { IQuiz, Quiz } from "./quiz-types";

class MissingScaleNote implements IQuiz {

    scale : Scale;
    scaleString : string;
    randomNote : string;
    randomNoteVariants : string[]
    constructor() {
        this.scale = ScaleClass.get(getRandom(circleOfFifth) + " major");
        this.randomNote = getRandom(this.scale.notes);

        this.scaleString = this.scale.notes
            .map(n => n === this.randomNote ? "- MISSING -" : n)
            .reduce((acc, cur) => acc + cur + " ", "")
            .toString();

        this.randomNoteVariants = getNoteVariants(this.randomNote)
    }

    get quizHead() {
        return [
            this.scale.name,
            this.scaleString
        ]
    }

    get question() {
        return this.randomNoteVariants;
    }

    get answer() {
        return this.randomNote
    }
}

export const MissingScaleNoteQuiz: Quiz = MissingScaleNote;