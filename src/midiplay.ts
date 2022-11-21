import easymidi, { Note as INote } from 'easymidi';
import { Note } from "@tonaljs/tonal";

export interface INotePlay {
    noteNames: string[],
    duration: number;
}

var output = new easymidi.Output('Microsoft GS Wavetable Synth');

const timer = async (time: number, { signal }: AbortController) => {
    return new Promise((res) => {
        // console.log("new timer id")
        let timer: any;
        const onAbort = (_: any) => {
            // console.log("on abort")
            clearTimeout(timer);
            signal.removeEventListener('abort', onAbort);
            return res(0);
        };
        signal.addEventListener('abort', onAbort, { once: true });
        timer = setTimeout(() => {  console.log("stop"); res(0) } , time)
    });
}

const channelObj: INote = {
    note: 0,
    velocity: 127,
    channel: 3
}

function notePlay(note: number, activator: "noteon" | "noteoff") {
    // @ts-ignore
    output.send(activator, { ...channelObj, note });
}

export async function playMidi(notes: INotePlay[], { signal }: any): Promise<void> {

    let abort: boolean = false;
    const ac = new AbortController();
    const onAbort = () => {
   
        abort = true;
        ac.abort();
        abortNotes();
        
    };
    signal.addEventListener('abort', onAbort, { once: true });

    const notesNames = notes.map(note => { return { ...note, noteNumbers: note.noteNames.map(noteName => Note.midi(noteName) as number) } })

    function abortNotes() {
        signal.removeEventListener('abort', onAbort);
        for (const note of notesNames) {
            for (const noteNumber of note.noteNumbers) {
                notePlay(noteNumber, "noteoff")
            }
        }
    }

    for (const note of notesNames) {
        if (abort) break;
        for (const noteNumber of note.noteNumbers) {
            notePlay(noteNumber, "noteon")
        }
        console.log("call timer")
        await timer(note.duration, ac);
        console.log("noteoff")
        for (const noteNumber of note.noteNumbers) {
            notePlay(noteNumber, "noteoff")
        }
    }
}
