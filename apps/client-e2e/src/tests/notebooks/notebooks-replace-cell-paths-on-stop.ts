import { GetExtensionPath, Sleep } from '@idl/shared';
import { OpenNotebookInVSCode, VSCODE_COMMANDS } from '@idl/vscode/shared';
import expect from 'expect';
import { readFileSync } from 'fs';
import * as vscode from 'vscode';

import { RunnerFunction } from '../runner.interface';

/**
 * Verifies we replace paths when we stop
 */
export const NotebooksReplaceCellPathsOnStop: RunnerFunction = async (init) => {
  const nbUri = GetExtensionPath(
    'idl/test/client-e2e/notebooks/replace-paths/on-stop.idlnb'
  );

  const expectedUri = GetExtensionPath(
    'idl/test/client-e2e/notebooks/replace-paths/on-stop-results.idlnb'
  );

  // open notebook
  const nb = await OpenNotebookInVSCode(nbUri, true);

  // short pause to parse
  await Sleep(500);

  // run all cells
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_RUN_ALL);

  // save to disk
  await nb.save();

  // get the code we should expect, independent of line ending
  const actual = readFileSync(nbUri, { encoding: 'utf-8' }).split(/\r?\n/gim);

  // get the code we should expect, independent of line ending
  const expected = readFileSync(expectedUri, { encoding: 'utf-8' }).split(
    /\r?\n/gim
  );

  // verify the content matches what we should have
  expect(expected).toEqual(actual);

  // run all cells
  await vscode.commands.executeCommand(VSCODE_COMMANDS.NOTEBOOK_CLEAR_OUTPUTS);

  // save to disk
  await nb.save();

  // close notebook
  await vscode.commands.executeCommand(VSCODE_COMMANDS.CLOSE_EDITOR);

  // pause momentarily
  await Sleep(100);

  // verify we cleaned up
  expect(vscode.window.activeNotebookEditor).toBeUndefined();
};