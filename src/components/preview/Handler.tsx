import {MouseEvent, useMemo} from "react";

import {PositionT} from "@/components/preview/type";

type Props = {
  position: PositionT
  onMouseDown: (e: MouseEvent) => void
}

export const Handler = ({position, onMouseDown}: Props) => {

  const style = useMemo(() => {
    switch (position) {
      case "left":
        return {
          gridColumnStart: 1,
          gridColumnEnd: 2,
          gridRowStart: 2,
          gridRowEnd: 3,
          cursor: "col-resize",
        }
      case "right":
        return {
          gridColumnStart: 3,
          gridColumnEnd: 4,
          gridRowStart: 2,
          gridRowEnd: 3,
          cursor: "col-resize",
        }
      case "bottom":
        return {
          gridColumnStart: 2,
          gridColumnEnd: 3,
          gridRowStart: 3,
          gridRowEnd: 4,
          cursor: "row-resize",
        }
      case "top":
      default:
        return {
          gridColumnStart: 2,
          gridColumnEnd: 3,
          gridRowStart: 1,
          gridRowEnd: 2,
          cursor: "row-resize",
        }
    }
  }, [position])

  return (
    <div
      style={style}
      className='h-full w-full'
      onMouseDown={onMouseDown}
    />
  )
}
