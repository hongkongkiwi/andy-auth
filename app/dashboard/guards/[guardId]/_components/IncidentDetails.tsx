'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { X, MapPin, Play } from 'lucide-react';
import {
  type Incident,
  type IncidentMedia,
  type IncidentTranscript
} from './IncidentsTab';
import IncidentMap from './IncidentMap';

interface IncidentDetailsProps {
  incident: Incident;
  onClose: () => void;
}

const IncidentDetails = ({ incident, onClose }: IncidentDetailsProps) => {
  const [brokenImages, setBrokenImages] = React.useState<Set<string>>(
    new Set()
  );

  const getStatusColor = (status: Incident['status']) => {
    const colors = {
      open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      in_progress:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      resolved:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status];
  };

  const getSourceBadge = (source: Incident['source']) => {
    if (source === 'ai_generated') {
      return (
        <Badge
          variant="outline"
          className="border-purple-200 bg-purple-100 text-xs text-purple-800 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-200"
        >
          AI Generated
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="border-blue-200 bg-blue-100 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200"
      >
        Guard Report
      </Badge>
    );
  };

  const getDuration = (incident: Incident) => {
    if (!incident.endTime) return 'Ongoing';

    const durationMs =
      incident.endTime.getTime() - incident.startTime.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="absolute inset-0 z-10 overflow-auto">
      <CardHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{incident.shortDescription}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(incident.status)}>
                {incident.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {getSourceBadge(incident.source)}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{format(incident.startTime, 'PPp')}</span>
          <span>→</span>
          <span>
            {incident.endTime ? format(incident.endTime, 'PPp') : 'Ongoing'}
          </span>
          <span className="font-medium">Duration: {getDuration(incident)}</span>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">{incident.longDescription}</p>
        </div>

        {/* Location Data */}
        {incident.coordinates.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">
              Location Data ({incident.coordinates.length} points)
            </h3>
            <div className="overflow-hidden rounded-lg border">
              <IncidentMap coordinates={incident.coordinates} />
            </div>
            <div className="space-y-2">
              {incident.coordinates.map((coord, index) => (
                <div
                  key={coord.id}
                  className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted/50"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="flex min-w-[70px] items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{format(coord.timestamp, 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      {coord.latitude.toFixed(4)}°N,{' '}
                      {coord.longitude.toFixed(4)}°W
                    </span>
                    {coord.accuracy && (
                      <span className="text-xs text-muted-foreground">
                        ±{coord.accuracy}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        {incident.media.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Media ({incident.media.length})</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {incident.media.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <Play className="h-8 w-8" />
                    </div>
                  )}
                  {!brokenImages.has(item.id) ? (
                    <img
                      src={item.type === 'video' ? item.thumbnailUrl : item.url}
                      alt={`Incident ${item.type}`}
                      className="h-full w-full object-cover"
                      onError={() =>
                        setBrokenImages((prev) => new Set(prev).add(item.id))
                      }
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-2 text-muted-foreground">
                      <span className="text-center text-xs">No preview</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-white">
                    {format(item.timestamp, 'HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcripts */}
        {incident.transcripts.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">
              Transcripts ({incident.transcripts.length})
            </h3>
            <div className="space-y-2">
              {incident.transcripts.map((transcript) => (
                <div
                  key={transcript.id}
                  className="flex items-start gap-2 text-sm"
                >
                  <time className="whitespace-nowrap text-muted-foreground">
                    {format(transcript.timestamp, 'HH:mm')}
                  </time>
                  <p className="flex-1">{transcript.text}</p>
                  {getSourceBadge(transcript.source)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncidentDetails;
