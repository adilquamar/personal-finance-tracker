/**
 * Utility functions for ensuring minimum touch target sizes (44x44px)
 * Following mobile accessibility guidelines
 */

export const MIN_TOUCH_TARGET = 44

/**
 * Returns Tailwind classes for minimum touch target size
 */
export function getTouchTargetClasses() {
  return `min-h-[${MIN_TOUCH_TARGET}px] min-w-[${MIN_TOUCH_TARGET}px]`
}

/**
 * Returns inline styles for minimum touch target size
 */
export function getTouchTargetStyles() {
  return {
    minHeight: `${MIN_TOUCH_TARGET}px`,
    minWidth: `${MIN_TOUCH_TARGET}px`,
  }
}

