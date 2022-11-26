// @ts-ignore
import AsciiTable from "ascii-table";
import { SolfegeMelody, Syllable } from "../solfege";

interface ITableObject {
  [key: string]: Syllable[];
}

function createTableObject(solfege: SolfegeMelody) {
  const ambitus = solfege.ambitus();

  const obj: ITableObject = {};
  for (let i = 0; i < ambitus + 1; i++) {
    obj[i] = [...Array(solfege.duration)]
  }
  return obj;
}

function fillRows(solfege: SolfegeMelody, tableObject: ITableObject) {
  let totalDuration: number = 0;

  solfege.getMelody.forEach((melodyNote) => {
    melodyNote.noteNames.forEach((n) => {
      const pitchRow: number = solfege.distance_from_lowest(n);
      const pitchSyllable = solfege.syllable(n);
      tableObject[pitchRow][totalDuration] = pitchSyllable;
    });

    totalDuration = totalDuration + melodyNote.duration;
  });

  return Object.values(tableObject).reverse();
}

function headingInMeasures(solfege: SolfegeMelody) {
  return [...Array(solfege.duration).keys()]
    .map((h) => (h % 4 === 0 ? "0" + (h / 4 + 1) : "  "))
    .map((h, index) => (index === 0 ? "01" : h));
}

export class LogTable {
  static write(solfege: SolfegeMelody) {
    const tableObject = createTableObject(solfege);
    const rows = fillRows(solfege, tableObject);

    var table = AsciiTable.factory({
      heading: headingInMeasures(solfege),
      rows: rows,
    });

    console.log(table.toString());
  }
}
