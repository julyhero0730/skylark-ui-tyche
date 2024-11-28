import { boot } from 'quasar/wrappers'
import { Loading, Dialog } from 'quasar'
import { i18n } from 'boot/i18n'
import {
  // ajaxUtil.js
  ajaxUtil
  // axios.js
  , api
  , upload
  , download
  , captcha
  // commonProp.js
  , commonProp
  // commonUtil.js
  , commonUtil
  // dowunloadUtil.js
  , downloadUtil
  // freeformUtil.js
  , freeformUtil
  // gridPropsUtil.js
  , gridPropsUtil
  // messageBox.js
  , messageBox
  // uploadUtil.js
  , uploadUtil
  //   component.js
  , componentsRoute
} from 'skylark-ui-lib'

// Add a api request interceptor
api.interceptors.request.use((config) => {
  Loading.show({ message: i18n.global.t('msg.info.loading') })
  return config
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a api response interceptor
api.interceptors.response.use((response) => {
  Loading.hide()
  return response
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a upload request interceptor
upload.interceptors.request.use((config) => {
  Loading.show({ message: i18n.global.t('msg.info.loading') })
  return config
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a upload response interceptor
upload.interceptors.response.use((response) => {
  Loading.hide()
  return response
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a download request interceptor
download.interceptors.request.use((config) => {
  Loading.show({ message: i18n.global.t('msg.info.loading') })
  return config
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a download response interceptor
download.interceptors.response.use((response) => {
  Loading.hide()
  return response
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a captcha request interceptor
captcha.interceptors.request.use((config) => {
  Loading.show({ message: i18n.global.t('msg.info.loading') })
  return config
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

// Add a captcha response interceptor
captcha.interceptors.response.use((response) => {
  Loading.hide()
  return response
}, (error) => {
  Loading.hide()
  return Promise.reject(error)
})

export default boot(({ app }) => {
  messageBox.Dialog = Dialog
  //   app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$upload = upload
  app.config.globalProperties.$download = download
  app.config.globalProperties.$captcha = captcha

  app.config.globalProperties.$ajaxUtil = ajaxUtil
  app.config.globalProperties.$commonProp = commonProp
  app.config.globalProperties.$commonUtil = commonUtil
  app.config.globalProperties.$downloadUtil = downloadUtil
  app.config.globalProperties.$freeformUtil = freeformUtil
  app.config.globalProperties.$gridPropsUtil = gridPropsUtil
  app.config.globalProperties.$uploadUtil = uploadUtil

  app.config.globalProperties.$messageBox = messageBox
  Object.keys(componentsRoute).forEach(key => {
    app.component(key, componentsRoute[key])
  })
})

export {
  ajaxUtil
  , api
  , upload
  , download
  , captcha
  , commonProp
  , commonUtil
  , downloadUtil
  , freeformUtil
  , gridPropsUtil
  , messageBox
  , uploadUtil
}
