<template>
    <q-header class="header_page_title">
        <div class="title_wrapper">
            <page-title></page-title>
        </div>
    </q-header>
    <q-page-container>
        <q-page class="table_container">
          <lonColMngFreeform
            :formParam="formParam"
            :searchParam="searchParam"
            :estateParam="estateParam"
            :vehicleParam="vehicleParam"
            :othersParam="othersParam"
            :radioDisableFlag="radioDisableFlag"
            :cdDisable="cdDisable"
            :nonTarget="nonTarget"
            :commonCodeList="commonCodeList"
            :modelValues="modelValues"
            :modelValues2="modelValues2"
            :modelValues3="modelValues3"
            :save="save"
            :handleChange="handleChange"
            :updateTrxnMode="updateTrxnMode"
            :getPopupRowData="getPopupRowData"
            :getPopupRowData1="getPopupRowData1"
            :getPopupRowData2="getPopupRowData2"
            :getPopupRowData3="getPopupRowData3"
            :getPopupRowData4="getPopupRowData4"
            :getPopupRowData5="getPopupRowData5"
            :getPopupRowData6="getPopupRowData6"
            :getPopupRowData7="getPopupRowData7"
            :getPopupRowData8="getPopupRowData8"
            :getPopupRowData9="getPopupRowData9"
            :getPopupRowData10="getPopupRowData10"
            :getColDirectSearch="getColDirectSearch"
            :getCstDirectSearch="getCstDirectSearch"
            :showColSearch="showColSearch"
            :showCstSearch1="showCstSearch1"
            :showCstSearch2="showCstSearch2"
            :showBraSearch1="showBraSearch1"
            :showEmpSearch1="showEmpSearch1"
            :showBraSearch2="showBraSearch2"
            :showEmpSearch2="showEmpSearch2"
            :showCtySearch1="showCtySearch1"
            :showLocSearch1="showLocSearch1"
            :showCtySearch2="showCtySearch2"
            :showLocSearch2="showLocSearch2"
            :isRealEstateExpanded="isRealEstateExpanded"
            :isVehicleExpanded="isVehicleExpanded"
            :isOthersExpanded="isOthersExpanded"
          ></lonColMngFreeform>
    </q-page>
    </q-page-container>
</template>
<script setup>
/*
    303020 - Collateral Management

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
import lonColMngFreeform from 'src/pages/lon/col/mng/lonColMngFreeform.vue'

/* =======================================================
        2. Global Variable
    ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언
const nonTarget = ref(false)
const excludeTarget = ref(true)
const collateralTitleName = ref(null)
const collateralTpcd = ref(null)
const ccycdMarket = ref(null)
const customerNo = ref(null)
const colOwnerNo = ref(null)
const appraisalDate = ref(null)
const currencyCode = ref(null)
const expireDate = ref(null)

const freeformRefs = {
  collateralTpcd,
  ccycdMarket,
  collateralTitleName,
  customerNo,
  colOwnerNo,
  appraisalDate,
  currencyCode,
  expireDate

}

// 전역변수 선언
const session = useSessionStore()
const cdDisable = ref(true)

/* =======================================================
      3. Common Code Adapter
  ======================================================= */
const commonCodeList = reactive({
  collateralTypeCode: ref([]),
  collateralStatusCode: ref([]),
  collateralDetailTypeCode1: ref([]),
  collateralDetailTypeCode2: ref([]),
  collateralDetailTypeCode9: ref([]),
  ownerRelationRTypeCode: ref([]),
  countryTypeCode: ref([]),
  employeeCode: ref([]),
  apprasialTypeCode: ref([])
})

ajaxUtil.getCodeList('LON_COLLATERAL_TYPE_CODE,LON_COLLATERAL_STATUS_CODE,LON_COLLATERAL_DETAIL_TYPE_CODE,LON_OWNER_RELATION_TYPE_CODE,LON_APPRASIAL_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.collateralTypeCode = codeData.lonCollateralTypeCode
    commonCodeList.collateralStatusCode = codeData.lonCollateralStatusCode
    commonCodeList.collateralDetailTypeCode1 = codeData.lonCollateralDetailTypeCode.filter(item => item.code.startsWith('1'))
    commonCodeList.collateralDetailTypeCode2 = codeData.lonCollateralDetailTypeCode.filter(item => item.code.startsWith('2'))
    commonCodeList.collateralDetailTypeCode9 = codeData.lonCollateralDetailTypeCode.filter(item => item.code.startsWith('9'))
    commonCodeList.ownerRelationRTypeCode = codeData.lonOwnerRelationTypeCode
    commonCodeList.apprasialTypeCode = codeData.lonApprasialTypeCode
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
      const matchingValue = matchingCode.codeValue
      formParam.value.createBranchName.value = matchingValue
      formParam.value.mngBranchName.value = matchingValue
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

ajaxUtil.getEmployeeNoList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
      const matchingValue = matchingCode.codeValue
      formParam.value.createEmpName.value = matchingValue
      formParam.value.mngEmpName.value = matchingValue
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

/* =======================================================
      4. Grid Props
  ======================================================= */
const modelValues = ref({
  currency: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues.value.currency.value, (newVal) => {
  formParam.value.ccycdMarket.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.marketAmt.value = Number(newVal.replace(/,/g, ''))
})

const modelValues2 = ref({
  currency: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues2.value.currency.value, (newVal) => {
  formParam.value.currencyCode.value = newVal
  modelValues.value.currency.value = newVal
  modelValues3.value.currency.value = newVal
})

watch(() => modelValues2.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.appraisalAmt.value = Number(newVal.replace(/,/g, ''))
})

const modelValues3 = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues3.value.currency.value, (newVal) => {
  vehicleParam.value.ccycdPurchase.value = newVal
})

watch(() => modelValues3.value.money.value, (newVal) => {
  newVal = String(newVal)
  vehicleParam.value.purchasePrice.value = Number(newVal.replace(/,/g, ''))
})

const formParam = ref({
  collateralNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  collateralTitleName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralTitle')
  },
  collateralTpcd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralType')
  },
  collateralStatusCd: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  ccycdMarket: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: false,
    description: i18n.global.t('label.view.marketAmt')
  },
  marketAmt: {
    value: 0,
    required: false,
    description: i18n.global.t('label.view.marketAmt')
  },
  customerNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.loanCustomer')
  },
  customerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  ownerRelationTpcd: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  colOwnerNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.ownerCustomer')
  },
  colOwnerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  registerDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.view.registDate')
  },
  appraisalTypeCode: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.appraisalType')
  },
  appraisalInstitutionNm: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.appraisalInst')
  },
  releaseDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.releaseDate')
  },
  appraisalDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.appraisalDate')
  },
  currencyCode: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.view.appraisalReview')
  },
  appraisalAmt: {
    value: 0,
    required: true,
    description: i18n.global.t('label.view.appraisalReview')
  },
  expireDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.expireDate')
  },
  registDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  registBrcd: {
    value: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  createBranchName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  createEmpName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  manageDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageBrcd: {
    value: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  mngBranchName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  mngEmpName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  rmk: {
    value: '',
    required: false,
    description: ''
  },
  collateralDetailCd: {
    value: ''
  },
  quantitySize: {
    value: '0'
  },
  unitName: {
    value: ''
  },
  countryCode: {
    value: ''
  },
  countryName: {
    value: ''
  },
  locationCode: {
    value: ''
  },
  locationName: {
    value: ''
  },
  collateralAddr: {
    value: ''
  },
  additionalInfo: {
    value: ''
  },
  makerName: {
    value: ''
  },
  licensePlateNo: {
    value: ''
  },
  purchaseDate: {
    value: ''
  },
  ccycdPurchase: {
    value: ''
  },
  purchasePrice: {
    value: '0'
  },
  productYear: {
    value: ''
  },
  modelNm: {
    value: ''
  },
  referenceNo: {
    value: ''
  },
  issueNm: {
    value: ''
  },
  transactionMode: {
    value: 'INQUIRY',
    required: true
  }
})

const estateParam = ref({
  collateralDetailCd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralDetailType')
  },
  quantitySize: {
    value: '0',
    required: true,
    description: i18n.global.t('label.view.quantity')
  },
  unitName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.quantity')
  },
  countryCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.country')
  },
  countryName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.country')
  },
  locationCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.location')
  },
  locationName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.location')
  },
  collateralAddr: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.address')
  },
  additionalInfo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.additionalInfo')
  },
  purchasePrice: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.purchasePrice')
  }
})

const vehicleParam = ref({
  collateralDetailCd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralDetailType')
  },
  makerName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.maker')
  },
  licensePlateNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.licensePlateNo')
  },
  purchaseDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.purchaseDate')
  },
  ccycdPurchase: {
    value: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.view.purchasePrice')
  },
  purchasePrice: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.purchasePrice')
  },
  additionalInfo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.additionalInfo')
  },
  productYear: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.productYear')
  },
  modelNm: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.model')
  },
  quantitySize: {
    value: '0',
    required: false,
    description: i18n.global.t('label.view.quantity')
  }
})

const othersParam = ref({
  collateralDetailCd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralDetailType')
  },
  quantitySize: {
    value: '0',
    required: true,
    description: i18n.global.t('label.view.quantity')
  },
  unitName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.quantity')
  },
  referenceNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.veiw.referenceNo')
  },
  issueNm: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.issuer')
  },
  countryCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.country')
  },
  countryName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.country')
  },
  locationCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.location')
  },
  locationName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.location')
  },
  additionalInfo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.additionalInfo')
  },
  purchasePrice: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.purchasePrice')
  }
})

const searchParam = ref({
  collateralNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.userName')
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
  const data = commonUtil.inputValueToJson('bsLonColMngService', 'LONCOLMNG002', searchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(async function (response) {
      if (response && Object.keys(response).length === 0) {
        const _alertInfo = () => {
          formParam.value.transactionMode.value = 'NEW'
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        freeformUtil.clear(formParam)
        freeformUtil.clear(modelValues)
        freeformUtil.clear(modelValues2)
        freeformUtil.clear(modelValues3)
        await nextTick()
        for (const key in response) {
          if (key in formParam.value && response[key] !== null) {
            formParam.value[key].value = response[key]
            if (formParam.value.collateralTpcd.value === '100') {
              if (key in estateParam.value && response[key] !== null) {
                estateParam.value[key].value = response[key]
                freeformUtil.clear(vehicleParam)
                freeformUtil.clear(othersParam)
              }
            } else if (formParam.value.collateralTpcd.value === '200') {
              if (key in vehicleParam.value && response[key] !== null) {
                vehicleParam.value[key].value = response[key]
                freeformUtil.clear(estateParam)
                freeformUtil.clear(othersParam)
              }
            } else if (formParam.value.collateralTpcd.value === '900') {
              if (key in othersParam.value && response[key] !== null) {
                othersParam.value[key].value = response[key]
                freeformUtil.clear(estateParam)
                freeformUtil.clear(vehicleParam)
              }
            }
          }
        }

        modelValues3.value.currency.value = vehicleParam.value.ccycdPurchase.value
        modelValues3.value.money.value = vehicleParam.value.purchasePrice.value
        modelValues.value.currency.value = formParam.value.ccycdMarket.value
        modelValues.value.money.value = formParam.value.marketAmt.value
        modelValues2.value.currency.value = formParam.value.currencyCode.value
        modelValues2.value.money.value = formParam.value.appraisalAmt.value

        formParam.value.transactionMode.value = 'INQUIRY'
        updateTrxnMode()
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

const alertAjaxSuccess = (response) => {
  const errMessage = '<div><label><b>Response : </b>' + 'success' + '</label></div>'

  return Dialog.create({
    title: '<div class="message_popup"><div class="popup_inner"><div class="message_head"><div class="iconPop03"/><h4 class="popup_ic_title">Result Success</h4></div></div></div>',
    message: '<div class="message_box">' + errMessage + '</div>',
    ok: { label: i18n.global.t('label.view.ok'), color: 'indigo-6' },
    html: true,
    persistent: true
  })
}

const checkParam = () => {
  if (formParam.value.collateralStatusCd.value === '01') {
    formParam.value.registerDate.required = true
    formParam.value.releaseDate.required = false
  } else {
    formParam.value.registerDate.required = false
    formParam.value.releaseDate.required = true
  }
  if (formParam.value.appraisalTypeCode.value === '01') {
    formParam.value.appraisalInstitutionNm.required = false
  } else {
    formParam.value.appraisalInstitutionNm.required = true
  }

  if (formParam.value.appraisalAmt.value === '') {
    formParam.value.appraisalAmt.value = 0
  }
  if (formParam.value.purchasePrice.value === '') {
    formParam.value.purchasePrice.value = 0
  }
  if (formParam.value.marketAmt.value === '') {
    formParam.value.marketAmt.value = 0
  }
  if (formParam.value.quantitySize.value === '') {
    formParam.value.quantitySize.value = 0
  }
}
const save = () => {
  checkParam()
  if (!freeformUtil.checkRequired(formParam, freeformRefs)) return
  if (formParam.value.collateralTpcd.value === '100') {
    for (const key in vehicleParam.value) {
      vehicleParam.value[key].value = ''
    }
    for (const key in othersParam.value) {
      othersParam.value[key].value = ''
    }
    // if (!freeformUtil.checkRequired(estateParam, freeformRefs)) return
    const estateValues = {}
    for (const key in estateParam.value) {
      estateValues[key] = { value: estateParam.value[key].value }
    }
    freeformUtil.clear(modelValues3)
    formParam.value = { ...formParam.value, ...estateValues }
  } else if (formParam.value.collateralTpcd.value === '200') {
    for (const key in estateParam.value) {
      estateParam.value[key].value = ''
    }
    for (const key in othersParam.value) {
      othersParam.value[key].value = ''
    }
    // if (!freeformUtil.checkRequired(vehicleParam, freeformRefs)) return
    const vehicleValues = {}
    vehicleParam.value.quantitySize.value = 0
    for (const key in vehicleParam.value) {
      vehicleValues[key] = { value: vehicleParam.value[key].value }
    }
    formParam.value = { ...formParam.value, ...vehicleValues }
  } else if (formParam.value.collateralTpcd.value === '900') {
    for (const key in estateParam.value) {
      estateParam.value[key].value = ''
    }
    for (const key in vehicleParam.value) {
      vehicleParam.value[key].value = ''
    }
    // if (!freeformUtil.checkRequired(othersParam, freeformRefs)) return

    const othersValues = {}
    for (const key in othersParam.value) {
      othersValues[key] = { value: othersParam.value[key].value }
    }
    freeformUtil.clear(modelValues3)
    formParam.value = { ...formParam.value, ...othersValues }
  }
  checkParam()
  if (formParam.value.transactionMode.value === 'NEW') {
    const saveParam = commonUtil.inputValueToJson('bsLonColMngService', 'LONCOLMNG019', formParam)
    ajaxUtil.ajaxServiceData(saveParam)
      .then(function (response) {
        if (!response) {
          const _alertInfoNodata = () => {
            formParam.value = []
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoNodata)
        } else {
          searchParam.value.collateralNo.value = response
          alertAjaxSuccess(response).onOk(() => {
            search()
          })
        }
      })
  } else {
    console.log(JSON.stringify(formParam))
    const saveParam = commonUtil.inputValueToJson('bsLonColMngService', 'LONCOLMNG009', formParam)
    ajaxUtil.ajaxServiceCall(saveParam)
      .then((response) => {
        const _alertAjaxSuccess = () => {
          if (formParam.value.transactionMode.value === 'DELETE') {
            formParam.value.transactionMode.value = 'NEW'
            updateTrxnMode()
          } else {
            search()
          }
        }
        messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
      })
      .catch((error) => {
        messageBox.alertAjaxError(error)
      })
  }
}

const handleChange = (newVal) => {
  formParam.value.ownerRelationTpcd.value = newVal
  if (formParam.value.ownerRelationTpcd.value === '01') {
    formParam.value.colOwnerNo.value = formParam.value.customerNo.value
    formParam.value.colOwnerName.value = formParam.value.customerName.value
  } else {
    formParam.value.colOwnerNo.value = ''
    formParam.value.colOwnerName.value = ''
  }
}

const isRealEstateExpanded = ref(false)
const isVehicleExpanded = ref(false)
const isOthersExpanded = ref(false)

const clearValuesBasedOnTpcd = (newVal) => {
  if (newVal === '100') {
    for (const key in vehicleParam.value) {
      vehicleParam.value[key].value = ''
    }
    freeformUtil.clear(modelValues3)
    for (const key in othersParam.value) {
      othersParam.value[key].value = ''
    }
    modelValues3.value.currency = { value: session.sysBaseCurrency }
  } else if (newVal === '200') {
    for (const key in estateParam.value) {
      estateParam.value[key].value = ''
    }
    for (const key in othersParam.value) {
      othersParam.value[key].value = ''
    }
    modelValues3.value.currency = { value: session.sysBaseCurrency }
    modelValues3.value.money.value = 0
  } else if (newVal === '900') {
    for (const key in estateParam.value) {
      estateParam.value[key].value = ''
    }
    for (const key in vehicleParam.value) {
      vehicleParam.value[key].value = ''
    }
    freeformUtil.clear(modelValues3)
    modelValues3.value.currency = { value: session.sysBaseCurrency }
  }
}
const format = () => {
  if (formParam.value.collateralStatusCd.value === '01') {
    formParam.value.releaseDate.value = ''
  }
  if (formParam.value.appraisalTypeCode.value === '01') {
    formParam.value.appraisalInstitutionNm.value = ''
  }
  if (formParam.value.transactionMode.value === 'NEW') {
    formParam.value.registDate.value = formParam.value.registerDate.value
    formParam.value.manageDate.value = formParam.value.registerDate.value
  }
}

const updateExpansionStates = (newVal) => {
  isRealEstateExpanded.value = newVal === '100'
  isVehicleExpanded.value = newVal === '200'
  isOthersExpanded.value = newVal === '900'
}
watch(formParam, format, { deep: true })

watch(() => formParam.value.collateralTpcd.value, (newVal) => {
  updateExpansionStates(newVal)
  if (formParam.value.transactionMode.value !== 'INQUIRY') {
    clearValuesBasedOnTpcd(newVal)
  }
  format()
}, { immediate: true })
/* =======================================================
      6. Freeform Object
  ======================================================= */
const showColSearch = ref(false)
const showCstSearch1 = ref(false)
const showCstSearch2 = ref(false)
const showBraSearch1 = ref(false)
const showBraSearch2 = ref(false)
const showEmpSearch1 = ref(false)
const showEmpSearch2 = ref(false)
const showCtySearch1 = ref(false)
const showCtySearch2 = ref(false)
const showLocSearch1 = ref(false)
const showLocSearch2 = ref(false)
const selectedPopupRowData = ref([])

const disableFlagObj = reactive({
  nonTarget, excludeTarget
})

const radioDisableFlag = ref({
  newRadio: {
    value: false,
    type: Boolean
  },
  inquiryRadio: {
    value: true,
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
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    freeformUtil.disableControl(false, disableFlagObj)
    freeformUtil.clear(formParam)
    freeformUtil.clear(searchParam)
    freeformUtil.clear(estateParam)
    freeformUtil.clear(vehicleParam)
    freeformUtil.clear(othersParam)
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    formParam.value.collateralStatusCd.value = '01'
    formParam.value.ownerRelationTpcd.value = '01'
    formParam.value.appraisalTypeCode.value = '01'
    modelValues.value.currency.value = session.sysBaseCurrency
    modelValues2.value.currency.value = session.sysBaseCurrency
    formParam.value.registerDate.value = session.sysCurrentBusinessDate
    ajaxUtil.getBranchCodeList()
      .then(function (codeData) {
        if (codeData && Array.isArray(codeData)) {
          const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
          const matchingValue = matchingCode.codeValue
          formParam.value.createBranchName.value = matchingValue
          formParam.value.registBrcd.value = session.sysBranchCode
          formParam.value.mngBranchName.value = matchingValue
          formParam.value.manageBrcd.value = session.sysBranchCode
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
      })

    ajaxUtil.getEmployeeNoList()
      .then(function (codeData) {
        if (codeData && Array.isArray(codeData)) {
          const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
          const matchingValue = matchingCode.codeValue
          formParam.value.createEmpName.value = matchingValue
          formParam.value.registEmployeeNo.value = session.sysEmployeeNo
          formParam.value.mngEmpName.value = matchingValue
          formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
      })
  } else if (transactionMode === 'INQUIRY') {
    freeformUtil.disableControl(true, disableFlagObj)
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(false, disableFlagObj)
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
  }

  controllRadioDisable(transactionMode)
}

const controllRadioDisable = (selectedRTransactionMode) => {
  if (selectedRTransactionMode === 'NEW') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  } else {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  }
}

const getPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.collateralNo.value = selectedPopupRowData.value.collateralNo
  search()
}

const getColDirectSearch = (event) => {
  if (event === '') {
    console.log('eventnull', event)
    freeformUtil.disableControl(false, disableFlagObj)
    formParam.value.collateralTpcd.value = ''
    formParam.value.colOwnerNo.value = ''
    formParam.value.colOwnerName.value = ''
    formParam.value.customerNo.value = ''
    formParam.value.customerName.value = ''
    formParam.value.appraisalDate.value = ''
    freeformUtil.clear(searchParam)
    freeformUtil.clear(estateParam)
    freeformUtil.clear(vehicleParam)
    freeformUtil.clear(othersParam)
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    formParam.value.collateralStatusCd.value = '01'
    formParam.value.ownerRelationTpcd.value = '01'
    formParam.value.appraisalTypeCode.value = '01'
    modelValues.value.currency.value = session.sysBaseCurrency
    modelValues2.value.currency.value = session.sysBaseCurrency
    formParam.value.registerDate.value = session.sysCurrentBusinessDate
  } else {
    console.log('@#@#@#@#@#')
    selectedPopupRowData.value = event
    searchParam.value.collateralNo.value = event.collateralNo
    search()
  }
}

const getPopupRowData1 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.customerNo.value = selectedPopupRowData.value.customerNo
  formParam.value.customerName.value = selectedPopupRowData.value.customerName
  if (formParam.value.ownerRelationTpcd.value === '01') {
    formParam.value.colOwnerNo.value = selectedPopupRowData.value.customerNo
    formParam.value.colOwnerName.value = selectedPopupRowData.value.customerName
  }
}

const getCstDirectSearch = (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    formParam.value.customerNo.value = selectedPopupRowData.value.customerNo
    formParam.value.customerName.value = selectedPopupRowData.value.customerName
    if (formParam.value.ownerRelationTpcd.value === '01') {
      formParam.value.colOwnerNo.value = selectedPopupRowData.value.customerNo
      formParam.value.colOwnerName.value = selectedPopupRowData.value.customerName
    }
  }
}

const getPopupRowData2 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.colOwnerNo.value = selectedPopupRowData.value.customerNo
  formParam.value.colOwnerName.value = selectedPopupRowData.value.customerName
}

const getPopupRowData3 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.registEmployeeNo.value = selectedPopupRowData.value.employeeNo
  formParam.value.createEmpName.value = selectedPopupRowData.value.employeeName
}

const getPopupRowData4 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.manageEmployeeNo.value = selectedPopupRowData.value.employeeNo
  formParam.value.mngEmpName.value = selectedPopupRowData.value.employeeName
}

const getPopupRowData5 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.registBrcd.value = selectedPopupRowData.value.branchCode
  formParam.value.createBranchName.value = selectedPopupRowData.value.branchName
}

const getPopupRowData6 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.manageBrcd.value = selectedPopupRowData.value.branchCode
  formParam.value.mngBranchName.value = selectedPopupRowData.value.branchName
}

const getPopupRowData7 = (event) => {
  selectedPopupRowData.value = event[0]
  estateParam.value.countryCode.value = selectedPopupRowData.value.countryCode
  estateParam.value.countryName.value = selectedPopupRowData.value.countryName
}

const getPopupRowData8 = (event) => {
  selectedPopupRowData.value = event[0]
  othersParam.value.countryCode.value = selectedPopupRowData.value.countryCode
  othersParam.value.countryName.value = selectedPopupRowData.value.countryName
}

const getPopupRowData9 = (event) => {
  selectedPopupRowData.value = event[0]
  estateParam.value.locationCode.value = selectedPopupRowData.value.locationCode
  estateParam.value.locationName.value = selectedPopupRowData.value.locationName
}

const getPopupRowData10 = (event) => {
  selectedPopupRowData.value = event[0]
  othersParam.value.locationCode.value = selectedPopupRowData.value.locationCode
  othersParam.value.locationName.value = selectedPopupRowData.value.locationName
}

let oldAppraisalDate = formParam.value.appraisalDate.value
let updating = false

watch(
  () => [formParam.value.appraisalDate.value, formParam.value.registerDate.value],
  () => {
    if (updating) {
      return
    }
    updating = true

    const appraisalDate = new Date(formParam.value.appraisalDate.value)
    const registerDate = new Date(formParam.value.registerDate.value)

    if (appraisalDate > registerDate) {
      const _alertInfo = () => {
        formParam.value.appraisalDate.value = oldAppraisalDate
        updating = false
      }
      messageBox.alertInfo(i18n.global.t('It cannot be greater than the Register Date value.'), _alertInfo)
    } else {
      oldAppraisalDate = formParam.value.appraisalDate.value
      updating = false
    }
  },
  { immediate: true }
)

const handleMessage = (event) => {
  const collateralNo = event.data.initParams.refNo
  searchParam.value.collateralNo.value = collateralNo
  search()
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
