/**
 * Exporta el SVG de la pizarra como PNG descargable.
 * El watermark SVG puede no renderizarse si la fuente Caveat no está embebida,
 * por eso se redibuja directamente sobre el canvas como fallback.
 */
export async function exportPng(svgEl: SVGSVGElement, filename?: string): Promise<void> {
  const rect = svgEl.getBoundingClientRect();
  const width = rect.width > 0 ? rect.width : 800;
  const height = rect.height > 0 ? rect.height : 600;

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(blob);

  try {
    const img = await loadImage(svgUrl);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas');

    ctx.drawImage(img, 0, 0, width, height);

    // Watermark canvas: garantiza visibilidad aunque la fuente no esté embebida en el SVG
    ctx.font = '14px "Caveat Variable", Caveat, cursive';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('minigolclub.com', width - 8, height - 8);

    await downloadCanvas(canvas, filename ?? 'pizarra-minigol.png');
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Error al cargar la imagen SVG para exportar'));
    img.src = src;
  });
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('No se pudo generar el blob PNG'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
