import {MouseEvent} from 'react'

import {cn} from "@/lib/utils";
import {ButtonT} from "@/types";
import {PositionT} from "@/components/preview/type";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import {Handler} from './Handler'

type Props = {
  button: ButtonT,
  grabbing: boolean,
  onMouseDown: (e: MouseEvent, button: ButtonT) => void,
  onHandlerMouseDown: (e: MouseEvent, p: PositionT, button: ButtonT) => void,
  onClickUpdate: (b: ButtonT) => void,
  onClickDelete: (b: ButtonT) => void,
}

export const Track = ({button, grabbing, onMouseDown, onHandlerMouseDown, onClickUpdate, onClickDelete}: Props) => {

  const innerMouseDown = (e: MouseEvent) => {
    onMouseDown(e, button)
  }

  const handleMouseDownTop = (e: MouseEvent) => {
    return onHandlerMouseDown(e, 'top', button)
  }

  const handleMouseDownBottom = (e: MouseEvent) => {
    return onHandlerMouseDown(e, 'bottom', button)
  }

  const handleMouseDownRight = (e: MouseEvent) => {
    return onHandlerMouseDown(e, 'right', button)
  }

  const handleMouseDownLeft = (e: MouseEvent) => {
    return onHandlerMouseDown(e, 'left', button)
  }

  if (!button) {
    return null
  }

  return (
    <div
      onMouseDown={innerMouseDown}
      className='relative grid'
      style={{
        cursor: grabbing ? 'grabbing' : 'grab',
        gridArea: button.id,
        gridTemplateColumns: '4px 1fr 4px',
        gridTemplateRows: '4px 1fr 4px'
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "h-full w-full p-2 rounded-md flex items-center justify-center bg-center bg-cover bg-no-repeat overflow-hidden",
              grabbing && 'shadow-lg',
              !grabbing && 'shadow-sm',
            )}
            style={{
              backgroundColor: button.color,
              backgroundImage: `url(${button.image})`,
              gridColumnStart: 2,
              gridColumnEnd: 3,
              gridRowStart: 2,
              gridRowEnd: 3,
            }}
          >
            {button.text}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => onClickUpdate(button)}>
            Edit
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onClickDelete(button)}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Handler position='top' onMouseDown={handleMouseDownTop}/>
      <Handler position='right' onMouseDown={handleMouseDownRight}/>
      <Handler position='bottom' onMouseDown={handleMouseDownBottom}/>
      <Handler position='left' onMouseDown={handleMouseDownLeft}/>
    </div>
  )
}
