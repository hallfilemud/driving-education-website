import React, { useState, useCallback } from "react";
import { useLocation } from "wouter";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// URL to fetch the US states TopoJSON data
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Map component props
interface USAMapProps {
  className?: string;
  onStateClick?: (stateCode: string) => void;
}

// State information for tooltip
interface StateInfo {
  name: string;
  abbreviation: string;
  position: [number, number]; // [longitude, latitude]
}

// State abbreviations mapped to their full names and positions
const stateInfo: Record<string, StateInfo> = {
  "01": { name: "Alabama", abbreviation: "AL", position: [-86.7510, 32.5901] },
  "02": { name: "Alaska", abbreviation: "AK", position: [-152.2932, 65.1605] },
  "04": { name: "Arizona", abbreviation: "AZ", position: [-111.0937, 34.2744] },
  "05": { name: "Arkansas", abbreviation: "AR", position: [-92.4426, 34.8938] },
  "06": { name: "California", abbreviation: "CA", position: [-119.4696, 36.7783] },
  "08": { name: "Colorado", abbreviation: "CO", position: [-105.5478, 38.9972] },
  "09": { name: "Connecticut", abbreviation: "CT", position: [-72.7273, 41.6219] },
  "10": { name: "Delaware", abbreviation: "DE", position: [-75.5277, 38.9896] },
  "11": { name: "District of Columbia", abbreviation: "DC", position: [-77.0369, 38.9072] },
  "12": { name: "Florida", abbreviation: "FL", position: [-81.5158, 27.6648] },
  "13": { name: "Georgia", abbreviation: "GA", position: [-83.4429, 32.6415] },
  "15": { name: "Hawaii", abbreviation: "HI", position: [-155.5828, 19.8968] },
  "16": { name: "Idaho", abbreviation: "ID", position: [-114.7420, 44.0682] },
  "17": { name: "Illinois", abbreviation: "IL", position: [-89.3985, 40.0417] },
  "18": { name: "Indiana", abbreviation: "IN", position: [-86.2604, 39.8942] },
  "19": { name: "Iowa", abbreviation: "IA", position: [-93.2140, 42.0046] },
  "20": { name: "Kansas", abbreviation: "KS", position: [-98.3804, 38.5266] },
  "21": { name: "Kentucky", abbreviation: "KY", position: [-84.2700, 37.8393] },
  "22": { name: "Louisiana", abbreviation: "LA", position: [-92.4451, 30.9843] },
  "23": { name: "Maine", abbreviation: "ME", position: [-69.4455, 45.2538] },
  "24": { name: "Maryland", abbreviation: "MD", position: [-76.6413, 39.0458] },
  "25": { name: "Massachusetts", abbreviation: "MA", position: [-71.3824, 42.4072] },
  "26": { name: "Michigan", abbreviation: "MI", position: [-85.6024, 44.3148] },
  "27": { name: "Minnesota", abbreviation: "MN", position: [-94.6859, 46.2807] },
  "28": { name: "Mississippi", abbreviation: "MS", position: [-89.3985, 32.7673] },
  "29": { name: "Missouri", abbreviation: "MO", position: [-92.6032, 38.4623] },
  "30": { name: "Montana", abbreviation: "MT", position: [-109.6333, 46.8797] },
  "31": { name: "Nebraska", abbreviation: "NE", position: [-99.9018, 41.4925] },
  "32": { name: "Nevada", abbreviation: "NV", position: [-116.4194, 38.8026] },
  "33": { name: "New Hampshire", abbreviation: "NH", position: [-71.5811, 43.6805] },
  "34": { name: "New Jersey", abbreviation: "NJ", position: [-74.4057, 40.0583] },
  "35": { name: "New Mexico", abbreviation: "NM", position: [-106.1126, 34.4071] },
  "36": { name: "New York", abbreviation: "NY", position: [-75.4653, 42.9538] },
  "37": { name: "North Carolina", abbreviation: "NC", position: [-79.0193, 35.5557] },
  "38": { name: "North Dakota", abbreviation: "ND", position: [-100.4659, 47.4501] },
  "39": { name: "Ohio", abbreviation: "OH", position: [-82.7755, 40.4173] },
  "40": { name: "Oklahoma", abbreviation: "OK", position: [-97.5164, 35.5889] },
  "41": { name: "Oregon", abbreviation: "OR", position: [-120.5542, 43.9336] },
  "42": { name: "Pennsylvania", abbreviation: "PA", position: [-77.1945, 41.2033] },
  "44": { name: "Rhode Island", abbreviation: "RI", position: [-71.5562, 41.6772] },
  "45": { name: "South Carolina", abbreviation: "SC", position: [-80.9066, 33.8569] },
  "46": { name: "South Dakota", abbreviation: "SD", position: [-100.2263, 44.4443] },
  "47": { name: "Tennessee", abbreviation: "TN", position: [-86.5804, 35.7478] },
  "48": { name: "Texas", abbreviation: "TX", position: [-99.3312, 31.4757] },
  "49": { name: "Utah", abbreviation: "UT", position: [-111.6703, 39.3055] },
  "50": { name: "Vermont", abbreviation: "VT", position: [-72.5778, 44.0687] },
  "51": { name: "Virginia", abbreviation: "VA", position: [-78.6569, 37.4316] },
  "53": { name: "Washington", abbreviation: "WA", position: [-120.4472, 47.3917] },
  "54": { name: "West Virginia", abbreviation: "WV", position: [-80.6227, 38.6409] },
  "55": { name: "Wisconsin", abbreviation: "WI", position: [-89.6385, 44.2563] },
  "56": { name: "Wyoming", abbreviation: "WY", position: [-107.2903, 42.9957] },
};

export default function USAMap({ className, onStateClick }: USAMapProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tooltipContent, setTooltipContent] = useState("");
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeState, setActiveState] = useState<string | null>(null);

  // Handle mouse move to update tooltip position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Handle state click - navigate to state page
  const handleStateClick = useCallback((geo: any) => {
    const stateId = geo.id;
    const state = stateInfo[stateId];
    
    if (state) {
      if (onStateClick) {
        onStateClick(state.abbreviation);
      } else {
        setLocation(`/states/${state.abbreviation.toLowerCase()}`);
      }
    } else {
      toast({
        title: "State Information Unavailable",
        description: "Could not find information for this state.",
        variant: "destructive",
      });
    }
  }, [setLocation, onStateClick, toast]);

  return (
    <div 
      className={cn("relative", className)} 
      onMouseMove={handleMouseMove}
    >
      <Card className="bg-background border rounded-lg shadow-md overflow-hidden">
        <CardContent className="p-2 sm:p-4">
          <ComposableMap 
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 1000 }}
            className="w-full h-auto"
          >
            <ZoomableGroup zoom={1} center={[-96, 38]}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const stateId = geo.id;
                    const isActive = activeState === stateId;
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground)/0.3)"}
                        stroke="hsl(var(--border))"
                        strokeWidth={0.5}
                        style={{
                          default: {
                            outline: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          },
                          hover: {
                            fill: "hsl(var(--primary)/0.8)",
                            outline: "none",
                            stroke: "hsl(var(--primary))",
                            strokeWidth: 1,
                          },
                          pressed: {
                            fill: "hsl(var(--primary))",
                            outline: "none",
                          },
                        }}
                        onMouseEnter={() => {
                          const state = stateInfo[stateId];
                          if (state) {
                            setTooltipContent(state.name);
                            setActiveState(stateId);
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                          setActiveState(null);
                        }}
                        onClick={() => handleStateClick(geo)}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </CardContent>
      </Card>

      {/* Tooltip */}
      {tooltipContent && (
        <Badge
          className="absolute z-10 pointer-events-none bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-lg text-sm"
          style={{
            left: `${position.x + 10}px`,
            top: `${position.y - 30}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltipContent}
        </Badge>
      )}
    </div>
  );
}