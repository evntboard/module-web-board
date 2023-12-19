import {useState} from 'react'

import {cn} from "@/lib/utils";
import {ButtonT, TmpDataT} from "@/types";

type Props = {
  extra: TmpDataT | undefined
  button: ButtonT
  onClick: (d: ButtonT) => void
}

export const BoardButton = ({button, onClick, extra}: Props) => {
  const [clicked, setClicked] = useState(false)

  const onMouseDown = () => {
    setClicked(true)
  }

  const onMouseUp = () => {
    setClicked(false)
  }

  const onClickButton = () => {
    onClick(button)
  }

  if (!button) {
    return null
  }

  return (
    <div
      className='p-2'
      style={{
        gridArea: button.id
      }}
    >
      <button
        onClick={onClickButton}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={cn(
          'h-full w-full p-2 rounded-md flex items-center justify-center bg-center bg-cover bg-no-repeat overflow-hidden whitespace-pre-line',
          clicked && 'shadow-sm',
          !clicked && 'shadow-lg'
        )}
        style={{
          backgroundImage: `url(${extra?.image ?? button.image})`,
          backgroundColor: extra?.color ?? button.color,
        }}
      >
        {extra?.text ?? button.text}
      </button>
    </div>
  )
}
