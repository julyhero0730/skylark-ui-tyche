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
  <frmHlpBrc v-model="showBrcSearch" @selected-popup-row-data="getBrcPopupRowData"></frmHlpBrc>
  <frmHlpEmp v-model="showEmpSearch" @selected-popup-row-data = "getEmpPopupRowData"></frmHlpEmp>
  <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getPopupRowData3"></frmHlpCst>
  <frmHlpCst v-model="showCstSearch1" @selected-popup-row-data = "getPopupRowData4"></frmHlpCst>
  <lonHlpDbs v-model = "showDbsSearch" @selected-popup-row-data = "getPopupRowData5"></lonHlpDbs>

    <lonDbsSchGrid
      :search-param="searchParam"
      :row-count="rowCount"
      :row-data="rowData"
      :next-search="nextSearch"
      :all-search="allSearch"
      :onSelectionChanged="onSelectionChanged"
      :common-code-list="commonCodeList"
    ></lonDbsSchGrid>
</template>

<script setup>
/*
    302010 - Disbursement Search

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
import { ref, reactive, watch, watchEffect, onMounted } from 'vue'
import { i18n } from 'boot/i18n'
import { commonUtil, ajaxUtil, freeformUtil, commonProp, gridPropsUtil, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { gridProps } from 'src/pages/lon/srv/dbs/lonDbsSchProps/lonDbsSchGridProps.vue'
import { useSessionStore } from 'stores/session'
import lonHlpDbs from 'src/components/pages/main/hlp/lon/lonHlpDbs.vue'
import dayjs from 'dayjs'
import lonDbsSchGrid from 'src/pages/lon/srv/dbs/lonDbsSchProps/lonDbsSchGrid.vue'
/* =======================================================
        2. Global Variable
    ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언

// 전역변수 선언
const session = useSessionStore()
const rowData = ref([])
const rowCount = ref(0)
const showBrcSearch = ref(false)
const showEmpSearch = ref(false)

/* =======================================================
      3. Common Code Adapter
  ======================================================= */
const commonCodeList = reactive({
  fetchSizeList: ref([]),
  countryTypeCode: ref([]),
  branchTypeCode: ref([]),
  employeeTypeCode: ref([]),
  interestRateCode: ref([]),
  lonCreditCode: ref([]),
  brcCurrencyCodeList: ref([]),
  searchTypeList: ref([])
})

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCodeList('SHOWROWS,LON_INTEREST_RATE_CODE,LON_CREDIT_LINE_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.interestRateCode = codeData.lonInterestRateCode
    commonCodeList.lonCreditCode = codeData.lonCreditLineTypeCode
    commonCodeList.fetchSizeList = codeData.showrows
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
      commonCodeList.branchTypeCode = codeData
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
      searchParam.value.employeeName.value = matchingValue
      commonCodeList.employeeTypeCode = codeData
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

const searchType = [
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'DISBURSEMENT_NO', codeValue: i18n.global.t('label.view.disbursementNo') }
]
commonCodeList.searchTypeList = searchType
/* =======================================================
      4. Grid Props
  ======================================================= */
const searchParam = ref({
  branchCode: {
    value: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.view.branch')
  },
  branchName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.branch')
  },
  employeeNo: {
    value: session.sysEmployeeNo,
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  employeeName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  searchType: {
    value: searchType[0].code,
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  searchKeyword: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  fetchSize: {
    value: 100,
    required: false,
    description: i18n.global.t('label.view.showRows')
  },
  maxValue: {
    value: '0',
    required: false,
    description: i18n.global.t('label.view.showRows')
  }
})

const formParam = ref({
  customerNo: {
    value: '',
    initValue: '',
    required: false
  },
  oldReferNo: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.referNo')
  },
  customerName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.customerName')
  },
  shortCustomerName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.shortCustomerName')
  },
  customerTypeCode: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.customerTypeCode')
  },
  bankCode: {
    value: '',
    initValue: '',
    required: false
  },
  bankName: {
    value: '',
    initValue: '',
    required: false
  },
  customerScaleCode: {
    value: '',
    required: false
  },
  corporationTypeCode: {
    value: '',
    initValue: '',
    required: false
  },
  countryCode: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.countryCode')
  },
  countryName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.countryName')
  },
  hqCountryCode: {
    value: '',
    initValue: '',
    required: false
  },
  hqCountryName: {
    value: '',
    initValue: '',
    required: false
  },
  residentYn: {
    value: 'Y',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.residentFlag')
  },
  gender: {
    value: '',
    initValue: '',
    required: false
  },
  businessNoTypeCode: {
    value: '',
    initValue: '',
    required: false
  },
  businessNo: {
    value: '',
    initValue: '',
    required: false
  },
  remark: {
    value: '',
    initValue: '',
    required: false
  },
  statusCode: {
    value: '01',
    initValue: '',
    required: false
  },
  createUserId: {
    value: session.sysUserId,
    initValue: '',
    required: false
  },
  createDatetime: {
    value: dayjs(new Date()).format(commonProp.dateformat.dateTimeType),
    initValue: '',
    required: false
  },
  updateUserId: {
    value: session.sysUserId,
    initValue: '',
    required: false
  },
  updateDatetime: {
    value: dayjs(new Date()).format(commonProp.dateformat.dateTimeType),
    initValue: '',
    required: false
  },
  organizationCode: {
    value: '',
    required: false
  },
  serialNo: {
    value: '',
    required: false
  },
  transactionMode: {
    value: 'NEW',
    required: true
  }
})
/* =======================================================
      5. Grid Function
  ======================================================= */

const clear = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.branchCode.value = ''
  searchParam.value.branchName.value = ''
  searchParam.value.employeeNo.value = ''
  searchParam.value.employeeName.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = 0
  rowData.value = []
}

const search = () => {
  searchParam.value.maxValue.value = '0'
  // if (searchParam.value.branchName.value === '' || searchParam.value.branchName.value === null) {
  //   searchParam.value.branchCode.value = ''
  // }

  // if (searchParam.value.employeeName.value === '' || searchParam.value.employeeName.value === null) {
  //   searchParam.value.employeeNo.value = ''
  // }
  gridPropsUtil.searchRow('bsLonSrvDbsService', 'LONSRVDBS002', searchParam, rowData, rowCount)
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonSrvDbsService', 'LONSRVDBS002', searchParam, rowCount)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonSrvDbsService', 'LONSRVDBS002', searchParam, rowCount)
}

const onSelectionChanged = () => {
  const selectedRows = gridProps.gridApi.value.getSelectedRows()
  if (selectedRows.length > 0) {
    const disbursementNo = selectedRows[0].disbursementNo
    freeformUtil.selectedRowDataToFreeformData(selectedRows[0], formParam.value)
    const menuId = '302020'
    const refNo = disbursementNo

    window.top.postMessage({
      e: 'openTabMenu',
      params: {
        menuId,
        refNo,
        timestamp: new Date().getTime()
      }
    })
  }
}

const topSearchPaneObject = ref([
  {
    type: 'label',
    label: i18n.global.t('label.view.branch')
  },
  {
    type: 'popup',
    model: 'branchName',
    css: 'width: 130px;'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.manager')
  },
  {
    type: 'popup',
    model: 'employeeName',
    css: 'width: 120px;'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.searchCriteria')
  },
  {
    type: 'dropdown',
    model: 'searchType',
    dropdownList: []
  },
  {
    type: 'popup',
    model: 'searchKeyword'
  }
])

/* =======================================================
      6. Freeform Object
  ======================================================= */
// const showBrcSearch = ref(false)
// const showEmpSearch = ref(false)
const showCstSearch = ref(false)
const showCstSearch1 = ref(false)
const showDbsSearch = ref(false)
const selectedPopupRowData = ref([])
/* =======================================================
      7. Freeform Funtion
  ======================================================= */
const getBrcPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.branchCode.value = selectedPopupRowData.value.branchCode
  searchParam.value.branchName.value = selectedPopupRowData.value.branchName
}

const getEmpPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.employeeNo.value = event[0].employeeNo
  searchParam.value.employeeName.value = event[0].employeeName
}

const getPopupRowData3 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerNo
  search()
}

const getPopupRowData4 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerName
  search()
}

const getPopupRowData5 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.disbursementNo
  search()
}

const showSearchPopup = (param) => {
  if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NO') {
    showCstSearch.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NAME') {
    showCstSearch1.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'DISBURSEMENT_NO') {
    showDbsSearch.value = true
  } else {
    switch (param) {
      case 'branchName' : showBrcSearch.value = true; break
      case 'employeeName' : showEmpSearch.value = true; break
    }
  }
}

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

watch(() => searchParam.value.searchType.value, () => {
  searchParam.value.searchKeyword.value = ''
})

watchEffect(() => {
  if (commonCodeList.searchTypeList.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'searchType').forEach(prop => { prop.dropdownList = commonCodeList.searchTypeList })
  }
})

onMounted(() => {
  search()
})
</script>
