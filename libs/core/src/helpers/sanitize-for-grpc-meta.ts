export function sanitizeForGrpcMeta(value: any): string {
  const raw = typeof value === 'string' ? value : JSON.stringify(value);

  // Normaliza Unicode y elimina marcas diacríticas (á -> a)
  const normalized =
    typeof raw.normalize === 'function'
      ? raw.normalize('NFKD').replace(/\p{M}/gu, '')
      : raw;

  // Quita caracteres de control y deja sólo ASCII imprimible (0x20..0x7E)
  const asciiPrintable = normalized.replace(/[^\x20-\x7E]/g, '');

  // Compacta espacios múltiples y trim
  return asciiPrintable.replace(/\s+/g, ' ').trim();
}
