import { I18n } from 'i18n'
import path from 'node:path'
import * as utils from './utils.js'

const i18n = new I18n({
  locales: ['en', 'es'],
  directory: path.join(utils.__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true,
  cookie: 'nodepop-locale'
})

export default i18n
