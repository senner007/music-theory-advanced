
import { LogError } from "../dev-utils";
import { Progression, romanNumeralsDict, to_roman_numeral } from "../harmonicProgressions";
import { AccidentalsAllOctaves, verifyNote } from "../utils";

// TODO : Refactor me!
export function JSONContentVerify(progressions: Progression[]) {
    const progressionsTemp: string[] = [];
    const notesSingleAccidentalAllOctaves = AccidentalsAllOctaves();
  
    progressions.forEach((progression, progressionIndex) => {
      const chordsString = "chords: " + progression.chords.join(",") + " bass: " + progression.bass.join(",");
  
      progression.bass.forEach(bassNote => {
        if (!verifyNote(notesSingleAccidentalAllOctaves, bassNote)) {
            LogError(
                `Json content error at:
        Description : ${progression.description} progression : ${chordsString}
        Invalid bass note at progression index : ${progressionIndex}`
              );
        }
      });
  
      if (progression.chords.length !== progression.bass.length) {
        LogError(
          `Json content error at: 
  Description : ${progression.description} progression : ${chordsString}
  Progression chords and bass length don't match at progression index : ${progressionIndex}`
        );
      }
  
      if (progressionsTemp.includes(chordsString)) {
        LogError(
          `Json content error at: 
  Description : ${progression.description} progression : ${chordsString}
  Progression is not unique. Similar to progression at index: ${progressionsTemp.indexOf(chordsString)}`
        );
      }
      progressionsTemp.push(chordsString);
  
      progression.chords.forEach((chord, chordIndex) => {
        if (!(chord in romanNumeralsDict || to_roman_numeral(chord) in romanNumeralsDict)) {
          LogError(
            `Json content error at: 
  Index : ${chordIndex} chord : ${chord}
  Roman numeral not in dictionary`
          );
        }
      });
    });
  }
  