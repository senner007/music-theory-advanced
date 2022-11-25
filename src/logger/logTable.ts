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
    obj[i] = Array.from({ length: solfege.duration });
  }
  return obj;
}

function fillTableObject(solfege: SolfegeMelody, tableObject: ITableObject) {
  let totalDuration: number = 0;

  solfege.getMelody.forEach((melodyNote) => {
    const pitchRow = solfege.distance_from_lowest(melodyNote.note);
    tableObject[pitchRow][totalDuration] = solfege.syllable(melodyNote.note);
    totalDuration = totalDuration + melodyNote.duration;
  });

  return Object.values(tableObject).reverse();
}

export class LogTable {
  static write(solfege: SolfegeMelody) {
    const tableObject = createTableObject(solfege);
    const rows = fillTableObject(solfege, tableObject);

    var table = AsciiTable.factory({
      heading: [...Array(solfege.duration).keys()]
        .map(h => h % 4 === 0 ? "0" + (h/4 + 1) : "  ")
        .map((h, index) => index === 0 ? "01" : h),
      rows: rows,
    });

    console.log(table.toString());
  }
}
