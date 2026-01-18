// Generate decision reasoning from visualization data

import { VisualizationData, DecisionReasoning, SituationAnalysis, Hazard } from '@/types';

export function generateDecisionReasoning(
  visualizationData: VisualizationData,
  situationAnalysis: SituationAnalysis
): DecisionReasoning {
  const { riskZones, safePaths, strikeNodes } = visualizationData;

  // Risk zone reasoning
  const riskZoneReasoning = riskZones.map((zone) => {
    let explanation = `Zone marked as ${zone.severity} risk based on proximity to fire origin. `;
    if (zone.severity === 'high') {
      explanation += `This area is within immediate danger zone and requires urgent attention. `;
    } else if (zone.severity === 'medium') {
      explanation += `This area may be affected by smoke or heat spread. `;
    } else {
      explanation += `This area has lower risk but should still be monitored. `;
    }
    explanation += `Risk assessment confidence: ${zone.confidence}%`;

    return {
      zoneId: zone.id,
      explanation,
      confidence: zone.confidence,
    };
  });

  // Path reasoning
  const pathReasoning = safePaths.map((path) => {
    const isRecommended = path.priority <= 2; // Top 2 paths are recommended
    let explanation = `Path to ${path.description}. `;
    if (isRecommended) {
      explanation += `This route avoids high-risk zones and provides safe access to exit. `;
      explanation += `Recommended for evacuation with priority ${path.priority}.`;
    } else {
      explanation += `Alternative evacuation route. May pass through medium-risk areas. `;
      explanation += `Consider this path if primary routes are blocked.`;
    }

    return {
      pathId: path.id,
      explanation,
      recommended: isRecommended,
    };
  });

  // Strike node reasoning
  const strikeNodeReasoning = strikeNodes.map((node) => {
    let explanation = '';
    if (node.type === 'fire-origin') {
      explanation = `Fire origin at this location - highest priority strike point. `;
      explanation += `All firefighting efforts should be focused here to contain the source.`;
    } else if (node.type === 'exit-risk') {
      explanation = `High-risk zone near critical exit point. `;
      explanation += `Protecting this exit is essential for safe evacuation routes.`;
    } else if (node.type === 'stairwell') {
      explanation = `Critical evacuation route (stairwell). `;
      explanation += `Ensure this path remains clear and protected during operations.`;
    } else {
      explanation = `Strategic intervention point. Priority: ${node.priority}. `;
      explanation += node.description;
    }

    return {
      nodeId: node.id,
      explanation,
      priority: node.priority,
    };
  });

  // Uncertainty markers
  const uncertaintyMarkers: { field: string; explanation: string; confidence: number }[] = [];

  if (situationAnalysis.inferred) {
    uncertaintyMarkers.push({
      field: 'Fire Origin Location',
      explanation: `Fire origin location was inferred from transcript description. ` +
        `Actual coordinates may vary. Confidence: ${situationAnalysis.fireOrigin.confidence}%`,
      confidence: situationAnalysis.fireOrigin.confidence,
    });
  }

  if (situationAnalysis.environmentConfidence < 90) {
    uncertaintyMarkers.push({
      field: 'Environment Type',
      explanation: `Environment type identified with ${situationAnalysis.environmentConfidence}% confidence. ` +
        `Layout selection based on best match.`,
      confidence: situationAnalysis.environmentConfidence,
    });
  }

  situationAnalysis.hazards.forEach((hazard: Hazard) => {
    if (hazard.confidence < 80) {
      uncertaintyMarkers.push({
        field: `Hazard: ${hazard.type}`,
        explanation: `Hazard location inferred with ${hazard.confidence}% confidence. ` +
          `Verification recommended before action.`,
        confidence: hazard.confidence,
      });
    }
  });

  return {
    riskZoneReasoning,
    pathReasoning,
    strikeNodeReasoning,
    uncertaintyMarkers,
  };
}
