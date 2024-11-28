<template>
  <top-search-pane
    v-model="searchParam"
    :paneObject="topSearchPaneObject"
    :useSearch="true"
    :searchFunc="search"
    :useClear="true"
    :clearFunc="clearGrid"
    @showSearchPopup="showPopup"
  ></top-search-pane>
  <frmHlpCst v-model="showCstNoSearch" @selected-popup-row-data="getPopupRowDataCstNo"></frmHlpCst>
  <frmHlpCst v-model="showCstNameSearch" @selected-popup-row-data="getPopupRowDataCstName"></frmHlpCst>

  <q-page-container>
    <q-page class="double_table_container">
      <div class="table_container">
        <div class="icon_button_wrapper">
          <div class="rows_box">
              <label>{{ $t('label.view.showRows') }}</label>
              <CommonSelectBox :codeList="commonCodeList.fetchSizeList" v-model="searchParam.fetchSize.value"></CommonSelectBox>
              <input type="hidden" v-model="searchParam.maxValue.value"/>
          </div>
          <div class="align_button_box">
              <label >{{ rowCounts }} {{ $t('label.view.rows') }}</label>
              <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
              <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
          </div>
        </div>
        <div class="table_scroll_box">
          <ag-grid-vue
            class="msg_table ag-theme-balham height73"
            :rowData="customerListRowData"
            :columnDefs="gridProps.columnDefs(commonCodeList)"
            :columnTypes="gridProps.columnTypes"
            :defaultColDef="gridProps.defaultColDef"
            @grid-ready="gridProps.onGridReady"
            rowSelection="single"
            @row-clicked="selectAqcCustomer"
            :getRowStyle="gridProps.getRowStyle"
          ></ag-grid-vue>
        </div>
      </div>
      <div class="table_container_2">
        <div class="table_top_button_wrapper">
          <div class="radio_wrapper">
            <q-radio dense v-model="formParam.transactionMode.value" val="NEW" color="brand" label="New" @update:model-value="updateTrxnMode" :disable="trxnModeDisableFlag.newRadio.value" />
            <q-radio dense v-model="formParam.transactionMode.value" val="INQUIRY" color="brand" label="Inquiry" @update:model-value="updateTrxnMode" :disable="trxnModeDisableFlag.inquiryRadio.value" />
            <q-radio dense v-model="formParam.transactionMode.value" val="UPDATE" color="brand" label="Update" @update:model-value="updateTrxnMode" :disable="trxnModeDisableFlag.updateRadio.value" />
            <q-radio dense v-model="formParam.transactionMode.value" val="DELETE" color="brand" label="Delete" @update:model-value="updateTrxnMode" :disable="trxnModeDisableFlag.deleteRadio.value" />
          </div>
          <div class="button_box right_button_wrapper">
            <q-btn :disable="saveDisableFlag" flat class="btn ok_button" @click="save()"><img src="~/assets/images/btn-btn-ic-check.svg" alt="check button" /><span class="button_text">{{ $t('label.view.ok') }}</span></q-btn>
          </div>
        </div>
        <div class="scrollable-container height71 q-pr-md">
        <section class="box-section">
            <div class="hidden">Customer AQC Information</div>
            <div class="msg_info_form_box_temp">
              <div>
                <label class="form_label is_required">{{ $t('label.view.customer') }}</label>
                <div class="form_customer">
                  <CommonDirectSearchBox class="width37" maxlength="30" v-model="formParam.customerNo.value" :disable="cdDisable" ref="customerNo" hlpType="frmHlpCst" :searchCode="formParam.customerNo.value"></CommonDirectSearchBox>
                  <CommonInputBox class="width61" maxlength="30" v-model="formParam.customerName.value" :disable="cdDisable" ref="customerName"></CommonInputBox>
                  <button type="button" class="help_button_simple" @click="showPopup('cust')">
                    <q-icon name="search" size="sm" />
                  </button>
                  <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data="getCstPopupRowData"></frmHlpCst>
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.baseDate') }}</label>
                <CommonCalendarYMD v-model="formParam.baseDate.value" @update:model-value="formCheck" :disable="cdDisable" :max-date="dayjs(fromDate).format(commonProp.dateformat.dateType)" style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.customerTypeCode') }}</label>
                <CommonSelectBox :codeList="commonCodeList.customerTypeCode" v-model="formParam.customerType.value" :disable="cdDisable" style="text-align-last: center;"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.view.customerDetailType') }}</label>
                <CommonSelectBox :codeList="commonCodeList.customerDetailTypeCode" v-model="formParam.customerDetailType.value" :disable="cdDisable" style="text-align-last: center;"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.view.creditRating') }}</label>
                <CommonSelectBox :codeList="commonCodeList.lonCreditRating" v-model="formParam.creditRate.value" :disable="cdDisable"  style="text-align-last: center;"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.pastdueDate') }}</label>
                <CommonCalendarYMD v-model="formParam.pastdueDate.value" @update:model-value="formCheck" :disable="cdDisable" :max-date="dayjs(fromDate).format(commonProp.dateformat.dateType)" style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.aqcTypeFinal') }}</label>
                <CommonSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcTypeCodeFinal.value" :disable="cdDisable" style="text-align-last: center;"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.aqcValidDate') }}</label>
                <CommonCalendarYMD v-model="formParam.adjustValidityDate.value" @update:model-value="formCheck" :disable="nonTarget"  :max-date="dayjs(fromDate).format(commonProp.dateformat.dateType)" style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.aqcTypeSys') }}</label>
                <CommonCalendarYMD v-model="formParam.aqcTypeDateSys.value" @update:model-value="formCheck" :disable="cdDisable"  :max-date="dayjs(fromDate).format(commonProp.dateformat.dateType)" style="text-align-last: center;"></CommonCalendarYMD>
                <CommonSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcTypeCodeSys.value" :disable="cdDisable" ></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.aqcTypeAdj') }}</label>
                <!--
                  <CommonCalendarYMD v-model="formParam.aqcTypeDateAdj.value" @update:model-value="formCheck" :readonly="optionalFlag.aqcTypeDateAdj.value"  :min-date="dayjs(fromDate).format(commonProp.dateformat.dateType)" style="text-align-last: center;"></CommonCalendarYMD>
                  <CommonSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcTypeCodeAdj.value"  style="text-align-last: center;"></CommonSelectBox>
                  <CommonInputBox v-model="formParam.aqcReasonAdj.value" @update:model-value="formCheck" :readonly="optionalFlag.aqcReasonAdj.value" style="text-align-last: left;"></CommonInputBox>
                -->
                <CommonCalendarYMD v-model="formParam.aqcTypeDateAdj.value" @update:model-value="formCheck" :disable="nonTarget"  :min-date="dayjs(fromDate).format(commonProp.dateformat.dateType)" style="text-align-last: center;"></CommonCalendarYMD>
                <CommonSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcTypeCodeAdj.value" :selectDisabled="nonTarget" :disable="nonTarget" style="text-align-last: center;"></CommonSelectBox>
                <CommonInputBox v-model="formParam.aqcReasonAdj.value" @update:model-value="formCheck" :disable="nonTarget"  style="text-align-last: left;"></CommonInputBox>
              </div>
              <div class="wide">
                <label class="form_label">{{ $t('label.view.remark') }}</label>
                <CommonInputBox v-model="formParam.rmk.value" @update:model-value="formCheck" :disable="nonTarget" style="text-align-last: left;"></CommonInputBox>
              </div>
            </div>
          </section>
          <section class="box-section">
            <div class="subtitle">Credit Evaluation History</div>
            <div class="table_scroll_box">
              <ag-grid-vue
                class="msg_table ag-theme-balham height25"
                :rowData="historyRowData"
                :columnDefs="gridProps2.columnDefs(commonCodeList)"
                :columnTypes="gridProps2.columnTypes"
                :defaultColDef="gridProps2.defaultColDef"
                @grid-ready="gridProps2.onGridReady"
                rowSelection="single"
                @row-clicked="selectHistory"
                :getRowStyle="gridProps2.getRowStyle"
            ></ag-grid-vue>
            </div>
          </section>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script setup>
/*
    304020 - Customer Credit Evaluation

    Index.
    1. Import Area
    2. Global Variable
    3. Common Code Adapter
    4. Grid Props
    5. Grid Function
    6. Freeform Object
    7. Freeform Function
    8. Business Function
    9. popup
    10. TabKey event
    11. Loading Module
*/

/* =======================================================
    1. Import Area
======================================================= */
import { reactive, ref, watch, watchEffect, onMounted } from 'vue'
import { ajaxUtil, frmHlpCst, commonUtil, messageBox, freeformUtil, gridPropsUtil, commonProp } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'
import { i18n } from 'boot/i18n'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/aqc/cst/lonAqcCstGridProps.vue'
import { gridProps2 } from 'src/pages/lon/com/cst/lonComCstHistoryGridProps.vue'

/* =======================================================
    2. Global Variable
======================================================= */
const session = useSessionStore()
const fromDate = session.sysCurrentBusinessDate
const customerListRowData = ref([])
const historyRowData = ref([])
const rowCounts = ref(0)
const showCstNoSearch = ref(false)
const showCstNameSearch = ref(false)
const showCustomerSearch = ref(false)
const selectedPopupRowData = ref([])

const topSearchPaneObject = ref([
  {
    type: 'label',
    label: i18n.global.t('label.view.asOf')
  },
  {
    type: 'calendarYmd',
    model: 'asOfDate'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.searchCriteria')
  },
  {
    type: 'dropdown',
    model: 'searchCriteria',
    dropdownList: []
  },
  {
    type: 'popup',
    model: 'searchKeyword'
  }
])
/* =======================================================
    3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  searchCriteriaList: ref([]),
  fetchSizeList: ref([]),
  customerTypeCode: ref([]),
  customerDetailTypeCode: ref([]),
  lonCreditRating: ref([]),
  lonAqcTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})
ajaxUtil.getCodeList('SHOWROWS, CUSTOMER_TYPE_CODE, CUSTOMER_DETAIL_TYPE_CODE, LON_CREDIT_RATING, LON_AQC_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.fetchSizeList = codeData.showrows
    commonCodeList.customerTypeCode = codeData.customerTypeCode
    commonCodeList.customerDetailTypeCode = codeData.customerDetailTypeCode
    commonCodeList.lonCreditRating = codeData.lonCreditRating
    commonCodeList.lonAqcTypeCode = codeData.lonAqcTypeCode
  })

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

/* =======================================================
    4. Grid Props
======================================================= */
const searchCriteria = [
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') }
]
commonCodeList.searchCriteriaList = searchCriteria

/* =======================================================
    5. Grid Function
======================================================= */
const showPopup = (param) => {
  switch (param) {
    case 'searchKeyword' :
      if (searchParam.value.searchCriteria.value === 'CUSTOMER_NO') {
        showCstNoSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'CUSTOMER_NAME') {
        showCstNameSearch.value = true
      }
      break
    case 'cust' :
      showCustomerSearch.value = true
      break
  }
}

const search = () => {
  searchParam.value.maxValue.value = '0'
  const newSearchParam = commonUtil.inputValueToJson('bsLonAqcSchService', 'LONAQCMNG0032', searchParam, customerListRowData, rowCounts)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data === null) {
        customerListRowData.value = []
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'))
      } else {
        customerListRowData.value = data
        rowCounts.value = data.length
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonAqcSchService', 'LONAQCMNG0032', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonAqcSchService', 'LONAQCMNG0032', searchParam, rowCounts)
}

const getPopupRowDataCstNo = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerNo
  search()
}

const getPopupRowDataCstName = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerName
  search()
}

const searchParam = ref({
  searchCriteria: {
    value: searchCriteria[0].code,
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  searchKeyword: {
    value: ''
  },
  asOfDate: {
    value: '2023-11-07',
    required: true
  },
  fetchSize: {
    value: 100,
    initValue: 100,
    required: false
  },
  maxValue: {
    value: '0',
    initValue: '0',
    required: false,
    description: ''
  }
})

const clearGrid = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowCounts.value = 0
  customerListRowData.value = []
}

watch(() => searchParam.value.searchCriteria.value, () => {
  searchParam.value.searchKeyword.value = ''
})

watchEffect(() => {
  // obj.model에 검색창 생성객체 내 해당 dropdown의 model명 입력
  // prop.dropdownList = '해당 model에 들어가야할 codeList 입력'
  if (commonCodeList.searchCriteriaList.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'searchCriteria').forEach(prop => { prop.dropdownList = commonCodeList.searchCriteriaList })
  }
})

onMounted(() => {
  saveDisableFlag.value = true
})

/* =======================================================
    6. Freeform Object
======================================================= */
// Freeform Disable 기능을 위한 객체 선언
const nonTarget = ref(false)
const excludeTarget = ref(true)
const disableFlagObj = reactive({
  nonTarget, excludeTarget
})
const cdDisable = ref(true)
// const fixedFlag = ref(false)
// const optionalFlag = ref(false)
// const variableFlag = ref(true)
// const creditFlag = ref(false)

const formParam = ref({
  transactionMode: {
    value: 'INQUIRY',
    required: true
  },
  baseDate: {
    value: '',
    required: true,
    type: 'leftAligned',
    description: i18n.global.t('label.objt.baseDate')
  },
  customerNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerName: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerType: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.customerTypeCode')
  },
  customerDetailType: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.customerDetailType')
  },
  customerTypeCode: {
    value: '',
    required: false
  },
  customerDetailTypeCode: {
    value: '',
    required: false
  },
  creditRate: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.creditRating')
  },
  pastdueDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.pastdueDate')
  },
  aqcTypeCodeFinal: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.aqcTypeFinal')
  },
  adjustValidityDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.aqcValidDate')
  },
  aqcTypeDateSys: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.aqcTypeSysDate')
  },
  aqcTypeCodeSys: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.aqcTypeSys')
  },
  aqcTypeDateAdj: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.aqcTypeAdjDate')
  },
  aqcTypeCodeAdj: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.aqcTypeAdj')
  },
  aqcReasonAdj: {
    value: '',
    required: true
  },
  rmk: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.remark')
  },
  serialNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.serialNo')
  },
  sysOrganizationCode: {
    value: session.sysOrganizationCode,
    required: false
  },
  sysDateTime: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateType),
    required: false
  },
  sysUserId: {
    value: session.sysUserId,
    required: false
  },
  manageBrcd: {
    value: session.sysBranchCode,
    required: false
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    required: false
  }
})
const resultParam = ref({
  creditRate: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.creditRating')
  },
  evaluationDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.evaluationDate')
  },
  expireDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.expireDate')
  },
  rmk: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.remark')
  }
})
const trxnModeDisableFlag = ref({
  newRadio: {
    value: true,
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
const saveDisableFlag = ref({
  value: true,
  type: Boolean
})
const trxnTypeDisableFlag = ref({
  normalRadio: {
    value: true,
    type: Boolean
  },
  releaseRadio: {
    value: true,
    type: Boolean
  }
})
const optionalFlag = ref({
  baseDate: {
    value: true,
    type: Boolean
  },
  creditRate: {
    value: true,
    type: Boolean
  },
  pastdueDate: {
    value: true,
    type: Boolean
  },
  adjustValidityDate: {
    value: true,
    type: Boolean
  },
  aqcTypeDateSys: {
    value: true,
    type: Boolean
  },
  aqcTypeCodeSys: {
    value: true,
    type: Boolean
  },
  aqcTypeDateAdj: {
    value: true,
    type: Boolean
  },
  aqcTypeCodeAdj: {
    value: true,
    type: Boolean
  },
  aqcReasonAdj: {
    value: true,
    type: Boolean
  },
  rmk: {
    value: true,
    type: Boolean
  }
})

/* =======================================================
    7. Freeform Function
======================================================= */
// AQC Customer Detail Info Select
const searchAqcCustomerInfo = () => {
//  console.log('searchCustomerInfo')
  const newSearchParam = commonUtil.inputValueToJson('bsLonAqcSchService', 'LONAQCMNG0042', formParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      // console.log(data)
      if (data === null) {
        // messageBox.alertInfo(i18n.global.t('msg.nodata.found'))
      } else {
        clearForm()
        formParam.value.customerNo.value = data.customerNo
        formParam.value.customerName.value = data.customerName
        formParam.value.baseDate.value = data.baseDate
        formParam.value.customerType.value = data.customerTypeCode
        formParam.value.customerDetailType.value = data.customerDetailTypeCode
        formParam.value.creditRate.value = data.creditRate
        formParam.value.pastdueDate.value = data.pastdueDate
        formParam.value.aqcTypeCodeFinal.value = data.aqcTypeCodeFinal
        formParam.value.adjustValidityDate.value = data.adjustValidityDate
        formParam.value.aqcTypeCodeSys.value = data.aqcTypeCodeSys
        formParam.value.aqcTypeDateSys.value = data.aqcTypeDateSys
        formParam.value.aqcTypeCodeAdj.value = data.aqcTypeCodeAdj
        formParam.value.aqcTypeDateAdj.value = data.aqcTypeDateAdj
        formParam.value.aqcReasonAdj.value = data.aqcReasonAdj
        formParam.value.rmk.value = data.rmk
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

const searchCustomerInfo = () => {
  const newSearchParam = commonUtil.inputValueToJson('bsLonComCstService', 'LONCOMCST012', formParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      // console.log(data)
      if (data === null) {
        // messageBox.alertInfo(i18n.global.t('msg.nodata.found'))
      } else {
        formParam.value.customerNo.value = data.customerNo
        formParam.value.customerName.value = data.customerName
        formParam.value.customerType.value = data.customerTypeCode
        formParam.value.customerDetailType.value = data.customerDetailTypeCode
        formParam.value.customerTypeCode.value = data.customerTypeCode
        formParam.value.customerDetailTypeCode.value = data.customerDetailTypeCode
        trxnModeDisableFlag.value.updateRadio.value = false
        trxnModeDisableFlag.value.deleteRadio.value = false
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}
const searchCreditEvaluationHistory = () => {
  const newSearchParam = commonUtil.inputValueToJson('bsLonComCstService', 'LONCOMCST032', formParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      clearHistory()
      /*
      if (data === null) {
        clearHistory()
      } else {
        clearHistory()
        if (formParam.value.transactionMode.value === 'NEW') {
          historyRowData.value = data
          formParam.value.creditRate.value = ''
          formParam.value.rmk.value = ''
          if (data[0].transactionType === 'Normal') {
            formParam.value.serialNo.value = data[0].serialNo
            formParam.value.pastRmk.value = data[0].rmk
          } else if (data[0].transactionType === 'Released') {
            formParam.value.serialNo.value = ''
          }
        } else {
          historyRowData.value = data
          formParam.value.creditRate.value = data[0].creditRate
          formParam.value.rmk.value = data[0].rmk
          resultParam.value.creditRate.value = data[0].creditRate
          resultParam.value.rmk.value = data[0].rmk
          if (data[0].transactionType === 'Normal') {
            formParam.value.transactionType.value = 'NORMAL'
            trxnModeDisableFlag.value.updateRadio.value = false
            trxnModeDisableFlag.value.deleteRadio.value = false
        }
      }
      */
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}
// Loan AQC Customer Click Event 2024-11-26
const selectAqcCustomer = (event) => {
  clearForm()
  formParam.value.transactionMode.value = 'INQUIRY'
  formParam.value.customerNo.value = event.data.customerNo
  // formParam.value.baseDate.value = searchParam.value.asOfDate.value
  formParam.value.baseDate.value = event.data.baseDate
  searchAqcCustomerInfo()
  trxnModeDisableFlag.value.updateRadio.value = false
  freeformUtil.disableControl(true, disableFlagObj)
  searchCreditEvaluationHistory()
}
const getCstPopupRowData = (event) => {
  clearForm()
  selectedPopupRowData.value = event[0]
  formParam.value.baseDate.value = searchParam.value.asOfDate.value
  formParam.value.customerNo.value = selectedPopupRowData.value.customerNo
  searchAqcCustomerInfo()
  // searchCustomerInfo()
  // searchCustomerDetail()
  searchCreditEvaluationHistory()
  if (formParam.value.transactionMode.value === 'NEW') {
    setNormalOptionalFlag()
    formParam.value.evaluationDate.value = formParam.value.businessDate.value
  } else {
    formParam.value.transactionMode.value = 'INQUIRY'
    setDefaultOptionalFlag()
  }
}
const updateTrxnMode = () => {
  const transactionMode = formParam.value.transactionMode.value
  switch (transactionMode) {
    case 'NEW':
      clearForm()
      break
    case 'INQUIRY':
      clearForm()
      // formRestore()
      freeformUtil.disableControl(true, disableFlagObj)
      break
    case 'UPDATE':
      formRestore()
      saveDisableFlag.value = true
      alert('여기')
      freeformUtil.disableControl(false, disableFlagObj)
      // setNormalOptionalFlag()
      break
    case 'DELETE':
      break
  }
}
/* 2024-11-27
const updateTrxnMode = () => {
  const transactionMode = formParam.value.transactionMode.value
  if (transactionMode === 'NEW') {
    clearForm()
    clearHistory()
    resultParam.value.creditRate.value = ''
    resultParam.value.evaluationDate.value = ''
    resultParam.value.expireDate.value = ''
    resultParam.value.rmk.value = ''
    // console.log('serialNo: ' + formParam.value.serialNo.value)
  } else if (transactionMode === 'INQUIRY') {
    if (resultParam.value.creditRate.value === '') {
      clearForm()
    }
    formRestore()
    formParam.value.rmk.value = resultParam.value.rmk.value
    saveDisableFlag.value = true
    trxnTypeDisableFlag.value.normalRadio.value = true
    trxnTypeDisableFlag.value.releaseRadio.value = true
    setDefaultOptionalFlag()
  } else if (transactionMode === 'UPDATE') {
    formRestore()
    saveDisableFlag.value = true
    trxnTypeDisableFlag.value.normalRadio.value = false
    trxnTypeDisableFlag.value.releaseRadio.value = false
    setNormalOptionalFlag()
  } else if (transactionMode === 'DELETE') {
    formRestore()
    formParam.value.rmk.value = resultParam.value.rmk.value
    saveDisableFlag.value = false
    trxnTypeDisableFlag.value.normalRadio.value = true
    trxnTypeDisableFlag.value.releaseRadio.value = true
    setDefaultOptionalFlag()
  }
}
*/
const setDefaultOptionalFlag = () => {
  optionalFlag.value.creditRate.value = true
}
const setNormalOptionalFlag = () => {
//  optionalFlag.value.creditRate.value = false
  optionalFlag.value.aqcTypeCodeAdj.value = false
  optionalFlag.value.aqcTypeDateAdj.value = false
  optionalFlag.value.aqcReasonAdj.value = false
}
const formCheck = () => {
  // Invalidd Date 일괄 빈 값으로 처리
  if (formParam.value.evaluationDate.value === 'Invalid Date') {
    formParam.value.evaluationDate.value = ''
  }
  if (formParam.value.releaseDate.value === 'Invalid Date') {
    formParam.value.releaseDate.value = ''
  }
  if (formParam.value.expireDate.value === 'Invalid Date') {
    formParam.value.expireDate.value = ''
  }
  if (resultParam.value.rmk.value === null) {
    resultParam.value.rmk.value = ''
  }
  // 셋 중 하나라도 빈 값이면 Save 비활성화
  if (formParam.value.creditRate.value === '' ||
      formParam.value.evaluationDate.value === '' ||
      formParam.value.expireDate.value === ''
  ) {
    saveDisableFlag.value = true
  } else {
    // 기존 값과 같으면 Save 비활성화
    if (formParam.value.creditRate.value === resultParam.value.creditRate.value &&
        formParam.value.evaluationDate.value === resultParam.value.evaluationDate.value &&
        formParam.value.expireDate.value === resultParam.value.expireDate.value &&
        formParam.value.rmk.value === resultParam.value.rmk.value
    ) {
      saveDisableFlag.value = true
    } else {
      // 값이 변경됐을 때 Save 활성화
      saveDisableFlag.value = false
    }
    // release일 때
    if (formParam.value.transactionType.value === 'RELEASE' && formParam.value.releaseDate.value === '') {
      saveDisableFlag.value = true
    } else if (formParam.value.transactionType.value === 'RELEASE' && formParam.value.releaseDate.value !== '') {
      saveDisableFlag.value = false
    }
  }
  // console.log('formCheck')
  // console.log(formParam.value.rmk.value)
  // console.log(resultParam.value.rmk.value)
}
const formRestore = () => {
  formParam.value.creditRate.value = resultParam.value.creditRate.value
}
const selectHistory = (event) => {
  if (formParam.value.transactionMode.value !== 'NEW') {
    // console.log(event.data)
    formParam.value.creditRate.value = event.data.creditRate
    formParam.value.evaluationDate.value = event.data.evaluationDate
    formParam.value.releaseDate.value = event.data.releaseDate
    formParam.value.expireDate.value = event.data.expireDate
    formParam.value.rmk.value = event.data.rmk
    formParam.value.serialNo.value = event.data.serialNo
    resultParam.value.creditRate.value = event.data.creditRate
    resultParam.value.evaluationDate.value = event.data.evaluationDate
    resultParam.value.expireDate.value = event.data.expireDate
    if (event.data.transactionType === 'Normal') {
      formParam.value.transactionType.value = 'NORMAL'
      trxnModeDisableFlag.value.updateRadio.value = false
      trxnModeDisableFlag.value.deleteRadio.value = false
    } else if (event.data.transactionType === 'Released') {
      formParam.value.transactionType.value = 'RELEASE'
      trxnModeDisableFlag.value.updateRadio.value = true
      trxnModeDisableFlag.value.deleteRadio.value = true
    }
  }
}
const save = () => {
  // console.log(formParam)
  const transactionMode = formParam.value.transactionMode.value
  if (transactionMode === 'NEW') {
    // 기존 정보는 release 처리, 신규 정보 등록
    if (formParam.value.serialNo.value !== '') {
      formParam.value.transactionType.value = 'RELEASE'
      formParam.value.releaseDate.value = dayjs(fromDate).format(commonProp.dateformat.dateType)
    }
    messageBox.confirm(i18n.global.t('msg.info.save')).onOk(() => {
      // console.log(formParam)
      const saveParam = commonUtil.inputValueToJson('bsLonComCstService', 'LONCOMCST009', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          messageBox.alertAjaxSuccess(response).onOk(() => {
            searchCustomerInfo()
            searchCreditEvaluationHistory()
            search()
            formParam.value.transactionMode.value = 'INQUIRY'
            setDefaultOptionalFlag()
            trxnTypeDisableFlag.value.normalRadio.value = true
            trxnTypeDisableFlag.value.releaseRadio.value = true
          })
        })
        .catch((error) => {
          messageBox.alertAjaxError(error).onOk(() => {
          })
        })
    })
  } else if (transactionMode === 'UPDATE') {
    messageBox.confirm(i18n.global.t('msg.info.save')).onOk(() => {
      const saveParam = commonUtil.inputValueToJson('bsLonComCstService', 'LONCOMCST003', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          messageBox.alertAjaxSuccess(response).onOk(() => {
            searchCustomerInfo()
            searchCreditEvaluationHistory()
            search()
            formParam.value.transactionMode.value = 'INQUIRY'
            setDefaultOptionalFlag()
            trxnTypeDisableFlag.value.normalRadio.value = true
            trxnTypeDisableFlag.value.releaseRadio.value = true
          })
        })
        .catch((error) => {
          messageBox.alertAjaxError(error).onOk(() => {
          })
        })
    })
  } else if (transactionMode === 'DELETE') {
    messageBox.confirm(i18n.global.t('msg.info.delete')).onOk(() => {
      const saveParam = commonUtil.inputValueToJson('bsLonComCstService', 'LONCOMCST004', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          messageBox.alertAjaxSuccess(response).onOk(() => {
            searchCustomerInfo()
            searchCreditEvaluationHistory()
            search()
            formParam.value.transactionMode.value = 'INQUIRY'
            setDefaultOptionalFlag()
            trxnTypeDisableFlag.value.normalRadio.value = true
            trxnTypeDisableFlag.value.releaseRadio.value = true
          })
        })
        .catch((error) => {
          messageBox.alertAjaxError(error).onOk(() => {
          })
        })
    })
  }
}
/*
const clearForm = () => {
  saveDisableFlag.value = true
  trxnModeDisableFlag.value.updateRadio.value = true
  trxnModeDisableFlag.value.deleteRadio.value = true
  trxnTypeDisableFlag.value.normalRadio.value = true
  trxnTypeDisableFlag.value.releaseRadio.value = true
  optionalFlag.value.creditRate.value = true
  optionalFlag.value.evaluationDate.value = true
  optionalFlag.value.releaseDate.value = true
  optionalFlag.value.expireDate.value = true
  optionalFlag.value.rmk.value = true

  formParam.value.customerNo.value = ''
  formParam.value.customerName.value = ''
  formParam.value.transactionType.value = 'NORMAL'
  formParam.value.customerType.value = ''
  formParam.value.customerTypeCode.value = ''
  formParam.value.customerDetailType.value = ''
  formParam.value.customerDetailTypeCode.value = ''
  formParam.value.creditRate.value = ''
  formParam.value.evaluationDate.value = ''
  formParam.value.releaseDate.value = ''
  formParam.value.expireDate.value = ''
  formParam.value.serialNo.value = ''
  formParam.value.rmk.value = ''
}
*/
const clearForm = () => {
  saveDisableFlag.value = true
  optionalFlag.value.creditRate.value = true
  optionalFlag.value.rmk.value = true
  formParam.value.customerNo.value = ''
  formParam.value.customerName.value = ''
  formParam.value.baseDate.value = ''
  formParam.value.customerType.value = ''
  formParam.value.customerTypeCode.value = ''
  formParam.value.customerDetailType.value = ''
  formParam.value.customerDetailTypeCode.value = ''
  formParam.value.creditRate.value = ''
  formParam.value.pastdueDate.value = ''
  formParam.value.aqcTypeCodeFinal.value = ''
  formParam.value.aqcTypeCodeSys.value = ''
  formParam.value.aqcTypeCodeAdj.value = ''
  formParam.value.aqcTypeCodeAdj.value = ''
  formParam.value.rmk.value = ''
}
const clearHistory = () => {
  historyRowData.value = []
}
</script>
<style scoped>
/* .box-section+.box-section {
  margin-top: 34px;
} */
.double_table_container {
  margin: 0 30px;
}
.form_customer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}
.form_customer > .help_button_simple {
  position: absolute;
  right: 8px;
}
.subtitle {
  margin-bottom: 7px;
  color: #333;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}
.radio_wrapper.box {
  display: flex;
  gap: 20px;
  padding: 8.5px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}
.radio_wrapper.box > .q-radio {
  flex: 1;
}
.wide {
  display: grid;
  grid-column-start: 1;
  grid-column-end: 3;
}

.msg_info_form_box_temp {
  display: grid;
  gap: 20px 30px;
  grid-template-columns: 1fr 1fr;
  padding: 24px 0 0;
  overflow: auto;
}
</style>
