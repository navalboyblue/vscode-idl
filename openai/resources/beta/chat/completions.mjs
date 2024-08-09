// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../resource.mjs";
import { ChatCompletionRunner } from "../../../lib/ChatCompletionRunner.mjs";
export { ChatCompletionRunner } from "../../../lib/ChatCompletionRunner.mjs";
import { ChatCompletionStreamingRunner, } from "../../../lib/ChatCompletionStreamingRunner.mjs";
export { ChatCompletionStreamingRunner, } from "../../../lib/ChatCompletionStreamingRunner.mjs";
export { ParsingFunction, ParsingToolFunction, } from "../../../lib/RunnableFunction.mjs";
import { ChatCompletionStream } from "../../../lib/ChatCompletionStream.mjs";
import { parseChatCompletion, validateInputTools } from "../../../lib/parser.mjs";
export { ChatCompletionStream } from "../../../lib/ChatCompletionStream.mjs";
export class Completions extends APIResource {
    async parse(body, options) {
        validateInputTools(body.tools);
        const completion = await this._client.chat.completions.create(body, {
            ...options,
            headers: {
                ...options?.headers,
                'X-Stainless-Helper-Method': 'beta.chat.completions.parse',
            },
        });
        return parseChatCompletion(completion, body);
    }
    runFunctions(body, options) {
        if (body.stream) {
            return ChatCompletionStreamingRunner.runFunctions(this._client, body, options);
        }
        return ChatCompletionRunner.runFunctions(this._client, body, options);
    }
    runTools(body, options) {
        if (body.stream) {
            return ChatCompletionStreamingRunner.runTools(this._client, body, options);
        }
        return ChatCompletionRunner.runTools(this._client, body, options);
    }
    /**
     * Creates a chat completion stream
     */
    stream(body, options) {
        return ChatCompletionStream.createChatCompletion(this._client, body, options);
    }
}
//# sourceMappingURL=completions.mjs.map