type Props = {
  height: number
  width: number
}

export const GridLayout = ({height, width}: Props) => {
  return (
    <svg className='w-full h-full'>
      <g>
        {Array.from(
          {length: width - 1},
          (_, index) => (
            <line
              style={{
                stroke: '#636363',
                strokeWidth: 1
              }}
              key={index}
              x1={`${(index + 1) / width * 100}%`}
              y1='0%'
              x2={`${(index + 1) / width * 100}%`}
              y2='100%'
            />
          )
        )}
      </g>
      <g>
        {Array.from(
          {length: height - 1},
          (_, index) => (
            <line
              style={{
                stroke: '#636363',
                strokeWidth: 1
              }}
              key={index}
              x1='0%'
              y1={`${(index + 1) / height * 100}%`}
              x2='100%'
              y2={`${(index + 1) / height * 100}%`}
            />
          )
        )}
      </g>
    </svg>
  )
}
