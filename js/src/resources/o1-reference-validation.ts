import { ValidationError } from '@runapi.ai/core';

const O1_MODEL = 'kling-o1';
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov']);
const BLOCKED_IP_CIDRS = [
  '0.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '172.16.0.0/12',
  '192.0.0.0/24',
  '192.0.2.0/24',
  '192.88.99.0/24',
  '192.168.0.0/16',
  '198.18.0.0/15',
  '198.51.100.0/24',
  '203.0.113.0/24',
  '224.0.0.0/4',
  '240.0.0.0/4',
  '255.255.255.255/32',
  '::/128',
  '::1/128',
  '64:ff9b::/96',
  '64:ff9b:1::/48',
  '100::/64',
  '2001::/32',
  '2001:2::/48',
  '2001:db8::/32',
  '2002::/16',
  '3fff::/20',
  'fc00::/7',
  'fe80::/10',
  'ff00::/8',
] as const;

type ParsedIp = { bits: 32 | 128; value: bigint };

const BLOCKED_IP_NETWORKS = BLOCKED_IP_CIDRS.map((cidr) => {
  const [address, prefixText] = cidr.split('/');
  const parsed = parseIpLiteral(address);
  if (!parsed) throw new Error('Invalid blocked IP range: ' + cidr);
  return { ...parsed, prefix: Number(prefixText) };
});

export function validateKlingO1References(body: Record<string, unknown>): void {
  if (body.model !== O1_MODEL) return;
  if (body.enable_sound === true) {
    throw new ValidationError(`enable_sound is not supported by ${O1_MODEL}`);
  }

  validateFrameUrls(body);
  if (typeof body.prompt !== 'string') {
    throw new ValidationError('prompt must be a string');
  }
  const prompt = body.prompt;
  const referenceImages = Array.isArray(body.reference_image_urls)
    ? body.reference_image_urls
    : [];
  if ('reference_video_url' in body && typeof body.reference_video_url !== 'string') {
    throw new ValidationError('reference_video_url must be a string');
  }
  const referenceVideoUrl = body.reference_video_url as string | undefined;
  if (
    present(body.last_frame_image_url) &&
    (referenceImages.length > 0 || present(referenceVideoUrl))
  ) {
    throw new ValidationError(
      'last_frame_image_url cannot be combined with reference_image_urls or reference_video_url'
    );
  }

  if (referenceVideoUrl && referenceImages.length > 4) {
    throw new ValidationError(
      'reference_image_urls must contain at most 4 items when reference_video_url is present'
    );
  }

  validateReferenceImages(prompt, referenceImages);
  validateReferenceVideo(body, prompt, referenceVideoUrl);
}

function validateFrameUrls(body: Record<string, unknown>): void {
  for (const field of ['first_frame_image_url', 'last_frame_image_url']) {
    const value = body[field];
    if (typeof value !== 'string' || value.length === 0) continue;
    if (!isPublicHttpUrl(value)) {
      throw new ValidationError(`${field} must be a public HTTP or HTTPS URL`);
    }
    if (!IMAGE_EXTENSIONS.has(urlExtension(value))) {
      throw new ValidationError(`${field} must use a JPG, JPEG, or PNG URL`);
    }
  }
}

function validateReferenceImages(prompt: string, urls: unknown[]): void {
  urls.forEach((url, index) => {
    if (typeof url !== 'string') {
      throw new ValidationError(`reference_image_urls[${index}] must be a string`);
    }
    if (!isPublicHttpUrl(url)) {
      throw new ValidationError(
        `reference_image_urls[${index}] must be a public HTTP or HTTPS URL`
      );
    }
    if (!IMAGE_EXTENSIONS.has(urlExtension(url))) {
      throw new ValidationError(
        `reference_image_urls[${index}] must use a JPG, JPEG, or PNG URL`
      );
    }
    const marker = `<<<image_${index + 1}>>>`;
    if (!prompt.includes(marker)) {
      throw new ValidationError(
        `prompt must reference reference_image_urls[${index}] as ${marker}`
      );
    }
  });

  for (const match of prompt.matchAll(/<<<image_(\d+)>>>/g)) {
    const index = Number(match[1]);
    if (index < 1 || index > urls.length) {
      throw new ValidationError(`prompt references missing image_${index}`);
    }
  }
}

function validateReferenceVideo(
  body: Record<string, unknown>,
  prompt: string,
  referenceVideoUrl: string | undefined
): void {
  if (!referenceVideoUrl) {
    if ('reference_video_type' in body) {
      throw new ValidationError('reference_video_type requires reference_video_url');
    }
    if ('preserve_reference_video_audio' in body) {
      throw new ValidationError('preserve_reference_video_audio requires reference_video_url');
    }
    const missingMarker = prompt.match(/<<<video_([^>]+)>>>/);
    if (missingMarker) {
      throw new ValidationError(`prompt references missing video_${missingMarker[1]}`);
    }
    return;
  }

  if (!isPublicHttpUrl(referenceVideoUrl)) {
    throw new ValidationError('reference_video_url must be a public HTTP or HTTPS URL');
  }
  if (!VIDEO_EXTENSIONS.has(urlExtension(referenceVideoUrl))) {
    throw new ValidationError('reference_video_url must use an MP4 or MOV URL');
  }
  if (!prompt.includes('<<<video_1>>>')) {
    throw new ValidationError('prompt must reference reference_video_url as <<<video_1>>>');
  }
  for (const match of prompt.matchAll(/<<<video_([^>]+)>>>/g)) {
    if (match[1] !== '1') {
      throw new ValidationError('prompt may only reference video_1');
    }
  }

  const referenceVideoType = body.reference_video_type ?? 'base';
  if (
    referenceVideoType === 'base' &&
    (present(body.first_frame_image_url) || present(body.last_frame_image_url))
  ) {
    throw new ValidationError(
      'reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url'
    );
  }
}

function present(value: unknown): boolean {
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null;
}

function urlExtension(value: string): string {
  try {
    const path = new URL(value).pathname;
    const dot = path.lastIndexOf('.');
    return dot >= 0 ? path.slice(dot).toLowerCase() : '';
  } catch {
    return '';
  }
}

function isPublicHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname.length > 0 && url.username.length === 0 && url.password.length === 0 &&
      !isBlockedHost(url.hostname);
  } catch {
    return false;
  }
}

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost')) return true;

  const parsed = parseIpLiteral(host);
  if (!parsed) return false;

  return BLOCKED_IP_NETWORKS.some((network) => {
    if (network.bits !== parsed.bits) return false;
    const shift = BigInt(parsed.bits - network.prefix);
    return (parsed.value >> shift) === (network.value >> shift);
  });
}

function parseIpLiteral(value: string): ParsedIp | undefined {
  const ipv4 = parseIpv4(value);
  if (ipv4 !== undefined) return { bits: 32, value: ipv4 };
  if (!value.includes(':')) return undefined;

  const halves = value.toLowerCase().split('::');
  if (halves.length > 2) return undefined;
  const head = parseIpv6Half(halves[0]);
  const tail = parseIpv6Half(halves[1] ?? '');
  if (!head || !tail) return undefined;

  const compressed = halves.length === 2;
  const missing = 8 - head.length - tail.length;
  if ((!compressed && missing !== 0) || (compressed && missing < 1)) return undefined;

  const segments = [...head, ...Array<number>(missing).fill(0), ...tail];
  const address = segments.reduce((result, segment) => (result << 16n) | BigInt(segment), 0n);
  if ((address >> 32n) === 0xffffn) {
    return { bits: 32, value: address & 0xffffffffn };
  }
  return { bits: 128, value: address };
}

function parseIpv4(value: string): bigint | undefined {
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d+$/.test(part))) return undefined;
  const octets = parts.map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) return undefined;
  return octets.reduce((result, octet) => (result << 8n) | BigInt(octet), 0n);
}

function parseIpv6Half(value: string): number[] | undefined {
  if (value === '') return [];
  const parts = value.split(':');
  if (parts.some((part) => !/^[0-9a-f]{1,4}$/.test(part))) return undefined;
  return parts.map((part) => Number.parseInt(part, 16));
}
