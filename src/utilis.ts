import { Note } from "@tonaljs/tonal";

export const circleOfFifth = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "F#", "B", "E", "A", "D", "G"];

export function getRandom(arr: string[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

export function getNoteVariants(note: string) {
    const noteBase = note.substring(0, 1);
    return [
        Note.transpose(noteBase, "1d"),
        noteBase,
        Note.transpose(noteBase, "1A")
    ]
}

export function loopQuiz(quiz : () => [number, number]) {

    let points = 0;
    let index = 0;

    while(index != -1)
    {
        console.clear();
        const [answer, point] = quiz();
        points = points + point;
        index = answer;
    }
}