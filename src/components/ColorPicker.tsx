import {parseRGBAString} from "@/lib/utils.ts";
import {Color, ColorResult, CirclePicker} from "react-color";

import {useEffect, useState} from "react";

type Props = {
  value: string | undefined,
  onChange: (s: string) => void
}

export const ColorPicker = (props: Props) => {
  const [color, setColor] = useState<Color>()

  useEffect(() => {
    setColor(parseRGBAString(props.value))
  }, [props.value]);


  const handleOnChangeComplete = (color: ColorResult) => {
    const newColor = {
      r: color.rgb.r,
      g: color.rgb.g,
      b: color.rgb.b,
      a: color.rgb.a,
    }
    setColor(newColor)
    props.onChange(`rgba(${newColor.r},${newColor.g},${newColor.b},${newColor.a})`)
  }

  return (
    <CirclePicker
      color={color}
      onChangeComplete={handleOnChangeComplete}
    />
  )
}