import { type HttpContext } from '@http/context.js';
import { renderToReadableStream } from 'react-dom/server';

const About = () => {
    return (
        <h1>
            Hello World!
        </h1>
    )
}

export default async function (ctx: HttpContext): Promise<Response> {
    const stream = await renderToReadableStream(<About />);
    return ctx.status(200)
        .setHeader('Content-Type', 'text/html')
        .send(stream);
}
