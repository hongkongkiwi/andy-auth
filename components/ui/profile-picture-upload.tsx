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
import { Upload, Loader2, Camera, ZoomOut, ZoomIn } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import type { Point, Area } from '@/types/cropper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { PermissionType } from '@prisma/client';
import { hasPermission } from '@/components/layout/Navigation/utils';
import { CAN_MANAGE_UI } from '@/lib/constants/permissions';

interface ProfilePictureUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File, crop: Area) => Promise<void>;
  aspectRatio?: number;
  initialTab?: 'upload' | 'camera';
  permissions: { type: PermissionType }[];
}

interface UploadResponse {
  file: {
    objectKey: string;
    objectBucket: string;
    mimeType: string;
    sizeInBytes: number;
  };
}

const uploadImage = async (file: File, crop: Area): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('crop', JSON.stringify(crop));

  const response = await fetch('/api/storage/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
};

export const ProfilePictureUpload = ({
  open,
  onOpenChange,
  onUpload,
  aspectRatio = 1,
  initialTab = 'upload',
  permissions
}: ProfilePictureUploadProps) => {
  const canUpload = permissions.some((p) => CAN_MANAGE_UI.includes(p.type));

  if (!canUpload) return null;

  const [image, setImage] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'upload' | 'camera'>(
    initialTab
  );
  const [showCropper, setShowCropper] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSave = async () => {
    if (!image || !croppedArea) return;

    try {
      setIsUploading(true);
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'profile-picture.jpg', {
        type: 'image/jpeg'
      });

      await onUpload(file, croppedArea);
      setImage(null);
      setShowCropper(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onCropComplete = React.useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
        stopCamera();
      };
      reader.readAsDataURL(blob);
    }, 'image/jpeg');
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  React.useEffect(() => {
    if (activeTab === 'camera' && open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
          <DialogDescription>
            {showCropper
              ? 'Adjust your photo'
              : 'Upload a picture or take one with your camera'}
          </DialogDescription>
        </DialogHeader>

        {showCropper && image ? (
          <>
            <div className="relative h-[300px]">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            </div>
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setImage(null);
                  setShowCropper(false);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isUploading}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'upload' | 'camera')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div
                  {...getRootProps()}
                  className="cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors hover:border-primary"
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isDragActive
                      ? 'Drop the image here'
                      : "Drag 'n' drop an image here, or click to select"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="camera" className="space-y-4">
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={takePhoto}
                  disabled={!stream}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
