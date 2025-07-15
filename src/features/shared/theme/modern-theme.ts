import { createTheme, Theme } from '@mui/material/styles'

// Modern color palette with semantic tokens
const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    secondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    accent: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    glass:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    rainbow:
      'linear-gradient(135deg, #22c55e 0%, #3b82f6 25%, #8b5cf6 50%, #f97316 75%, #ef4444 100%)',
  },
}

// Modern shadows with depth
const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  glow: '0 0 20px rgba(34, 197, 94, 0.3)',
}

// Modern typography scale
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
}

// Animation and transition tokens
const animations = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
}

// Light theme
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[600],
      light: colors.secondary[400],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    background: {
      default: colors.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
    },
    divider: colors.neutral[200],
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: colors.accent[500],
      light: colors.accent[400],
      dark: colors.accent[600],
    },
    success: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[700],
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: 1.4,
      color: colors.neutral[500],
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    shadows.xs,
    shadows.sm,
    shadows.base,
    shadows.md,
    shadows.lg,
    shadows.xl,
    shadows['2xl'],
    shadows.glass,
    shadows.glow,
    // MUI requires 25 shadow levels
    ...Array(15).fill(shadows.base),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: typography.fontFamily,
          backgroundColor: colors.neutral[50],
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.neutral[200]}`,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: shadows.base,
          transition: `all ${animations.duration.base} ${animations.easing.ease}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadows.lg,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: typography.fontWeight.medium,
          fontSize: typography.fontSize.base,
          padding: '12px 24px',
          transition: `all ${animations.duration.base} ${animations.easing.ease}`,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: shadows.md,
          },
        },
        contained: {
          background: colors.gradients.primary,
          boxShadow: shadows.sm,
          '&:hover': {
            background: colors.gradients.primary,
            filter: 'brightness(1.1)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            background: 'rgba(34, 197, 94, 0.05)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: `all ${animations.duration.fast} ${animations.easing.ease}`,
          '&:hover': {
            transform: 'scale(1.05)',
            background: 'rgba(34, 197, 94, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: `all ${animations.duration.base} ${animations.easing.ease}`,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              background: '#ffffff',
              boxShadow: shadows.glow,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: typography.fontWeight.medium,
          fontSize: typography.fontSize.sm,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.neutral[200]}`,
        },
        colorPrimary: {
          background: colors.gradients.primary,
          color: '#ffffff',
          border: 'none',
        },
        colorSecondary: {
          background: colors.gradients.secondary,
          color: '#ffffff',
          border: 'none',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: colors.gradients.primary,
          boxShadow: shadows.sm,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.neutral[200]}`,
          boxShadow: shadows.lg,
          marginTop: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: `all ${animations.duration.fast} ${animations.easing.ease}`,
          '&:hover': {
            background: 'rgba(34, 197, 94, 0.1)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
  },
})

// Dark theme
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[500],
      light: colors.primary[400],
      dark: colors.primary[600],
      contrastText: colors.neutral[900],
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[500],
      contrastText: colors.neutral[900],
    },
    background: {
      default: colors.neutral[900],
      paper: colors.neutral[800],
    },
    text: {
      primary: colors.neutral[100],
      secondary: colors.neutral[400],
    },
    divider: colors.neutral[700],
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: colors.accent[500],
      light: colors.accent[400],
      dark: colors.accent[600],
    },
    success: {
      main: colors.primary[500],
      light: colors.primary[400],
      dark: colors.primary[600],
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
  },
  typography: lightTheme.typography,
  shape: lightTheme.shape,
  shadows: lightTheme.shadows,
  components: {
    ...lightTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: typography.fontFamily,
          backgroundColor: colors.neutral[900],
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.neutral[700]}`,
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: shadows.base,
          transition: `all ${animations.duration.base} ${animations.easing.ease}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: shadows.lg,
            border: `1px solid ${colors.neutral[600]}`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: `all ${animations.duration.base} ${animations.easing.ease}`,
            '&:hover': {
              background: 'rgba(30, 41, 59, 0.9)',
            },
            '&.Mui-focused': {
              background: colors.neutral[800],
              boxShadow: shadows.glow,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: typography.fontWeight.medium,
          fontSize: typography.fontSize.sm,
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.neutral[700]}`,
          color: colors.neutral[300],
        },
        colorPrimary: {
          background: colors.gradients.primary,
          color: '#ffffff',
          border: 'none',
        },
        colorSecondary: {
          background: colors.gradients.secondary,
          color: '#ffffff',
          border: 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          background: 'rgba(30, 41, 59, 0.9)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.neutral[700]}`,
          boxShadow: shadows.lg,
          marginTop: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: `all ${animations.duration.fast} ${animations.easing.ease}`,
          '&:hover': {
            background: 'rgba(34, 197, 94, 0.2)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
  },
})

// Export design tokens for use in components
export { colors, shadows, typography, animations }

// Helper functions for common styling patterns
export const glassMorphism = (opacity = 0.1) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
})

export const darkGlassMorphism = (opacity = 0.1) => ({
  background: `rgba(30, 41, 59, ${opacity})`,
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
})

export const hoverScale = (scale = 1.02) => ({
  transition: `all ${animations.duration.base} ${animations.easing.spring}`,
  '&:hover': {
    transform: `scale(${scale})`,
  },
})

export const hoverGlow = (color = colors.primary[500]) => ({
  transition: `all ${animations.duration.base} ${animations.easing.ease}`,
  '&:hover': {
    boxShadow: `0 0 20px ${color}40`,
  },
})
