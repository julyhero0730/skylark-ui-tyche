<template>
    <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.lonHlpCon') }}</div>
                <q-space />
                <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="modal_form table_search_modal">
                    <div class="search_condition_wrapper">
                        <div class="domain_search_wrapper">
                          <div>
                          <label class="form_label" style="margin-bottom: 0px;">{{ $t('label.view.branch') }}</label>
                          <div style=" display: flex;">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.branchName.value" hlpType="frmHlpBrc" :searchCode="searchParam.branchCode.value" style="text-align-last: left;" ></commonDirectSearchBox>
                            <q-icon name="search" size="sm" style="margin:5px 20px 0px -30px;" class="help_button_simple" @click="showBrcSearchPopup()" />
                            <frmHlpBrc v-model="showBrcSearch" @selected-popup-row-data="getBrcPopupRowData"></frmHlpBrc>
                          </div>
                        </div>
                        <div style="margin-right: 10px;">
                          <label class="form_label" style="margin-bottom: 0px;">{{ $t('label.view.manager') }}</label>
                          <div style=" display: flex;">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.employeeName.value" hlpType="frmHlpEmp" :searchCode="searchParam.employeeNo.value" style="text-align-last: left;"></commonDirectSearchBox>
                            <q-icon name="search" size="sm" style="margin:5px 20px 0 -30px;" class="help_button_simple" @click="showEmpSearchPopup()"/>
                            <frmHlpEmp v-model="showEmpSearch" @selected-popup-row-data = "getEmpPopupRowData"></frmHlpEmp>
                          </div>
                        </div>
                            <div>
                                <label class="form_label" style="margin-bottom: 0px;">{{ $t('label.view.searchCriteria') }}</label>
                                <CommonSelectBox style="width:300px;" :codeList="commonCodeList.searchTypeList" v-model="searchParam.searchType.value" :disable="false"></CommonSelectBox>
                            </div>
                            <div>
                              <label class="form_label" style="margin-bottom: 0px;">{{ $t('label.view.searchItem') }}</label>
                              <div style=" display: flex; align-items: center; gap:1px;">
                                  <CommonInputBox maxlength="30" v-model="searchParam.searchKeyword.value" :disable=false style="text-align-last: center;" @keyup.enter="enterEvent()"></CommonInputBox>
                                  <q-icon name="search" size="sm" style="margin:0 20px 0 -30px;" class="help_button_simple" @click="showSearchPopup"/>
                                  <frmHlpCst v-model="showCstNoSearch" @selected-popup-row-data="getPopupRowDataCstNo"></frmHlpCst>
                                  <frmHlpCst v-model="showCstNameSearch" @selected-popup-row-data="getPopupRowDataCstName"></frmHlpCst>
                              </div>
                            </div>
                        </div>
                        <div class="button_box right_button_wrapper custom_search_button">
                            <CommonSearchButton  :clearFunc="clear" :searchFunc="search"></CommonSearchButton>
                        </div>
                    </div>
                    <div class="table_rows_wrapper">
                      <div class="rows_box">
                            <label class="searchLabel">{{ $t('label.view.showRows') }}</label>
                            <div class="select_dropdown rows_dropdown">
                                <CommonSelectBox :codeList="fetchSizeList" v-model="searchParam.fetchSize.value" ></CommonSelectBox>
                                <input type="hidden" v-model="searchParam.maxValue.value"/>
                            </div>
                            <div class="align_button_box">
                                <span class="searchLabel">{{ rowCounts }}</span>
                                <span class="searchLabel">{{ $t('label.view.rows') }}</span>
                                <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
                                <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
                            </div>
                        </div>
                    </div>
                            <div class="table_scroll_box">
                                <ag-grid-vue
                                    class="msg_table ag-theme-balham height50"
                                    :columnDefs="columnDefs"
                                    :columnTypes="columnTypes"
                                    :rowData="rowData"
                                    :defaultColDef="defaultColDef"
                                    :stopEditingWhenCellsLoseFocus="false"
                                    rowSelection="single"
                                    @grid-ready="onGridReady"
                                    @rowDoubleClicked="onRowDoubleClicked"
                                ></ag-grid-vue>
                            </div>
                </div>
            </q-card-section>
            <q-card-actions align="right">
              <div class="button_box form_button_box popup_bottom_button_wrapper">
                <q-btn flat class="btn bg_deep close_button" v-close-popup :label="$t('label.view.exit')"></q-btn>
              </div>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ajaxUtil, commonUtil, gridPropsUtil, commonProp, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dayjs from 'dayjs'
import { useSessionStore } from 'stores/session'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const session = useSessionStore()
const showBrcSearch = ref(false)
const showEmpSearch = ref(false)

const clear = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  searchParam.value.branchCode.value = ''
  searchParam.value.branchName.value = ''
  searchParam.value.employeeName.value = ''
  searchParam.value.employeeNo.value = ''
  rowData.value = []
}

const commonCodeList = reactive({
  countryTypeCode: ref([]),
  branchTypeCode: ref([]),
  employeeTypeCode: ref([]),
  brcCurrencyCodeList: ref([]),
  applicationTpcd: ref([])

})

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
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
      searchParam.value.branchName.value = matchingValue
      searchParam.value.branchCode.value = session.sysBranchCode
      commonCodeList.branchTypeCode = codeData
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

// ajaxUtil.getEmployeeNoList()
//   .then(function (codeData) {
//     if (codeData && Array.isArray(codeData)) {
//       const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
//       const matchingValue = matchingCode.codeValue
//       searchParam.value.employeeName.value = matchingValue
//       searchParam.value.employeeNo.value = session.sysEmployeeNo
//       commonCodeList.employeeTypeCode = codeData
//     }
//   })
//   .catch(function (error) {
//     console.error('Error:', error)
//   })

const props = defineProps({
  customerNo: {
    type: String
  },
  customerName: {
    type: String
  },
  cdDisable: {
    type: Boolean
  },
  prgsStatusCode: {
    type: String
  },
  modelValue: { type: Boolean, required: true }
})

const model = computed({
  /**
   *
   */
  get () {
    if (props.modelValue) {
      showDialog()
    }
    return props.modelValue
  },
  /**
   *
   */
  set (newValue) {
    emit('update:modelValue', newValue)
  }
})

const emit = defineEmits(['update:modelValue', 'selectedPopupRowData'])

const dialogPos = {
  x: 0,
  y: 0
}

const rowCounts = ref(0)
const rowData = ref([])
const fetchSizeList = ref([])

const searchType = [
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'CONTRACT_NO', codeValue: i18n.global.t('label.objt.contractNo') }
]
commonCodeList.searchTypeList = searchType

const searchParam = ref({
  searchType: {
    value: searchType[0].code,
    required: false,
    description: i18n.global.t('label.view.searchType')
  },
  searchKeyword: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchKeyword')
  },
  branchCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.branchCode')
  },
  branchName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.branchName')
  },
  employeeNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.employeeNo')
  },
  employeeName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.employeeName')
  },
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false
  },
  helpSearchType: {
    value: 'lonHlpCon',
    required: false
  },
  prgsStatusCode: { // 계약 변경 신청 화면에서 넘어올때 사용(prgsStatusCode = '500' 조건필요)
    value: props.prgsStatusCode
  }
})

/* =======================================================
      6. Freeform Object
  ======================================================= */
const showCstNameSearch = ref(false)
const showCstNoSearch = ref(false)
const selectedPopupRowData = ref([])
/* =======================================================
      7. Freeform Funtion
  ======================================================= */
const enterEvent = () => {
  search()
}
const getPopupRowDataCstName = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerName
  search()
}

const getPopupRowDataCstNo = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerNo
  search()
}

const showSearchPopup = () => {
  if (searchParam.value.searchType.value === 'CUSTOMER_NO') {
    showCstNoSearch.value = true
  } else if (searchParam.value.searchType.value === 'CUSTOMER_NAME') {
    showCstNameSearch.value = true
  }
}

const getBrcPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.branchCode.value = selectedPopupRowData.value.branchCode
  searchParam.value.branchName.value = selectedPopupRowData.value.branchName
}

const getEmpPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.employeeNo.value = selectedPopupRowData.value.employeeNo
  searchParam.value.employeeName.value = selectedPopupRowData.value.employeeName
}

const showBrcSearchPopup = () => {
  showBrcSearch.value = true
}

const showEmpSearchPopup = () => {
  showEmpSearch.value = true
}
const gridApi = ref(null)
const gridColumnApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const columnDefs = [
  {
    headerName: '#',
    width: 45,
    colId: 0,
    valueGetter: (params) => { return params.node.rowIndex + 1 },
    type: 'centerAligned',
    pinned: 'left',
    headerComponent: CommonHeaderMark
  },
  {
    field: 'contractNo',
    headerName: i18n.global.t('label.objt.contractNo'),
    width: 120,
    editable: false,
    type: 'centerAligned',
    pinned: 'left',
    headerComponent: CommonHeaderMark
  },
  {
    field: 'customerInfo',
    headerName: i18n.global.t('label.view.customer'),
    width: 190,
    // type: 'centerAligned',
    editable: false,
    pinned: 'left',
    valueGetter: params => `[${params.data.customerNo}] ${params.data.customerName}`,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'productName',
    headerName: i18n.global.t('label.objt.productName'),
    width: 250,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'applicationTpcd',
    headerName: i18n.global.t('label.objt.applicationTpcd'),
    width: 150,
    type: 'centerAligned',
    editable: false,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.applicationTpcd, params.value)
    }
  },
  {
    field: 'creditLineTpnm',
    headerName: i18n.global.t('label.objt.loanMethod'),
    width: 110,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'currencyCode',
    headerName: i18n.global.t('label.view.ccy'),
    width: 50,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.countryTypeCode, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'contractAmount',
    headerName: i18n.global.t('label.view.contractAmt'),
    type: 'rightAligned',
    width: 120,
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, params.data.currencyCode, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(params.data.currencyCode, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'contractBal',
    headerName: i18n.global.t('label.objt.contractBal'),
    type: 'rightAligned',
    width: 120,
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, params.data.currencyCode, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(params.data.currencyCode, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'contractDate',
    headerName: i18n.global.t('label.objt.contractDate'),
    width: 120,
    type: 'centerAligned',
    cellRenderer: (params) => {
      return dayjs(params.value).format(commonProp.dateformat.dateType)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'maturityDate',
    headerName: i18n.global.t('label.objt.maturityDate'),
    width: 120,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'manageBrcd',
    headerName: i18n.global.t('label.objt.managementBranch'),
    type: 'centerAligned',
    width: 150,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.branchTypeCode, params.value)
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'manageEmployeeNo',
    headerName: i18n.global.t('label.objt.managementEmployee'),
    width: 150,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.employeeTypeCode, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'organizationCode',
    hide: true
  },
  {
    field: 'serialNo',
    hide: true
  },
  {
    field: 'statusCd',
    hide: true
  },
  {
    field: 'createDatetime',
    hide: true
  },
  {
    field: 'createUserId',
    hide: true
  },
  {
    field: 'deleteDatetime',
    hide: true
  },
  {
    field: 'deleteUserId',
    hide: true
  },
  {
    field: 'updateDatetime',
    hide: true
  },
  {
    field: 'updateUserId',
    hide: true
  },
  {
    field: 'productCode',
    hide: true
  },
  {
    field: 'fundPurposeCode',
    hide: true
  },
  {
    field: 'creditLineTpcd',
    hide: true
  },
  {
    field: 'intRateTpcd',
    hide: true
  },
  {
    field: 'baseRateCode',
    hide: true
  },
  {
    field: 'baseRateApplydt',
    hide: true
  },
  {
    field: 'spreadRate',
    hide: true
  },
  {
    field: 'interestRate',
    hide: true
  },
  {
    field: 'pastdueSpread',
    hide: true
  },
  {
    field: 'loanPrdTpcd',
    hide: true
  },
  {
    field: 'loanTermYear',
    hide: true
  },
  {
    field: 'loanTermMonth',
    hide: true
  },
  {
    field: 'maturityDate',
    hide: true
  },
  {
    field: 'repayProgTpcd',
    hide: true
  },
  {
    field: 'gracePrdYear',
    hide: true
  },
  {
    field: 'gracePrdMonth',
    hide: true
  },
  {
    field: 'amrtPrdMm',
    hide: true
  },
  {
    field: 'repaySourceCode',
    hide: true
  },
  {
    field: 'registBrcd',
    hide: true
  },
  {
    field: 'registEmployeeNo',
    hide: true
  },
  {
    field: 'registDate',
    hide: true
  },
  {
    field: 'manageBrcd',
    hide: true
  },
  {
    field: 'manageEmployeeNo',
    hide: true
  },
  {
    field: 'manageDate',
    hide: true
  }
]

const defaultColDef = {
  resizable: true,
  initialWidth: 200
}

const columnTypes = {
  centerAligned: {
    cellClass: 'centered'
  }
}

ajaxUtil.getCodeList('SHOWROWS, LON_APPLICATION_TYPE_CODE')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showrows
    commonCodeList.applicationTpcd = codeData.lonApplicationTypeCode
  })

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  emit('selectedPopupRowData', selectedRows)
  model.value = false
}

watch(() => searchParam.value.searchType.value, () => {
  searchParam.value.searchKeyword.value = ''
})

watch(() => searchParam.value.searchKeyword.value, (newVal) => {
  if (searchParam.value.searchType.value === 'CONTRACT_NO' && newVal.length === 12) {
    search()
  }
})

watch(() => searchParam.value.employeeName.value, (newVal) => {
  if (commonUtil.isEmpty(newVal)) {
    searchParam.value.employeeNo.value = ''
  }
})
watch(() => searchParam.value.branchName.value, (newVal) => {
  if (commonUtil.isEmpty(newVal)) {
    searchParam.value.branchCode.value = ''
  }
})

const showDialog = () => {
  setSessionData()
  searchParam.value.searchKeyword.value = ''
  search()
  model.value = true
}

const setSessionData = () => {
  searchParam.value.branchCode.value = session.sysBranchCode
  searchParam.value.employeeNo.value = session.sysEmployeeNo
  ajaxUtil.getBranchCodeList()
    .then(function (codeData) {
      if (codeData && Array.isArray(codeData)) {
        const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
        const matchingValue = matchingCode.codeValue
        searchParam.value.branchName.value = matchingValue
        commonCodeList.branchTypeCode = codeData
      }
    })
  ajaxUtil.getEmployeeNoList()
    .then(function (codeData) {
      if (codeData && Array.isArray(codeData)) {
        const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
        const matchingValue = matchingCode.codeValue
        searchParam.value.employeeName.value = matchingValue
        commonCodeList.employeeTypeCode = codeData
      }
    })
}

const search = () => {
  gridPropsUtil.searchRow('bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowData, rowCounts)
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

const onDragable = (evt) => {
  dialogPos.x = dialogPos.x + evt.delta.x
  dialogPos.y = dialogPos.y + evt.delta.y
}

const dragablePopupStyle = computed(() => {
  return {
    transform: `translate(${dialogPos.x}px, ${dialogPos.y}px)`
  }
})
</script>
<style scoped>
.relative-container {
   position: relative;
}
.custom_search_button {
  position: relative;
  transform: translateY(36%);
}
</style>
