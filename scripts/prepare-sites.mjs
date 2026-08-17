import { mkdir, writeFile } from 'node:fs/promises';

const worker = `const HTML_TOKEN = '__SITE_ORIGIN__';

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && request.headers.get('accept')?.includes('text/html')) {
      const fallback = new Request(new URL('/index.html', url.origin), request);
      response = await env.ASSETS.fetch(fallback);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const headers = new Headers(response.headers);
      headers.set('cache-control', 'no-cache');
      const html = (await response.text()).replaceAll(HTML_TOKEN, url.origin);
      return new Response(html, { status: response.status, headers });
    }

    return response;
  },
};
`;

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url), worker);
