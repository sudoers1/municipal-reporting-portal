import { auth } from '@/lib/auth';
import { Client } from 'pg';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const userId = session.user.id;

  const encoder = new TextEncoder();
  let client: Client;
  let heartbeat: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      return new Promise<void>(async (resolve, reject) => {
        try {
          client = new Client({
            connectionString: process.env.DATABASE_URL_UNPOOL,
            ssl: { rejectUnauthorized: false },
          });

          await client.connect();
          await client.query('LISTEN new_notification');

          console.log('[SSE] Connected and listening for userId:', userId);

          client.on('notification', (msg) => {
            if (!msg.payload) return;
            try {
              const payload = JSON.parse(msg.payload);
              if (payload.user_id !== userId) return;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
              );
            } catch {
              // ignore
            }
          });

          client.on('error', (err) => {
            console.error('[SSE] Postgres error:', err);
            clearInterval(heartbeat);
            controller.close();
            reject(err);
          });

          heartbeat = setInterval(() => {
            try {
              controller.enqueue(encoder.encode(': heartbeat\n\n'));
            } catch {
              clearInterval(heartbeat);
            }
          }, 30_000);

          resolve();
        } catch (err) {
          console.error('[SSE] Failed to connect:', err);
          reject(err);
        }
      });
    },

    cancel() {
      console.log('[SSE] Client disconnected');
      clearInterval(heartbeat);
      client?.query('UNLISTEN new_notification').finally(() => client?.end());
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}