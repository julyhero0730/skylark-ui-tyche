<template>
  <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
      <q-card class="popup_inner" :style=dragablePopupStyle>
          <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
              <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
              <div class="popup_title">{{ $t('label.view.lonHlpApc') }}</div>
              <q-space />
              <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <div class="modal_form table_search_modal">
              <div class="search_condition_wrapper">
                <div class="domain_search_wrapper width100">
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
                    <CommonSelectBox @update:model-value="selectChange" :codeList="commonCodeList.searchCriteria" v-model="searchParam.searchCriteria.value"></CommonSelectBox>
                    </div>
                      <div class="relative-container d-flex items-center" style="margin-top: 19.5px;">
                        <!-- 최초 HELP OPEN(Search Criteria 빈값일때) - 기능X 디자인용 -->
                        <template v-if="searchParam.searchCriteria.value === ''">
                        <CommonDirectSearchBox maxlength="30" :disable="true"></commonDirectSearchBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:5px; top:50%; transform: translateY(-50%);" class="help_button_simple" />
                          </template>

                        <!-- Search Criteria - CustomerNo 일때 -->
                        <template v-if="searchParam.searchCriteria.value === 'CUSTOMER_NO'">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.searchKeyword.value" hlpType="frmHlpCst" :searchCode="searchParam.searchKeyword.value" @keyup.enter="getCstEnterSearch" @directSearchVal="getCstDirectSearch"></commonDirectSearchBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:5px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="showCstSearchPopup()" />
                            <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getCstPopupRowData"></frmHlpCst>
                        </template>

                        <!-- Search Criteria - CustomerName 일때 -->
                        <template v-if="searchParam.searchCriteria.value === 'CUSTOMER_NAME'">
                          <CommonInputBox maxlength="30" v-model="searchParam.searchKeyword.value" @keyup.enter="getCstNmEnterSearch"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:5px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="showCstNmSearchPopup()" />
                            <frmHlpCst v-model="showCstNmSearch" @selected-popup-row-data = "getCstNmPopupRowData"></frmHlpCst>
                        </template>

                        <!-- Search Criteria - ApplicationNo 일때 -->
                        <template v-if="searchParam.searchCriteria.value === 'APPLICATION_NO'">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.searchKeyword.value" hlpType="lonHlpApc" :searchCode="searchParam.searchKeyword.value" @keyup.enter="getApcEnterSearch" @directSearchVal="getApcDirectSearch"></commonDirectSearchBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:5px; top:50%; transform: translateY(-50%);" class="help_button_simple"/>
                        </template>
                      </div>
                      <div class="button_box right_button_wrapper custom_search_button">
                          <CommonSearchButton  :clearFunc="clear" :searchFunc="search"></CommonSearchButton>
                      </div>
                  </div>
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
                    class="msg_table ag-theme-balham height55"
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
import { ajaxUtil, commonUtil, gridPropsUtil, commonProp, frmHlpCst, frmHlpEmp, frmHlpBrc } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'
import { useSessionStore } from 'stores/session'

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
const session = useSessionStore()
const showBrcSearch = ref(false)
const showEmpSearch = ref(false)
const selectedPopupRowData = ref([])
const showCstSearch = ref(false)
const showCstNmSearch = ref(false)

const commonCodeList = reactive({
  searchCriteria: ref([]),
  applicationType: ref([]),
  progressStatus: ref([]),
  fundPurpose: ref([]),
  countryTypeCode: ref([]),
  branchTypeCode: ref([]),
  employeeTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

const searchCriteria = [
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'APPLICATION_NO', codeValue: i18n.global.t('label.objt.applicationNo') }
]
commonCodeList.searchCriteria = searchCriteria

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

// const showPopup = (type) => {
//   showCustomerSearch.value = false

//   switch (type) {
//     case 'cust' : showCustomerSearch.value = true; break
//   }
//   isCalendarOpen.value = true
// }
// const getCustPopupRowData = (event) => {
//   searchParam.value.customerNo.value = event[0].customerNo
//   searchParam.value.customerName.value = event[0].customerName
// }

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

const showCstSearchPopup = () => {
  showCstSearch.value = true
}

const showCstNmSearchPopup = () => {
  showCstNmSearch.value = true
}

const showBrcSearchPopup = () => {
  showBrcSearch.value = true
}

const showEmpSearchPopup = () => {
  showEmpSearch.value = true
}

const getCstPopupRowData = (event) => {
  searchParam.value.searchKeyword.value = event[0].customerNo
  search()
}

const getCstNmPopupRowData = (event) => {
  searchParam.value.searchKeyword.value = event[0].customerName
  search()
}

const getCstDirectSearch = (event) => {
  if (event !== '') {
    searchParam.value.searchKeyword.value = event.customerNo
    search()
  } else {
    rowData.value = []
  }
}

const getApcDirectSearch = (event) => {
  if (event !== '') {
    // rowData에 값을 담기 위해 배열형식으로 재정의
    const data = []
    data[0] = event
    rowData.value = data
  } else {
    rowData.value = []
  }
}

const getCstEnterSearch = () => {
  searchParam.value.searchCriteria.value = 'CUSTOMER_NO'
  search()
}

const getCstNmEnterSearch = () => {
  searchParam.value.searchCriteria.value = 'CUSTOMER_NAME'
  search()
}

const getApcEnterSearch = () => {
  search()
}

ajaxUtil.getCodeList('LON_APPLICATION_TYPE_CODE, LON_APL_PROGRESS_STCD, LON_FUND_PURPOSE_CODE')
  .then(function (codeData) {
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
    commonCodeList.progressStatus = codeData.lonAplProgressStcd
    commonCodeList.progressStatus.unshift({
      code: '', codeValue: i18n.global.t('label.view.all')
    })
    searchParam.value.progressStatus.value = commonCodeList.progressStatus[0].code
    commonCodeList.fundPurpose = codeData.lonFundPurposeCode
  })

const props = defineProps({
  customerNo: {
    type: String
  },
  customerName: {
    type: String
  },
  branchCode: {
    type: String
  },
  selectType: {
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

const searchParam = ref({
  searchCriteria: {
    value: searchCriteria[0].code,
    required: false,
    description: i18n.global.t('label.view.searchCriteria')
  },
  searchKeyword: {
    value: '',
    description: i18n.global.t('label.view.searchKeyword')
  },
  progressStatus: {
    value: '000',
    required: true,
    description: i18n.global.t('label.objt.progressStatus')
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
    value: 'lonHlpApc',
    required: false
  },
  selectType: {
    value: props.selectType
  },
  branchCode: {
    value: session.sysBranchCode,
    required: false
  },
  employeeNo: {
    value: session.sysEmployeeNo,
    required: false
  },
  employeeName: {
    value: '',
    required: false
  },
  branchName: {
    value: '',
    required: false
  }
})

const closePopup = () => {
  clear()
}

const selectChange = () => {
  searchParam.value.searchKeyword.value = ''
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
    field: 'applicationNo',
    headerName: i18n.global.t('label.objt.applicationNo'),
    width: 120,
    type: 'centerAligned',
    editable: false,
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
    width: 350,
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'applicationTpcd',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.applicationType, params.value)
    },
    headerName: i18n.global.t('label.objt.applicationType'),
    width: 120,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'loanMethod',
    headerName: i18n.global.t('label.objt.loanMethod'),
    width: 120,
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
    field: 'applicationAmount',
    headerName: i18n.global.t('label.objt.applicationAmount'),
    width: 120,
    editable: false,
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
    type: 'rightAligned',
    headerComponent: CommonHeaderMark
  },
  {
    field: 'applicationDate',
    headerName: i18n.global.t('label.objt.applicationDate'),
    width: 120,
    editable: false,
    cellRenderer: (params) => {
      return dayjs(params.value).format(commonProp.dateformat.dateType)
    },
    type: 'centerAligned',
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
    field: 'employeeNo',
    headerName: i18n.global.t('label.view.lastAuthEmp'),
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.employeeTypeCode, params.value)
    },
    width: 150,
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'authorizationDate',
    headerName: i18n.global.t('label.objt.authorizationDate'),
    width: 130,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'prgsStatusCode',
    headerName: i18n.global.t('label.objt.progressStatus'),
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.progressStatus, params.value)
    },
    width: 160,
    editable: false,
    type: 'centerAligned',
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
    field: 'decision',
    hide: true
  },
  {
    field: 'productType',
    hide: true
  },
  {
    field: 'loanPeriodType',
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
    field: 'baseRate',
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
    field: 'intRateType',
    hide: true
  },
  {
    field: 'fixedInterestRate',
    hide: true
  },
  {
    field: 'repaymentProgram',
    headerName: i18n.global.t('label.objt.repaymentProgram'),
    width: 150,
    editable: false,
    hide: true,
    type: 'centerAligned'
  },
  {
    field: 'gracePeriodYear',
    hide: true
  },
  {
    field: 'gracePeriodMonth',
    hide: true
  },
  {
    field: 'amortizationPeriodYear',
    hide: true
  },
  {
    field: 'amortizationPeriodMonth',
    hide: true
  },
  {
    field: 'repaymentSource',
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
  },
  {
    field: 'contractNo',
    hide: true
  },
  {
    field: 'contractDate',
    hide: true
  },
  {
    field: 'authorizationNo',
    hide: true
  },
  {
    field: 'authorizationDate',
    hide: true
  },
  {
    field: 'maturityDate',
    hide: true
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
    field: 'maxValue',
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

ajaxUtil.getCodeList('SHOWROWS')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showrows
  })

// ajaxUtil.getBranchCodeList()
//   .then(function (codeData) {
//     if (codeData && Array.isArray(codeData)) {
//       const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
//       const matchingValue = matchingCode.codeValue
//       searchParam.value.branchName.value = matchingValue
//       commonCodeList.branchTypeCode = codeData
//     }
//   })

// ajaxUtil.getEmployeeNoList()
//   .then(function (codeData) {
//     if (codeData && Array.isArray(codeData)) {
//       const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
//       const matchingValue = matchingCode.codeValue
//       searchParam.value.employeeName.value = matchingValue
//       commonCodeList.employeeTypeCode = codeData
//     }
//   })

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  emit('selectedPopupRowData', selectedRows)
  model.value = false
}

watch(() => searchParam.value.searchCriteria.value, () => {
  searchParam.value.searchKeyword.value = ''
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
transform: translateY(20%);
}
</style>
