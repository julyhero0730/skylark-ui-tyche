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
  <frmHlpCst v-model="showCstNameSearch" @selected-popup-row-data="getPopupRowDataCstName"></frmHlpCst>
  <frmHlpCst v-model="showCstNoSearch" @selected-popup-row-data="getPopupRowDataCstNo"></frmHlpCst>
  <lonHlpAto v-model="showAthSearch" @selected-popup-row-data="getPopupRowDataAth"></lonHlpAto>

<lonAthSchGrid
  :commonCodeList="commonCodeList"
  :searchParam="searchParam"
  :dataValue="dataValue"
  :rowCounts="rowCounts"
  :nextSearch="nextSearch"
  :allSearch="allSearch"
  :onRowDoubleClicked="onRowDoubleClicked"
  :rowData="rowData"
  :groupDisplayType="groupDisplayType"
></lonAthSchGrid>
</template>

<script setup>
/*

301030 - Loan Authorization Inquiry

*/
/* =======================================================
  1. Import Area
======================================================= */
import { reactive, ref, onMounted, watch, watchEffect } from 'vue'
import { ajaxUtil, messageBox, gridPropsUtil, commonUtil, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
// import { commonProp } from 'boot/commonProp'
import { gridProps } from 'src/pages/lon/ogn/ath/lonAthSchGridProps.vue'
// import dayjs from 'dayjs'
import { i18n } from 'boot/i18n'
import lonAthSchGrid from 'src/pages/lon/ogn/ath/lonAthSchGrid.vue'
import lonHlpAto from 'src/components/pages/main/hlp/lon/lonHlpAto.vue'

/* =======================================================
  2. Global Variable
======================================================= */
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref(0)
const showBrcSearch = ref(false)
const showEmpSearch = ref(false)
// const showCustomerSearch = ref(false)
// const showEmployeeSearch = ref(false)
// const isCalendarOpen = ref(false)
const branchTypeList = ref([])
const groupDisplayType = ref(null)
groupDisplayType.value = 'groupRows'

/* =======================================================
  3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  // progressStatus: ref([]),
  // authorizationStatus: ref([]),
  fetchSizeList: ref([]),
  brcCurrencyCodeList: ref([]),
  branchTypeCode: ref([])
})
ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
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
      searchParam.value.employeeNo.value = session.sysEmployeeNo
      commonCodeList.employeeTypeCode = codeData
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

ajaxUtil.getCodeList('SHOWROWS,LON_APL_PROGRESS_STCD, LON_APPROVAL_RESULT_CODE')
  .then(function (codeData) {
    const newProgressStatus = []
    newProgressStatus.push({
      code: '', codeValue: i18n.global.t('label.view.all')
    })
    const lonAplProgressStcdList = codeData.lonAplProgressStcd
    for (const index in lonAplProgressStcdList) {
      newProgressStatus.push(lonAplProgressStcdList[index])
    }
    commonCodeList.progressStatus = newProgressStatus
    commonCodeList.authorizationStatus = codeData.lonApprovalResultCode
    commonCodeList.fetchSizeList = codeData.showrows
  })

const brListSearch = () => {
  const brSearchParam = ref({
    searchType: {
      value: 'BRANCH_CODE'
    },
    searchKeyword: {
      value: ''
    },
    fetchSize: {
      value: 100
    },
    maxValue: {
      value: '0'
    },
    helpSearchType: {
      value: 'FrmHlpBrc'
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsFrmHlpCmmService', 'FRMHLPCMM002', brSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        const _alertInfo = () => {
          rowData.value = []
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        const branchCodeList = []
        branchCodeList.push({
          code: '', codeValue: i18n.global.t('label.view.all')
        })
        const _branchCode = data

        for (const index in _branchCode) {
          const row = {
            code: _branchCode[index].branchCode,
            decode: _branchCode[index].branchName,
            codeValue: _branchCode[index].branchName,
            codeName: _branchCode[index].branchName,
            fullCodeName: _branchCode[index].branchName
          }
          branchCodeList.push(row)
        }
        branchTypeList.value = branchCodeList
        searchParam.value.branchCode.value = session.sysBranchCode
      }
    })
}

brListSearch()

// const showPopup = (type) => {
//   showCustomerSearch.value = false
//   showEmployeeSearch.value = false

//   switch (type) {
//     case 'customerNo' : showCustomerSearch.value = true; break
//     case 'employeeName' : showEmployeeSearch.value = true; break
//   }
//   isCalendarOpen.value = true
// }

// const getCustPopupRowData = (event) => {
//   searchParam.value.customerNo.value = event[0].customerNo
//   searchParam.value.customerName.value = event[0].customerName
// }

// const getEmpPopupRowData = (event) => {
//   searchParam.value.employeeNo.value = event[0].employeeNo
//   searchParam.value.employeeName.value = event[0].employeeName
// }

const onRowDoubleClicked = () => {
  const selectedRows = gridProps.gridApi.value.getSelectedRows()
  if (selectedRows.length > 0) {
    const menuId = '301040'
    const refNo = commonUtil.isEmpty(selectedRows[0].authorizationNo) ? selectedRows[0].applicationNo : selectedRows[0].authorizationNo

    window.top.postMessage({
      e: 'openTabMenu',
      params: {
        menuId,
        refNo,
        timestamp: new Date().getTime() // 현재 시간의 타임스탬프 추가
      }
    })
  }
}

const searchType = [
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'AUTHORIZATION_NO', codeValue: i18n.global.t('label.objt.authorizationNo') }
]
commonCodeList.searchTypeList = searchType
/* =======================================================
      4. Grid Props
  ======================================================= */
const searchParam = ref({
  branchCode: {
    value: session.sysBranchCode,
    required: false
  },
  branchName: {
    value: '',
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
  customerNo: {
    value: '',
    required: false
  },
  customerName: {
    value: '',
    required: false
  },
  progressStatus: {
    value: '',
    required: true
  },
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  }
})

const clear = () => {
  searchParam.value.searchKeyword.value = ''
  // searchParam.value.customerName.value = ''
  // searchParam.value.customerNo.value = ''
  searchParam.value.branchCode.value = ''
  searchParam.value.branchName.value = ''
  searchParam.value.employeeNo.value = ''
  searchParam.value.employeeName.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowCounts.value = 0
  rowData.value = []
}

// const search = () => {
//   const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH042', searchParam, rowData, rowCounts)
//   ajaxUtil.ajaxServiceData(newSearchParam)
//     .then(function (datas) {
//       if (datas.length === 0) {
//         messageBox.alertInfo(i18n.global.t('msg.nodata.found')).onOk(() => {
//           rowData.value = []
//         })
//       } else {
//         rowData.value = datas
//         rowCounts.value = datas.length
//         rowData.value.forEach((data) => {
//           data.group = `${data.applicationNo}`
//         })
//       }
//     })
// }

const search = () => {
  gridPropsUtil.searchRow('bsLonOrgAthService', 'LONORGATH042', searchParam, rowData, rowCounts)
  rowData.value.forEach((data) => {
    data.group = `${data.applicationNo}`
  })
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonOrgAthService', 'LONORGATH042', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonOrgAthService', 'LONORGATH042', searchParam, rowCounts)
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
  // {
  //   type: 'label',
  //   label: i18n.global.t('label.view.branch')
  // },
  // {
  //   type: 'dropdown',
  //   model: 'branchCode',
  //   dropdownList: [],
  //   css: 'width: 120px;'
  // },
  // {
  //   type: 'label',
  //   label: i18n.global.t('label.objt.employee')
  // },
  // {
  //   type: 'popup',
  //   model: 'employeeName'
  // },
  // {
  //   type: 'label',
  //   label: i18n.global.t('label.view.status')
  // },
  // {
  //   type: 'dropdown',
  //   model: 'progressStatus',
  //   dropdownList: [],
  //   css: 'width: 120px;'
  // },
  // {
  //   type: 'label',
  //   label: i18n.global.t('label.view.customer')
  // },
  // {
  //   type: 'input',
  //   model: 'customerName',
  //   css: 'width: 100px;'
  // },
  // {
  //   type: 'popup',
  //   model: 'customerNo'
  // }
])

/* =======================================================
      6. Freeform Object
  ======================================================= */
// const showBrcSearch = ref(false)
// const showEmpSearch = ref(false)
const showCstNameSearch = ref(false)
const showCstNoSearch = ref(false)
const showAthSearch = ref(false)
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

const getPopupRowDataAth = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.authorizationNo
  if (searchParam.value.searchKeyword.value !== null) {
    search()
  }
}

const showSearchPopup = (param) => {
  if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NO') {
    showCstNoSearch.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'CUSTOMER_NAME') {
    showCstNameSearch.value = true
  } else if (param === 'searchKeyword' && searchParam.value.searchType.value === 'AUTHORIZATION_NO') {
    showAthSearch.value = true
  } else {
    switch (param) {
      case 'branchName' : showBrcSearch.value = true; break
      case 'employeeName' : showEmpSearch.value = true; break
    }
  }
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
