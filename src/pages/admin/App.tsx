import {useMemo} from "react";
import {template} from 'grid-template-parser'

import {useAppStore} from "@/store";
import {transformToColumn} from "@/lib/utils";
import {BoardButton} from "@/components/BoardButton";
import {BoardText} from "@/components/BoardText";
import {ButtonT} from "@/types.ts";
import {BoardSwitch} from "@/components/BoardSwitch.tsx";

export function App() {
  const boards = useAppStore(state => state.boards)
  const tmpDatas = useAppStore(state => state.tmp)
  const selectedBoardId = useAppStore(state => state.selectedBoardId)
  const emitButtonClick = useAppStore(state => state.emitButtonClick)

  const currentBoard = useMemo(() => {
    return boards?.find((b) => b.id === selectedBoardId) ?? undefined
  }, [boards, selectedBoardId])

  const tpl = useMemo(() => {
    if (currentBoard) {
      return template({
        width: currentBoard.width,
        height: currentBoard.height,
        areas: currentBoard.layout.reduce((acc, i) => ({...acc, [i.id ?? '']: transformToColumn(i)}), {})
      })
    }
    return null
  }, [currentBoard])

  const handleBtnClick = async (btn: ButtonT) => {
    await emitButtonClick({button: btn})
  }

  if (!currentBoard || !tpl) {
    return null
  }

  return (
    <div
      className="grid h-full w-full rounded-md overflow-hidden bg-center bg-no-repeat bg-cover"
      style={{
        gridTemplateColumns: `repeat(${currentBoard.width}, ${100 / currentBoard.width}%)`,
        gridTemplateRows: `repeat(${currentBoard.height}, ${100 / currentBoard.height}%)`,
        gridTemplateAreas: `${tpl}`,
        backgroundColor: currentBoard.color,
        backgroundImage: `url(${currentBoard.image})`,
      }}
    >
      {currentBoard.layout.map(button => {
        const tmpData = tmpDatas.find(({ slug }) => slug === button.slug)
        switch (button.type) {
          case 'switch':
            return (
              <BoardSwitch
                extra={tmpData}
                key={button.id}
                button={button}
              />
            )
          case 'button':
            return (
              <BoardButton
                extra={tmpData}
                onClick={handleBtnClick}
                key={button.id}
                button={button}
              />
            )
          case 'text':
            return (
              <BoardText
                extra={tmpData}
                key={button.id}
                button={button}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}