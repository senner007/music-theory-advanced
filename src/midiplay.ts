import easymidi, { Note as INote } from 'easymidi';
import { Note } from "@tonaljs/tonal";

export interface INotePlay {
    noteName: string,
    duration: number;
}

var output = new easymidi.Output('Microsoft GS Wavetable Synth');

const timer = async (time: number, { signal }: AbortController) => {
    return new Promise((res) => {
        let timer: any;
        const onAbort = () => {
            clearTimeout(timer);
            res(0);
        };
        timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); res(0) } , time)
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
        signal.removeEventListener('abort', onAbort);
    };
    signal.addEventListener('abort', onAbort, { once: true });

    const notesNames = notes.map(note => { return { ...note, noteNumber: Note.midi(note.noteName) as number } })

    function abortNotes() {
        for (const note of notesNames) {
            notePlay(note.noteNumber, "noteoff")
        }
    }

    for (const note of notesNames) {
        if (abort) break;
        notePlay(note.noteNumber, "noteon")
        await timer(note.duration, ac);
        notePlay(note.noteNumber, "noteoff")
    }
}
