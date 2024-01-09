import {
  DEFAULT_ASSEMBLER_OPTIONS,
  FormatterType,
  IAssemblerOptions,
} from '@idl/assembling/config';
import { IDL_LSP_LOG } from '@idl/logger';
import { IDL_TRANSLATION } from '@idl/translation';
import {
  MigrateCodeLSPPayload,
  MigrateCodeLSPResponse,
} from '@idl/vscode/events/messages';
import { LSP_WORKER_THREAD_MESSAGE_LOOKUP } from '@idl/workers/parsing';

import { ResolveFSPathAndCodeForURI } from '../../helpers/resolve-fspath-and-code-for-uri';
import { IDL_CLIENT_CONFIG } from '../../helpers/track-workspace-config';
import { IDL_LANGUAGE_SERVER_LOGGER } from '../../initialize-server';
import { IDL_INDEX } from '../initialize-document-manager';
import { SERVER_INITIALIZED } from '../is-initialized';

/**
 * Callback to migrate code to newer versions
 *
 * @param event The event from VSCode
 */
export const ON_MIGRATE_CODE = async (
  event: MigrateCodeLSPPayload
): Promise<MigrateCodeLSPResponse> => {
  await SERVER_INITIALIZED;
  try {
    // log information
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'info',
      content: ['Migrate code', event],
    });

    /**
     * Resolve the fspath to our cell and retrieve code
     */
    const info = await ResolveFSPathAndCodeForURI(event.uri);

    // return if nothing found
    if (info === undefined) {
      return undefined;
    }

    /**
     * Make default formatting config for info.fsPath
     *
     * Use settings from VSCode client as our default
     */
    const clientConfig: IAssemblerOptions<FormatterType> = {
      ...DEFAULT_ASSEMBLER_OPTIONS,
      ...IDL_CLIENT_CONFIG.code.formatting,
      style: IDL_CLIENT_CONFIG.code.formattingStyle,
    };

    /** Formatting config for info.fsPath */
    const config = IDL_INDEX.getConfigForFile(info.fsPath, clientConfig);

    /**
     * Formatted code
     */

    // do nothing
    if (!IDL_INDEX.isPROCode(info.fsPath)) {
      return undefined;
    }

    /**
     * Formatted code
     */
    const formatted =
      await IDL_INDEX.indexerPool.workerio.postAndReceiveMessage(
        IDL_INDEX.getWorkerID(info.fsPath),
        LSP_WORKER_THREAD_MESSAGE_LOOKUP.MIGRATE_CODE,
        {
          file: info.fsPath,
          code: info.code,
          formatting: config,
          migrationType: event.migrationType,
        }
      ).response;

    // check if we couldnt format
    if (formatted === undefined) {
      IDL_LANGUAGE_SERVER_LOGGER.log({
        log: IDL_LSP_LOG,
        type: 'warn',
        content: [
          IDL_TRANSLATION.lsp.events.onMigrateCodeProblemCode,
          info.fsPath,
        ],
        alert: IDL_TRANSLATION.lsp.events.onMigrateCodeProblemCode,
        alertMeta: {
          file: info.fsPath,
        },
      });
      return { text: undefined };
    }

    return { text: formatted };
  } catch (err) {
    IDL_LANGUAGE_SERVER_LOGGER.log({
      log: IDL_LSP_LOG,
      type: 'error',
      content: ['Error responding to code migration', err],
      alert: IDL_TRANSLATION.lsp.events.onMigrateCode,
    });
  }

  return { text: undefined };
};
