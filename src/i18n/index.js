import enLabel from './en/label.json'
import enMessage from './en/message.json'
import koLabel from './ko/label.json'
import koMessage from './ko/message.json'

const enCombined = Object.assign({}, enLabel, enMessage)
const koCombined = Object.assign({}, koLabel, koMessage)

export default {
  'en-US': enCombined,
  en: enCombined,
  ko: koCombined,
  'ko-KR': koCombined,
  'zh-CN': enCombined,
  vi: enCombined,
  ru: enCombined,
  ja: enCombined
}
