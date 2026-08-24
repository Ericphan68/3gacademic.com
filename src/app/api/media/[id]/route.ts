import { prisma } from '@/server/db';

// Phục vụ ảnh đã tải lên (lưu trong DB). Ảnh là bất biến nên cache dài hạn.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const image = await prisma.imageBlob.findUnique({
      where: { id },
      select: { mimeType: true, data: true },
    });
    if (!image) return new Response('Not found', { status: 404 });

    const body = new Uint8Array(image.data);
    return new Response(body, {
      headers: {
        'Content-Type': image.mimeType,
        'Content-Length': String(body.byteLength),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Error', { status: 500 });
  }
}
