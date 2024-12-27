export enum UnitType {
  VOLUME = "VOLUME",
  WEIGHT = "WEIGHT",
}

export enum VolumeUnit {
  MILLILITER = "mL",
  LITER = "L",
}

export enum WeightUnit {
  MILLIGRAM = "mg",
  GRAM = "g",
  KILOGRAM = "kg",
}

export type Unit = VolumeUnit | WeightUnit;

export const unitTypeMap: Record<Unit, UnitType> = {
  [VolumeUnit.MILLILITER]: UnitType.VOLUME,
  [VolumeUnit.LITER]: UnitType.VOLUME,
  [WeightUnit.MILLIGRAM]: UnitType.WEIGHT,
  [WeightUnit.GRAM]: UnitType.WEIGHT,
  [WeightUnit.KILOGRAM]: UnitType.WEIGHT,
};

export const conversionFactors: Record<Unit, number> = {
  [VolumeUnit.MILLILITER]: 0.001, // Base: Liters
  [VolumeUnit.LITER]: 1,
  [WeightUnit.MILLIGRAM]: 0.001, // Base: Grams
  [WeightUnit.GRAM]: 1,
  [WeightUnit.KILOGRAM]: 1000,
};

export function convertUnit(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): number | null {
  // Check if units are of the same type
  if (unitTypeMap[fromUnit] !== unitTypeMap[toUnit]) {
    return null;
  }

  // Convert to base unit (L or g) then to target unit
  const baseValue = value * conversionFactors[fromUnit];
  return baseValue / conversionFactors[toUnit];
}

export function formatQuantity(value: number, unit: Unit): string {
  const unitType = unitTypeMap[unit];
  let displayUnit = unit;
  let displayValue = value;

  if (unitType === UnitType.VOLUME) {
    if (value >= 1000 && unit === VolumeUnit.MILLILITER) {
      displayValue = value / 1000;
      displayUnit = VolumeUnit.LITER;
    } else if (value < 1 && unit === VolumeUnit.LITER) {
      displayValue = value * 1000;
      displayUnit = VolumeUnit.MILLILITER;
    }
  } else if (unitType === UnitType.WEIGHT) {
    if (value >= 1000 && unit === WeightUnit.GRAM) {
      displayValue = value / 1000;
      displayUnit = WeightUnit.KILOGRAM;
    } else if (value >= 1 && unit === WeightUnit.MILLIGRAM) {
      displayValue = value / 1000;
      displayUnit = WeightUnit.GRAM;
    } else if (value < 1 && unit === WeightUnit.KILOGRAM) {
      displayValue = value * 1000;
      displayUnit = WeightUnit.GRAM;
    } else if (value < 1 && unit === WeightUnit.GRAM) {
      displayValue = value * 1000;
      displayUnit = WeightUnit.MILLIGRAM;
    }
  }

  return `${displayValue.toFixed(displayValue < 1 ? 2 : 1)}${displayUnit}`;
}

export function getUnitOptions(type: UnitType): Unit[] {
  return Object.entries(unitTypeMap)
    .filter(([_, unitType]) => unitType === type)
    .map(([unit]) => unit as Unit);
}

export function getBaseUnit(type: UnitType): Unit {
  return type === UnitType.VOLUME ? VolumeUnit.LITER : WeightUnit.GRAM;
}

export function normalizeToBaseUnit(value: number, unit: Unit): number {
  return value * conversionFactors[unit];
}

export function formatFromBaseUnit(value: number, targetUnit: Unit): number {
  return value / conversionFactors[targetUnit];
}
