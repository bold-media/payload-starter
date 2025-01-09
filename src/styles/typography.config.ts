import type { Config } from 'tailwindcss'

type Theme = Config['theme'] & {
  colors?: {
    zinc?: {
      [key: string]: string
    }
  }
}

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px: number) => `${round(px / 16)}rem`
const em = (px: number, base: number) => `${round(px / base)}em`

export const typographyConfig = ({ theme }: { theme: Theme }) => ({
  DEFAULT: {
    css: {},
  },
})
