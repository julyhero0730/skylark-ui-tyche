<template>
  <q-header class="header_page_title">
    <div class="title_wrapper">
      <page-title></page-title>
    </div>
  </q-header>
  <q-page-container>
    <q-page class="table_container">
      <div class="table_top_button_wrapper">
        <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
        <q-btn flat :disable=settleBtnFlag :label="$t('label.view.settlement')" class="btn btmBtn" style="margin-left:30px" @click="popupOpen()"/>
      </div>
      <div class="scrollable-container height73 q-pr-md">
        <LonRpmMngFreeform
          :form-param="formParam"
          :common-code-list="commonCodeList"
          :selected-popup-row-data="selectedPopupRowData"
          :model-values="modelValues"
          :model-values2="modelValues2"
          :model-values3="modelValues3"
          :model-values4="modelValues4"
          :model-values5="modelValues5"
          :model-values6="modelValues6"
          :cd-disable="cdDisable"
          :form-param-clear="formParamClear"
          :row-data-clear="rowDataClear"
          :model-values-clear="modelValuesClear"
          :repayment-history="repaymentHistory"
        ></LonRpmMngFreeform>
        <div class="msg_info_form_quadruple_box" style="margin-top: 10px;">
          <q-list class="custom-gray text-white rounded-borders all-full-row bordered-items" >
            <q-expansion-item v-model="isRepaymentHistory">
              <template v-slot:header>
                  <div class="text-center full-width">{{ $t('label.view.repaymentHistoryInfo') }}</div>
              </template>
                <q-card>
                  <q-card-section>
                      <div class="width" style="margin-top: 10px; border: 1px solid #000; padding: 10px; position: relative;">
                          <div style="font-weight: bold; position: absolute; top: -10px; left: 10px; background-color: #fff; padding: 0 5px; color: #000;">
                            [ Repayment History ]
                          </div>
                          <div class="table_scroll_box width100" style="margin-top: 10px;">
                              <ag-grid-vue
                                  class="msg_table ag-theme-balham height30"
                                  :rowData="rowData3"
                                  :columnDefs="gridProps4.columnDefs(commonCodeList, currencyParam)"
                                  :columnTypes="gridProps4.columnTypes"
                                  :defaultColDef="gridProps4.defaultColDef"
                                  @grid-ready="gridProps4.onGridReady"
                                  rowSelection="single"
                                  :onCellKeyDown="gridPropsUtil.onCellKeyDown"
                                  @rowClicked="onRowSelected"
                              ></ag-grid-vue>
                          </div>
                      </div>
                  </q-card-section>
                </q-card>
            </q-expansion-item>
            <LonRpmMngGeneralFreeform
              :selected-popup-row-data="selectedPopupRowData"
              :repayment-search="repaymentSearch"
              :repayment-search-param="repaymentSearchParam"
              :form-param="formParam"
              :common-code-list="commonCodeList"
              :model-values3="modelValues3"
              :model-values4="modelValues4"
              :model-values5="modelValues5"
              :model-values6="modelValues6"
              :is-repayment-general="isRepaymentGeneral"
              :cd-disable="cdDisable"
              :non-target="nonTarget"
            ></LonRpmMngGeneralFreeform>
            <q-expansion-item v-model="isRepaymentPrincipalAndInterestInfo">
              <template v-slot:header>
                  <div class="text-center full-width">{{ $t('label.view.repaymentPrincipalInt') }}</div>
              </template>
              <q-card>
                <q-card-section>
                  <div class="width100" style="margin-top: 20px; border: 1px solid #000; padding: 10px; position: relative;">
                      <div style="font-weight: bold; position: absolute; top: -10px; left: 10px; background-color: #fff; padding: 0 5px; color: #000;">
                        [ Principal ]
                      </div>
                      <div class="table_scroll_box width100" style="margin-top: 30px;">
                          <ag-grid-vue
                          class="msg_table ag-theme-balham height30"
                          :rowData="rowData"
                          :columnDefs="gridProps.columnDefs(commonCodeList, currencyParam)"
                          :columnTypes="gridProps.columnTypes"
                          :defaultColDef="gridProps.defaultColDef"
                          @grid-ready="gridProps.onGridReady"
                          rowSelection="single"
                          ></ag-grid-vue>
                      </div>
                  </div>
                  <div class="width100" style="margin-top: 20px; border: 1px solid #000; padding: 10px; position: relative;">
                    <div style="font-weight: bold; position: absolute; top: -10px; left: 10px; background-color: #fff; padding: 0 5px; color: #000;">
                      [ Interest ]
                    </div>
                    <div class="table_scroll_box width100" style="margin-top: 30px;">
                        <ag-grid-vue
                            class="msg_table ag-theme-balham height30"
                            :rowData="rowData1"
                            :columnDefs="gridProps2.columnDefs(commonCodeList, currencyParam)"
                            :columnTypes="gridProps2.columnTypes"
                            :defaultColDef="gridProps2.defaultColDef"
                            @grid-ready="gridProps2.onGridReady"
                            rowSelection="single"
                        ></ag-grid-vue>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item v-model="isPastDueInfo">
              <template v-slot:header>
                  <div class="text-center full-width">{{ $t('label.view.pastDueInfo') }}</div>
              </template>
                <q-card>
                  <q-card-section>
                      <div class="width100" style="margin-top: 20px; border: 1px solid #000; padding: 10px; position: relative;">
                          <div style="font-weight: bold; position: absolute; top: -10px; left: 10px; background-color: #fff; padding: 0 5px; color: #000;">
                            [ Past Due ]
                          </div>
                          <div class="table_scroll_box width100" style="margin-top: 30px;">
                              <ag-grid-vue
                                  class="msg_table ag-theme-balham heigth30"
                                  :rowData="rowData2"
                                  :columnDefs="gridProps3.columnDefs(commonCodeList, currencyParam)"
                                  :columnTypes="gridProps3.columnTypes"
                                  :defaultColDef="gridProps3.defaultColDef"
                                  @grid-ready="gridProps3.onGridReady"
                                  rowSelection="single"
                                  :onCellKeyDown="gridPropsUtil.onCellKeyDown"
                              ></ag-grid-vue>
                          </div>
                      </div>
                  </q-card-section>
                </q-card>
            </q-expansion-item>
            </q-list>
            <lonHlpSet
                :lon-disbursement-no=formParam.disbursementNo.value
                :lon-customer-no=formParam.customerNo.value
                :lon-transaction-mode=formParam.transactionMode.value
                :lon-repayment-no=formParam.repaymentNo.value
                :lon-currency-code=formParam.currencyCode.value
                :lon-principle-amt=formParam.principleAmt.value
                :lon-int-amt=formParam.intAmt.value
                :lon-pastdue-amt=formParam.pastDueAmt.value
                :lon-total-repay-amt=formParam.totalAmt.value
                :lon-transaction-status-cd=formParam.transactionStatusCd.value
                v-model="showSettleSearch" >
            </lonHlpSet>
          </div>
          <div class="msg_info_form_quadruple_box">
              <div class="all-full-row">
                  <label class="form_label">{{ $t('label.view.pastDueRemark') }}</label>
                  <CommonSearchInputBox v-model="formParam.pastdueRmk.value" :disable="formParam.transactionMode.value !== 'NEW' && formParam.transactionMode.value !== 'UPDATE'"></CommonSearchInputBox>
              </div>
          </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script setup>
/*
    302040 - Loan Repayment

    Index.
    1. Import Area
    2. Global Variable
    3. Common Code Adapter
    4. Grid Props
    5. Function
    6. Freeform Object
    7. Freeform Function
    8. Watch
*/

/* =======================================================
    1. Import Area
======================================================= */
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { i18n } from 'boot/i18n'
import { ajaxUtil, commonUtil, messageBox, freeformUtil, gridPropsUtil } from 'skylark-ui-lib'
import { AgGridVue } from 'ag-grid-vue3'
import LonRpmMngFreeform from './lonRpmMngProps/lonRpmMngFreeform.vue'
import LonRpmMngGeneralFreeform from './lonRpmMngProps/lonRpmMngGeneralFreeform.vue'
import { useSessionStore } from 'stores/session'
import { Dialog } from 'quasar'
import { gridProps } from './lonRpmMngProps/lonRpmPrinGridProps.vue'
import { gridProps2 } from './lonRpmMngProps/lonRpmInterestGridProps.vue'
import { gridProps3 } from './lonRpmMngProps/lonRpmPastGridProps.vue'
import { gridProps4 } from './lonRpmMngProps/lonRpmHistoryGridProps.vue'
import lonHlpSet from 'src/components/pages/main/hlp/lon/lonHlpSet.vue'

/* =======================================================
    2. Global Variable
======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언
const nonTarget = ref(false)
const rowData = ref([])
const rowData1 = ref([])
const rowData2 = ref([])
const rowData3 = ref([])

// 전역변수 선언
const session = useSessionStore()
const cdDisable = ref(true)
const prinDisable = ref(true)
const interestDisable = ref(true)
const showSettleSearch = ref(false)
const settleBtnFlag = ref(true)

/* =======================================================
    3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  countryTypeCode: ref([]),
  lonRepayMethodCode: ref([]),
  lonRepayPrincpleInterestCode: ref([]),
  lonRepaymentCode: ref([]),
  lonRepayInterestCode: ref([]),
  brcCurrencyCodeList: ref([]),
  lonPastdueTypeCode: ref([]),
  lonRepayPastdueFlag: ref([])
})

const branchCode = ref('')
const branchValue = ref('')
const employeeNo = ref('')
const employeeValue = ref('')

// 통화 코드 및 기타 코드 가져오기
ajaxUtil.getCurrencyCodeForBranch().then(function (codeData) {
  commonCodeList.brcCurrencyCodeList = codeData
})
ajaxUtil.getCodeList('LON_REPAY_METHOD_CODE,LON_REPAY_PRINCPLE_INTEREST_CODE,LON_REPAYMENT_CODE,LON_REPAY_INTEREST_CODE,LON_PAST_DUE_CODE,LON_REPAY_PASTDUE_FLAG')
  .then(function (codeData) {
    commonCodeList.lonRepayMethodCode = codeData.lonRepayMethodCode
    commonCodeList.lonRepayPrincpleInterestCode = codeData.lonRepayPrincpleInterestCode
    commonCodeList.lonRepaymentCode = codeData.lonRepaymentCode
    commonCodeList.lonRepayInterestCode = codeData.lonRepayInterestCode
    commonCodeList.lonPastdueTypeCode = codeData.lonPastDueCode
    commonCodeList.lonRepayPastdueFlag = codeData.lonRepayPastdueFlag
  })
ajaxUtil.getCurrencyCode().then(function (codeData) {
  commonCodeList.countryTypeCode = codeData
})

ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      branchCode.value = codeData.find(item => item.code === session.sysBranchCode)
      branchValue.value = branchCode.value.codeValue
      formParam.value.manageBrnm.value = branchValue.value
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

ajaxUtil.getEmployeeNoList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      employeeNo.value = codeData.find(item => item.code === session.sysEmployeeNo)
      employeeValue.value = employeeNo.value.codeValue
      formParam.value.manageEmployeeNm.value = employeeValue.value
      formParam.value.registEmployeeNm.value = employeeValue.value
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })
/* =======================================================
      4. Grid Props
  ======================================================= */
const formParam = ref({
  creditLineTpcd: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.creditLineTpcd')
  },
  disbursementNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.disbursementNo')
  },
  serialNo: {
    value: '',
    required: false
  },
  referSerialNo: {
    value: '',
    required: true
  },
  customerNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.customer')
  },
  repayProgTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.repaymentProgram')
  },
  productCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.productCode')
  },
  disbursementDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.disbursementDate')
  },
  maturityDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.maturityDate')
  },
  currencyCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.disbursementAmount')
  },
  disbursementAmt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.disbursementAmount')
  },
  disburseBalance: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.disburseOutstanding')
  },
  lastRepayDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.lastRepayDate')
  },
  lastIntChrgPrd: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.lastInterestCharGed')
  },
  nextSchdDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.nextRepaySchDate')
  },
  nextSchdIntDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.nextInterestSchDate')
  },
  repaymentNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.repaymentNo')
  },
  transactionDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.view.transactionDate')
  },
  repaymentDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.view.repaymentDate')
  },
  repayPrinIntCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.principalInterest')
  },
  repayTypeCode: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.repayTypeCode')
  },
  scheduleNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.repayScheduleNo')
  },
  scheduleDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.scheduleDate')
  },
  scheduleYn: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.scheduleActiveYn')
  },
  principleAmt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.principalAmount')
  },
  interestRepayCode: {
    value: '01',
    required: true,
    description: i18n.global.t('label.view.interestRepayType')
  },
  intCalcFromDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.interestPeriodFrom')
  },
  intCalcToDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.interestPeriodTo')
  },
  intAmt: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.interestAmount')
  },
  pastDueCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.pastDuePeriodFrom')
  },
  pastdueFrdt: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.pastDuePeriodFrom')
  },
  pastdueTodt: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.pastDuePeriodTo')
  },
  pastDueAmt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.pastDueInterestAmount')
  },
  rmk: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.remark')
  },
  totalAmt: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.totalRepaymentAmount')
  },
  pastdueRmk: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.pastDueRemark')
  },
  transactionMode: {
    value: 'NEW',
    initValue: 'NEW',
    required: true
  },
  branchCd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true
  },
  userId: {
    value: session.sysUserId,
    initValue: session.sysUserId,
    required: true
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageBrnm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true,
    description: i18n.global.t('label.objt.employeeNo')
  },
  registEmployeeNm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.employeeName')
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true,
    description: i18n.global.t('label.objt.managementEmployee')
  },
  manageEmployeeNm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.managementEmployee')
  },
  transactionStatusCd: { // 상환 일계처리를 위한 코드 값
    value: '01',
    initValue: '01',
    required: true
  }
})

const repaymentSearchParam = ref({
  referSerialNo: {
    value: '',
    required: true
  },
  repaymentNo: {
    value: '',
    required: true
  },
  disbursementNo: {
    value: '',
    required: true
  },
  scheduleNo: {
    value: '',
    required: true
  },
  repaymentDate: {
    value: '',
    required: false
  },
  transactionMode: {
    value: 'NEW',
    required: true
  },
  searchType: {
    value: 'DISBURSEMENT_NO',
    required: false
  },
  searchKeyword: {
    value: '',
    required: false
  },
  fetchSize: {
    value: 100
  },
  maxValue: {
    value: '0'
  }
})

const modelValues = ref({
  currency: {
    value: ''
  },
  money: {
    value: 0
  }
})

const modelValues2 = ref({
  currency: {
    value: ''
  },
  money: {
    value: 0
  }
})

const modelValues3 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

const modelValues4 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

const modelValues5 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

const modelValues6 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

/* =======================================================
      5. Function
  ======================================================= */
const isRepaymentHistory = ref(false)
const isRepaymentGeneral = ref(false)
const isRepaymentPrincipalAndInterestInfo = ref(false)
const isPastDueInfo = ref(false)

const search = async () => {
  try {
    formParam.value.transactionMode.value = 'INQUIRY'
    updateTrxnMode()

    const data = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM052', repaymentSearchParam)
    const response = await ajaxUtil.ajaxServiceData(data)
    if (response && Object.keys(response).length === 0) {
      messageBox.alertInfo(i18n.global.t('msg.nodata.found'), formParamClear())
    } else {
      for (const key in response) {
        formParam.value[key] = { value: response[key] }
      }
      modelValues.value.currency.value = response.currencyCode
      modelValues2.value.currency.value = response.currencyCode
      modelValues3.value.currency.value = response.currencyCode
      modelValues4.value.currency.value = response.currencyCode
      modelValues5.value.currency.value = response.currencyCode
      modelValues6.value.currency.value = response.currencyCode
      modelValues.value.money.value = response.disbursementAmt
      modelValues2.value.money.value = response.disburseBalance

      repaymentHistory()
      repaymentHistoryDetail()
    }
  } catch (error) {
    messageBox.alertAjaxError(error)
    settleBtnFlag.value = true
  }
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

const forData = (dataRows, datas) => {
  for (const index in dataRows) {
    datas.push(dataRows[index].data)
  }
}

const setSaveParam = (saveParam) => {
  const datas = []
  const datas1 = []
  const datas2 = []
  const dataRows = gridProps.gridApi.value.rowModel.rowsToDisplay
  const dataRows1 = gridProps2.gridApi.value.rowModel.rowsToDisplay
  const dataRows2 = gridProps3.gridApi.value.rowModel.rowsToDisplay

  forData(dataRows, datas)
  forData(dataRows1, datas1)
  forData(dataRows2, datas2)

  saveParam.gridData = datas.filter(obj => obj.id !== 'total')
  saveParam.gridData1 = datas1.filter(obj => obj.id !== 'total')
  saveParam.gridData2 = datas2.filter(obj => obj.id !== 'total')
}

const save = () => {
  if (formParam.value.registEmployeeNo.value !== session.sysEmployeeNo) {
    messageBox.alertInfo(i18n.global.t('msg.info.managerCheck'))
    return
  }
  if (!freeformUtil.checkRequired(formParam)) return

  if (formParam.value.transactionMode.value !== 'INQUIRY') {
    const saveParam = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM009', formParam)
    setSaveParam(saveParam)
    ajaxUtil.ajaxServiceData(saveParam)
      .then(function (response) {
        if (!response) {
          const _alertInfoNodata = () => {
            rowData.value = []
            rowData1.value = []
            rowData2.value = []
            rowData3.value = []
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoNodata)
        } else {
          repaymentSearchParam.value.disbursementNo.value = formParam.value.disbursementNo.value
          alertAjaxSuccess(response).onOk(() => {
            if (formParam.value.transactionMode.value === 'NEW') {
              repaymentSearchParam.value.repaymentNo.value = response
              search()
            } else if (formParam.value.transactionMode.value === 'UPDATE') {
              repaymentSearchParam.value.transactionMode.value = formParam.value.repaymentNo.value
              repaymentSearchParam.value.disbursementNo.value = formParam.value.disbursementNo.value
              search()
            }
          })
        }
      })
  }
}

const popupOpen = () => {
  if (formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    showSettleSearch.value = true
  } else {
    messageBox.alertInfo(i18n.global.t('msg.info.managerCheck'))
    showSettleSearch.value = false
  }
}

/* =======================================================
      6. Freeform Object
  ======================================================= */
const selectedPopupRowData = ref([])
let oldRepaymentDate = formParam.value.repaymentDate.value

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
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    formParamClear()
    modelValuesClear()
    rowDataClear()
    isRepaymentHistory.value = false
    isRepaymentPrincipalAndInterestInfo.value = false
    isPastDueInfo.value = false
    freeformUtil.disableControl(false, disableFlagObj)
  } else if (transactionMode === 'INQUIRY') {
    freeformUtil.disableControl(true, disableFlagObj)
    formParamClear()
    modelValuesClear()
    rowDataClear()
    cdDisable.value = true
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(true, disableFlagObj)
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
    cdDisable.value = true
  }

  controllRadioDisable(transactionMode)
}

const formParamClear = () => {
  freeformUtil.clear(formParam)
  formParam.value.transactionDate.value = session.sysCurrentBusinessDate
  formParam.value.repaymentDate.value = session.sysCurrentBusinessDate
  formParam.value.currencyCode.value = modelValues.value.currency.value
  formParam.value.manageBrnm.value = branchValue.value
  formParam.value.manageEmployeeNm.value = employeeValue.value
}

const modelValuesClear = () => {
  modelValues.value.money.value = 0
  modelValues2.value.money.value = 0
  modelValues3.value.money.value = 0
  modelValues4.value.money.value = 0
  modelValues5.value.money.value = 0
  modelValues6.value.money.value = 0
}

const rowDataClear = () => {
  rowData.value = []
  rowData1.value = []
  rowData2.value = []
  rowData3.value = []
}

const controllRadioDisable = (selectedTransactionMode) => {
  if (selectedTransactionMode === 'NEW') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    settleBtnFlag.value = true
  } else if (selectedTransactionMode === 'INQUIRY') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    settleBtnFlag.value = true
  } else if (selectedTransactionMode === 'UPDATE') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
    settleBtnFlag.value = true
  } else if (selectedTransactionMode === 'DELETE') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
    settleBtnFlag.value = true
  }
}

const onRowSelected = (params) => {
  const selectedRows = {}
  if (params === undefined) { // 직접 선택하지 않고 Direct Search 이후 onRowSelected를 호출 한 경우
    selectedRows.value = gridProps4.gridApi.value.getRenderedNodes()[0].data
  } else { // 직접 Row를 선택한 경우
    selectedRows.value = params.api.getSelectedRows()[0]
  }

  if (formParam.value.transactionMode.value === 'NEW' && params !== undefined) {
    formParam.value.transactionMode.value = 'INQUIRY'
  }

  if (formParam.value.transactionMode.value !== 'NEW' && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    for (const key in selectedRows.value) {
      formParam.value[key] = { value: selectedRows.value[key] }
    }

    rowData.value = []
    rowData1.value = []
    rowData2.value = []

    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false

    repaymentHistoryDetail()
  }
}

const repaymentSearch = async () => {
  rowData.value = []
  rowData1.value = []
  rowData2.value = []
  try {
    if (formParam.value.repayPrinIntCode.value === '01') {
      principalGrid()
      interestGrid()
      pastdueGrid()
    } else if (formParam.value.repayPrinIntCode.value === '02') {
      interestGrid()
      pastdueGrid()
    } else if (formParam.value.repayPrinIntCode.value === '03') {
      principalGrid()
      pastdueGrid()
    }
    isRepaymentPrincipalAndInterestInfo.value = true
  } catch (error) {
    freeformUtil.clear(repaymentSearchParam)
    modelValuesClear()
    formParam.value.scheduleNo.value = ''
    formParam.value.scheduleDate.value = ''
    formParam.value.referSerialNo.value = ''
    formParam.value.intCalcFromDate.value = ''
    formParam.value.intCalcToDate.value = ''
  }
}

const repaymentHistory = async () => {
  if (formParam.value.scheduleYn.value === '' || formParam.value.scheduleYn.value === 'N') {
    const _alertError = () => {
      formParamClear()
      rowDataClear()
      modelValuesClear()
      isRepaymentGeneral.value = false
      settleBtnFlag.value = true
      return null
    }
    messageBox.alertError('Please create the schedule before proceeding.', _alertError)
  }
  if (formParam.value.transactionMode.value === 'INQUIRY') {
    isRepaymentHistory.value = true
    // settleBtnFlag.value = false
  } else {
    isRepaymentHistory.value = false
    settleBtnFlag.value = true
  }
  repaymentSearchParam.value.disbursementNo.value = formParam.value.disbursementNo.value
  const data = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM002', repaymentSearchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response) {
        rowData3.value = response
        if (rowData3.value.length > 0 && formParam.value.repaymentNo.value === '') {
          setTimeout(() => { // Direct Search로 실행 조회한 경우 Repayment History의 첫번째 행 선택
            onRowSelected()
          }, 0)
        }
      }
    })
}

const repaymentHistoryDetail = async () => {
  repaymentSearchParam.value.repaymentNo.value = formParam.value.repaymentNo.value
  const data = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM012', repaymentSearchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response) {
        settleBtnFlag.value = false
        rowData.value = []
        rowData1.value = []
        rowData2.value = []
        rowData.value = response.filter(obj => obj.repayDetailCode === '01')
        rowData1.value = response.filter(obj => obj.repayDetailCode === '02')
        rowData2.value = response.filter(obj => obj.repayDetailCode === '03')
        if (rowData.value.length > 0) { totalValue() }
        if (rowData1.value.length > 0) { totalValue1() }
        if (rowData.value.length > 0 || rowData1.value.length > 0) {
          isRepaymentPrincipalAndInterestInfo.value = true
        }

        if (rowData2.value.length > 0) {
          isPastDueInfo.value = true
          totalValue2()
        } else {
          isPastDueInfo.value = false
        }
      } else {
        settleBtnFlag.value = true
      }
    })
}

const principalGrid = async () => { // 원금 스케줄 조회
  const data = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM022', repaymentSearchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response) {
        rowData.value = response
        for (const key in response) {
          formParam.value[key] = { value: response[key] }
        }
        if (rowData.value.length > 0) { totalValue() } // rowData가 0 보다 큰 경우에만 total행 추가
      }
    })
}

const interestGrid = async () => { // 이자 스케줄 조회
  const data = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM032', repaymentSearchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response) {
        rowData1.value = response
        if (rowData1.value.length > 0) {
          totalValue1()

          // rowData1의 이자 계산 시작일과 끝
          formParam.value.intCalcFromDate.value = rowData1.value[0].intCalcFromDate
          formParam.value.intCalcToDate.value = rowData1.value[rowData1.value.length - 2].intCalcToDate
        } else {
          formParam.value.intCalcFromDate.value = ''
          formParam.value.intCalcToDate.value = ''
        }
      }
    })
}

const pastdueGrid = async () => { // 연체 스케줄 조회
  const data = commonUtil.inputValueToJson('bsLonSrvRpmService', 'LONSRVRPM042', repaymentSearchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response) {
        rowData2.value = response
        if (rowData2.value.length > 0) {
          totalValue2()
          if (rowData2.value[rowData2.value.length - 1].accruedPastdue > 0) { // 연체금이 존재하면
          // rowData2의 연체 계산 시작일과 끝
            isPastDueInfo.value = true
            formParam.value.pastdueFrdt.value = rowData2.value[0].pastdueFrdt
            formParam.value.pastdueTodt.value = rowData2.value[rowData2.value.length - 2].pastdueTodt
            formParam.value.pastDueCode.value = rowData2.value[rowData2.value.length - 2].pastDueTypeCode
          }
        } else {
          isPastDueInfo.value = false
          rowData2.value = []
        }
      }
    })
}

const totalValue = () => {
  // Principle Grid 합계 구하기
  const totalSchdPrincipalAmt = rowData.value.reduce((acc, row) => acc + Number(row.schdPrincipalAmt), 0)
  const totalPreviousPrincipal = rowData.value.reduce((acc, row) => acc + Number(row.previousPrincipal), 0)
  const totalPaidPrincipal = rowData.value.reduce((acc, row) => acc + Number(row.paidPrincipal), 0)
  const totalRemainingPrincipal = rowData.value.reduce((acc, row) => acc + Number(row.remainingPrincipal), 0)

  // 합계 결과를 total 행에 설정
  const totalRow = {
    id: 'total',
    scheduleDate: '',
    repaymentType: '',
    schdPrincipalAmt: totalSchdPrincipalAmt,
    previousPrincipal: totalPreviousPrincipal,
    paidPrincipal: totalPaidPrincipal,
    remainingPrincipal: totalRemainingPrincipal
  }
  // rowData.value 배열을 복사하여 새로운 배열을 생성하고, 그 배열에 totalRow 추가
  rowData.value = [...rowData.value, totalRow]
}

const totalValue1 = () => {
  // Interest Grid 합계 구하기
  const totalSchdIntAmt = rowData1.value.reduce((acc, row) => acc + Number(row.schdIntAmt), 0)
  const totalPreviousInt = rowData1.value.reduce((acc, row) => acc + Number(row.previousInt), 0)
  const totalPaidInt = rowData1.value.reduce((acc, row) => acc + Number(row.paidInt), 0)
  const totalRemainingInt = rowData1.value.reduce((acc, row) => acc + Number(row.remainingInt), 0)

  // 합계 결과를 total 행에 설정
  const totalRow1 = {
    id: 'total',
    scheduleDate: '',
    interestRepayCode: '',
    intCalcPrinciple: '',
    intCalcFromDate: '',
    intCalcToDate: '',
    intCalcDays: '',
    intCalcRate: '',
    schdIntAmt: Number(totalSchdIntAmt),
    previousInt: Number(totalPreviousInt),
    paidInt: Number(totalPaidInt),
    remainingInt: Number(totalRemainingInt)
  }
  // rowData.value 배열을 복사하여 새로운 배열을 생성하고, 그 배열에 totalRow 추가
  rowData1.value = [...rowData1.value, totalRow1]
}

const totalValue2 = () => {
  // Interest Grid 합계 구하기
  const totalDays = rowData2.value.reduce((acc, row) => acc + Number(row.pastdueDays), 0)
  const totalAccruedPastdue = rowData2.value.reduce((acc, row) => acc + Number(row.accruedPastdue), 0)
  const totalPaidPastdue = rowData2.value.reduce((acc, row) => acc + Number(row.paidPastdue), 0)
  const totalRemainingPastdue = rowData2.value.reduce((acc, row) => acc + Number(row.remainingPastdue), 0)

  // 합계 결과를 total 행에 설정
  const totalRow2 = {
    id: 'total',
    scheduleDate: '',
    pastDueTypeCode: '',
    relatedPrincipalPastdue: '',
    pastdueFrdt: '',
    pastdueTodt: '',
    pastdueDays: Number(totalDays),
    pastdueRate: '',
    accruedPastdue: Number(totalAccruedPastdue),
    collectFlag: '',
    pastDueAmt: '',
    paidPastdue: Number(totalPaidPastdue),
    previousPastdue: '',
    remainingPastdue: Number(totalRemainingPastdue)
  }
  // rowData.value 배열을 복사하여 새로운 배열을 생성하고, 그 배열에 totalRow 추가
  rowData2.value = [...rowData2.value, totalRow2]
}
/* =======================================================
  8. Watch
======================================================= */
watch(() => formParam.value.repaymentNo.value, newVal => {
  if ((newVal !== '' || newVal.length === 11) && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  }
})

watch(() => formParam.value.disbursementNo.value, () => {
  radioDisableFlag.value.updateRadio.value = true
  radioDisableFlag.value.deleteRadio.value = true
})

watch(
  () => ({
    modelValues: modelValues.value.currency.value,
    modelValues2: modelValues2.value.currency.value,
    modelValues3: modelValues3.value.currency.value,
    modelValues4: modelValues4.value.currency.value,
    modelValues5: modelValues5.value.currency.value,
    modelValues6: modelValues6.value.currency.value
  }),
  (newVal) => {
    formParam.value.currencyCode.value = newVal.modelValues
    formParam.value.currencyCode.value = newVal.modelValues2
    formParam.value.currencyCode.value = newVal.modelValues3
    formParam.value.currencyCode.value = newVal.modelValues4
    formParam.value.currencyCode.value = newVal.modelValues5
    formParam.value.currencyCode.value = newVal.modelValues6
  }
)

watch(
  () => ({
    modelValues: modelValues.value.money.value,
    modelValues2: modelValues2.value.money.value,
    modelValues3: modelValues3.value.money.value,
    modelValues4: modelValues4.value.money.value,
    modelValues5: modelValues5.value.money.value,
    modelValues6: modelValues6.value.money.value
  }),
  (newVal) => {
    newVal.modelValues = String(newVal.modelValues)
    formParam.value.disbursementAmt.value = Number(newVal.modelValues.replace(/,/g, ''))

    newVal.modelValues2 = String(newVal.modelValues2)
    formParam.value.disburseBalance.value = Number(newVal.modelValues2.replace(/,/g, ''))

    newVal.modelValues3 = String(newVal.modelValues3)
    formParam.value.principleAmt.value = Number(newVal.modelValues3.replace(/,/g, ''))

    newVal.modelValues4 = String(newVal.modelValues4)
    formParam.value.intAmt.value = Number(newVal.modelValues4.replace(/,/g, ''))

    newVal.modelValues5 = String(newVal.modelValues5)
    formParam.value.pastDueAmt.value = Number(newVal.modelValues5.replace(/,/g, ''))

    newVal.modelValues6 = String(newVal.modelValues6)
    formParam.value.totalAmt.value = Number(newVal.modelValues6.replace(/,/g, ''))
  }
)
// Total Repayment Amount 계산
watch(
  () => ({
    principleAmt: formParam.value.principleAmt.value,
    intAmt: formParam.value.intAmt.value,
    pastDueAmt: formParam.value.pastDueAmt.value
  }),
  (newVal) => {
    modelValues6.value.money.value = Number(newVal.principleAmt) + Number(newVal.intAmt) + Number(newVal.pastDueAmt)
  }
)

watch(() => formParam.value.transactionMode.value, (newVal) => {
  gridProps.dataHandler.value = newVal
  gridProps2.dataHandler.value = newVal
  gridProps3.dataHandler.value = newVal
})

watch(
  () => [formParam.value.repaymentDate.value],
  () => {
    const repaymentDate = new Date(formParam.value.repaymentDate.value)
    const transactionDate = new Date(formParam.value.transactionDate.value)

    if (repaymentDate > transactionDate) {
      const _alertInfoTranData = () => {
        formParam.value.repaymentDate.value = oldRepaymentDate
      }
      messageBox.alertInfo(i18n.global.t('Cannot be less than transactionDate.'), _alertInfoTranData)
    } else {
      oldRepaymentDate = formParam.value.repaymentDate.value
    }
  },
  { immediate: true }
)

watch(
  [() => formParam.value.repayProgTpcd.value],
  (newValues) => {
    if (formParam.value.transactionMode.value === 'NEW') {
      if (newValues[0] === '01' || newValues[0] === '02' || newValues[0] === '04' || newValues[0] === '05') {
        formParam.value.repayPrinIntCode.value = '01'
        formParam.value.repayTypeCode.value = '01'
        formParam.value.interestRepayCode.value = '01'
      } else if (newValues[0] === '03') {
        formParam.value.repayPrinIntCode.value = '02'
      }
    }
  },
  { deep: true }
)

watch(
  [() => formParam.value.repayPrinIntCode.value],
  (newValues) => {
    if (newValues[0] === '02') {
      formParam.value.principleAmt.value = 0
      formParam.value.repayTypeCode.value = ''
      prinDisable.value = true
      interestDisable.value = false
    } else if (newValues[0] === '03') {
      formParam.value.interestRepayCode.value = ''
      formParam.value.intCalcFromDate.value = ''
      formParam.value.intCalcToDate.value = ''
      formParam.value.intAmt.value = 0
      prinDisable.value = false
      interestDisable.value = true
    } else {
      prinDisable.value = false
      interestDisable.value = false
    }
  },
  { deep: true }
)

const currencyParam = ref(modelValues.value.currency.value)
watch(() => modelValues.value.currency.value, (newVal) => {
  currencyParam.value = newVal
  gridProps.gridApi.value.redrawRows()
  gridProps2.gridApi.value.redrawRows()
  gridProps3.gridApi.value.redrawRows()
})

watch(() => formParam.value.scheduleYn.value, (newVal) => {
  // ScheduleYn이 'N'인 경우 === Schedule 생성이 되어있지 않은 경우
  if (newVal !== '' && newVal !== 'Y') {
    const _alertErrorSchBefor = () => {
      formParamClear()
      rowDataClear()
      modelValuesClear()
      isRepaymentGeneral.value = false
    }
    messageBox.alertError('Please create the schedule before proceeding.', _alertErrorSchBefor)
  } else {
    isRepaymentGeneral.value = true
  }
})

watch(
  () => ({
    // principal 합계
    principalAmount: rowData.value.reduce((acc, row, index, array) => {
      if (index !== array.length - 1) {
        return acc + Number(row.paidPrincipal)
      } else {
        return acc
      }
    }, 0),
    // interest 합계
    interestAmount: rowData1.value.reduce((acc, row, index, array) => {
      if (index !== array.length - 1) {
        return acc + Number(row.paidInt)
      } else {
        return acc
      }
    }, 0),
    // pastDueAmt 합계
    pastDueAmt: rowData2.value.reduce((acc, row, index, array) => {
      if (index !== array.length - 1) {
        return acc + Number(row.paidPastdue)
      } else {
        return acc
      }
    }, 0)
  }),
  (newVal) => {
    modelValues3.value.money.value = newVal.principalAmount
    modelValues4.value.money.value = newVal.interestAmount
    modelValues5.value.money.value = newVal.pastDueAmt
  }
)

const handleMessage = (event) => {
  formParam.value.transactionMode.value = 'INQUIRY'
  updateTrxnMode()
  const [repaymentNo, disbursementNo] = event.data.initParams.refNo.split('/')
  repaymentSearchParam.value.repaymentNo.value = repaymentNo
  repaymentSearchParam.value.disbursementNo.value = disbursementNo
  formParam.value.disbursementNo.value = disbursementNo
  formParam.value.repaymentNo.value = repaymentNo
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

<style scoped>
.all-full-row {
    grid-column-start: span 4;
}
.flex-grow {
  flex-grow: 1;
}
.custom-gray {
  background-color: #4850b2;
}
.bordered-items > .q-expansion-item {
  border: 1px solid rgb(153, 153, 153);
}
.text-center.full-width {
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
}
.double_input_box {
    display: flex;
    gap: 10px;
    width: 100%;
}

.double_input_box > * {
    flex: 1;
}
</style>
