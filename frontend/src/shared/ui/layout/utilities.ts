import { cn } from "@/shared/lib/utils";

export interface SpacingProps {
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  p?: number | string;
  px?: number | string;
  py?: number | string;
  pt?: number | string;
  pb?: number | string;
  pl?: number | string;
  pr?: number | string;
}

const spacingMap: Record<string, string> = {
  m: "m",
  mx: "mx",
  my: "my",
  mt: "mt",
  mb: "mb",
  ml: "ml",
  mr: "mr",
  p: "p",
  px: "px",
  py: "py",
  pt: "pt",
  pb: "pb",
  pl: "pl",
  pr: "pr",
};

export function getSpacingClasses(props: SpacingProps): string {
  const classes: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const prefix = spacingMap[key];
    if (prefix) {
      classes.push(`${prefix}-${value}`);
    }
  });

  return cn(...classes);
}

export function extractSpacingProps<T extends SpacingProps>(
  props: T
): { spacingProps: SpacingProps; otherProps: Omit<T, keyof SpacingProps> } {
  const spacingProps: SpacingProps = {};
  const otherProps = {} as Record<string, unknown>;

  Object.entries(props).forEach(([key, value]) => {
    if (key in spacingMap) {
      (spacingProps as Record<string, unknown>)[key] = value;
    } else {
      otherProps[key] = value;
    }
  });

  return {
    spacingProps,
    otherProps: otherProps as Omit<T, keyof SpacingProps>,
  };
}
