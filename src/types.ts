export type BoardT = {
  id: string | undefined,
  name: string,
  slug: string | undefined,
  description: string,
  default: boolean,
  image: string | undefined,
  color: string | undefined,
  width: number,
  height: number,
  layout: Array<ButtonT>
}

export type ButtonT = {
  id: string | undefined,
  slug: string | undefined,
  type: 'text' | 'button' | 'switch',
  text: string,
  image: string | undefined,
  color: string | undefined,
  column_start: number,
  column_end: number,
  row_start: number,
  row_end: number,
}

export const defaultButton: ButtonT = {
  slug: "",
  type: "text",
  image: undefined,
  text: "",
  id: undefined,
  color: undefined,
  column_end: 2,
  column_start: 1,
  row_end: 2,
  row_start: 1,
}

export type TmpDataT = {
  slug: string,
  text: string | undefined,
  image: string | undefined,
  color: string | undefined,
}