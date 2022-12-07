import { expect, vi, describe, test, afterEach, Mock } from "vitest";
import chalk from "chalk";
import { MathFloor } from "../src/random-funcs";
import { SingBassLines } from "../src/quiz/singBassLines";
import { LogTable } from "../src/logger/logTable";
import { LogAsync } from "../src/logger/logAsync";
import { SolfegeMelody } from "../src/solfege";
LogAsync;

describe("Test SingBassLines quiz", () => { // put in mocks folder
  // Mock the MathFloor method to remove randomness
  vi.mock("../src/random-funcs", () => {
    return {
      MathFloor: vi.fn(),
    };
  });

  vi.mock("../src/logger/logTable", () => {
    const LogTableMock = vi.fn();
    (LogTableMock as any).write = vi.fn();

    return { LogTable: LogTableMock };
  });

  vi.mock("../src/midiplay", () => {
    return {
      playMidi: vi.fn(),
    };
  });

  vi.mock("../src/logger/logAsync", () => {
    const LogAsyncMock = vi.fn();
    (LogAsyncMock as any).questionInListIndexedGlobalKeyHook = vi.fn();

    return { LogAsync: LogAsyncMock };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const quizHeadOutput = [
    `${chalk.underline("Diatonic")} progression bass line in key of ${chalk.underline("Cb Major")}`,
    `${chalk.underline("Diatonic")} progression bass line in key of ${chalk.underline("D Minor")}`,
    `${chalk.underline("Diatonic")} progression bass line in key of ${chalk.underline("E# Minor")}`,
  ];

  const solfegeMelodies = [
    {
      melody: [
        { noteNames: ['Cb4'], duration: 1 },
        { noteNames: ['Fb3'], duration: 1 },
        { noteNames: ['Gb3'], duration: 1 },
        { noteNames: ['Cb4'], duration: 1 }
      ]
    },
    {
      melody: [
        { noteNames: ['D3'], duration: 1 },
        { noteNames: ['G3'], duration: 1 },
        { noteNames: ['A3'], duration: 1 },
        { noteNames: ['D3'], duration: 1 }
      ]
    },
    {
      melody: [
        { noteNames: ['E#3'], duration: 1 },
        { noteNames: ['A#3'], duration: 1 },
        { noteNames: ['B#3'], duration: 1 },
        { noteNames: ['E#3'], duration: 1 }
      ]
    },
  ];

  test.each([0, 1, 2])("should generate quiz head text", (mathFloorReturnValue: number) => {
    (<Mock>MathFloor).mockReturnValue(mathFloorReturnValue);
    const quiz = new SingBassLines(SingBassLines.meta().getAllOptions);
    expect(MathFloor).toBeCalledTimes(3);
    expect(quiz.quizHead).toEqual([quizHeadOutput[mathFloorReturnValue]]);
  });

  test.each([0, 1, 2])("should generate solfege degrees to LogTable", async (mathFloorReturnValue: number) => {
    (<Mock>MathFloor).mockReturnValue(mathFloorReturnValue);
    (<Mock>LogTable.write).mockImplementation((solfege: SolfegeMelody) => {
      expect(solfege.getMelody).toEqual(solfegeMelodies[mathFloorReturnValue].melody);
    });
    const quiz = new SingBassLines(SingBassLines.meta().getAllOptions);
    await quiz.execute();
    expect(LogTable.write).toBeCalledTimes(1);
  });
});
