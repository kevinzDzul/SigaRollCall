import { Buffer } from 'buffer';

export async function fetchImageToB64(url: string) {
  const res = await fetch(`file://${url}`);
  if (!res.ok) {throw new Error('🥶 ' + res.status);}
  const ab = await res.arrayBuffer();
  return Buffer.from(ab).toString('base64');
}

//const b64 = await fetchImageToB64('https://i.imgur.com/4AiXzf8.jpg');
//const dataUri = 'data:image/jpeg;base64,' + b64;
