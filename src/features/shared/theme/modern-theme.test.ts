import { describe, it, expect } from 'vitest'
import {
  lightTheme,
  darkTheme,
  colors,
  shadows,
  typography,
  animations,
  glassMorphism,
  darkGlassMorphism,
  hoverScale,
  hoverGlow,
} from './modern-theme'

describe('Modern Theme', () => {
  describe('Color Palette', () => {
    it('should have complete color scales', () => {
      expect(colors.primary).toHaveProperty('50')
      expect(colors.primary).toHaveProperty('500')
      expect(colors.primary).toHaveProperty('950')

      expect(colors.secondary).toHaveProperty('50')
      expect(colors.secondary).toHaveProperty('500')
      expect(colors.secondary).toHaveProperty('950')

      expect(colors.neutral).toHaveProperty('50')
      expect(colors.neutral).toHaveProperty('500')
      expect(colors.neutral).toHaveProperty('950')
    })

    it('should have gradient definitions', () => {
      expect(colors.gradients).toHaveProperty('primary')
      expect(colors.gradients).toHaveProperty('secondary')
      expect(colors.gradients).toHaveProperty('accent')
      expect(colors.gradients).toHaveProperty('glass')
      expect(colors.gradients).toHaveProperty('rainbow')

      expect(colors.gradients.primary).toContain('linear-gradient')
      expect(colors.gradients.rainbow).toContain('linear-gradient')
    })
  })

  describe('Typography', () => {
    it('should have font family stack', () => {
      expect(typography.fontFamily).toContain('Inter')
      expect(typography.fontFamily).toContain('sans-serif')
    })

    it('should have font weight scale', () => {
      expect(typography.fontWeight).toHaveProperty('light', 300)
      expect(typography.fontWeight).toHaveProperty('normal', 400)
      expect(typography.fontWeight).toHaveProperty('bold', 700)
      expect(typography.fontWeight).toHaveProperty('extrabold', 800)
    })

    it('should have font size scale', () => {
      expect(typography.fontSize).toHaveProperty('xs', '0.75rem')
      expect(typography.fontSize).toHaveProperty('base', '1rem')
      expect(typography.fontSize).toHaveProperty('xl', '1.25rem')
      expect(typography.fontSize).toHaveProperty('6xl', '3.75rem')
    })
  })

  describe('Shadows', () => {
    it('should have shadow scale from xs to 2xl', () => {
      expect(shadows).toHaveProperty('xs')
      expect(shadows).toHaveProperty('sm')
      expect(shadows).toHaveProperty('base')
      expect(shadows).toHaveProperty('md')
      expect(shadows).toHaveProperty('lg')
      expect(shadows).toHaveProperty('xl')
      expect(shadows).toHaveProperty('2xl')
    })

    it('should have special effect shadows', () => {
      expect(shadows).toHaveProperty('glass')
      expect(shadows).toHaveProperty('glow')

      expect(shadows.glass).toContain('rgba')
      expect(shadows.glow).toContain('rgba')
    })
  })

  describe('Animations', () => {
    it('should have duration scale', () => {
      expect(animations.duration).toHaveProperty('fast', '150ms')
      expect(animations.duration).toHaveProperty('base', '200ms')
      expect(animations.duration).toHaveProperty('slow', '300ms')
      expect(animations.duration).toHaveProperty('slower', '500ms')
    })

    it('should have easing functions', () => {
      expect(animations.easing).toHaveProperty('ease')
      expect(animations.easing).toHaveProperty('easeIn')
      expect(animations.easing).toHaveProperty('easeOut')
      expect(animations.easing).toHaveProperty('spring')

      expect(animations.easing.ease).toContain('cubic-bezier')
      expect(animations.easing.spring).toContain('cubic-bezier')
    })
  })

  describe('Light Theme', () => {
    it('should have light palette mode', () => {
      expect(lightTheme.palette.mode).toBe('light')
    })

    it('should have primary color configuration', () => {
      expect(lightTheme.palette.primary.main).toBe(colors.primary[600])
      expect(lightTheme.palette.primary.contrastText).toBe('#ffffff')
    })

    it('should have background colors for light mode', () => {
      expect(lightTheme.palette.background.default).toBe(colors.neutral[50])
      expect(lightTheme.palette.background.paper).toBe('#ffffff')
    })

    it('should have typography configuration', () => {
      expect(lightTheme.typography.fontFamily).toBe(typography.fontFamily)
      expect(lightTheme.typography.h1?.fontSize).toBe(
        typography.fontSize['4xl']
      )
      expect(lightTheme.typography.h1?.fontWeight).toBe(
        typography.fontWeight.bold
      )
    })

    it('should have custom component styles', () => {
      expect(
        lightTheme.components?.MuiButton?.styleOverrides?.root
      ).toBeDefined()
      expect(lightTheme.components?.MuiCard?.styleOverrides?.root).toBeDefined()
      expect(
        lightTheme.components?.MuiTextField?.styleOverrides?.root
      ).toBeDefined()
    })
  })

  describe('Dark Theme', () => {
    it('should have dark palette mode', () => {
      expect(darkTheme.palette.mode).toBe('dark')
    })

    it('should have primary color configuration', () => {
      expect(darkTheme.palette.primary.main).toBe(colors.primary[500])
      expect(darkTheme.palette.primary.contrastText).toBe(colors.neutral[900])
    })

    it('should have background colors for dark mode', () => {
      expect(darkTheme.palette.background.default).toBe(colors.neutral[900])
      expect(darkTheme.palette.background.paper).toBe(colors.neutral[800])
    })

    it('should have text colors for dark mode', () => {
      expect(darkTheme.palette.text.primary).toBe(colors.neutral[100])
      expect(darkTheme.palette.text.secondary).toBe(colors.neutral[400])
    })
  })

  describe('Helper Functions', () => {
    describe('glassMorphism', () => {
      it('should return glass morphism styles with default opacity', () => {
        const styles = glassMorphism()

        expect(styles.background).toBe('rgba(255, 255, 255, 0.1)')
        expect(styles.backdropFilter).toBe('blur(20px)')
        expect(styles.border).toBe('1px solid rgba(255, 255, 255, 0.2)')
      })

      it('should accept custom opacity', () => {
        const styles = glassMorphism(0.5)

        expect(styles.background).toBe('rgba(255, 255, 255, 0.5)')
      })
    })

    describe('darkGlassMorphism', () => {
      it('should return dark glass morphism styles', () => {
        const styles = darkGlassMorphism()

        expect(styles.background).toBe('rgba(30, 41, 59, 0.1)')
        expect(styles.backdropFilter).toBe('blur(20px)')
        expect(styles.border).toBe('1px solid rgba(255, 255, 255, 0.1)')
      })

      it('should accept custom opacity', () => {
        const styles = darkGlassMorphism(0.3)

        expect(styles.background).toBe('rgba(30, 41, 59, 0.3)')
      })
    })

    describe('hoverScale', () => {
      it('should return hover scale styles with default scale', () => {
        const styles = hoverScale()

        expect(styles.transition).toContain(animations.duration.base)
        expect(styles.transition).toContain(animations.easing.spring)
        expect(styles['&:hover'].transform).toBe('scale(1.02)')
      })

      it('should accept custom scale', () => {
        const styles = hoverScale(1.1)

        expect(styles['&:hover'].transform).toBe('scale(1.1)')
      })
    })

    describe('hoverGlow', () => {
      it('should return hover glow styles with default color', () => {
        const styles = hoverGlow()

        expect(styles.transition).toContain(animations.duration.base)
        expect(styles.transition).toContain(animations.easing.ease)
        expect(styles['&:hover'].boxShadow).toContain(colors.primary[500])
      })

      it('should accept custom color', () => {
        const customColor = '#ff0000'
        const styles = hoverGlow(customColor)

        expect(styles['&:hover'].boxShadow).toContain(customColor)
      })
    })
  })
})
