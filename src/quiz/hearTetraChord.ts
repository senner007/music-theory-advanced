
import { Scale } from "@tonaljs/scale";
import { get_random_note_common_accidental, allScaleTypes, get_scale, get_scale_notes, transpose_to_ascending } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { ListeningQuizBase } from "./quizBase/listeningQuizBase";

export const HearTetraChord: Quiz<string> = class extends ListeningQuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  randomNote;
  randomScale;
  randomTetraChord;
  scaleTetraChords;
  octaveAudio = 4;
  audio; 

  private prepareAudio() {
   
    return this.randomTetraChord
    .toOctave(this.octaveAudio)
    .map(transpose_to_ascending)
    .shuffleArray()
    .map(note => { return { noteNames: [note], duration: 500, channel : 1 } })
  }

  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.randomNote = get_random_note_common_accidental();

    const scales: Scale[] = scaleTypes.map(scaleType => 
      get_scale(this.randomNote, scaleType)
    );

    this.randomScale = scales.randomItem();
    this.randomTetraChord = get_scale_notes(this.randomScale).slice(0,4);
    this.scaleTetraChords = scales.map(scale => get_scale_notes(scale).slice(0,4)).shuffleArray();  

    this.audio = this.prepareAudio();
  }

  get quizHead() {
    return [];
  }

  get questionOptions() {
    return this.scaleTetraChords.map(st => st.commaSequence());
  }

  get question() {
    return "Which is the correct spelling?";
  }

  answer(): string {
    return this.randomTetraChord.commaSequence();
  }

  getAudio() {
    return [ { audio : this.audio, keyboardKey : "space", onInit : true, channel : 1, message: "play audio"} ]
  }

  static meta() {
    return {
      get getAllOptions() {
        return [
          "major",
          "aeolian",
          "phrygian",
          "lydian",
          "altered",
        ];
      },
      name: "Hear tetrachord",
      description: "Choose the correct spelling after listening to the tetrachord",
    };
  }
};
