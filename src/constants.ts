import {BoardT} from "@/types";
import {generateStringId} from "@/lib/generateStringId.ts";
import {generateColor} from "@/lib/generateColor.ts";

export const EVNTBOARD_KEY_DATA = "board"

export const EVNTBOARD_KEY_TEMP = "tmp:board"

export const MODULE_CODE = 'board'

export const defaultBoards: BoardT[] = [
  {
    id: generateStringId(),
    default: true,
    name: "Board 1",
    slug: "board-1",
    height: 5,
    width: 5,
    image: undefined,
    color: generateColor(),
    description: "Your first board",
    layout: [
      {
        id: generateStringId(),
        slug: "btn-1",
        type: "button",
        text: "Button 1",
        image: undefined,
        color: generateColor(),
        row_start: 1,
        row_end: 2,
        column_start: 1,
        column_end: 2,
      },
      {
        id: generateStringId(),
        slug: "txt-1",
        type: "text",
        text: "DEFAULT",
        image: undefined,
        color: generateColor(),
        row_start: 1,
        row_end: 2,
        column_start: 2,
        column_end: 3,
      },
      {
        id: generateStringId(),
        slug: "switch-1",
        type: "switch",
        text: "board-2",
        image: undefined,
        color: generateColor(),
        row_start: 1,
        row_end: 2,
        column_start: 3,
        column_end: 4,
      }
    ]
  },
  {
    id: generateStringId(),
    default: true,
    name: "Board 2",
    slug: "board-2",
    height: 5,
    width: 5,
    image: undefined,
    color: generateColor(),
    description: "Your second board",
    layout: [
      {
        id: generateStringId(),
        slug: "btn-2",
        type: "button",
        text: "Button 2",
        image: undefined,
        color: generateColor(),
        row_start: 1,
        row_end: 2,
        column_start: 1,
        column_end: 2,
      },
      {
        id: generateStringId(),
        slug: "txt-2",
        type: "text",
        text: "DEFAULT",
        image: undefined,
        color: generateColor(),
        row_start: 1,
        row_end: 2,
        column_start: 2,
        column_end: 3,
      },
      {
        id: generateStringId(),
        slug: "switch-2",
        type: "switch",
        text: "board-1",
        image: undefined,
        color: generateColor(),
        row_start: 1,
        row_end: 2,
        column_start: 3,
        column_end: 4,
      }
    ]
  }
]