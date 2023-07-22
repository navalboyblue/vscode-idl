import { LogManager } from '@idl/logger';
import { Parser } from '@idl/parser';
import { IDLIndex } from '@idl/parsing/index';
import { Tokenizer } from '@idl/parsing/tokenizer';
import { TimeItAsync } from '@idl/shared';
import * as glob from 'fast-glob';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as progressBar from 'progress';

import { IParsingPerformanceRunnerOpts } from './options.interface';

interface IProblem {
  line: number;
  text: string;
  erased: string;
}

/**
 * Parses all code in a folder to check for problems with parsing or syntax
 */
export async function ParsingPerformanceRunner(
  folder: string,
  options: IParsingPerformanceRunnerOpts
): Promise<void> {
  // create our index
  const index = new IDLIndex(
    new LogManager({
      alert: () => {
        // do nothing
      },
    })
  );

  // search for files
  const files = await glob('**/**.pro', { cwd: folder });
  if (files.length === 0) {
    throw new Error(`No ".pro" files found in "${folder}"`);
  }

  // init array for code
  const code: string[][] = [];
  let lines = 0;

  // read all files
  const bar = new progressBar('Reading files [:bar] :etas :title :file', {
    total: files.length,
    width: 25,
  });
  for (let i = 0; i < files.length; i++) {
    bar.tick({
      title: `${i + 1}/${files.length}`,
      file: files[i],
    });
    const read = readFileSync(join(folder, files[i]), 'utf-8').split('\n');
    lines += read.length;
    code.push(read);
  }
  bar.complete = true;
  bar.render();

  const offset = 0;

  /**
   * get number of files we process
   */
  const nFiles = code.length * options.multiplier;

  // process all files
  const t2 = await TimeItAsync(async () => {
    const bar2 = new progressBar(
      `Extracting tokens via "${options.method}" [:bar] :etas :title :file`,
      {
        total: nFiles,
        width: 25,
      }
    );
    for (let j = 0; j < nFiles; j++) {
      const canTick = true;

      const i = Math.floor(j / options.multiplier);

      switch (options.method) {
        case 'tokenizer':
          Tokenizer(code[i]);
          break;
        case 'parser':
          Parser(code[i], options);
          break;
        case 'index-single':
          // index and make up file
          await index.getParsedProCode(`${j}.pro`, code[i], {
            postProcess: false,
          });
          break;
        default:
          throw new Error(`Not implemented: ${options.method}`);
      }

      // tick the bar if we can
      if (canTick) {
        bar2.tick({
          title: `${j + 1}/${nFiles}`,
          file: files[j],
        });
      }
    }

    // bar2.tick({
    //   title: `Indexing`,
    //   file: `workspace with threads`,
    // });
    // await index.indexWorkspace(folder, false);

    bar2.complete = true;
    bar2.render();
  });
  console.log(``);
  console.log(`  Processing time (ms): ${t2}`);
  console.log(`  Processing rate (lines/s): ${lines / ((t2 - offset) / 1000)}`);
  console.log(``);
}
