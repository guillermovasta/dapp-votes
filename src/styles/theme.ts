import { createMuiTheme } from '@material-ui/core'

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto'
        },
        body: {
          marginTop: 24
        }
      }
    }
  }
})

export const colors = {
  red: '#ff1744',
  green: '#a6e22e',
  dark: '#20232a',
  light: '#fff'
}
