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
  <lonHlpDbs v-model="showDbsSearch" @selected-popup-row-data = "getPopupRowData1"></lonHlpDbs>
  <frmHlpCst v-model="showCstSearch1" @selected-popup-row-data = "getPopupRowData2"></frmHlpCst>
  <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getPopupRowData3"></frmHlpCst>
    <lonAqcSchGrid
      :search-param="searchParam"
      :row-count="rowCount"
      :row-data="rowData"
      :next-search="nextSearch"
      :all-search="allSearch"
      :onSelectionChanged="onSelectionChanged"
      :common-code-list="commonCodeList"
    ></lonAqcSchGrid>
</template>

<script setup>
/*
    307010 - Asset Quality Classification

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
import { ajaxUtil, gridPropsUtil, frmHlpCst, commonUtil, messageBox } from 'skylark-ui-lib'
import { gridProps } from 'src/pages/lon/aqc/mng/lonAqcSchProps/lonAqcSchGridProps.vue'
// import { useSessionStore } from 'stores/session'
import lonHlpDbs from 'src/components/pages/main/hlp/lon/lonHlpDbs.vue'
// import topSearchPane from 'src/components/commonPane/topSearchPane.vue'
import lonAqcSchGrid from 'src/pages/lon/aqc/mng/lonAqcSchProps/lonAqcSchGrid.vue'
// import lonHlpAqc from 'src/components/pages/main/hlp/lon/lonHlpAqc.vue'
/* =======================================================
        2. Global Variable
    ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언

// 전역변수 선언
// const session = useSessionStore()
const rowData = ref([])
const rowCount = ref(0)
/* =======================================================
      3. Common Code Adapter
  ======================================================= */
const commonCodeList = reactive({
  fetchSizeList: ref([]),
  branchTypeCode: ref([]),
  employeeTypeCode: ref([]),
  interestRateCode: ref([]),
  lonCreditCode: ref([]),
  brcCurrencyCodeList: ref([]),
  searchTypeList: ref([]),
  lonAqcTypeCode: ref([]),
  lonAqcMethodCode: ref([])
})

ajaxUtil.getCodeList('SHOWROWS,LON_PRODUCT_TYPE,LON_AQC_TYPE_CODE,LON_AQC_METHOD_CODE')
  .then(function (codeData) {
    commonCodeList.lonProductCode = codeData.lonProductCode
    commonCodeList.fetchSizeList = codeData.showrows
    commonCodeList.lonAqcTypeCode = codeData.lonAqcTypeCode
    commonCodeList.lonAqcMethodCode = codeData.lonAqcMethodCode
  })

const newSearchInfoParam = commonUtil.inputValueToJson('bsLonAqcSchService', 'LONAQCMNG0022')
ajaxUtil.ajaxServiceData(newSearchInfoParam)
  .then(function (data) {
    if (data.length === 0) {
      const _alertInfo = () => {
        alert('error')
      }
      messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
    } else {
      searchParam.value.appraisalDate.value = data[0].maxDate
    }
  })

const searchType = [
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'DISBURSEMENT_NO', codeValue: i18n.global.t('label.view.disbursementNo') }

]
commonCodeList.searchTypeList = searchType
/* =======================================================
      4. Grid Props
  ======================================================= */
const searchParam = ref({
  branchName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.branch')
  },
  branchCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.branch')
  },
  searchType: {
    value: searchType[0].code,
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  searchCustomer: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  searchBranch: {
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
  },
  appraisalDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.appraisalDate')
  },
  searchKeyword: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  allYn: {
    value: '',
    required: false,
    description: ''
  },
  serialNo: {
    value: '',
    required: false,
    description: ''
  },
  assetReferNo: {
    value: '',
    required: false,
    description: ''
  },
  assetAmount: {
    value: '',
    required: false,
    description: ''
  }
})

/* =======================================================
      5. Grid Function
  ======================================================= */

const clear = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.appraisalDate = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = 0
  rowData.value = []
}

const search = () => {
//   if (searchParam.value.searchBranch.value === '' || searchParam.value.searchBranch.value === null) {
//     searchParam.value.branchCode.value = ''
//   }
  searchParam.value.allYn.value = 'N'
  gridPropsUtil.searchRow('bsLonAqcSchService', 'LONAQCMNG002', searchParam, rowData, rowCount)
}

const nextSearch = () => {
  if (searchParam.value.searchBranch.value === '' || searchParam.value.searchBranch.value === null) {
    searchParam.value.branchCode.value = ''
  }
  searchParam.value.allYn.value = 'N'
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonAqcSchService', 'LONAQCMNG002', searchParam, rowCount)
}

const allSearch = () => {
  if (searchParam.value.searchBranch.value === '' || searchParam.value.searchBranch.value === null) {
    searchParam.value.branchCode.value = ''
  }
  searchParam.value.allYn.value = 'Y'
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonAqcSchService', 'LONAQCMNG002', searchParam, rowCount)
}

const onSelectionChanged = () => {
  const selectedRows = gridProps.gridApi.value.getSelectedRows()
  searchParam.value.assetReferNo.value = selectedRows[0].assetReferNo
  searchParam.value.serialNo.value = selectedRows[0].serialNo
  searchParam.value.assetAmount.value = selectedRows[0].assetAmount
  if (selectedRows.length > 0) {
    showAqcSearch.value = true
  }
}

// const getSessionInfo = () => {
//   searchParam.value.searchBranch.value = session.sysBranchCode
//   searchParam.value.branchCode.value = session.sysBranchCode
//   for (let i = 0; i < commonCodeList.branchTypeCode.length; i++) {
//     if (commonCodeList.branchTypeCode[i].code === session.sysBranchCode) {
//       searchParam.value.searchBranch.value = commonCodeList.branchTypeCode[i].decode
//       searchParam.value.branchCode.value = commonCodeList.branchTypeCode[i].code
//     }
//   }
// }

const topSearchPaneObject = ref([
  {
    type: 'label',
    label: i18n.global.t('label.objt.baseDate')
  },
  {
    type: 'calendarYmd',
    model: 'appraisalDate'
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
const showCstSearch = ref(false)
const showCstSearch1 = ref(false)
const showAqcSearch = ref(false)
const showDbsSearch = ref(false)
const selectedPopupRowData = ref([])
/* =======================================================
      7. Freeform Funtion
  ======================================================= */
const getPopupRowData1 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.disbursementNo
  search()
}

const getPopupRowData2 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerName
  search()
}

const getPopupRowData3 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.customerNo
  search()
}

const showSearchPopup = (param) => {
  if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NO') {
    showCstSearch.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NAME') {
    showCstSearch1.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'DISBURSEMENT_NO') {
    showDbsSearch.value = true
  }
}
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
