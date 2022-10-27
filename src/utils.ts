import { Note } from "@tonaljs/tonal";
import chalk from "chalk";
import rs from "readline-sync"
import { Quiz } from "./quiz-types";

export const circleOfFifth = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "F#", "B", "E", "A", "D", "G"];

export function getRandomItem(arr: string[]) {
    const randomIndex = getRandomIndex(arr);
    return arr[randomIndex];
}

export function getRandomIndex(arr: string[]) {
    return Math.floor(Math.random() * arr.length);
}

export function getNoteVariants(note: string) {
    const noteBase = note.substring(0, 1);
    return [
        Note.transpose(noteBase, "1dd"),
        Note.transpose(noteBase, "1d"),
        noteBase,
        Note.transpose(noteBase, "1A"),
        Note.transpose(noteBase, "1AA")
    ]
}

export function numberToDegree(n: number) {
    let degree = "";
    switch (n) {
        case 0:
            degree = "1st";
            break;
        case 1:
            degree = "2nd";
            break;
        case 2:
            degree = "3rd";
            break;
        case 3:
            degree = "4th";
            break;
        case 4:
            degree = "5th";
            break;
        case 5:
            degree = "6th";
            break;
        case 6:
            degree = "7th";
    }
    return degree;
}

export function loopQuiz(QuizClass: Quiz, options: string[]) {

    let index = 0;

    while (index != -1) {
        console.clear();
        const quiz = new QuizClass(options);

        for (const head of quiz.quizHead) {
            console.log(head)
        }

        index = rs.keyInSelect(quiz.questionOptions, quiz.question);

        if (index === -1) {
            console.log("Bye for now");
            break;
        }

        if (quiz.questionOptions[index] === quiz.answer) {
            console.log(chalk.green(`Right!`))


        } else if (index != -1) {
            console.log(chalk.red(`Wrong!`))
            console.log(chalk.white(`Correct : ${quiz.answer}`))
        }
        rs.question("Hit Enter key to continue", { hideEchoBack: true, mask: '' });
    }
}