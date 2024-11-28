<template>
  <q-header class="header_page_title">
      <div class="title_wrapper">
          <page-title></page-title>
      </div>
  </q-header>
  <q-page-container>
      <q-page class="table_container">
        <lonColGuaFreeform
          :formParam="formParam"
          :radioDisableFlag="radioDisableFlag"
          :cdDisable="cdDisable"
          :nonTarget="nonTarget"
          :disableFlag="disableFlag"
          :commonCodeList="commonCodeList"
          :revenueCurForm="revenueCurForm"
          :networthCurForm="networthCurForm"
          :incometaxCurForm="incometaxCurForm"
          :financialCurForm="financialCurForm"
          :save="save"
          :updateTrxnMode="updateTrxnMode"
          :getGuaPopupRowData="getGuaPopupRowData"
          :getPopupGuaRowData="getPopupGuaRowData"
          :getPopupCstRowData="getPopupCstRowData"
          :showGuarantorSearch="showGuarantorSearch"
          :showCstSearch="showCstSearch"
          :row-data="rowData"
          :isGuarantorExpanded="isGuarantorExpanded"
          :isRelevantExpanded="isRelevantExpanded"
          :getGurDirectSearch="getGurDirectSearch"
          :getCstDirectSearch="getCstDirectSearch"
          :getGuaDirectSearch="getGuaDirectSearch"
          :search="search"
        ></lonColGuaFreeform>
  </q-page>
  </q-page-container>
</template>
<script setup>
/*
  303050 - Loan Guaratnee

  Index.
  1. Import Area
  2. Global Variable
  3. Common Code Adapter
  4. Grid Props
  5. Grid Function
  6. Business Function
  7. popup
  8. TabKey event
  9. Loading Module
*/
/* =======================================================
        1. Import Area
    ======================================================= */
import { ref, reactive, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { i18n } from 'boot/i18n'
import { ajaxUtil, commonUtil, messageBox, freeformUtil } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import { Dialog } from 'quasar'
import lonColGuaFreeform from 'src/pages/lon/col/gua/lonColGuaFreeform.vue'

/* =======================================================
      2. Global Variable
  ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언
const nonTarget = ref(false)
const disableFlag = ref(true)
const collateralTitleName = ref(null)
const collateralTpcd = ref(null)
const ccycdMarket = ref(null)
const customerNo = ref(null)
const colOwnerNo = ref(null)
const appraisalDate = ref(null)
const expireDate = ref(null)
const deleteCheck = ref(false)

const freeformRefs = {
  collateralTpcd,
  ccycdMarket,
  collateralTitleName,
  customerNo,
  colOwnerNo,
  appraisalDate,
  expireDate

}

// 전역변수 선언
const session = useSessionStore()
const cdDisable = ref(true)

/* =======================================================
    3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  guaranteeStatusCode: ref([]),
  houseTypeCode: ref([]),
  houseOcpncyCode: ref([]),
  ocuptTypeCode: ref([]),
  branchNameList: ref([]),
  countryTypeCode: ref([]),
  branchTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

ajaxUtil.getCodeList('LON_GUARANTEE_TYPE_CODE, FRM_HOUSE_TYPE_CODE, HOUSE_OCPN_TYPE_CODE, OCCUPATION_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.guaranteeStatusCode = codeData.lonGuaranteeTypeCode
    commonCodeList.houseTypeCode = codeData.frmHouseTypeCode
    commonCodeList.houseOcpncyCode = codeData.houseOcpnTypeCode
    commonCodeList.ocuptTypeCode = codeData.occupationTypeCode
  })

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    commonCodeList.branchNameList = codeData
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

/* =======================================================
    4. Grid Props
======================================================= */
const revenueCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => revenueCurForm.value.currency.value, (newVal) => {
  formParam.value.currencyCodeGua.value = newVal
  networthCurForm.value.currency.value = newVal
  incometaxCurForm.value.currency.value = newVal
  financialCurForm.value.currency.value = newVal
})

watch(() => revenueCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.revenueAmt.value = Number(newVal.replace(/,/g, ''))
})

const networthCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => networthCurForm.value.currency.value, (newVal) => {
  revenueCurForm.value.currency.value = newVal
})

watch(() => networthCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.netWorth.value = Number(newVal.replace(/,/g, ''))
})

const incometaxCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => incometaxCurForm.value.currency.value, (newVal) => {
  revenueCurForm.value.currency.value = newVal
})

watch(() => incometaxCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.incomeTax.value = Number(newVal.replace(/,/g, ''))
})

const financialCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => financialCurForm.value.currency.value, (newVal) => {
  revenueCurForm.value.currency.value = newVal
})

watch(() => financialCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.financialAsset.value = Number(newVal.replace(/,/g, ''))
})

const formParam = ref({
  guaranteeNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeNo')
  },
  transactionStatusCd: {
    value: '01',
    initValue: '01',
    required: true,
    description: i18n.global.t('label.objt.transactionStatus')
  },
  expireDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.expireDate')
  },
  guaranteeTypeCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guaranteeType')
  },
  registerDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.registerDate')
  },
  contractDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.contractDate')
  },
  releaseDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.releaseDate')
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.managementBranch')
  },
  guarantorNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guarantor')
  },
  guarantorName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guarantor')
  },
  creditRating: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.creditScore')
  },
  creditEvltDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.evaluationDate')
  },
  borrowerRelation: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.relationCustomer')
  },
  customerNo: {
    value: '',
    required: true
  },
  customerName: {
    value: '',
    required: true
  },
  rmk: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.remark')
  },
  ocuptTypeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.occupationType')
  },
  houseTypeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guarantorHouseType')
  },
  houseOcpncyCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.houseOccupancyType')
  },
  socialStatus: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.socialStatus')
  },
  occupationDetail: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.occupationDetail')
  },
  revenueAmt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.guarantorRevenueIncome')
  },
  netWorth: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.netWorth')
  },
  incomeTax: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.incomeTax')
  },
  financialAsset: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.financialAsset')
  },
  currencyCodeGua: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.financialAsset')
  },
  transactionMode: {
    value: 'NEW',
    required: true
  }
})

const searchParam = ref({
  guaranteeNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guaranteeNo')
  },
  transactionMode: {
    value: '',
    required: true
  }
})

/* =======================================================
    5. Function
======================================================= */

const search = () => {
  rowData.value = []
  const data = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA002', searchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(async function (response) {
      if (response && Object.keys(response).length === 0) {
        const _alertInfo = () => {
          formParam.value.transactionMode.value = 'NEW'
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        freeformUtil.clear(formParam)
        freeformUtil.clear(revenueCurForm)
        freeformUtil.clear(networthCurForm)
        freeformUtil.clear(incometaxCurForm)
        response.contractDate = response.contractDate.trim() // contractDate 공백 제거
        await nextTick()
        for (const key in response) {
          if (key in formParam.value && response[key] !== null) {
            formParam.value[key].value = response[key]
          }
        }

        if (!commonUtil.isEmpty(formParam.value.guaranteeNo.value)) {
          radioDisableFlag.value.updateRadio.value = false
          radioDisableFlag.value.deleteRadio.value = false
        }

        revenueCurForm.value.currency.value = formParam.value.currencyCodeGua.value
        revenueCurForm.value.money.value = formParam.value.revenueAmt.value
        networthCurForm.value.money.value = formParam.value.netWorth.value
        incometaxCurForm.value.money.value = formParam.value.incomeTax.value
        financialCurForm.value.money.value = formParam.value.financialAsset.value

        if (formParam.value.transactionMode.value === 'NEW') {
          formParam.value.transactionMode.value = 'INQUIRY'
          isGuarantorExpanded.value = true
          freeformUtil.disableControl(true, disableFlagObj)
        }
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

const searchGrid = () => {
  rowData.value = []
  const data = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA0021', searchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(async function (response) {
      await nextTick()
      // contractNo 등록 돼있는 경우만 출력
      for (const index in response) {
        if (response[index].contractNo === null) {
          isRelevantExpanded.value = false
          return
        } else {
          rowData.value = response
          isRelevantExpanded.value = true
        }
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

const alertAjaxSuccess = () => {
  const messageCode = 'msg.request.success'
  const messageText = 'your request successfully done'
  const errMessage = '<div><label><b>Result Code : </b>' + messageCode +
      '</label><br/><label><b>Result Text : </b>' + messageText +
      '</label></div>'
  return Dialog.create({
    title: '<div class=" message_popup "><div class="popup_inner"><div class="message_head"><div class="iconPop03"/><h4 class="popup_ic_title">Result Success</h4></div></div></div>',
    message: '<div class="message_box">' + errMessage + '</div>',
    ok: { label: i18n.global.t('label.view.ok'), color: 'indigo-6' },
    html: true,
    persistent: true
  })
}

const checkRadio = () => {
  const registration = '01' // 보증등록
  const contract = '02' // 보증약정
  const release = '05' // 보증해제

  // Radio값에 따라 각 Date 필수값 변경
  if (formParam.value.transactionStatusCd.value === registration) {
    formParam.value.registerDate.required = true
    formParam.value.contractDate.required = false
    formParam.value.releaseDate.required = false
  } else if (formParam.value.transactionStatusCd.value === contract) {
    formParam.value.registerDate.required = false
    formParam.value.contractDate.required = true
    formParam.value.releaseDate.required = false
  } else if (formParam.value.transactionStatusCd.value === release) {
    formParam.value.registerDate.required = false
    formParam.value.contractDate.required = false
    formParam.value.releaseDate.required = true
  }
}
const save = () => {
  if (formParam.value.transactionMode.value === 'INQUIRY') return
  // 필수 데이터 Check
  checkRadio()
  if (!freeformUtil.checkRequired(formParam, freeformRefs)) return

  // NEW
  if (formParam.value.transactionMode.value === 'NEW') {
    const _confirm = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA001', formParam)
      ajaxUtil.ajaxServiceData(saveParam)
        .then(function (response) {
          if (!response) {
            const _alertInfo = () => {
              formParam.value = []
            }
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
          } else {
            searchParam.value.guaranteeNo.value = response
            const _alertAjaxSuccess = () => {
              formParam.value.transactionMode.value = 'INQUIRY'
              freeformUtil.disableControl(true, disableFlagObj)
              search()
              searchGrid()
              isGuarantorExpanded.value = true
            }
            alertAjaxSuccess(response, _alertAjaxSuccess)
          }
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
    // UPDATE
  } else if (formParam.value.transactionMode.value === 'UPDATE') {
    const _confirm = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA003', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          const _alertAjaxSuccess = () => {
            search()
            searchGrid()
            isGuarantorExpanded.value = true
          }
          messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
        })
        .catch((error) => {
          messageBox.alertAjaxError(error)
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
    // DELETE
  } else if (formParam.value.transactionMode.value === 'DELETE') {
    // Delete 이후 OK버튼 비활성화(삭제된 데이터 화면에 뿌려진 상태)
    if (deleteCheck.value) {
      messageBox.alertInfo(i18n.global.t('msg.info.alreadyDeleted'))
      return
    }
    const _confirm = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA004', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          const _alertAjaxSuccess = () => {
            deleteCheck.value = true
          }
          messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
        })
        .catch((error) => {
          messageBox.alertAjaxError(error)
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.delete'), _confirm)
  }
}

const isGuarantorExpanded = ref(false)
const isRelevantExpanded = ref(false)
/* =======================================================
    6. Freeform Object
======================================================= */
const rowData = ref([])
// const rowCount = ref(0)
const showGuarantorSearch = ref(false)
const showCstSearch = ref(false)
const selectedPopupRowData = ref([])

const disableFlagObj = reactive({
  nonTarget
})

const radioDisableFlag = ref({
  newRadio: {
    value: false,
    type: Boolean
  },
  inquiryRadio: {
    value: false,
    type: Boolean
  },
  updateRadio: {
    value: true,
    type: Boolean
  },
  deleteRadio: {
    value: true,
    type: Boolean
  }
})
/* =======================================================
    7. Freeform Funtion
======================================================= */
const updateTrxnMode = (event) => {
  const registration = '01' // 보증등록
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    freeformUtil.disableControl(false, disableFlagObj)
    disableFlag.value = true
    freeformUtil.clear(formParam)
    freeformUtil.clear(searchParam)
    freeformUtil.clear(revenueCurForm)
    freeformUtil.clear(networthCurForm)
    freeformUtil.clear(incometaxCurForm)
    freeformUtil.clear(financialCurForm)
    rowData.value = []
    formParam.value.transactionStatusCd.value = registration // 기본값으로 초기화 '01'
    revenueCurForm.value.currency.value = ''
    isRelevantExpanded.value = false
    isGuarantorExpanded.value = false
  } else if (transactionMode === 'INQUIRY') {
    freeformUtil.disableControl(true, disableFlagObj)
    disableFlag.value = false
    deleteCheck.value = false
    freeformUtil.clear(formParam)
    freeformUtil.clear(searchParam)
    freeformUtil.clear(revenueCurForm)
    freeformUtil.clear(networthCurForm)
    freeformUtil.clear(incometaxCurForm)
    freeformUtil.clear(financialCurForm)
    rowData.value = []
    formParam.value.transactionStatusCd.value = registration // 기본값으로 초기화 '01'
    revenueCurForm.value.currency.value = ''
    isRelevantExpanded.value = false
    isGuarantorExpanded.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(false, disableFlagObj)
    disableFlag.value = true
    deleteCheck.value = false
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
    disableFlag.value = true
  }

  controllRadioDisable(transactionMode)
}

const controllRadioDisable = (selectedRTransactionMode) => {
  if (selectedRTransactionMode === 'NEW') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  }
}

const getGuaPopupRowData = (event) => {
  rowData.value = []
  searchParam.value.guaranteeNo.value = event[0].guaranteeNo
  isGuarantorExpanded.value = true

  search()
  searchGrid()
}

const getGuaDirectSearch = (event) => {
  if (event !== '') {
    searchParam.value.guaranteeNo.value = event.guaranteeNo
    search()
    searchGrid()
  } else {
    freeformUtil.clear(formParam)
    freeformUtil.clear(revenueCurForm)
    freeformUtil.clear(networthCurForm)
    freeformUtil.clear(incometaxCurForm)
    freeformUtil.clear(financialCurForm)
    rowData.value = []
    searchParam.value.guaranteeNo.value = ''
  }
}

const getPopupGuaRowData = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.guarantorNo.value = selectedPopupRowData.value.customerNo
  formParam.value.guarantorName.value = selectedPopupRowData.value.customerName
}

const getPopupCstRowData = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.customerNo.value = selectedPopupRowData.value.customerNo
  formParam.value.customerName.value = selectedPopupRowData.value.customerName
}

const getGurDirectSearch = (event) => {
  if (event !== '') {
    formParam.value.guarantorNo.value = event.customerNo
    formParam.value.guarantorName.value = event.customerName
  } else {
    formParam.value.customerName.value = ''
  }
}

const getCstDirectSearch = (event) => {
  if (event !== '') {
    formParam.value.customerNo.value = event.customerNo
    formParam.value.customerName.value = event.customerName
  } else {
    formParam.value.customerName.value = ''
  }
}

const handleMessage = (event) => {
  searchParam.value.guaranteeNo.value = event.data.initParams.refNo

  search()
  searchGrid()
}
onMounted(() => {
  window.addEventListener('message', handleMessage)
  window.top.postMessage({
    e: 'requestData'
  })
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>
