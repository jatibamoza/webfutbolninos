import { useState } from 'preact/hooks';
import type { RefObject } from 'preact';
import { exportPng } from '../exportPng';

interface ExportButtonProps {
  svgRef: RefObject<SVGSVGElement>;
}

const CSS = `
.pizarra-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 8px 14px;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  outline-offset: 2px;
  transition: background 0.12s, opacity 0.12s;
}

.pizarra-export-btn:hover:not(:disabled) {
  background: #2563eb;
}

.pizarra-export-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.pizarra-export-btn:focus-visible {
  outline: 3px solid #fbbf24;
}
`;

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style={{ width: '18px', height: '18px', flexShrink: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function ExportButton({ svgRef }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleClick = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      await exportPng(svgRef.current);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <button
        type="button"
        class="pizarra-export-btn"
        aria-label="Exportar pizarra como PNG"
        disabled={exporting}
        onClick={handleClick}
      >
        <DownloadIcon />
        {exporting ? 'Exportando...' : 'Exportar PNG'}
      </button>
    </>
  );
}
