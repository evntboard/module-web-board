import * as React from 'react'
import {MouseEvent, useMemo, useRef, useState} from 'react'
import {area, template} from 'grid-template-parser'

import {BoardT, ButtonT, defaultButton} from "@/types";
import {clamp} from '@/lib/clamp';
import {generateColor} from "@/lib/generateColor";
import {transformToColumn} from "@/lib/utils";
import {useEventListener} from "@/hook/useEventListener";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {PositionT} from "@/components/preview/type";
import {generateStringId} from "@/lib/generateStringId";
import {ButtonForm} from "@/components/ButtonForm";

import {Track} from './Track'
import {GridLayout} from './GridLayout'
import {Button} from "@/components/ui/button.tsx";


type Props = {
  value: BoardT
  onChange: (a: BoardT) => void
}

export const Preview = ({value: board, onChange}: Props) => {
  const [openDialogDelete, setOpenDialogDelete] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [current, setCurrent] = React.useState<ButtonT>()
  const ref = useRef<HTMLInputElement>(null)

  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedArea, setDraggedArea] = useState<string>()
  const [draggedPosition, setDraggedPosition] = useState<PositionT>()

  const width = useMemo(() => {
    if (board) {
      return board.width
    }
    return 0
  }, [board])

  const height = useMemo(() => {
    if (board) {
      return board.height
    }
    return 0
  }, [board])


  const tpl = useMemo(() => {
    if (board) {
      return template({
        width: board.width,
        height: board.height,
        areas: board.layout.reduce((acc, i) => ({...acc, [i.id ?? '']: transformToColumn(i)}), {})
      })
    }
    return null
  }, [board])

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setDraggedArea(undefined)
      setDraggedPosition(undefined)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) {
      return
    }
    if (isDragging) {
      const rect = ref.current.getBoundingClientRect()
      const x = Math.round((e.clientX - rect.left) / rect.width * width)
      const y = Math.round((e.clientY - rect.top) / rect.height * height)

      switch (true) {
        case typeof draggedPosition === 'string':
          return moveHandler(x, y)
        case typeof draggedArea === 'string':
          return moveTrack(x, y)
        default:
          return null
      }
    }
  }

  useEventListener('mouseup', handleMouseUp)
  useEventListener('mousemove', handleMouseMove)

  const moveTrack = (x: number, y: number) => {
    const button = board?.layout?.find((btn) => btn.id === draggedArea)

    if (!button) {
      return
    }

    const buttonTop = findAdjacentArea(button, 'top')
    const buttonRight = findAdjacentArea(button, 'right')
    const buttonBottom = findAdjacentArea(button, 'bottom')
    const buttonLeft = findAdjacentArea(button, 'left')

    const column_start = clamp(
      x - dx + 1,
      buttonLeft ? buttonLeft.column_end : 1,
      (buttonRight ? buttonRight.column_start : width + 1) - (button.column_end - button.column_start)
    )

    const row_start = clamp(
      y - dy + 1,
      buttonTop ? buttonTop.row_end : 1,
      (buttonBottom ? buttonBottom.row_start : height + 1) - (button.row_end - button.row_start)
    )

    if (column_start !== button.column_start || row_start !== button.row_start) {
      const column_end = column_start + (button.column_end - button.column_start)
      const row_end = row_start + (button.row_end - button.row_start)

      return moveArea({
        ...button,
        column_start,
        column_end,
        row_start,
        row_end
      })
    }
  }

  const makeTrackMouseDown = (e: MouseEvent, button: ButtonT) => {
    if (!ref.current) {
      return
    }

    e.preventDefault()
    const rect = ref.current.getBoundingClientRect()
    const x = Math.round((e.clientX - rect.left) / rect.width * width)
    const y = Math.round((e.clientY - rect.top) / rect.height * height)

    setDx(x - button.column_start + 1)
    setDy(y - button.row_start + 1)

    setIsDragging(true)
    setDraggedArea(button.id)
  }

  const makeHandlerMouseDown = (e: MouseEvent, draggedPosition: PositionT, button: ButtonT) => {
    e.preventDefault()
    setIsDragging(true)
    setDraggedArea(button.id)
    setDraggedPosition(draggedPosition)
  }

  const moveHandler = (x: number, y: number) => {
    if (!draggedPosition) {
      return
    }

    let start
    let end

    const button = board?.layout?.find((btn) => btn.id === draggedArea)

    if (!button) {
      return
    }

    const adjTrigger = findAdjacentArea(button, draggedPosition)

    switch (draggedPosition) {
      case 'top':
        start = clamp(
          y + 1,
          adjTrigger ? adjTrigger.row_end : 1,
          button.row_end - 1
        )
        return moveArea({...button, row_start: start})
      case 'right':
        end = clamp(
          x + 1,
          button.column_start + 1,
          adjTrigger ? adjTrigger.column_start : width + 1
        )
        return moveArea({...button, column_end: end})
      case 'bottom':
        end = clamp(
          y + 1,
          button.row_start + 1,
          adjTrigger ? adjTrigger.row_start : height + 1
        )
        return moveArea({...button, row_end: end})
      case 'left':
        start = clamp(
          x + 1,
          adjTrigger ? adjTrigger.column_end : 1,
          button.column_end - 1
        )
        return moveArea({...button, column_start: start})
      default:
        throw new Error('WTF ?!?')
    }
  }

  const onClickAdd = (e: MouseEvent) => {
    e.preventDefault()
    if (isDragging) {
      return
    }
    const rectGrid = e.currentTarget.getBoundingClientRect()

    const gridHeight = rectGrid.bottom - rectGrid.top
    const gridWidth = rectGrid.right - rectGrid.left

    const mouseX = e.clientX - rectGrid.left
    const mouseY = e.clientY - rectGrid.top

    const colWidth = gridWidth / width
    const colHeight = gridHeight / height

    const x = Math.trunc(mouseX / colWidth)
    const y = Math.trunc(mouseY / colHeight)

    const newArea = area({x, y, width: 1, height: 1})

    setCurrent({
      id: generateStringId(),
      text: "",
      type: "text",
      image: "",
      slug: "",
      color: generateColor(),
      column_start: newArea.column.start,
      column_end: newArea.column.end,
      row_start: newArea.row.start,
      row_end: newArea.row.end
    })
    setOpenDialog(true)
  }

  const moveArea = (button: ButtonT) => {
    onChange?.({
      id: board?.id,
      height: board?.height ?? 0,
      width: board?.width ?? 0,
      slug: board?.slug,
      color: board?.color,
      default: board?.default ?? false,
      image: board?.image,
      name: board?.name ?? '',
      description: board?.description ?? '',
      layout: [
        ...(board?.layout?.filter(i => i.id !== button.id) ?? []),
        button
      ]
    })
  }

  const findAdjacentArea = (button: ButtonT, direction: PositionT) => {
    const {column_start, column_end, row_start, row_end} = button

    switch (direction) {
      case 'top':
        return board?.layout?.find((i) =>
          i.row_end === row_start &&
          i.column_start < column_end &&
          i.column_end > column_start
        )
      case 'right':
        return board?.layout?.find((i) =>
          i.column_start === column_end &&
          i.row_start < row_end &&
          i.row_end > row_start
        )
      case 'bottom':
        return board?.layout?.find((i) =>
          i.row_start === row_end &&
          i.column_start < column_end &&
          i.column_end > column_start
        )
      case 'left':
        return board?.layout?.find((i) =>
          i.column_end === column_start &&
          i.row_start < row_end &&
          i.row_end > row_start
        )
      default:
        throw new Error('WTF !?')
    }
  }

  const handleUpdateBtn = (button: ButtonT) => {
    setCurrent(button)
    setOpenDialog(true)
  }

  const handleDeleteBtn = (button: ButtonT) => {
    setCurrent(button)
    setOpenDialogDelete(true)
  }

  const handleOnSubmitBtn = (button: any) => {
    setOpenDialog(false)
    setCurrent(undefined)

    onChange?.({
      id: board?.id,
      height: board?.height ?? 0,
      width: board?.width ?? 0,
      slug: board?.slug,
      color: board?.color,
      default: board?.default ?? false,
      image: board?.image,
      name: board?.name ?? '',
      description: board?.description ?? '',
      layout: [
        ...(board?.layout?.filter(i => i.id !== button.id) ?? []),
        {
          id: button.id,
          type: button.type,
          slug: button.slug,
          color: button.color,
          text: button.text,
          image: button.image,
          row_start: button.row_start,
          row_end: button.row_end,
          column_start: button.column_start,
          column_end: button.column_end,
        }
      ]
    })
  }

  const handleDeleteBtnCancel = () => {
    setOpenDialogDelete(false)
    setCurrent(undefined)
  }

  const handleDeleteBtnAccept = () => {
    if (!current?.id) {
      handleDeleteBtnCancel()
      return
    }
    onChange?.({
      id: board?.id,
      height: board?.height ?? 0,
      width: board?.width ?? 0,
      slug: board?.slug,
      color: board?.color,
      default: board?.default ?? false,
      image: board?.image,
      name: board?.name ?? '',
      description: board?.description ?? '',
      layout: board?.layout?.filter(i => i.id !== current.id) ?? []
    })
    handleDeleteBtnCancel()
  }

  if (!tpl) {
    return null
  }

  return (
    <>
      <Dialog open={openDialogDelete} onOpenChange={setOpenDialogDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to delete this button ?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={handleDeleteBtnCancel}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteBtnAccept}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to this button ?</DialogTitle>
            <ButtonForm
              defaultValues={current ?? defaultButton}
              onSubmit={handleOnSubmitBtn}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div
        id='preview'
        className="grid flex-1 cursor-pointer overflow-hidden relative"
        ref={ref}
        style={{
          gridTemplateColumns: `repeat(${width}, ${100 / width}%)`,
          gridTemplateRows: `repeat(${height}, ${100 / height}%)`,
          gridTemplateAreas: `${tpl}`
        }}
        onMouseUp={onClickAdd}
      >
        <div className="absolute h-full w-full">
          <GridLayout width={width} height={height}/>
        </div>
        {board?.layout?.map(button => (
          <Track
            key={button.id}
            button={button}
            grabbing={isDragging && draggedArea === button.id}
            onMouseDown={makeTrackMouseDown}
            onHandlerMouseDown={makeHandlerMouseDown}
            onClickUpdate={handleUpdateBtn}
            onClickDelete={handleDeleteBtn}
          />
        ))}
      </div>
    </>
  )
}
