import { type MatchedRoute } from 'bun';
import { dirname, resolve } from 'node:path';

interface HttpContextState {
    status: number;
    statusText: string;
    headers: Headers;
}

/**
 * Bun filesystem router
 */
export const router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: resolve(dirname(Bun.fileURLToPath(new URL(import.meta.url))), '..', 'routers'),
});

/**
 * @class HttpContext
 */
export class HttpContext {
    /**
     * Http Context State
     */
    #state: HttpContextState = {
        'status': 200,
        'statusText': 'OK',
        'headers': new Headers(),
    };

    /**
     * @constructor
     * @param {Request} request Incoming request from Bun.serve
     */
    constructor(private request: Request) {}

    /**
     * Get Request#url as `URL` instance
     * @returns {URL}
     */
    get url(): URL {
        return new URL(this.request.url);
    }

    /**
     * Matched router
     * @returns {MatchedRoute?}
     */
    get matchRouter(): MatchedRoute | undefined {
        return router.match(this.request) ?? undefined;
    }

    /**
     * Set response status code
     * @param {number} code http response status code want to sent
     * @param {string} message http response status message
     * @returns {HttpContext}
     */
    status(code: number, message?: string): HttpContext {
        this.#state.status = code;
        if (message)
            this.#state.statusText = message;

        return this;
    }

    /**
     * Send response data
     * @param {BlobPart | BlobPart[] | FormData | ReadableStream} data Response body
     * @returns {Response}
     */
    send(data: BlobPart[] | BlobPart | FormData | ReadableStream): Response {
        return new Response(data, {
            status: this.#state.status,
            statusText: this.#state.statusText,
            headers: this.#state.headers,
        });
    }

    /**
     * Set response headers
     * @param {string} key Header key
     * @param {string | string[]} value Header value
     * @param {boolean} duplicate Duplicate mode
     * @returns {HttpContext}
     */
    setHeader(key: string, value: string | string[], duplicate: boolean = false): HttpContext {
        const add = (val: string) =>
            this.#state.headers[duplicate ? 'append' : 'set'](key, val);

        if (Array.isArray(value)) {
            for (const val of value) {
                add(val);
            }
        } else {
            add(value);
        }

        return this;
    }
}