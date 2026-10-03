import React, { useState } from 'react';
import type { CampusBuilding, Complaint, PriorityLevel } from '../../types/campus';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight, 
  Layers, 
  Filter, 
  Flame,
  Info
} from 'lucide-react';

interface CampusStatusMapProps {
  complaints: Complaint[];
  selectedBuilding: CampusBuilding | null;
  onSelectBuilding: (building: CampusBuilding | null) => void;
  onReportForBuilding?: (building: CampusBuilding) => void;
  className?: string;
}

interface BuildingBlockConfig {
  id: CampusBuilding;
  code: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floors: string;
  roomCapacity: number;
  dimensionLabel: string;
  description: string;
  zones: { name: string; x: number; y: number; w: number; h: number }[];
}

export const CAMPUS_BLOCKS: BuildingBlockConfig[] = [
  {
    id: 'ADMIN BLOCK',
    code: 'SEC-A1',
    name: 'ADMIN BLOCK',
    x: 60,
    y: 60,
    width: 220,
    height: 120,
    floors: 'Ground + 2 Floors',
    roomCapacity: 34,
    dimensionLabel: '44.0m × 24.0m',
    description: 'Vice Chancellor Chambers, Registrar, Finance Division & Academic Council Halls',
    zones: [
      { name: 'Reg. Bureau', x: 70, y: 70, w: 90, h: 45 },
      { name: 'Council Rm 102', x: 170, y: 70, w: 95, h: 45 },
      { name: 'Finance Bay', x: 70, y: 125, w: 195, h: 40 },
    ],
  },
  {
    id: 'MAIN BLOCK',
    code: 'SEC-B1',
    name: 'MAIN BLOCK',
    x: 320,
    y: 60,
    width: 280,
    height: 140,
    floors: 'Ground + 3 Floors',
    roomCapacity: 58,
    dimensionLabel: '56.0m × 28.0m',
    description: 'Central Lecture Auditoriums A/B, Dean Offices & Faculty Department Suites',
    zones: [
      { name: 'Auditorium A', x: 335, y: 75, w: 120, h: 65 },
      { name: 'Auditorium B', x: 465, y: 75, w: 120, h: 65 },
      { name: 'Faculty Corridors', x: 335, y: 150, w: 250, h: 35 },
    ],
  },
  {
    id: 'LIBRARY',
    code: 'SEC-C1',
    name: 'LIBRARY',
    x: 640,
    y: 60,
    width: 200,
    height: 150,
    floors: 'Ground + 3 Floors',
    roomCapacity: 28,
    dimensionLabel: '40.0m × 30.0m',
    description: 'Central University Library, Digital Research Stack, Rare Archives & Reading Commons',
    zones: [
      { name: 'Digital Commons', x: 655, y: 75, w: 80, h: 60 },
      { name: 'Stack 4C Archive', x: 745, y: 75, w: 80, h: 60 },
      { name: 'Reading Atrium', x: 655, y: 145, w: 170, h: 50 },
    ],
  },
  {
    id: 'LAB BLOCK',
    code: 'SEC-D2',
    name: 'LAB BLOCK',
    x: 60,
    y: 230,
    width: 270,
    height: 170,
    floors: 'Ground + 4 Floors',
    roomCapacity: 48,
    dimensionLabel: '54.0m × 34.0m',
    description: 'Advanced Computing Lab 204, Microelectronics, Mechatronics, Physics & Chemistry Research',
    zones: [
      { name: 'AI/ML Lab 204', x: 75, y: 245, w: 115, h: 70 },
      { name: 'Mechatronics', x: 200, y: 245, w: 115, h: 70 },
      { name: 'Materials Lab', x: 75, y: 325, w: 240, h: 60 },
    ],
  },
  {
    id: 'CANTEEN',
    code: 'SEC-E2',
    name: 'CANTEEN',
    x: 370,
    y: 240,
    width: 190,
    height: 140,
    floors: 'Ground + 1 Floor',
    roomCapacity: 16,
    dimensionLabel: '38.0m × 28.0m',
    description: 'Student & Faculty Dining Pavilions, Central Culinary Services & Refreshment Kiosks',
    zones: [
      { name: 'Dining Bay North', x: 385, y: 255, w: 160, h: 50 },
      { name: 'Kitchen & Stores', x: 385, y: 315, w: 160, h: 50 },
    ],
  },
  {
    id: 'HOSTEL',
    code: 'SEC-F3',
    name: 'HOSTEL',
    x: 600,
    y: 250,
    width: 240,
    height: 180,
    floors: 'Ground + 5 Floors',
    roomCapacity: 240,
    dimensionLabel: '48.0m × 36.0m',
    description: 'Residential Blocks A & B, Dining Mess, Recreation Lounges & Warden Residence',
    zones: [
      { name: 'Block A (Wing 1)', x: 615, y: 265, w: 100, h: 70 },
      { name: 'Block B (Wing 2)', x: 725, y: 265, w: 100, h: 70 },
      { name: 'Common Lounges', x: 615, y: 345, w: 210, h: 70 },
    ],
  },
  {
    id: 'SPORTS AREA',
    code: 'SEC-G4',
    name: 'SPORTS AREA',
    x: 180,
    y: 440,
    width: 380,
    height: 120,
    floors: 'Outdoor + Pavilion',
    roomCapacity: 12,
    dimensionLabel: '76.0m × 24.0m',
    description: 'Football Turf Arena, Basketball Courts, Track Grounds & Gymnasium Pavilion',
    zones: [
      { name: 'Football Arena', x: 195, y: 455, w: 220, h: 90 },
      { name: 'Gym & Pavilion', x: 425, y: 455, w: 120, h: 90 },
    ],
  },
];

export const CampusStatusMap: React.FC<CampusStatusMapProps> = ({
  complaints,
  selectedBuilding,
  onSelectBuilding,
  onReportForBuilding,
  className = '',
}) => {
  const [activeFloorFilter, setActiveFloorFilter] = useState<string>('All');
  const [hoveredBuilding, setHoveredBuilding] = useState<CampusBuilding | null>(null);

  // Compute stats for each block
  const getBlockStats = (buildingId: CampusBuilding) => {
    const buildingComplaints = complaints.filter(
      (c) => c.building === buildingId && c.status !== 'RESOLVED' && c.status !== 'REJECTED'
    );
    const resolvedComplaints = complaints.filter(
      (c) => c.building === buildingId && c.status === 'RESOLVED'
    );
    const activeCount = buildingComplaints.length;

    // Highest priority
    let highestPriority: PriorityLevel | 'None' = 'None';
    if (buildingComplaints.some((c) => c.priority === 'Urgent')) highestPriority = 'Urgent';
    else if (buildingComplaints.some((c) => c.priority === 'High')) highestPriority = 'High';
    else if (buildingComplaints.some((c) => c.priority === 'Medium')) highestPriority = 'Medium';
    else if (buildingComplaints.some((c) => c.priority === 'Low')) highestPriority = 'Low';

    // Status color
    let statusColor: 'green' | 'yellow' | 'orange' | 'red' | 'blue' = 'green';
    if (highestPriority === 'Urgent') statusColor = 'red';
    else if (highestPriority === 'High') statusColor = 'orange';
    else if (highestPriority === 'Medium' || highestPriority === 'Low') statusColor = 'yellow';
    else statusColor = 'green';

    // Category breakdown
    const categories: Record<string, number> = {};
    buildingComplaints.forEach((c) => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    // Assigned staff list
    const assignedStaff = Array.from(
      new Set(buildingComplaints.map((c) => c.assignedStaffName).filter(Boolean))
    ) as string[];

    // Latest issue
    const latestIssue = buildingComplaints[0];

    return {
      activeCount,
      resolvedCount: resolvedComplaints.length,
      highestPriority,
      statusColor,
      categories,
      assignedStaff,
      latestIssue,
      allActive: buildingComplaints,
    };
  };

  const selectedStats = selectedBuilding ? getBlockStats(selectedBuilding) : null;
  const selectedConfig = selectedBuilding ? CAMPUS_BLOCKS.find((b) => b.id === selectedBuilding) : null;

  return (
    <div className={`card-blueprint rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Map Header & Architectural Metadata Toolbar */}
      <div className="px-4 py-3 border-b border-[#dce3dd] dark:border-[#24332b] bg-[#f9faf8] dark:bg-[#161e1a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 dark:bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18221c] dark:text-[#f1f5f2] flex items-center gap-2">
              CAMPUS STATUS MAP
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-normal bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                SCALE 1:500 ARCH
              </span>
            </h3>
            <p className="text-[11px] font-mono text-[#526359] dark:text-[#9cb1a5]">
              Real-time Architectural Infrastructure Matrix • Interactive Block Layout
            </p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#237848] border border-emerald-700" />
            <span className="text-[#526359] dark:text-[#9cb1a5]">Healthy (0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ab6e10] border border-amber-600" />
            <span className="text-[#526359] dark:text-[#9cb1a5]">Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#bd5119] border border-orange-600" />
            <span className="text-[#526359] dark:text-[#9cb1a5]">High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#b82b28] border border-red-700" />
            <span className="text-[#526359] dark:text-[#9cb1a5]">Urgent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#235c87] border border-blue-600" />
            <span className="text-[#526359] dark:text-[#9cb1a5]">Selected</span>
          </div>
        </div>
      </div>

      {/* Main Split Body: Interactive Blueprint SVG + Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* SVG Drawing Canvas Area */}
        <div className="lg:col-span-8 p-3 sm:p-5 flex flex-col justify-center items-center bg-[#f7f8f6] dark:bg-[#101513] relative overflow-hidden">
          {/* Subtle Technical Grid Overlay */}
          <div className="absolute inset-0 blueprint-bg opacity-70 pointer-events-none" />

          {/* Compass / Orientation Rose in Top Right */}
          <div className="absolute top-4 right-4 z-10 p-2 rounded bg-white/80 dark:bg-[#18221c]/80 backdrop-blur-xs border border-[#dce3dd] dark:border-[#24332b] text-center font-mono pointer-events-none">
            <div className="flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1" className="text-emerald-800/40 dark:text-emerald-400/30" />
                <polygon points="20,6 23,20 20,17 17,20" fill="#1b3d2f" className="dark:fill-emerald-400" />
                <polygon points="20,34 23,20 20,23 17,20" fill="#a0b0a8" className="dark:fill-gray-600" />
                <text x="18" y="5" fontSize="7" fill="currentColor" fontWeight="bold" className="text-emerald-900 dark:text-emerald-300">N</text>
              </svg>
            </div>
            <div className="text-[8px] text-[#526359] dark:text-[#9cb1a5] uppercase tracking-widest mt-0.5">
              GRID NORTH
            </div>
          </div>

          {/* Technical Drawing SVG */}
          <div className="w-full max-w-[880px] aspect-4/3 relative z-10 select-none">
            <svg
              viewBox="0 0 900 600"
              className="w-full h-full drop-shadow-xs"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Perimeter Architectural Measurement Border */}
              <rect
                x="20"
                y="20"
                width="860"
                height="560"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                className="text-emerald-900/20 dark:text-emerald-400/20"
              />

              {/* Dimension Tick Marks along Axis */}
              {[100, 200, 300, 400, 500, 600, 700, 800].map((coord) => (
                <g key={`x-${coord}`}>
                  <line x1={coord} y1="16" x2={coord} y2="24" stroke="currentColor" strokeWidth="1" className="text-emerald-900/40 dark:text-emerald-400/40" />
                  <text x={coord - 10} y="13" fontSize="8" fontFamily="monospace" fill="currentColor" className="text-emerald-900/50 dark:text-emerald-400/50">
                    {coord / 10}m
                  </text>
                </g>
              ))}

              {[100, 200, 300, 400, 500].map((coord) => (
                <g key={`y-${coord}`}>
                  <line x1="16" y1={coord} x2="24" y2={coord} stroke="currentColor" strokeWidth="1" className="text-emerald-900/40 dark:text-emerald-400/40" />
                  <text x="2" y={coord + 3} fontSize="8" fontFamily="monospace" fill="currentColor" className="text-emerald-900/50 dark:text-emerald-400/50">
                    {coord / 10}m
                  </text>
                </g>
              ))}

              {/* Campus Walkways & Circulation Pathways */}
              <path
                d="M 170 180 L 170 230 L 460 230 L 460 240 M 460 200 L 460 240 M 600 200 L 600 250 M 320 380 L 320 440"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 3"
                className="text-emerald-900/20 dark:text-emerald-400/20"
                fill="none"
              />

              {/* Render Campus Building Blocks */}
              {CAMPUS_BLOCKS.map((block) => {
                const stats = getBlockStats(block.id);
                const isSelected = selectedBuilding === block.id;
                const isHovered = hoveredBuilding === block.id;

                // Color mappings based on state
                let fillColor = 'rgba(35, 120, 72, 0.08)'; // Green tint
                let strokeColor = '#237848';
                let badgeBg = '#237848';

                if (isSelected) {
                  fillColor = 'rgba(35, 92, 135, 0.20)'; // Blue selected
                  strokeColor = '#235c87';
                  badgeBg = '#235c87';
                } else if (stats.statusColor === 'red') {
                  fillColor = 'rgba(184, 43, 40, 0.14)';
                  strokeColor = '#b82b28';
                  badgeBg = '#b82b28';
                } else if (stats.statusColor === 'orange') {
                  fillColor = 'rgba(189, 81, 25, 0.12)';
                  strokeColor = '#bd5119';
                  badgeBg = '#bd5119';
                } else if (stats.statusColor === 'yellow') {
                  fillColor = 'rgba(171, 110, 16, 0.12)';
                  strokeColor = '#ab6e10';
                  badgeBg = '#ab6e10';
                }

                return (
                  <g
                    key={block.id}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => onSelectBuilding(isSelected ? null : block.id)}
                    onMouseEnter={() => setHoveredBuilding(block.id)}
                    onMouseLeave={() => setHoveredBuilding(null)}
                  >
                    {/* Shadow / selection halo */}
                    {isSelected && (
                      <rect
                        x={block.x - 4}
                        y={block.y - 4}
                        width={block.width + 8}
                        height={block.height + 8}
                        fill="none"
                        stroke="#235c87"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Building Envelope */}
                    <rect
                      x={block.x}
                      y={block.y}
                      width={block.width}
                      height={block.height}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.5}
                      rx="3"
                    />

                    {/* Structural Double Wall Line (Architectural convention) */}
                    <rect
                      x={block.x + 3}
                      y={block.y + 3}
                      width={block.width - 6}
                      height={block.height - 6}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="0.75"
                      strokeOpacity="0.4"
                    />

                    {/* Interior Room Subdivisions */}
                    {block.zones.map((zone, idx) => (
                      <g key={idx}>
                        <rect
                          x={zone.x}
                          y={zone.y}
                          width={zone.w}
                          height={zone.h}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="0.75"
                          strokeDasharray="2 2"
                          strokeOpacity="0.45"
                        />
                        <text
                          x={zone.x + 4}
                          y={zone.y + 11}
                          fontSize="7.5"
                          fontFamily="monospace"
                          fill="currentColor"
                          className="text-gray-600 dark:text-gray-400 opacity-70"
                        >
                          {zone.name}
                        </text>
                      </g>
                    ))}

                    {/* Architectural Coordinate Stamp in top-right */}
                    <text
                      x={block.x + block.width - 6}
                      y={block.y + 13}
                      textAnchor="end"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="currentColor"
                      className="text-emerald-950/60 dark:text-emerald-300/60"
                    >
                      {block.code}
                    </text>

                    {/* Dimension Line Header */}
                    <text
                      x={block.x + 8}
                      y={block.y - 4}
                      fontSize="7.5"
                      fontFamily="monospace"
                      fill="currentColor"
                      className="text-[#526359] dark:text-[#9cb1a5] opacity-75"
                    >
                      {block.dimensionLabel}
                    </text>

                    {/* Building Name Badge in Upper Left */}
                    <rect
                      x={block.x + 6}
                      y={block.y + 6}
                      width={Math.min(block.width - 45, 120)}
                      height="16"
                      fill="var(--bg-card, #ffffff)"
                      stroke={strokeColor}
                      strokeWidth="1"
                      rx="2"
                    />
                    <text
                      x={block.x + 12}
                      y={block.y + 17}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="currentColor"
                      className="text-[#18221c] dark:text-[#f1f5f2]"
                    >
                      {block.name}
                    </text>

                    {/* Issue Count Indicator Badge */}
                    <g transform={`translate(${block.x + block.width - 24}, ${block.y + block.height - 24})`}>
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill={badgeBg}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x="10"
                        y="13"
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        {stats.activeCount}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick instructions pill at bottom */}
          <div className="mt-2 text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] flex items-center gap-1.5 z-10">
            <Info className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
            <span>Click any structural block to open live building maintenance telemetry</span>
          </div>
        </div>

        {/* Selected Block Information Inspector Panel */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#dce3dd] dark:border-[#24332b] bg-[#ffffff] dark:bg-[#161e1a] p-4 sm:p-5 flex flex-col justify-between">
          {selectedConfig && selectedStats ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="pb-3 border-b border-[#dce3dd] dark:border-[#24332b]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {selectedConfig.code}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    selectedStats.highestPriority === 'Urgent'
                      ? 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                      : selectedStats.highestPriority === 'High'
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : selectedStats.activeCount > 0
                      ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800'
                      : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  }`}>
                    {selectedStats.activeCount === 0 ? 'NOMINAL / HEALTHY' : `${selectedStats.highestPriority} PRIORITY`}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#18221c] dark:text-[#f1f5f2] mt-1.5">
                  {selectedConfig.name}
                </h4>
                <p className="text-xs text-[#526359] dark:text-[#9cb1a5] mt-0.5 line-clamp-2">
                  {selectedConfig.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                  <span className="text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase block">
                    Active Complaints
                  </span>
                  <span className="text-lg font-bold text-[#18221c] dark:text-[#f1f5f2]">
                    {selectedStats.activeCount}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                  <span className="text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase block">
                    Resolved To Date
                  </span>
                  <span className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                    {selectedStats.resolvedCount}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                  <span className="text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase block">
                    Floors / Rooms
                  </span>
                  <span className="text-xs font-semibold text-[#18221c] dark:text-[#f1f5f2] mt-1 block">
                    {selectedConfig.floors}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#f7f8f6] dark:bg-[#121614] border border-[#dce3dd] dark:border-[#24332b]">
                  <span className="text-[10px] text-[#526359] dark:text-[#9cb1a5] uppercase block">
                    Dimensions
                  </span>
                  <span className="text-xs font-semibold text-[#18221c] dark:text-[#f1f5f2] mt-1 block">
                    {selectedConfig.dimensionLabel}
                  </span>
                </div>
              </div>

              {/* Complaint Categories Breakdown */}
              <div>
                <h5 className="text-[11px] font-mono font-bold uppercase text-[#526359] dark:text-[#9cb1a5] mb-1.5">
                  Complaint Categories
                </h5>
                {Object.keys(selectedStats.categories).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selectedStats.categories).map(([cat, count]) => (
                      <span
                        key={cat}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eff2ee] dark:bg-[#1c2722] text-[#18221c] dark:text-[#f1f5f2] border border-[#dce3dd] dark:border-[#24332b]"
                      >
                        {cat}: <strong className="font-bold">{count}</strong>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7d8f85] italic font-mono">No active category incidents reported.</p>
                )}
              </div>

              {/* Assigned Staff */}
              <div>
                <h5 className="text-[11px] font-mono font-bold uppercase text-[#526359] dark:text-[#9cb1a5] mb-1.5">
                  Assigned Staff
                </h5>
                {selectedStats.assignedStaff.length > 0 ? (
                  <div className="space-y-1">
                    {selectedStats.assignedStaff.map((staff, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs font-mono text-[#18221c] dark:text-[#f1f5f2]"
                      >
                        <Users className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                        <span>{staff}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7d8f85] italic font-mono">No active technicians deployed.</p>
                )}
              </div>

              {/* Latest Issue Snippet */}
              {selectedStats.latestIssue && (
                <div className="p-3 rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between text-[10px] font-mono text-amber-900 dark:text-amber-300">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      LATEST ISSUE
                    </span>
                    <span>{selectedStats.latestIssue.complaintId}</span>
                  </div>
                  <p className="text-xs font-medium text-[#18221c] dark:text-[#f1f5f2] mt-1 line-clamp-2">
                    {selectedStats.latestIssue.title}
                  </p>
                  <div className="text-[10px] font-mono text-[#526359] dark:text-[#9cb1a5] mt-1 flex items-center justify-between">
                    <span>{selectedStats.latestIssue.location}</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {selectedStats.latestIssue.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f0f2ef] dark:bg-[#1c2722] flex items-center justify-center text-emerald-800 dark:text-emerald-400">
                <Building2 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-bold font-mono uppercase text-[#18221c] dark:text-[#f1f5f2]">
                Select a Campus Area
              </h4>
              <p className="text-xs text-[#526359] dark:text-[#9cb1a5] leading-relaxed">
                Click any building block on the architectural drawing to inspect live telemetry, pending complaints, floor plans, and maintenance staff assignments.
              </p>
            </div>
          )}

          {/* Action CTAs */}
          {selectedConfig && onReportForBuilding && (
            <div className="pt-3 border-t border-[#dce3dd] dark:border-[#24332b] mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onReportForBuilding(selectedConfig.id)}
                className="w-full py-2 px-3 text-xs font-mono font-bold rounded bg-emerald-900 hover:bg-emerald-950 text-white dark:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>+ Report Issue For {selectedConfig.name}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
