// Per-component font helper
export function getComponentFonts(settings, prefix) {
  return {
    fs:  parseInt(settings[`${prefix}_font_large`])  || parseInt(settings.font_large)  || 52,
    fm:  parseInt(settings[`${prefix}_font_medium`]) || parseInt(settings.font_medium) || 22,
    fsm: parseInt(settings[`${prefix}_font_small`])  || parseInt(settings.font_small)  || 13,
    ff:  settings.font_family || 'Segoe UI',
  }
}
