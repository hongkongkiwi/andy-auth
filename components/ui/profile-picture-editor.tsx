'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut,
  Camera,
  ImageOff
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import type { Point, Area } from '@/types/cropper';

interface ProfilePictureEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onDelete: () => Promise<void>;
  onUpdate: (crop: Area) => Promise<void>;
  onUploadNew: (tab: 'upload' | 'camera') => void;
}

export function ProfilePictureEditor({
  open,
  onOpenChange,
  imageUrl,
  onDelete,
  onUpdate,
  onUploadNew
}: ProfilePictureEditorProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
    img.src = imageUrl;
  }, [imageUrl]);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!croppedArea) return;
    try {
      setIsLoading(true);
      await onUpdate(croppedArea);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCropComplete = React.useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
          <DialogDescription>
            {imageError
              ? 'Image is broken. Please upload a new one.'
              : 'Adjust your profile picture or upload a new one.'}
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex h-[300px] items-center justify-center rounded-lg bg-muted">
          {imageError ? (
            <div className="space-y-4 text-center">
              <ImageOff className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Image is broken or cannot be loaded
              </p>
            </div>
          ) : (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="round"
              showGrid={false}
            />
          )}
        </div>

        {!imageError && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.max(1, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Slider
                value={[zoom]}
                onValueChange={handleZoomChange}
                min={1}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.min(3, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUploadNew('upload')}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onUploadNew('camera')}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!imageError && (
              <Button onClick={handleUpdate} disabled={isLoading}>
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
