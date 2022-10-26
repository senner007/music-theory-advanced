
import { Scale as ScaleClass} from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandom, getNoteVariants, circleOfFifth } from "./utils"
import { IQuiz, Quiz } from "./quiz-types";

class MissingScaleNote implements IQuiz {

    scale : Scale;
    scaleString : string;
    randomNote : string;
    randomNoteVariants : string[]
    constructor(scaleTypes : string[]) {
        this.scale = ScaleClass.get(getRandom(circleOfFifth) + " " + getRandom(scaleTypes));
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

    get questionOptions() {
        return this.randomNoteVariants;
    }

    get question() {
        return 'Which note is missing?';
    }

    get answer() {
        return this.randomNote
    }
}

export const MissingScaleNoteQuiz: Quiz = MissingScaleNote;