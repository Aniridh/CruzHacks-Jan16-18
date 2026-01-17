// Utility to load and select layout templates

import { LayoutTemplate, EnvironmentType } from '@/types';
import apartmentLayout from '@/data/layouts/apartment.json';
import officeLayout from '@/data/layouts/office.json';
import schoolLayout from '@/data/layouts/school.json';
import forestLayout from '@/data/layouts/forest.json';

const layoutMap: Record<EnvironmentType, LayoutTemplate> = {
  apartment: apartmentLayout as LayoutTemplate,
  office: officeLayout as LayoutTemplate,
  school: schoolLayout as LayoutTemplate,
  forest: forestLayout as LayoutTemplate,
  warehouse: officeLayout as LayoutTemplate, // fallback to office for now
};

export async function loadLayoutTemplate(
  environmentType: EnvironmentType
): Promise<LayoutTemplate | null> {
  try {
    const layout = layoutMap[environmentType];
    if (!layout) {
      console.error(`No layout template found for environment type: ${environmentType}`);
      return null;
    }
    return layout;
  } catch (error) {
    console.error(`Error loading layout template for ${environmentType}:`, error);
    return null;
  }
}

export function getLayoutTemplateSync(environmentType: EnvironmentType): LayoutTemplate | null {
  try {
    const layout = layoutMap[environmentType];
    if (!layout) {
      console.error(`No layout template found for environment type: ${environmentType}`);
      return null;
    }
    return layout;
  } catch (error) {
    console.error(`Error getting layout template for ${environmentType}:`, error);
    return null;
  }
}
