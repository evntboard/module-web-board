import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {ButtonT} from "@/types.ts";
import {Color} from "react-color";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transformToColumn = (b: ButtonT) => ({
  column: {
    start: b.column_start,
    end: b.column_end,
    span: b.column_end - b.column_start
  },
  row: {
    start: b.row_start,
    end: b.row_end,
    span: b.row_end - b.row_start
  }
})

export function parseRGBAString(rgbaString: string | undefined): Color {
  if (!rgbaString) {
    console.error("Invalid RGBA string format");
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    }
  }

  const regex = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/;
  const match = rgbaString.match(regex);

  if (match) {
    const [, red, green, blue, alpha] = match;
    return {
      r: parseInt(red, 10),
      g: parseInt(green, 10),
      b: parseInt(blue, 10),
      a: parseFloat(alpha),
    };
  } else {
    console.error("Invalid RGBA string format");
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 1,
    }
  }
}