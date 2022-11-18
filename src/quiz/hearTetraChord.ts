
import { Scale } from "@tonaljs/scale";
import { get_random_note_limit_single_accidental, allScaleTypes, getScale, getScaleNotes, transposeToAscending } from "../utils";
import { IQuiz, Quiz } from "../quiz-types";
import { AudioQuizBase } from "./quizBase/audioQuizBase";

export const HearTetraChord: Quiz = class extends AudioQuizBase implements IQuiz {
  verifyOptions(scaleTypes: string[]): boolean {
    return scaleTypes.every((scaleType) => allScaleTypes.includes(scaleType));
  }

  randomNote;
  randomScale;
  randomTetraChord;
  scaleTetraChords;
  audio: { noteName: string; duration: number }[]; 

  private prepareAudio() {
   
    return this.randomTetraChord
    .map(n => n + "4")
    .map(transposeToAscending)
    .shuffleArray()
    .map(note => { return { noteName: note, duration: 500 } })
  }

  constructor(scaleTypes: Readonly<string[]>) {
    super(scaleTypes);
    this.randomNote = get_random_note_limit_single_accidental();

    const scales: Scale[] = scaleTypes.map(scaleType => 
      getScale(this.randomNote, scaleType)
    );

    this.randomScale = scales.randomItem();
    this.randomTetraChord = getScaleNotes(this.randomScale).slice(0,4);
    this.scaleTetraChords = scales.map(scale => getScaleNotes(scale).slice(0,4)).shuffleArray();  

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

  answer(guess: string): Readonly<[boolean, string]> {
    const answer = this.randomTetraChord.commaSequence();
    return [answer === guess, answer];
  }

  getAudio() {
    return this.audio;
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
