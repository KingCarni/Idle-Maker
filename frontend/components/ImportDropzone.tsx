'use client';

import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import type { ImportedFile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImportDropzoneProps {
  onFiles: (files: ImportedFile[]) => void;
  compact?: boolean;
  className?: string;
}

const ACCEPTED = ['.json', '.md', '.png', '.jpg', '.jpeg', '.webp', '.svg'];
const IMAGE_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

function classify(file: File): ImportedFile['kind'] {
  if (file.type.startsWith('image/') || IMAGE_MIME.includes(file.type)) return 'image';
  if (file.name.endsWith('.json') || file.type === 'application/json') return 'json';
  if (file.name.endsWith('.md') || file.type === 'text/markdown') return 'md';
  return 'invalid';
}

function readAsText(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result || ''));
    r.onerror = () => rej(r.error);
    r.readAsText(f);
  });
}

function readAsDataURL(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result || ''));
    r.onerror = () => rej(r.error);
    r.readAsDataURL(f);
  });
}

export default function ImportDropzone({ onFiles, compact = false, className }: ImportDropzoneProps) {
  const [hovering, setHovering] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (filesList: FileList | File[]) => {
      const out: ImportedFile[] = [];
      const files = Array.from(filesList);
      for (const f of files) {
        const kind = classify(f);
        let preview = '';
        try {
          if (kind === 'image') preview = await readAsDataURL(f);
          else if (kind === 'json' || kind === 'md') preview = await readAsText(f);
        } catch {
          preview = '';
        }
        out.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: f.name,
          kind,
          size: f.size,
          preview,
          mime: f.type || 'application/octet-stream',
          addedAt: Date.now(),
        });
      }
      const invalid = out.find((o) => o.kind === 'invalid');
      if (invalid) {
        setWarn(`"${invalid.name}" doesn't look like JSON, Markdown, or an image. We saved a placeholder anyway — feel free to scribble notes around it.`);
      } else {
        setWarn(null);
      }
      onFiles(out);
    },
    [onFiles]
  );

  return (
    <div className={cn('relative', className)}>
      <label
        htmlFor="import-input"
        onDragOver={(e) => {
          e.preventDefault();
          setHovering(true);
        }}
        onDragLeave={() => setHovering(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHovering(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        data-testid="import-dropzone"
        className={cn(
          'block cursor-none select-none border-4 border-dashed rounded-3xl text-center transition-colors',
          'bg-paper/60 hover:bg-card',
          compact ? 'p-5' : 'p-10',
          hovering ? 'border-crayonBlue bg-card' : 'border-softBorder'
        )}
      >
        <input
          id="import-input"
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          className="sr-only"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          data-testid="import-input"
        />
        <div className="flex flex-col items-center gap-2 text-pencil">
          <UploadCloud className="w-7 h-7" strokeWidth={1.5} />
          <p className="font-fraunces text-lg text-ink">
            Drop a sketch, note, or config in here.
          </p>
          <p className="text-sm">
            Accepted: <span className="font-mono text-xs">{ACCEPTED.join('  ')}</span>
          </p>
          <p className="font-caveat text-lg text-pencil mt-1">or click anywhere on this paper</p>
        </div>
      </label>
      {warn && (
        <div
          role="status"
          className="mt-3 bg-coral/15 border-2 border-coral/50 rounded-xl p-3 font-caveat text-lg text-ink"
          data-testid="import-warning"
        >
          ⚠ {warn}
        </div>
      )}
    </div>
  );
}
