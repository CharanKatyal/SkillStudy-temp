import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { ZoomIn, ZoomOut, RotateCcw, Check, Move, Sparkles } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (compressedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Live Canvas Draw Preview
  useEffect(() => {
    if (!imgElement || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 240;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save context for circular or square mask
    ctx.save();

    // Scale to cover square viewport
    const scale = Math.max(size / imgElement.width, size / imgElement.height) * zoom;
    const drawWidth = imgElement.width * scale;
    const drawHeight = imgElement.height * scale;

    const drawX = (size - drawWidth) / 2 + offset.x;
    const drawY = (size - drawHeight) / 2 + offset.y;

    ctx.drawImage(imgElement, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }, [imgElement, zoom, offset]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!imgElement) return;

    // Render high-quality compressed 256x256 output
    const outputCanvas = document.createElement('canvas');
    const outSize = 256;
    outputCanvas.width = outSize;
    outputCanvas.height = outSize;

    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    // Image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const scale = (Math.max(240 / imgElement.width, 240 / imgElement.height) * zoom) * (outSize / 240);
    const drawWidth = imgElement.width * scale;
    const drawHeight = imgElement.height * scale;

    const drawX = (outSize - drawWidth) / 2 + offset.x * (outSize / 240);
    const drawY = (outSize - drawHeight) / 2 + offset.y * (outSize / 240);

    ctx.drawImage(imgElement, drawX, drawY, drawWidth, drawHeight);

    // Compress to efficient WebP (or JPEG fallback) at 85% quality (~15KB)
    let dataUrl = '';
    try {
      dataUrl = outputCanvas.toDataURL('image/webp', 0.85);
    } catch {
      dataUrl = outputCanvas.toDataURL('image/jpeg', 0.85);
    }

    onCropComplete(dataUrl);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Position & Crop Profile Photo"
      maxWidth="md"
    >
      <div className="space-y-4 text-slate-800 dark:text-slate-200">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Drag to reposition and use the zoom slider to select a perfect square profile photo. It will be compressed for offline storage.
        </p>

        {/* Interactive Cropper Window */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-[240px] h-[240px] rounded-2xl overflow-hidden shadow-2xl relative border-2 border-dashed border-brand-500 cursor-grab active:cursor-grabbing select-none bg-slate-900 flex items-center justify-center"
          >
            <canvas
              ref={previewCanvasRef}
              className="w-[240px] h-[240px] rounded-2xl pointer-events-none"
            />
            {/* Guide overlay */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30 pointer-events-none flex items-center justify-center">
              <div className="w-full h-full rounded-full ring-2 ring-white/40 border border-brand-500/50" />
            </div>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <Move className="w-3 h-3" />
            <span>Drag image to center</span>
          </span>
        </div>

        {/* Zoom & Adjustment Controls */}
        <div className="space-y-2 bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
            <span className="flex items-center gap-1.5">
              <ZoomIn className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Zoom Scale</span>
            </span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>

          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset position</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Apply &amp; Crop</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
