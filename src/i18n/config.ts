export type Locale = (typeof locales)[number]

export const locales = ['en', 'hi', 'gu'] as const

export const defaultLocale: Locale = 'en'
