// src/boot/i18n.js 수정
import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { useSessionStore } from 'stores/session'

const session = useSessionStore()
let locale = 'en' // 기본 언어 설정
if (session.sysLangCd) {
  if (session.sysLangCd === 'EN') {
    locale = 'en-US'
  } else if (session.sysLangCd === 'ZH') {
    locale = 'zh-CN'
  } else if (session.sysLangCd === 'KO') {
    locale = 'ko-KR'
  } else {
    locale = session.sysLangCd.toLowerCase()
  }
}

const i18n = createI18n({
  legacy: false,
  locale,
  messages,
  globalInjection: true
})

export default boot(({ app }) => {
  app.use(i18n)
})
export { i18n }
