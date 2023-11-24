import { ThemeOptions, createTheme } from "@mui/material/styles";
import PoppinsFont from "./font";
import type { } from '@mui/lab/themeAugmentation';
import NextLink from 'next/link';
import { forwardRef } from 'react';

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
  return <NextLink ref={ref} {...props} />;
});

const themeOptions: ThemeOptions = {
  // Auto complete override
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour
      }
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour
      }
    },
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          padding: '0.875rem 1.875rem',
          borderRadius: '0.5rem',
          color: "white",
          height: '3rem',
        },
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #fff inset',
            WebkitTextFillColor: '#000'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '0.875rem 1.875rem',
          borderRadius: '0.5rem',
          color: "white",
          height: '2.5rem',
        },
        sizeLarge: {
          height: '3rem',
        },
        sizeSmall: {
          height: '2rem',
        },
        outlined: {
          color: '#ae1622'
        }
      }
    },
    // MuiLoad
  },
  shadows: ["none", "2px 2px 16px 0px rgba(0, 0, 0, 0.08)"],
  // Color themes
  palette: {
    primary: {
      main: '#ae1622',
    },
    secondary: {
      main: '#efd0d3',
    },
    monochrome: {
      five: '#000',
      four: '#333',
      three: '#666',
      two: '#999',
      one: '#CCC',
      main: '#FFF'
    }
  },
  // Typography
  typography: {
    fontFamily: PoppinsFont.style.fontFamily,
    button: {
      textTransform: 'capitalize',
      fontSize: '1rem',
      fontWeight: 500,
    },
    h1: {
      fontSize: 34,
    },
    h2: {
      fontSize: 30,
    },
    h3: {
      fontSize: 26,
    },
    h4: {
      fontSize: 22,
    },
    h5: {
      fontSize: 18,
    },
    h6: {
      fontSize: 14,
    },
    subtitle1: {
      fontSize: 16,
    },
    subtitle2: {
      fontSzize: 12,
    },
    caption: {
      fontSize: '0.75rem',
      cursor: 'pointer',
      fontWeight: 400,
    }
  },
};

export const theme = createTheme(themeOptions);


