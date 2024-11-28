<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container>
        <q-page class="login_container window-height window-width row justify-center items-center" @keyup.enter="onSubmit">
            <div class="login_card_wrapper">
                <div class="logo_title_box">
                  <img src="~/assets/images/logo-shin-02.png" class="big_logo" alt="logo" />
          <p class="login_title">Shinhan Banking System</p>

          <footer class="login_footer">
            <img src="~/assets/images/skylark-logo-sd.png" class="login_footer_logo" alt="skylark logo" />
            <div class="login_footer_info">
              <p>(C)2023 All Rights Reserved</p>
              <p>IMB System Made with by skylark</p>
            </div>
          </footer>
                <!-- <p class="frm_login_logo full-width"></p> -->
                </div>
                    <div class="login_form">
                        <!-- <div class="text-center full-width" style="height: 0px;">
                            <span class="auth-head-icon"></span>
                        </div> -->
                        <h4 class="login_form_title">{{ $t('label.view.login') }}</h4>
                        <q-card-section>
                            <q-form class="login_info" @submit.prevent="onSubmit" id="loginForm" >
                              <div>
                                <CommonInput autofocus maxlength="20" :label="$t('label.objt.userId')"
                                    v-model="loginForm.sysUsrid.value"
                                    @update:model-value="validateInputValue('sysUsrid')"
                                    @blur="validateInputValue('sysUsrid')"
                                    :error="loginForm.sysUsrid.error"
                                    class="bg_filled"
                                    :error-message="loginForm.sysUsrid.msg">
                                </CommonInput>
                              </div>
                              <div>
                                <CommonPassword :label="$t('label.objt.password')"
                                    v-model="loginForm.sysPasswd.value"
                                    @update:model-value="validateInputValue('sysPasswd')"
                                    @blur="validateInputValue('sysPasswd')"
                                    :rules="[
                                        val => !!val || loginForm.sysPasswd.msg,
                                        ]"
                                    lazy-rules
                                    :hint="hint"
                                    class="bg_filled">
                                </CommonPassword>
                              </div>
                              <div v-show="captchaVisible">
                                <!-- <q-input type="text" v-model="loginFalseCnt"></q-input>
                                <q-input type="text" v-model="maxLoginFalseCount"></q-input> -->
                                <q-img
                                  v-show="captchaVisible"
                                  :src="captchaSrc"
                                  spinner-color="white"
                                  style="height: 50px; width: 290px"
                                />
                                <q-btn v-show="captchaVisible" type="button" flat class="float-right btn" @click.prevent="getImage()"><img src="~/assets/images/btn-btn-ic-refresh.svg" alt="refresh icon" /></q-btn>
                              </div>
                              <div v-show="captchaVisible">
                                <CommonInput
                                    v-show="captchaVisible"
                                    v-model="captchaCode"
                                    label="Code"
                                    maxlength="6"
                                    class="bg_filled"
                                    ref="captchaRef"
                                />
                              </div>
                              <div>
                                <CommonSelectBox :codeList="languageCodeList" v-model="loginForm.sysLang.value" class="bg_filled"></CommonSelectBox>
                                <input type="hidden" v-model="loginForm.sysOrganizationCode.value" />
                              </div>
                                <q-btn
                                  unelevated size="lg" class="login_btn"
                                  :label="$t('label.view.login')"
                                  :disable="!commonUtil.checkSubmitRequired(loginForm)"
                                  :color="!commonUtil.checkSubmitRequired(loginForm) ? 'grey-6' : 'indigo-10'"
                                  @click.prevent="onSubmit"
                                >
                                </q-btn>
                              <q-checkbox size="xs" v-model="keepId" :label="$t('msg.info.saveId')" style="margin-left: 10px;" @click="setKeepId"/>
                            </q-form>
                        </q-card-section>
                    </div>
            </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { api, captcha, ajaxUtil, commonUtil, messageBox } from 'boot/bootFrm'
// import { api, captcha } from 'boot/axios'
// import { ajaxUtil } from 'boot/ajaxUtil'
// import { commonUtil } from 'boot/commonUtil'
// import { messageBox } from 'boot/messageBox'
import { date, useQuasar } from 'quasar'
import { i18n } from 'boot/i18n'
import { ref, watch } from 'vue'
import { useSessionStore } from 'stores/session'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
// import axios from 'axios'

const { addToDate } = date
const { locale } = useI18n()

const $q = useQuasar()
const router = useRouter()
const session = useSessionStore()

const hint = ref('')

session.removeSession()
locale.value = 'en-US'
session.sysLangCd = 'EN'

const keepId = ref(false)
const languageCodeList = ref([])
const loginForm = ref({
  sysUsrid: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.userId')
  },
  sysPasswd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.password')
  },
  sysLang: {
    value: 'EN',
    required: false,
    description: i18n.global.t('label.view.language')
  },
  sysOrganizationCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.organizationCode')
  }
})

watch(() => loginForm.value.sysPasswd.value, (newVal, oldVal) => {
  if (/[A-Z]/.test(newVal)) {
    hint.value = i18n.global.t('msg.info.uppercase')
  } else {
    hint.value = ''
  }
})

const validateInputValue = (field = '') => {
  commonUtil.validateInput(loginForm.value, field)
}

const onSubmit = () => {
// 로그인 계정 입력값 체크
  if (!commonUtil.isFormValid(loginForm)) {
    return false
  }

  // * 캡차 이미지가 없는 경우
  // 로그인 서비스 호출
  if (!captchaVisible.value) {
    submitLoginForm()
  } else {
  // * 캡차 이미지가 보이는 경우
  // 1. 캡차 코드 입력값 체크
    if (!checkCodeValue()) {
      return false
    }
    // 2. 캡차 코드 입력값 일치 확인
    const param = { captchaCode: captchaCode.value }
    return new Promise(function (resolve, reject) {
      api.post('/chkAnswer.do', JSON.stringify(param))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          messageBox.alertAjaxError(error)
          reject(error)
        })
    }).then((result) => {
      if (result === 200) {
      // 3. 일치 : 로그인 서비스 호출
        submitLoginForm()
      } else {
      // 4. 불일치 : Alert 메세지 노출
        alert('캡차 코드 불일치')
        clearCaptchaCode()
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}

const setKeepId = () => {
  if (keepId.value) {
    const obj = {
      value: loginForm.value.sysUsrid.value,
      expire: addToDate(new Date(), { days: 7 })
    }

    const objString = JSON.stringify(obj)
    $q.localStorage.set('userInputId', objString)
  } else {
    $q.localStorage.remove('userInputId')
  }
}

// Initialize ID
const userInputId = $q.localStorage.getItem('userInputId')
if (userInputId) {
  const item = JSON.parse(userInputId)
  const unit = 'days'
  const diff = date.getDateDiff(new Date(), item.expire, unit)
  if (diff <= 7) {
    loginForm.value.sysUsrid.value = item.value
    keepId.value = true
  } else {
    $q.localStorage.remove('userInputId')
  }
}

const loadData = () => {
  api.post('/FRM/FCD/LGN/FRMFCDLGN100.do')
    .then((response) => {
      if (response.data.MAX_LOGIN_FALSE_COUNT !== null) {
        maxLoginFalseCount.value = response.data.MAX_LOGIN_FALSE_COUNT
      }
      if (response.data.LANGUAGE_CODE_LIST !== null) {
        languageCodeList.value = response.data.LANGUAGE_CODE_LIST
      }
      loginForm.value.sysOrganizationCode.value = response.data.SYS_ORGANIZATION_CODE
    })
    .catch(() => {
      const obj = [{
        code: 'EN',
        codeValue: 'English'
      }]
      languageCodeList.value = obj
      loginForm.value.sysOrganizationCode.value = '1000'
    })
}

// 지연로그인
const captchaCode = ref('')
const loginFalseCnt = ref(0)
const maxLoginFalseCount = ref(0)
const captchaVisible = ref(false)
const captchaSrc = ref('')
const captchaRef = ref(null)
// const matchFlag = ref(false)

/**
*
*/
function compareLoginFalseCount () {
  if (maxLoginFalseCount.value !== 0) {
    if (maxLoginFalseCount.value <= loginFalseCnt.value) {
      getImage()
      captchaVisible.value = true
    } else {
      captchaVisible.value = false
    }
  } else {
    captchaVisible.value = false
  }
}

/* captcha */
// 캡차이미지 불러오기
/**
*
*/
function getImage () {
  captcha.get('/captchaImg.do?rand=' + Math.random())
    .then((response) => {
      const url = window.URL.createObjectURL(response.data)
      captchaSrc.value = url
    })
    .catch(() => {

    })
}

const checkCodeValue = () => {
  if (captchaCode.value === '' || captchaCode.value === undefined) {
    messageBox.alertError(i18n.global.t('msg.error.captcha'))
    return false
  } else {
    return true
  }
}

const submitLoginForm = () => {
  const loginParam = commonUtil.objectToJson(loginForm)
  ajaxUtil.ajaxCall('/FRM/FCD/LGN/FRMFCDLGN101.do', loginParam)
    .then((response) => {
      const blnSucess = response.blnSucess
      session.removeSession()
      if (!blnSucess) {
        messageBox.alertNormalError(response)
        loginFalseCnt.value++
      } else {
      // Setting Login Info
        const loginInfo = response
        session.setLoginInfo(
          loginInfo.sysUserId,
          loginInfo.sysLangCd,
          loginInfo.sysOrganizationCode,
          loginInfo.sysUserName,
          loginInfo.sysUserKind,
          loginInfo.sysEmployeeNo,
          loginInfo.sysChnlCd,
          loginInfo.sysSessId,
          loginInfo.ipAddress,
          loginInfo.ipAddress,
          loginInfo.sysBranchCode,
          loginInfo.sysGuestLoginFlag,
          loginInfo.sysGroupList
        )
        // Setting System Config Info
        const sysConfigInfo = loginInfo.rtnSysConfig
        session.setSysConfig(
          sysConfigInfo.sysDatePattern,
          sysConfigInfo.sysDateSymbol,
          sysConfigInfo.sysDecimalPoint,
          sysConfigInfo.sysMenuMode,
          sysConfigInfo.sysOverActiFlag,
          sysConfigInfo.sysOverUrl,
          sysConfigInfo.sysTabCount,
          sysConfigInfo.maxLoginFalseCount,
          sysConfigInfo.sysInitializeScreenId
        )

        session.sysInitializeScreenId = sysConfigInfo.sysInitializeScreenId
        const sysBranchInfo = loginInfo.rtnBranchInfo
        if (sysBranchInfo) {
          session.setBranchInfo(
            sysBranchInfo.sysCurrentBusinessDate,
            sysBranchInfo.sysPreviousBusinessDate,
            sysBranchInfo.sysNextBusinessDate,
            sysBranchInfo.sysParentBranchCode,
            sysBranchInfo.sysBaseCurrency,
            sysBranchInfo.sysBranchBic,
            sysBranchInfo.sysRegionHeadOffice
          )
        }

        session.menuList = JSON.stringify(loginInfo.menuList)
        session.sysAllMenu = JSON.stringify(loginInfo.sysAllMenu)
        session.menu3LvlList = loginInfo.menu3LvlList

        session.sysPwForceChangeFlag = loginInfo.sysPwForceChangeFlag
        session.sysPasswordFlag = loginInfo.sysPasswordFlag

        if (!commonUtil.isEmpty(loginInfo.authToken)) {
          session.setToken(loginInfo.authToken)
        }

        router.push({ name: 'IndexPage' })
      }
      compareLoginFalseCount()
      clearCaptchaCode()
    })
    .catch((error) => {
      console.log(error.message)
      compareLoginFalseCount()
      clearCaptchaCode()
    })
}

const clearCaptchaCode = () => {
  captchaCode.value = ''
  captchaRef.value.$.vnode.el.focus()
}

loadData()
</script>
