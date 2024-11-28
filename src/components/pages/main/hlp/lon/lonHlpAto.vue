<template>
  <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
      <q-card class="popup_inner" :style=dragablePopupStyle>
          <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
              <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
              <div class="popup_title">{{ $t('label.view.lonHlpAto') }}</div>
              <q-space />
              <q-btn flat v-close-popup @click="clear"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
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
                      <CommonSelectBox :codeList="commonCodeList.searchTypeList" v-model="searchParam.searchType.value" :disable="false"></CommonSelectBox>
                  </div>
                  <div>
                    <label class="form_label" style="margin-bottom: 0px;">{{ $t('label.view.searchItem') }}</label>
                    <div style=" display: flex; align-items: center; gap:1px;">
                        <CommonInputBox maxlength="30" v-model="searchParam.searchKeyword.value" :disable=false style="text-align-last: center;" @keyup.enter="enterEvent()"></CommonInputBox>
                        <q-icon name="search" size="sm" style="margin:0 20px 0 -30px;" class="help_button_simple" @click="showSearchPopup" />
                        <frmHlpCst v-model="showCstNoSearch" @selected-popup-row-data="getPopupRowDataCstNo"></frmHlpCst>
                        <frmHlpCst v-model="showCstNameSearch" @selected-popup-row-data="getPopupRowDataCstName"></frmHlpCst>
                        <lonHlpApc v-model="showApcSearch" @selected-popup-row-data="getPopupRowDataApc"></lonHlpApc>
                    </div>
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
                    class="msg_table ag-theme-balham height50"
                    :columnDefs="columnDefs"
                    :columnTypes="columnTypes"
                    :groupDefaultExpanded="-1"
                    :rowData="rowData"
                    :defaultColDef="defaultColDef"
                    :stopEditingWhenCellsLoseFocus="false"
                    :groupUseEntireRow="true"
                    :groupDisplayType="groupDisplayType"
                    @grid-ready="onGridReady"
                    rowSelection="single"
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
import { ajaxUtil, commonUtil, gridPropsUtil, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { useSessionStore } from 'stores/session'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

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

const commonCodeList = reactive({
  applicationType: ref([]),
  progressStatus: ref([]),
  fundPurpose: ref([]),
  authorizationStatus: ref([]),
  countryTypeCode: ref([]),
  branchTypeCode: ref([]),
  employeeTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCodeList('LON_APPLICATION_TYPE_CODE, LON_APPROVAL_RESULT_CODE, LON_APL_PROGRESS_STCD, LON_FUND_PURPOSE_CODE')
  .then(function (codeData) {
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
    commonCodeList.progressStatus = codeData.lonAplProgressStcd
    commonCodeList.fundPurpose = codeData.lonFundPurposeCode
    commonCodeList.authorizationStatus = codeData.lonApprovalResultCode
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

/* =======================================================
      6. Freeform Object
  ======================================================= */
const showCstNameSearch = ref(false)
const showCstNoSearch = ref(false)
const showApcSearch = ref(false)
const selectedPopupRowData = ref([])
/* =======================================================
      7. Freeform Funtion
  ======================================================= */
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

const getPopupRowDataApc = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.applicationNo
  search()
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

const showSearchPopup = () => {
  if (searchParam.value.searchType.value === 'CUSTOMER_NO') {
    showCstNoSearch.value = true
  } else if (searchParam.value.searchType.value === 'CUSTOMER_NAME') {
    showCstNameSearch.value = true
  } else if (searchParam.value.searchType.value === 'APPLICATION_NO') {
    showApcSearch.value = true
  }
}

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
  progressStatus: {
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
const rowData = ref(0)
const fetchSizeList = ref([])

const searchType = [
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'APPLICATION_NO', codeValue: i18n.global.t('label.objt.applicationNo') }
]
commonCodeList.searchTypeList = searchType
const searchParam = ref({
  branchCode: {
    value: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.branchCode')
  },
  branchName: {
    value: '',
    required: false,
    description: i18n.global.t('label.bojt.branchName')
  },
  employeeNo: {
    value: session.sysEmployeeNo,
    required: false,
    description: i18n.global.t('label.objt.employeeNo')
  },
  employeeName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.employeeName')
  },
  progressStatus: {
    value: '000',
    required: false,
    description: i18n.global.t('label.objt.progressStatus')
  },
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
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false
  },
  helpSearchType: {
    value: 'lonHlpAto',
    required: false
  }
})

const gridApi = ref(null)
const gridColumnApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const currency = ref('')

const columnDefs = [
  {
    field: 'applicationNo',
    headerName: i18n.global.t('label.objt.applicationNo'),
    width: 120,
    rowGroup: true,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'authorizationNo',
    headerName: i18n.global.t('label.objt.authorizationNo'),
    width: 120,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'employeeNo',
    hide: true
  },
  {
    field: 'employeeName',
    headerName: i18n.global.t('label.objt.authLine'),
    width: 125,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'authorizationDate',
    headerName: i18n.global.t('label.objt.authorizationDate'),
    width: 126,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'authResultCode',
    headerName: i18n.global.t('label.objt.authorizationStatus'),
    width: 135,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.authorizationStatus, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'productName',
    headerName: i18n.global.t('label.objt.productName'),
    width: 300,
    editable: false
  },
  {
    field: 'prgsStatusCode',
    headerName: i18n.global.t('label.objt.progressStatus'),
    width: 135,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.progressStatus, params.value)
    },
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'customerNo',
    headerName: i18n.global.t('label.objt.customerNo'),
    width: 150,
    type: 'centerAligned',
    editable: false,
    hide: true
  },
  {
    field: 'customerName',
    headerName: i18n.global.t('label.objt.customerName'),
    width: 120,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'currencyCode',
    headerName: i18n.global.t('label.objt.currency'),
    width: 75,
    type: 'centerAligned',
    valueFormatter: (params) => {
      currency.value = params.value
      return params.value
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'applicationAmount',
    headerName: i18n.global.t('label.objt.amount'),
    width: 100,
    type: 'rightAligned',
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
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'maxValue',
    hide: true
  }
]

const defaultColDef = {
  resizable: true,
  initialWidth: 150
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

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  emit('selectedPopupRowData', selectedRows)
  model.value = false
}

const groupDisplayType = ref('groupRows')

const enterEvent = () => {
  search()
}

watch(() => searchParam.value.searchType.value, () => {
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
  searchParam.value.progressStatus.value = props.progressStatus
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
  gridPropsUtil.searchRow('bsLonOrgAthService', 'LONORGATH042', searchParam, rowData, rowCounts)
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridApi.value, 'bsLonOrgAthService', 'LONORGATH042', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridApi.value, 'bsLonOrgAthService', 'LONORGATH042', searchParam, rowCounts)
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
