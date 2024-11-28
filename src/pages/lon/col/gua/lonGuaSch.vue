<template>
  <top-search-pane
      v-model="searchParam"
      :paneObject="topSearchPaneObject"
      :useSearch="true"
      :searchFunc="search"
      :useClear="true"
      :clearFunc="clear"
      @showSearchPopup="showSearchPopup"
    ></top-search-pane>
    <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data = "getCustPopupRowData"></frmHlpCst>
    <lonHlpCon v-model="showContractSearch" @selected-popup-row-data = "getConPopupRowData"></lonHlpCon>
    <lonHlpApc v-model="showApplicationSearch" @selected-popup-row-data = "getApcPopupRowData"></lonHlpApc>
    <lonHlpGua v-model="showGuaranteeSearch" @selected-popup-row-data = "getGuaPopupRowData"></lonHlpGua>

    <q-page-container>
        <q-page class="table_container" style="margin: 0px 30px">
          <lonGuaSchGrid
                :row-data="rowData"
                :common-code-list="commonCodeList"
                :search-param="searchParam"
                :row-counts="rowCounts"
                :next-search="nextSearch"
                :all-search="allSearch"
                :radio-handle-change="radioHandleChange"
                >
            </lonGuaSchGrid>
    </q-page>
    </q-page-container>
</template>

<script setup>
/*

Guarantee Search - 303040

 */

/* =======================================================
    1. Import Area
======================================================= */
import { reactive, ref, watchEffect } from 'vue'
import { ajaxUtil, commonUtil, messageBox, gridPropsUtil, freeformUtil, frmHlpCst } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import { gridProps } from 'src/pages/lon/col/gua/lonGuaSchGridProps.vue'
import { i18n } from 'boot/i18n'
import lonHlpCon from 'src/components/pages/main/hlp/lon/lonHlpCon.vue'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import lonHlpGua from 'src/components/pages/main/hlp/lon/lonHlpGua.vue'
import lonGuaSchGrid from 'src/pages/lon/col/gua/lonGuaSchGrid.vue'

/* =======================================================
    2. Global Variable
======================================================= */
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref([])
rowCounts.value = 0
const showCustomerSearch = ref(false)
const showContractSearch = ref(false)
const showApplicationSearch = ref(false)
const showGuaranteeSearch = ref(false)
const applicationNo = ref('')
const topSearchPaneObject = ref([
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
    model: 'popupRowData'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.branch')
  },
  {
    type: 'dropdown',
    model: 'branchCode',
    dropdownList: []
  },
  {
    type: 'label',
    label: i18n.global.t('label.objt.transactionStatus')
  },
  {
    type: 'dropdown',
    model: 'transactionStatusCd',
    dropdownList: []
  }
])
/* =======================================================
    3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  searchCriteriaList: ref([]),
  branchTypeCode: ref([]),
  transactionStatusCode: ref([]),
  fetchSizeList: ref([]),
  applicationType: ref([]),
  progressStatus: ref([]),
  brcCurrencyCodeList: ref([])
})
ajaxUtil.getCodeList('SHOWROWS, LON_GUARANTEE_STATUS_CODE, LON_APPLICATION_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.transactionStatusCode = codeData.lonGuaranteeStatusCode
    commonCodeList.transactionStatusCode.unshift({
      code: '', codeValue: i18n.global.t('label.view.all')
    })
    commonCodeList.fetchSizeList = codeData.showrows
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
  })

ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      commonCodeList.branchTypeCode = codeData
      commonCodeList.branchTypeCode.unshift({
        code: '', codeValue: i18n.global.t('label.view.all')
      })
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
//       commonCodeList.employeeTypeCode = codeData
//     }
//   })
//   .catch(function (error) {
//     console.error('Error:', error)
//   })

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

const searchCriteria = [
  { code: 'LOAN_CUSTOMER', codeValue: i18n.global.t('label.view.loanCustomer') },
  { code: 'GUARANTOR_NO', codeValue: i18n.global.t('label.objt.guarantorNo') },
  { code: 'GUARANTEE_NO', codeValue: i18n.global.t('label.objt.guaranteeNo') },
  { code: 'APPLICATION_NO', codeValue: i18n.global.t('label.objt.applicationNo') },
  { code: 'CONTRACT_NO', codeValue: i18n.global.t('label.objt.contractNo') }
]
commonCodeList.searchCriteriaList = searchCriteria

const search = () => {
  searchParam.value.maxValue.value = '0'

  switch (searchParam.value.searchCriteria.value) {
    case 'LOAN_CUSTOMER': searchParam.value.customerNo.value = searchParam.value.popupRowData.value
      break
    case 'GUARANTOR_NO' : searchParam.value.guarantorNo.value = searchParam.value.popupRowData.value
      break
    case 'GUARANTEE_NO' : searchParam.value.guaranteeNo.value = searchParam.value.popupRowData.value
      break
    case 'APPLICATION_NO' : searchParam.value.applicationNo.value = searchParam.value.popupRowData.value
      break
    case 'CONTRACT_NO' : searchParam.value.contractNo.value = searchParam.value.popupRowData.value
      break
  }

  const newSearchParam = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA0022', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        const _alertInfo = () => {
          rowData.value = []
          rowCounts.value = 0
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        applicationNo.value = data[0].applicationNo
        rowData.value = data
        rowCounts.value = data.length
      }
    })
}

const getCustPopupRowData = (event) => {
  if (searchParam.value.searchCriteria.value === 'LOAN_CUSTOMER') {
    searchParam.value.customerNo.value = event[0].customerNo
  } else if (searchParam.value.searchCriteria.value === 'GUARANTOR_NO') {
    searchParam.value.guarantorNo.value = event[0].customerNo
  }
  searchParam.value.popupRowData.value = event[0].customerName
}

const getConPopupRowData = (event) => {
  searchParam.value.contractNo.value = event[0].contractNo
  searchParam.value.popupRowData.value = event[0].contractNo
}

const getApcPopupRowData = (event) => {
  searchParam.value.applicationNo.value = event[0].applicationNo
  searchParam.value.popupRowData.value = event[0].applicationNo
}

const getGuaPopupRowData = (event) => {
  searchParam.value.guaranteeNo.value = event[0].guaranteeNo
  searchParam.value.popupRowData.value = event[0].guaranteeNo
}

const searchParam = ref({
  transactionStatusCd: {
    value: ''
  },
  popupRowData: {
    value: ''
  },
  searchCriteria: {
    value: ''
  },
  contractNo: {
    value: ''
  },
  contractName: {
    value: ''
  },
  applicationNo: {
    value: ''
  },
  guaranteeNo: {
    value: ''
  },
  guarantorNo: {
    value: ''
  },
  guaranteeName: {
    value: ''
  },
  customerNo: {
    value: ''
  },
  branchCode: {
    value: session.sysBranchCode,
    required: false
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

const clear = () => {
  freeformUtil.clear(searchParam)
  searchParam.value.branchCode.value = session.sysBranchCode
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowCounts.value = 0
  rowData.value = []
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonColGuaService', 'LONCOLGUA0022', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonColGuaService', 'LONCOLGUA0022', searchParam, rowCounts)
}

const showSearchPopup = (param) => {
  switch (param) {
    case 'popupRowData' :
      if (searchParam.value.searchCriteria.value === 'LOAN_CUSTOMER') {
        showCustomerSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'GUARANTOR_NO') {
        showCustomerSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'GUARANTEE_NO') {
        showGuaranteeSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'APPLICATION_NO') {
        showApplicationSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'CONTRACT_NO') {
        showContractSearch.value = true
      }
      break
  }
}

const radioHandleChange = (event) => {
  // Radio버튼 변경시 해당 값으로 search
  searchParam.value.transactionStatusCd.value = event
  search()
}

search()

watchEffect(() => {
  if (commonCodeList.branchTypeCode.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'branchCode').forEach(prop => { prop.dropdownList = commonCodeList.branchTypeCode })
  }
  if (commonCodeList.searchCriteriaList.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'searchCriteria').forEach(prop => { prop.dropdownList = commonCodeList.searchCriteriaList })
  }
  if (commonCodeList.transactionStatusCode.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'transactionStatusCd').forEach(prop => { prop.dropdownList = commonCodeList.transactionStatusCode })
  }
})
</script>
