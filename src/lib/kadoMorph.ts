export interface KadoColors {
  skin: string;
  hair: string;
  eye: string;
  accent: string;
}

export const DEFAULT_KADO_COLORS: KadoColors = {
  skin: '#c8845a',
  hair: '#1a0a00',
  eye: '#2d1b69',
  accent: '#dc2626',
};

export function extractKadoColors(img: HTMLImageElement): KadoColors {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return DEFAULT_KADO_COLORS;
  ctx.drawImage(img, 0, 0, 32, 32);
  const data = ctx.getImageData(0, 0, 32, 32).data;
  const buckets: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 40) * 40;
    const g = Math.round(data[i + 1] / 40) * 40;
    const b = Math.round(data[i + 2] / 40) * 40;
    if (data[i + 3] < 128) continue;
    const k = `${r},${g},${b}`;
    buckets[k] = (buckets[k] || 0) + 1;
  }
  const sorted = Object.entries(buckets)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => {
      const [r, g, b] = k.split(',').map(Number);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    });
  return {
    skin: sorted[0] || DEFAULT_KADO_COLORS.skin,
    hair: sorted[1] || DEFAULT_KADO_COLORS.hair,
    eye: sorted[2] || DEFAULT_KADO_COLORS.eye,
    accent: sorted[3] || DEFAULT_KADO_COLORS.accent,
  };
}

export function loadKadoFromFile(file: File): Promise<KadoColors> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve(extractKadoColors(img)); URL.revokeObjectURL(url); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(DEFAULT_KADO_COLORS); };
    img.src = url;
  });
}

export function autoTagContent(title: string, content: string): string[] {
  const text = (title + ' ' + content).toLowerCase();
  const rules: [RegExp, string][] = [
    [/music|track|beat|audio|wav|mp3|studio|lyria/, 'music'],
    [/game|level|enemy|asset|uasset|map|quest/, 'game-dev'],
    [/card|deck|kado|komics|comic|expansion/, 'kados'],
    [/npc|ai|sentient|agent|autonomous/, 'ai'],
    [/ghost|deleted|recovered|vault|phantom/, 'ghost-data'],
    [/hellskin|satan|hell|demonic|666/, 'hellskin'],
    [/horse|stable|lyria|big horse/, 'big-horse'],
    [/wasm|virtual|emulate|worker|pi/, 'wasm'],
    [/patent|legal|property|owner/, 'legal'],
    [/trash|bound|rubbish|discard/, 'trash-bound'],
    [/rupip|avatar|morph|kado/, 'rupivision'],
    [/code|script|inject|directive/, 'code'],
  ];
  const tags: string[] = [];
  for (const [regex, tag] of rules) {
    if (regex.test(text)) tags.push(tag);
  }
  return tags;
}
