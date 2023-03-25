import { type HttpContext } from '@http/context.js';
import { type MatchedRoute } from 'bun';

interface RouterView {
    default: (ctx: HttpContext) => Promise<Response>;
}

export const sendRouterView = async (ctx: HttpContext, r: MatchedRoute): Promise<Response> => {
    const file: RouterView | undefined = await import.meta.require(r.filePath);

    if (!file) {
        return ctx.status(500).send('Couldn\'t import router ' + r.filePath);
    }
    return file.default(ctx);
}
