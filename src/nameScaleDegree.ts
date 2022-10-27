
import { Scale as ScaleClass} from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandomItem, getNoteVariants, numberToDegree, getRandomIndex, getRandomNote } from "./utils"
import { IQuiz, Quiz } from "./quiz-types";

class NameScaleDegree implements IQuiz {

    scale : Scale;
    randomDegree : string;
    randomNote : string;
    randomNoteVariants : string[]
    constructor(scaleTypes : string[]) {
        this.scale = ScaleClass.get(getRandomNote() + " " + getRandomItem(scaleTypes));
        const randomIndex = getRandomIndex(this.scale.notes)
        this.randomNote = this.scale.notes[randomIndex];
        this.randomDegree = numberToDegree(randomIndex)
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
        return `Which is the ${this.randomDegree} degree?`;
    }
    get answer() {
        return this.randomNote
    }
}

export const NameScaleDegreeQuiz: Quiz = NameScaleDegree;