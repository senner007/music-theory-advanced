
import chalk from "chalk"
import rs from "readline-sync"
import { Scale as ScaleClass } from "@tonaljs/tonal";
import { Scale } from "@tonaljs/scale";
import { getRandom, getNoteVariants, circleOfFifth } from "./utilis"



export function missingScaleNoteQuiz() : [number, number] {

    const scale: Scale = ScaleClass.get(getRandom(circleOfFifth) + " major");

    console.log(scale.name)

    const randomNote = getRandom(scale.notes)

    const options = getNoteVariants(randomNote)

    const scaleString = scale
        .notes
        .map(n => n === randomNote ? "- MISSING -" : n)
        .reduce((acc, cur) => acc + cur + " ", "")
        .toString();

    console.log(chalk.white(`${scaleString}\n`));

    const index = rs.keyInSelect(options, 'Which note is missing?');
    
    let point = 0;

    if (options[index] === randomNote) {
        console.log(chalk.green(`Right!`))
        point++;
        rs.question('Hit Enter key to continue.', {hideEchoBack: true, mask: ''});
    } else if (index != -1) {
        console.log(chalk.red(`Wrong!`))
        console.log(chalk.white(`Correct : ${randomNote}`))

        rs.question('Hit Enter key to continue.', {hideEchoBack: true, mask: ''});
    }

    return [index, point];
}