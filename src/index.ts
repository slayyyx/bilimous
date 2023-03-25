import { HttpContext, router } from '@http/context.js';
import { sendRouterView } from '@http/view-router.js';

// Port check
const PORT = parseInt(process.env.PORT ?? '3000', 10);
if (isNaN(PORT) || PORT < 1) {
    console.error('Invalid PORT');
    process.exit(1);
}

Bun.serve({
    port: PORT,
    lowMemoryMode: !!process.env.LOW_MEMORY_MODE,
    fetch(request) {
        const ctx = new HttpContext(request);
        if (!!process.env.RELOAD_ROUTERS_ON_REQUEST) {
            router.reload();
        }

        const matchedRoute = ctx.matchRouter;
        if (!matchedRoute) {
            return ctx.status(404).send('404 Not Found');
        } else {
            return sendRouterView(ctx, matchedRoute);
        }
    },
});
