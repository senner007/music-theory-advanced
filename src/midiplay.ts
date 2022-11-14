// @ts-nocheck
import easymidi, { Note as INote} from 'easymidi';
import { Note } from "@tonaljs/tonal";
import { INotePlay } from './quiz-types';
console.log('MIDI outputs:');
console.log(easymidi.getOutputs());

var output = new easymidi.Output('Microsoft GS Wavetable Synth');

const timer = async (time: number, { signal } : any) => {
    return new Promise((res) => {
        let timer: any;
        // @ts-ignore
        const onAbort = (e: any) => {
            clearTimeout(timer);
            res(0);
        };
        signal.addEventListener('abort', onAbort, { once: true });
        timer = setTimeout(() => res(0), time)
    });
}

const channelObj: INote = {
    note: 0,
    velocity: 127,
    channel: 3
}

function notePlay(note: number, activator: "noteon" | "noteoff") {
    // @ts-ignore
    output.send(activator, {...channelObj, note});
}

interface INotePlayNumber {
    noteName: number,
    duration?: number
}
// @ts-ignore
export async function playMidi(notes: INotePlay[], { signal }: any, duration?: number ) {
    
    let abort: boolean = false;
    const ac = new AbortController();
    // @ts-ignore
    const onAbort = (e: any) => {
        abort = true;
        ac.abort();
        abortNotes();
    };
    signal.addEventListener('abort', onAbort, { once: true });
  

    if (!duration && !notes.every(note => note.duration)) {
        throw new Error("Either set the global duration as the second parameter to 'playMidi' or indicate duration on each and every note")
    }
    const notesNames: INotePlayNumber[] = notes.map(note => { return {...note, noteName: Note.midi(note.noteName) as number } })

    function abortNotes () {
        for (const note of notesNames) {
            notePlay(note.noteName, "noteoff") 
        }
    }

    for (const note of notesNames) {
        if (abort) break;
        notePlay(note.noteName, "noteon")
        await timer(duration! || note.duration!, ac);
        notePlay(note.noteName, "noteoff") 
    }

}
