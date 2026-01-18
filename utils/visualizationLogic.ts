// Visualization logic: risk zones, pathfinding, strike nodes

import { LayoutTemplate, FireOrigin, RiskZone, SafePath, StrikeNode, Severity } from '@/types';

/**
 * Calculate risk zones based on fire origin and layout
 * Simple distance-based calculation with exponential decay
 */
export function calculateRiskZones(
  layout: LayoutTemplate,
  fireOrigin: FireOrigin
): RiskZone[] {
  const riskZones: RiskZone[] = [];
  
  // Get fire origin coordinates (use room center if not specified)
  let fireX = fireOrigin.coordinates?.x || 50;
  let fireY = fireOrigin.coordinates?.y || 50;

  // If fire origin has a room/area, find its center
  if (fireOrigin.area) {
    const fireRoom = layout.rooms.find((r) =>
      r.name.toLowerCase().includes(fireOrigin.area.toLowerCase()) ||
      r.id.toLowerCase().includes(fireOrigin.area.toLowerCase())
    );
    if (fireRoom) {
      fireX = fireRoom.coordinates.x + fireRoom.coordinates.width / 2;
      fireY = fireRoom.coordinates.y + fireRoom.coordinates.height / 2;
    }
  }

  // Calculate risk for each room based on distance from fire
  layout.rooms.forEach((room) => {
    const roomCenterX = room.coordinates.x + room.coordinates.width / 2;
    const roomCenterY = room.coordinates.y + room.coordinates.height / 2;

    const distance = Math.sqrt(
      Math.pow(roomCenterX - fireX, 2) + Math.pow(roomCenterY - fireY, 2)
    );

    // Risk decreases with distance (max distance in layout is ~141 for 100x100 grid)
    const normalizedDistance = Math.min(distance / 50, 1);
    const riskLevel = 1 - normalizedDistance;

    let severity: Severity = 'low';
    if (riskLevel > 0.6) severity = 'high';
    else if (riskLevel > 0.3) severity = 'medium';

    // Create risk zone covering the room area
    if (severity !== 'low' || distance < 15) {
      riskZones.push({
        id: `risk-${room.id}`,
        coordinates: room.coordinates,
        severity,
        confidence: Math.min(riskLevel * 100, 95),
      });
    }
  });

  return riskZones;
}

/**
 * Simple pathfinding using A* concepts but simplified
 * Finds safe paths avoiding high-risk zones
 */
export function calculateSafePaths(
  layout: LayoutTemplate,
  fireOrigin: FireOrigin,
  riskZones: RiskZone[],
  startRoomId?: string
): SafePath[] {
  const safePaths: SafePath[] = [];

  // Find starting point (room or default location)
  let startX = 50;
  let startY = 50;

  if (startRoomId) {
    const startRoom = layout.rooms.find((r) => r.id === startRoomId);
    if (startRoom) {
      startX = startRoom.coordinates.x + startRoom.coordinates.width / 2;
      startY = startRoom.coordinates.y + startRoom.coordinates.height / 2;
    }
  }

  // Filter exits to find safe ones (not in high-risk zones)
  const safeExits = layout.exits.filter((exit) => {
    const exitRisk = riskZones.find((rz) => {
      const ex = rz.coordinates;
      return (
        exit.coordinates.x >= ex.x &&
        exit.coordinates.x <= ex.x + ex.width &&
        exit.coordinates.y >= ex.y &&
        exit.coordinates.y <= ex.y + ex.height
      );
    });

    return !exitRisk || exitRisk.severity === 'low';
  });

  // For each safe exit, create a path
  safeExits.forEach((exit, index) => {
    // Simple straight-line path (can be improved with actual pathfinding)
    const pathPoints = [
      { x: startX, y: startY },
      { x: exit.coordinates.x, y: exit.coordinates.y },
    ];

    safePaths.push({
      id: `path-${exit.id}`,
      points: pathPoints,
      priority: index + 1, // Lower number = higher priority
      description: `Route to ${exit.name}`,
    });
  });

  // If no safe exits, suggest path to least risky exit
  if (safePaths.length === 0 && layout.exits.length > 0) {
    const safestExit = layout.exits[0];
    safePaths.push({
      id: `path-emergency-${safestExit.id}`,
      points: [
        { x: startX, y: startY },
        { x: safestExit.coordinates.x, y: safestExit.coordinates.y },
      ],
      priority: 1,
      description: `Emergency route to ${safestExit.name} (risky but closest)`,
    });
  }

  return safePaths;
}

/**
 * Identify strike nodes (high-priority areas for firefighters)
 */
export function identifyStrikeNodes(
  layout: LayoutTemplate,
  fireOrigin: FireOrigin,
  riskZones: RiskZone[]
): StrikeNode[] {
  const strikeNodes: StrikeNode[] = [];

  // Fire origin is highest priority strike node
  let fireX = fireOrigin.coordinates?.x || 50;
  let fireY = fireOrigin.coordinates?.y || 50;

  if (fireOrigin.area) {
    const fireRoom = layout.rooms.find((r) =>
      r.name.toLowerCase().includes(fireOrigin.area.toLowerCase())
    );
    if (fireRoom) {
      fireX = fireRoom.coordinates.x + fireRoom.coordinates.width / 2;
      fireY = fireRoom.coordinates.y + fireRoom.coordinates.height / 2;
    }
  }

  strikeNodes.push({
    id: 'strike-origin',
    coordinates: { x: fireX, y: fireY },
    type: 'fire-origin',
    priority: 1,
    description: 'Fire origin - primary strike point',
  });

  // High-risk zones near exits are critical
  riskZones
    .filter((rz) => rz.severity === 'high')
    .forEach((rz, index) => {
      const roomCenterX = rz.coordinates.x + rz.coordinates.width / 2;
      const roomCenterY = rz.coordinates.y + rz.coordinates.height / 2;

      // Check if near exit
      const nearExit = layout.exits.some((exit) => {
        const distance = Math.sqrt(
          Math.pow(exit.coordinates.x - roomCenterX, 2) +
            Math.pow(exit.coordinates.y - roomCenterY, 2)
        );
        return distance < 10;
      });

      if (nearExit) {
        strikeNodes.push({
          id: `strike-exit-risk-${index}`,
          coordinates: { x: roomCenterX, y: roomCenterY },
          type: 'exit-risk',
          priority: 2 + index,
          description: 'High-risk zone near exit - priority intervention',
        });
      }
    });

  // Stairwells are important for evacuation
  layout.exits
    .filter((exit) => exit.type === 'stairwell')
    .forEach((exit, index) => {
      strikeNodes.push({
        id: `strike-stairwell-${index}`,
        coordinates: exit.coordinates,
        type: 'stairwell',
        priority: 10 + index,
        description: `Stairwell ${exit.name} - evacuation route protection`,
      });
    });

  return strikeNodes;
}
