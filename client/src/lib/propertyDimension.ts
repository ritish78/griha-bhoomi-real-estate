export const DIMENSION_UNITS = ["ft", "m", "in"] as const;

export type DimensionUnit = (typeof DIMENSION_UNITS)[number];

export const DIMENSION_UNIT_LABELS: Record<DimensionUnit, string> = {
  ft: "Feet (ft)",
  m: "Meters (m)",
  in: "Inches (in)"
};

const dimensionAmountPattern = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export function isValidDimensionAmount(value: string): boolean {
  return dimensionAmountPattern.test(value) && Number.isFinite(Number(value));
}

//We store the amount and unit together, just like the existing area field.
//If the optional dimension is blank, we keep it blank.
export function serializePropertyDimension(value: string | undefined, unit: DimensionUnit): string {
  const amount = value?.trim() ?? "";

  return amount ? `${amount} ${unit}` : "";
}

//Older listings stored only the amount because the form always displayed feet.
//For newer listings, we separate the saved amount and unit for the edit form.
export function parsePropertyDimension(value: unknown): { amount: string; unit: DimensionUnit } {
  if (value === undefined || value === null || value === "") {
    return { amount: "", unit: "ft" };
  }

  if (typeof value !== "string") {
    throw new Error("The saved dimension must be a string.");
  }

  const dimension = value.trim();

  if (!dimension) {
    return { amount: "", unit: "ft" };
  }

  if (isValidDimensionAmount(dimension)) {
    return { amount: dimension, unit: "ft" };
  }

  const match = dimension.match(/^(.+?)\s*(ft|m|in)$/i);
  const amount = match?.[1]?.trim();
  const unit = match?.[2]?.toLowerCase() as DimensionUnit | undefined;

  if (!amount || !unit || !isValidDimensionAmount(amount)) {
    throw new Error("The saved dimension must contain an amount and a supported length unit.");
  }

  return { amount, unit };
}
