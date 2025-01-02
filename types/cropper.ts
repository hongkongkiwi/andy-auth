export interface Point {
  x: number;
  y: number;
}

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropperProps {
  image: string;
  crop: Point;
  zoom: number;
  aspect: number;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  cropShape?: 'rect' | 'round';
  showGrid?: boolean;
}
