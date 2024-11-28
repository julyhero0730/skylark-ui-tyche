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
    <frmHlpCst v-model="showCstNoSearch" @selected-popup-row-data="getPopupRowDataCstNo"></frmHlpCst>
    <frmHlpCst v-model="showCstNameSearch" @selected-popup-row-data="getPopupRowDataCstName"></frmHlpCst>
    <lonHlpCon v-model = "showConSearch" @selected-popup-row-data="getPopupRowDataCon"></lonHlpCon>

    <lonCntSchGrid
      :search-param="searchParam"
      :row-counts="rowCounts"
      :row-data="rowData"
      :next-search="nextSearch"
      :all-search="allSearch"
      :onSelectionChanged="onSelectionChanged"
      :common-code-list="commonCodeList"
    ></lonCntSchGrid>
</template>

<script setup>
/*
    301050 - Contract Search

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
import { ref, reactive, onMounted, watch, watchEffect } from 'vue'
import { i18n } from 'boot/i18n'
import { commonUtil, ajaxUtil, gridPropsUtil, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { gridProps } from 'src/pages/lon/ogn/cnt/lonCntSchGrudProps.vue'
import { useSessionStore } from 'stores/session'
import lonHlpCon from 'src/components/pages/main/hlp/lon/lonHlpCon.vue'
import lonCntSchGrid from 'src/pages/lon/ogn/cnt/lonCntSchGrid.vue'
/* =======================================================
        2. Global Variable
    ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언

// 전역변수 선언
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref(0)
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
  brcCurrencyCodeList: ref([]),
  searchTypeList: ref([]),
  applicationTpcd: ref([])
})

ajaxUtil.getCodeList('SHOWROWS, LON_APPLICATION_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.fetchSizeList = codeData.showrows
    commonCodeList.applicationTpcd = codeData.lonApplicationTypeCode
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
  { code: 'CONTRACT_NO', codeValue: i18n.global.t('label.objt.contractNo') }
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
      5. Grid Function
  ======================================================= */
const onSelectionChanged = () => {
  const selectedRows = gridProps.gridApi.value.getSelectedRows()
  if (selectedRows.length > 0) {
    const contractNo = selectedRows[0].contractNo
    const menuId = '301060'
    const refNo = contractNo

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

const clear = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  searchParam.value.branchCode.value = ''
  searchParam.value.branchName.value = ''
  searchParam.value.employeeNo.value = ''
  searchParam.value.employeeName.value = ''
  rowCounts.value = 0
  rowData.value = []
}

const search = () => {
  gridPropsUtil.searchRow('bsLonOrgCntService', 'LONORGCNT002', searchParam, rowData, rowCounts)
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonOrgCntService', 'LONORGCNT002', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonOrgCntService', 'LONORGCNT002', searchParam, rowCounts)
}

/* =======================================================
      6. Freeform Object
  ======================================================= */
const showCstNameSearch = ref(false)
const showCstNoSearch = ref(false)
const showConSearch = ref(false)
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

const getPopupRowDataCon = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.contractNo
  search()
}

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

const showSearchPopup = (param) => {
  if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NO') {
    showCstNoSearch.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NAME') {
    showCstNameSearch.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CONTRACT_NO') {
    showConSearch.value = true
  } else {
    switch (param) {
      case 'branchName' : showBrcSearch.value = true; break
      case 'employeeName' : showEmpSearch.value = true; break
    }
  }
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

watchEffect(() => {
  if (commonCodeList.searchTypeList.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'searchType').forEach(prop => { prop.dropdownList = commonCodeList.searchTypeList })
  }
})

onMounted(() => {
  search()
})

</script>
