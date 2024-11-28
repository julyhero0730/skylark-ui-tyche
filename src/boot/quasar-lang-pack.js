// -- With @quasar/app-vite --

import { Quasar } from 'quasar'
import { useSessionStore } from 'stores/session'

// relative path to your node_modules/quasar/..
// change to YOUR path
const langList = import.meta.glob('../../node_modules/quasar/lang/*.mjs')
const session = useSessionStore()
let value = ''

if (session.sysLangCd === 'EN') {
  value = 'en-US'
} else if (session.sysLangCd === 'ZH') {
  value = 'zh-CN'
} else if (session.sysLangCd === 'KO') {
  value = 'ko-KR'
} else {
  value = session.sysLangCd
}
// or just a select few (example below with only DE and FR):
// import.meta.glob('../../node_modules/quasar/lang/(de|fr).mjs')

export default async () => {
  const langIso = value // ... some logic to determine it (use Cookies Plugin?)

  try {
    langList[`../../node_modules/quasar/lang/${langIso}.mjs`]().then(lang => {
      Quasar.lang.set(lang.default)
    })
  } catch (err) {
    return null
  }
}
