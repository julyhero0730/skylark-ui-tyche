<template>
  <q-header class="header_page_title">
      <div class="title_wrapper">
        <page-title></page-title>
        <div class="search_filter_wrapper" data-break="1200" @keyup.enter="search">
          <div class="button_box">
            <CommonSearchButton :searchFunc="search" :clearFunc="clear"></CommonSearchButton>
          </div>
        </div>
      </div>
    </q-header>
  <q-page-container>
    <q-page class="double_table_container" style="margin: 0px 30px; min-height: 1px;">
          <div class="table_container">
            <div class="icon_button_wrapper">
              <div class="rows_box">
                <label>{{ $t('label.view.showRows') }}</label>
                <CommonSelectBox :codeList="commonCodeList.fetchSizeList.value" v-model="searchParam.fetchSize.value"></CommonSelectBox>
                <input type="hidden" v-model="searchParam.maxValue.value"/>
              </div>
              <div class="align_button_box">
                <span class="box_label">{{ rowCounts }}</span>
                <span class="box_label">{{ $t('label.view.rows') }}</span>
                <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
                <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
              </div>
            </div>
            <div class="table_scroll_box width100">
              <ag-grid-vue
                class="ag-theme-balham height73"
                rowSelection="single"
                :columnDefs="gridProps.columnDefs(commonCodeList)"
                :columnTypes="gridProps.columnTypes"
                :defaultColDef="gridProps.defaultColDef"
                :rowData="rowData"
                :selected="false"
                @grid-ready="gridProps.onGridReady"
                @selection-changed="onSelectionChanged"
              ></ag-grid-vue>
            </div>
          </div>
          <div class="table_container_2">
            <div class="table_top_button_wrapper">
                <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
            </div>
          <div class="scrollable-container height71 q-pr-md">
            <div class="msg_info_form_box">
              <div class="full-row">
                <label class="form_label">{{ $t('label.objt.loanProduct') }}</label>
                  <div class="horizontal-layout d-flex items-center">
                    <CommonInputBox class="width24" maxlength="3" v-model="formParam.productCode.value" :disable="cdDisable"></CommonInputBox>
                    <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="nonTarget ? null :showPrdSearchPopup()" />
                    <CommonInputBox class="width75" maxlength="3" v-model="formParam.productName.value" :disable="cdDisable" style=" margin-left: -20px;"></CommonInputBox>
                    <facHlpPrd v-model="showPrdSearch" @selected-popup-row-data = "getPopupRowData5"></facHlpPrd>
                  </div>
              </div>
              <div class="full-row">
                <label class="form_label">{{ $t('label.objt.accountCode') }}</label>
                <div class="horizontal-layout d-flex items-center">
                  <CommonInputBox class="width24" maxlength="3" v-model="formParam.accountCode.value" :disable="cdDisable"></CommonInputBox>
                  <CommonInputBox class="width75" maxlength="3" v-model="formParam.accountCodeName.value" :disable="cdDisable" style="margin-left: -6px;"></CommonInputBox>
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.openDate') }}</label>
                <CommonInputBox v-model="formParam.openDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.closeDate') }}</label>
                <CommonInputBox v-model="formParam.closeDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
              </div>
            </div>
            <div class="msg_info_form_triple_box">
              <div class="grid-item">
                <label class="form_label">{{ $t('label.objt.loanAmountRange') }}</label>
                <div class="double_input_box">
                  <CommonCurFormatterBox
                    :modelValues="modelValues"
                    :selectDisabled="nonTarget" :inputDisabled="nonTarget">
                  </CommonCurFormatterBox>
                </div>
                <span class="tilde" style="z-index: 0;">~</span>
              </div>
              <div>
                <label class="form_label" style="visibility: hidden;">{{ $t('label.objt.') }}</label>
                <div class="double_input_box">
                  <CommonCurFormatterBox
                    :modelValues="modelValues2"
                    :inputDisabled="nonTarget" :curUsed="false">
                  </CommonCurFormatterBox>
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.defaultAmount') }}</label>
                <div class="double_input_box">
                  <CommonCurFormatterBox
                    :modelValues="modelValues3"
                    :inputDisabled="nonTarget" :curUsed="false">
                  </CommonCurFormatterBox>
                </div>
              </div>
          </div>
          <div class="msg_info_form_box">
            <div>
              <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.loanMethod') }}</label>
              <CommonSelectBox :codeList="commonCodeList.lonCreditLineTypeCode" v-model="formParam.creditLineTpcd.value" :disable="nonTarget"></CommonSelectBox>
            </div>
            <div>
              <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.intRateTpcd') }}</label>
              <CommonSelectBox :selectChangeFunc="intRatetTypeChange" :codeList="commonCodeList.lonInterestRateCode" v-model="formParam.intRateTpcd.value" :disable="nonTarget"></CommonSelectBox>
            </div>
            <div>
              <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
              <div class="relative-container1 d-flex items-center">
                <CommonInputBox maxlength="10" v-model="formParam.baseRateCode.value" :disable=cdDisable style="text-align-last: center;" ></CommonInputBox>
                <q-icon name="search" size="sm" :disable=variableFlag style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="(formParam.intRateTpcd.value === '01' || formParam.intRateTpcd.value === '03') || nonTarget ? null :showBirSearchPopup1()" />
                <frmHlpBir :business-Code=formParam.businessCode.value
                  :baseDate=formParam.baseDate.value
                  v-model="showBirSearch1"
                  @selected-popup-row-data = "getPopupRowData"
                ></frmHlpBir>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="width46">
                <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.interestRateRange') }}</label>
                <CommonInputBox v-model="formParam.intMinRate.value" style="text-align-last: right;" :disable="nonTarget"></CommonInputBox>
              </div>
              <div style="height: 0%; width: 5%; text-align: center;">
                ~
              </div>
              <div class="width46">
                <label class="form_label" style="vertical-align: top; visibility: hidden;">{{ $t('label.objt.') }}</label>
                <CommonInputBox v-model="formParam.intMaxRate.value" style="text-align-last: right;" :disable="nonTarget"></CommonInputBox>
              </div>
            </div>
            <div class="grid-item">
              <label class="form_label">{{ $t('label.objt.loanTermRange') }}</label>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div class="width47" style="display: flex; align-items: center;">
                  <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                  <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermYearMin.value" :disable="nonTarget"  style="text-align-last: right;width:100%;"></CommonInputBox>
                </div>
                <div class="width47" style="display: flex; align-items: center;">
                  <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                  <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermMonthMin.value" :disable="nonTarget"  style="text-align-last: right;width:100%;"></CommonInputBox>
                </div>
              </div>
              <span class="tilde" style="z-index: 0;">
              ~
              </span>
            </div>
            <div>
              <label class="form_label" style="visibility: hidden;">{{ $t('label.objt.gracePeriod') }}</label>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div class="width47" style="display: flex; align-items: center;">
                    <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                    <CommonInputBox class="width80" maxlength="30" placeholder="0" v-model="formParam.loanTermYearMax.value" :disable="nonTarget"  style="text-align-last: right;"></CommonInputBox>
                  </div>
                  <div class="width50" style="display: flex; align-items: center;">
                    <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                    <CommonInputBox class="width78" maxlength="30" placeholder="0" v-model="formParam.loanTermMonthMax.value" :disable="nonTarget"  style="text-align-last: right;"></CommonInputBox>
                  </div>
                </div>
            </div>
            <div>
              <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.repaymentProgram') }}</label>
              <CommonSelectBox :codeList="commonCodeList.lonRepayMethodCode" v-model="formParam.repayProgTpcd.value" :disable="nonTarget"></CommonSelectBox>
            </div>
            <div>
              <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.creditCollateralLoan') }}</label>
              <CommonSelectBox :selectChangeFunc="crecolTypeChange" :codeList="commonCodeList.lonCreditCollateralCode" v-model="formParam.creditClCode.value" :disable="nonTarget"></CommonSelectBox>
            </div>
            <div>
              <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.collateralType') }}</label>
              <CommonSelectBox :disable="(formParam.creditClCode.value === '01') || nonTarget" :codeList="commonCodeList.lonCollateralTypeCode" v-model="formParam.collateralTpcd.value" ></CommonSelectBox>
            </div>
            <div>
              <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.collateralDetailType') }}</label>
              <CommonSelectBox :disable="(formParam.creditClCode.value === '01') || nonTarget || (formParam.collateralTpcd.value === '')" :codeList="lonCollateralDetailTypeCodeList" v-model="formParam.collateralDetailCd.value" ></CommonSelectBox>
            </div>
          </div>
        </div>
        </div>
    </q-page>
  </q-page-container>
</template>
<script setup>
/*
    304010 - Product Management

    Index.
    1. Import Area
    2. Global Variable
    3. Common Code Adapter
    4. Grid Props
    5. Grid Function
    6. Freeform Object
    7. Freeform Funtion
    8. Business Function
    9. popup
    10. TabKey event
    11. Loading Module
*/

/* =======================================================
    1. Import Area
======================================================= */
import { reactive, ref, watch, nextTick } from 'vue'
import { i18n } from 'boot/i18n'
import { commonUtil, ajaxUtil, messageBox, freeformUtil, gridPropsUtil, frmHlpBir } from 'skylark-ui-lib'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/com/prd/lonComPrdGridProps.vue'
import { useSessionStore } from 'stores/session'
import facHlpPrd from 'src/components/pages/main/hlp/fac/prd/facHlpPrd.vue'

/* =======================================================
    2. Global Variable
======================================================= */
// 전역변수 선언
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref([])
rowCounts.value = ref(0)
const baseRateCode = ref(null)
const lonCollateralDetailTypeCodeList = ref([])
/* =======================================================
    3. Common Code Adapter
======================================================= */
// Code List 선언 및 Code Data 맵핑
const commonCodeList = reactive({
  fetchSizeList: ref([]),
  lonCreditLineTypeCode: ref([]),
  lonInterestRateCode: ref([]),
  lonRepayMethodCode: ref([]),
  lonCollateralTypeCode: ref([]),
  lonCollateralDetailTypeCode: ref([]),
  baseRateCode: ref([])
})

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCodeList('SHOWROWS,LON_CREDIT_LINE_TYPE_CODE,INTEREST_RATE_CODE,LON_REPAY_METHOD_CODE,LON_CREDIT_COLLATERAL_CODE,LON_COLLATERAL_DETAIL_TYPE_CODE,LON_COLLATERAL_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.fetchSizeList.value = codeData.showrows
    commonCodeList.lonCreditLineTypeCode = codeData.lonCreditLineTypeCode
    commonCodeList.lonInterestRateCode = codeData.interestRateCode
    commonCodeList.lonCreditCollateralCode = codeData.lonCreditCollateralCode
    commonCodeList.lonCollateralDetailTypeCode = codeData.lonCollateralDetailTypeCode
    commonCodeList.lonCollateralTypeCode = codeData.lonCollateralTypeCode
    commonCodeList.lonRepayMethodCode = codeData.lonRepayMethodCode
    const optionalCode = { code: '06', codeValue: 'Optional' }
    commonCodeList.lonRepayMethodCode.push(optionalCode)
  })

/* =======================================================
    4. Grid Props
======================================================= */
const searchParam = ref({
  fetchSize: {
    value: 100,
    required: false,
    description: i18n.global.t('label.view.showRows')
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  }
})

/* =======================================================
    5. Grid Function
======================================================= */
const clear = () => {
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowCounts.value = 0
  rowData.value = []
  freeformUtil.clear(modelValues)
  freeformUtil.clear(formParam)
  formParam.value.transactionMode.value = 'NEW'
  updateTrxnMode()
}

const search = () => {
  const newSearchParam = commonUtil.inputValueToJson('bsLonComPrdService', 'LONCOMPRD002', searchParam, rowData, rowCounts)
  return new Promise((resolve, reject) => {
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        if (data.length === 0) {
          const _alertInfo = () => {
            rowData.value = []
            rowCounts.value = 0
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
        } else {
          rowData.value = []
          rowCounts.value = 0
          rowData.value = data
          rowCounts.value = data.length
          formParam.value.transactionMode.value = 'NEW'
          updateTrxnMode()
        }
        resolve(rowData.value)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonComPrdService', 'LONCOMPRD002', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonComPrdService', 'LONCOMPRD002', searchParam, rowCounts)
}

/* =======================================================
    6. Freeform Object
======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언
const configId = ref(null)
const configObjectType = ref(null)
const configDesc = ref(null)
const usedYn = ref(null)
const freeformRefs = {
  configId, configObjectType, configDesc, usedYn, baseRateCode
}
// Freeform Disable 기능을 위한 객체 선언
const nonTarget = ref(false)
const collateralLoanFlag = ref(true)
const excludeTarget = ref(true)
const disableFlagObj = reactive({
  nonTarget, excludeTarget
})
const cdDisable = ref(true)
const fixedFlag = ref(false)
const optionalFlag = ref(false)
const variableFlag = ref(true)
const creditFlag = ref(false)

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

const formParam = ref({
  productCode: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.loanProductCode')
  },
  productName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.loanProductName')
  },
  accountCode: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.accountCode')
  },
  accountCodeName: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.accountName')
  },
  openDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.openDate')
  },
  closeDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.closeDate')
  },
  loanMinAmount: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.loanAmount')
  },
  loanMaxAmount: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.loanAmount')
  },
  loanDefaultAmount: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.defaultAmount')
  },
  intRateTpcd: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.interestRateType')
  },
  baseRateCode: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  baseRateName: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  intMinRate: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  intMaxRate: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  loanTermYearMin: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTermRange')
  },
  loanTermMonthMin: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTermRange')
  },
  loanTermYearMax: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTermRange')
  },
  loanTermMonthMax: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTermRange')
  },
  repayProgTpcd: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.repaymentProgram')
  },
  creditClCode: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.creditCollateralLoan')
  },
  collateralTpcd: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.collateralType')
  },
  collateralDetailCd: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.collateralDetailType')
  },
  creditLineTpcd: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanMethod')
  },
  businessCode: {
    value: 'LON',
    initValue: 'LON'
  },
  baseDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate
  },
  transactionMode: {
    value: 'NEW',
    required: true
  },
  currencyCode: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: false,
    description: i18n.global.t('label.objt.baseRate')
  }
})

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
  modelValues2.value.currency.value = newVal
  modelValues3.value.currency.value = newVal
  formParam.value.currencyCode.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.loanMinAmount.value = Number(newVal.replace(/,/g, ''))
})

const modelValues2 = ref({
  currency: {
    value: modelValues.value.currency.value,
    initValue: modelValues.value.currency.value
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues2.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.loanMaxAmount.value = Number(newVal.replace(/,/g, ''))
})

const modelValues3 = ref({
  currency: {
    value: modelValues.value.currency.value,
    initValue: modelValues.value.currency.value
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues3.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.loanDefaultAmount.value = Number(newVal.replace(/,/g, ''))
})

watch(() => formParam.value.collateralTpcd.value, (newVal) => {
  lonCollateralDetailTypeCodeList.value = []
  const coTpcd = formParam.value.collateralTpcd.value.split(0)[0]
  const codeTpcd = commonCodeList.lonCollateralDetailTypeCode.filter(v => v.code.startsWith(coTpcd))
  lonCollateralDetailTypeCodeList.value = codeTpcd
})

/* =======================================================
   7. Freeform Funtion
======================================================= */
const showBirSearch1 = ref(false)
const showPrdSearch = ref(false)
const selectedPopupRowData = ref([])
const checkParam = () => {
  if (formParam.value.intRateTpcd.value === '02') {
    formParam.value.baseRateCode.required = true
  } else {
    formParam.value.baseRateCode.required = false
  }
}
const save = () => {
  checkParam()
  if (!freeformUtil.checkRequired(formParam, freeformRefs)) return

  // Loan Min Amount 가 Loan Max Amount보다 큰 경우
  if (formParam.value.loanMinAmount.value > formParam.value.loanMaxAmount.value) {
    const msg = 'Min loan amount can not be larger than max loan amount'
    messageBox.alertError(msg)
    return
  }
  // Loan Default Amount가 Loan Amount Range 내에 있지 않은 경우
  if ((formParam.value.loanMinAmount.value > formParam.value.loanDefaultAmount.value) || formParam.value.loanDefaultAmount.value > formParam.value.loanMaxAmount.value) {
    const msg = 'Default amount must fall within the loan amount range'
    messageBox.alertError(msg)
    return
  }
  // Interest Min Rate가 Interest Max Rate보다 큰 경우
  if (formParam.value.intMinRate.value > formParam.value.intMaxRate.value) {
    const msg = 'Min interest rate can not be larger than max interest rate'
    messageBox.alertError(msg)
    return
  }
  // Loan Min Term이 Loan Max Term보다 큰 경우
  if (((formParam.value.loanTermYearMin.value * 12) + formParam.value.loanTermMonthMin.value) > ((formParam.value.loanTermYearMax.value * 12) + formParam.value.loanTermMonthMax.value)) {
    const msg = 'Min loan term can not be larger than max loan term'
    messageBox.alertError(msg)
    return
  }
  const _confirm = () => {
    const saveParam = commonUtil.inputValueToJson('bsLonComPrdService', 'LONCOMPRD009', formParam)
    ajaxUtil.ajaxServiceCall(saveParam)
      .then((response) => {
        messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
      })
      .catch((error) => {
        messageBox.alertAjaxError(error)
      })
  }
  const _alertAjaxSuccess = () => {
    if (formParam.value.transactionMode.value === 'NEW' || formParam.value.transactionMode.value === 'UPDATE') {
      formParam.value.transactionMode.value = 'INQUIRY'
      const targetproductCode = formParam.value.productCode.value
      search().then(rows => {
        const selectedRow = rows.find(row => row.productCode === targetproductCode)
        if (selectedRow) {
          gridProps.gridApi.value.forEachNode(node => {
            if (node.data.productCode === selectedRow.productCode) {
              node.setSelected(true)
              onSelectionChanged({ source: 'rowClicked' })
            }
          })
        }
      })
    } else {
      formParam.value.transactionMode.value = 'NEW'
      search()
    }
    updateTrxnMode()
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

const onSelectionChanged = async (values) => {
  if (values.source === 'rowClicked') {
    freeformUtil.clear(modelValues)

    formParam.value.transactionMode.value = 'INQUIRY'
    updateTrxnMode()
    await nextTick()
    const selectedRows = gridProps.gridApi.value.getSelectedRows()
    freeformUtil.selectedRowDataToFreeformData(selectedRows[0], formParam.value)
    modelValues.value.currency.value = formParam.value.currencyCode.value
    modelValues2.value.currency.value = formParam.value.currencyCode.value
    modelValues.value.money.value = formParam.value.loanMinAmount.value
    modelValues2.value.money.value = formParam.value.loanMaxAmount.value
    modelValues3.value.money.value = formParam.value.loanDefaultAmount.value
  }
}

const showBirSearchPopup1 = () => {
  showBirSearch1.value = true
}

const showPrdSearchPopup = () => {
  showPrdSearch.value = true
}

const getPopupRowData5 = (event) => {
  selectedPopupRowData.value = event[0]
  const existingApplication = rowData.value.find(row => row.productCode === selectedPopupRowData.value.productCode)
  if (existingApplication) {
    const _alertInfoPopup = () => {
      showPrdSearchPopup()
    }
    messageBox.alertInfo(i18n.global.t('This is an already registered productCode number.'), _alertInfoPopup)
  } else {
    formParam.value.productCode.value = selectedPopupRowData.value.productCode
    formParam.value.productName.value = selectedPopupRowData.value.productName
    formParam.value.accountCode.value = selectedPopupRowData.value.accountCode
    formParam.value.accountCodeName.value = selectedPopupRowData.value.accountCodeName
    formParam.value.openDate.value = selectedPopupRowData.value.openDate
    formParam.value.closeDate.value = selectedPopupRowData.value.closeDate
  }
}

const getPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.baseRateCode.value = selectedPopupRowData.value.baseRateName
  formParam.value.intMinRate.value = selectedPopupRowData.value.baseRate
  formParam.value.intMaxRate.value = selectedPopupRowData.value.baseRate
}

const updateTrxnMode = (event) => {
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    freeformUtil.disableControl(false, disableFlagObj)
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    freeformUtil.clear(formParam)
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
    radioDisableFlag.value.inquiryRadio.value = true
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  } else {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  }
}

const intRatetTypeChange = (event) => {
  const trMode = formParam.value.transactionMode.value
  if (trMode === 'NEW' || trMode === 'UPDATE') {
    if (event === '01') {
      fixedFlag.value = false
      variableFlag.value = true
      optionalFlag.value = true
      formParam.value.baseRateCode.value = ''
      formParam.value.baseRateName.value = ''
    } else if (event === '02') {
      fixedFlag.value = true
      variableFlag.value = false
      optionalFlag.value = true
    } else {
      fixedFlag.value = true
      variableFlag.value = true
      optionalFlag.value = false
      formParam.value.baseRateCode.value = ''
      formParam.value.baseRateName.value = ''
    }
  }
}

const crecolTypeChange = (event) => {
  const tr = formParam.value.transactionMode.value
  if (tr === 'NEW' || tr === 'UPDATE') {
    if (event === '01') {
      creditFlag.value = false
      collateralLoanFlag.value = true
      formParam.value.collateralTpcd.value = ''
      formParam.value.collateralDetailCd.value = ''
    } else {
      creditFlag.value = true
      collateralLoanFlag.value = false
    }
  }
}

</script>
<style scoped>
.relative-container1 {
   position: relative;
}
.full-row {
    grid-column-start: span 2;
}
.horizontal-layout {
   display: flex; /* Use flex for the inner items */
   justify-content: flex-start;
   gap: 10px;
}
.double_input_box {
    display: flex;
    gap: 10px;
    width: 100%;
}
.msg_info_form_triple_box {
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: hidden;
}

.msg_info_form_box{
  min-height: 300px !important;
}

</style>
