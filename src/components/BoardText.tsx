import {ButtonT, TmpDataT} from "@/types.ts";

type Props = {
  extra: TmpDataT | undefined
  button: ButtonT
}

export const BoardText = ({button, extra}: Props) => {
  if (!button) {
    return null
  }

  return (
    <div
      className='p-2'
      style={{
        gridArea: button.id,
      }}
    >
      <div
        className='h-full w-full p-2 rounded-md flex items-center justify-center bg-center bg-cover bg-no-repeat overflow-hidden whitespace-pre-line'
        style={{
          backgroundColor: extra?.color ?? button.color,
          backgroundImage: `url(${extra?.image ?? button.image})`,
        }}
      >
        {extra?.text ?? button.text}
      </div>
    </div>
  )
}
