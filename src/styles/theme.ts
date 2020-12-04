import { colors, createMuiTheme } from '@material-ui/core'

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto'
        },
        body: {
          backgroundColor: colors.grey['900'],
          marginTop: 24
        }
      }
    }
  }
})
