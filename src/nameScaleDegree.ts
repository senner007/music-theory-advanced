
import { Scale as ScaleClass} from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandom, getNoteVariants, circleOfFifth, numberToDegree, getRandomNumber } from "./utils"
import { IQuiz, Quiz } from "./quiz-types";

class NameScaleDegree implements IQuiz {

    scale : Scale;
    degree : string;
    randomNote : string;
    randomNoteVariants : string[]
    constructor(scaleTypes : string[]) {
        this.scale = ScaleClass.get(getRandom(circleOfFifth) + " " + getRandom(scaleTypes));

        const randomDegree = getRandomNumber(this.scale.notes)

        this.randomNote = this.scale.notes[randomDegree];

        this.degree = numberToDegree(randomDegree)

        this.randomNoteVariants = getNoteVariants(this.randomNote)
    }

    get quizHead() {
        return [
            this.scale.name
        ]
    }

    get questionOptions() {
        return this.randomNoteVariants;
    }

    get question() {
        return `Which is the ${this.degree} degree?`;
    }

    get answer() {
        return this.randomNote
    }
}

export const NameScaleDegreeQuiz: Quiz = NameScaleDegree;