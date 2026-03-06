import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

interface AvatarCropModalProps {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
  loading?: boolean;
}

export default function AvatarCropModal({ imageSrc, onCancel, onConfirm, loading }: AvatarCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
    if (blob) onConfirm(blob);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-bg-card rounded-lg p-6 mx-4" style={{ maxWidth: 360, width: '100%' }}>
        <h3 className="text-lg text-white font-semibold mb-4">Crop Avatar</h3>

        <div className="relative rounded-lg overflow-hidden" style={{ height: 280, background: '#1A1D1D' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              cropAreaStyle: { border: '2px solid #24EE89' },
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs text-txt-muted">-</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-brand"
          />
          <span className="text-xs text-txt-muted">+</span>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-12 rounded-lg border border-divider bg-transparent text-white text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-lg border-none text-black text-sm font-extrabold cursor-pointer"
            style={{
              background: 'linear-gradient(90deg, #24EE89, #9FE871)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Canvas-based crop utility */
async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = url;
  });
}
