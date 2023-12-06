export const generateColor = (): string => {
  const s = 255
  const o = Math.round;
  const r = Math.random;
  return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',1)'
}
