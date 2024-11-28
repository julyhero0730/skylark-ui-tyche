<template>
  <top-search-pane
      v-model="searchParam"
      :paneObject="topSearchPaneObject"
      :useSearch="true"
      :searchFunc="search"
      :useClear="true"
      :clearFunc="clear"
      @showSearchPopup="showPopup"
    ></top-search-pane>
    <frmHlpBrc v-model="showBrcSearch" @selected-popup-row-data="getBrcPopupRowData"></frmHlpBrc>
    <frmHlpEmp v-model="showEmpSearch" @selected-popup-row-data = "getEmpPopupRowData"></frmHlpEmp>
    <frmHlpCst v-model="showCstNameSearch" @selected-popup-row-data="getPopupRowDataCstName"></frmHlpCst>
    <frmHlpCst v-model="showCstNoSearch" @selected-popup-row-data="getPopupRowDataCstNo"></frmHlpCst>
    <lonHlpApc v-model="showApplicationSearch"  @selected-popup-row-data = "getApcPopupRowData"></lonHlpApc>

    <q-page-container>
        <q-page class="table_container" style="margin: 0px 30px">
          <lonOgnSchGrid
                :row-data="rowData"
                :common-code-list="commonCodeList"
                :search-param="searchParam"
                :row-counts="rowCounts"
                :next-search="nextSearch"
                :all-search="allSearch"
                >
            </lonOgnSchGrid>
    </q-page>
    </q-page-container>
</template>

<script setup>
/*

Loan Application Inquiry - 301010

 */

/* =======================================================
    1. Import Area
======================================================= */
import { reactive, ref, watch, watchEffect } from 'vue'
import { ajaxUtil, commonUtil, messageBox, gridPropsUtil, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import { gridProps } from 'src/pages/lon/ogn/apc/lonOgnSchGridProps.vue'
import { i18n } from 'boot/i18n'
import lonOgnSchGrid from 'src/pages/lon/ogn/apc/lonOgnSchGrid.vue'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'

/* =======================================================
    2. Global Variable
======================================================= */
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref(0)
const showBrcSearch = ref(false)
const showEmpSearch = ref(false)
const showCstNameSearch = ref(false)
const showCstNoSearch = ref(false)
const showApplicationSearch = ref(false)
const selectedPopupRowData = ref([])
const applicationNo = ref('')
const branchTypeList = ref([])
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
  applicationType: ref([]),
  progressStatus: ref([]),
  fundPurpose: ref([]),
  branchTypeCode: ref([]),
  employeeTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})
ajaxUtil.getCodeList('SHOWROWS, LON_APPLICATION_TYPE_CODE, LON_APL_PROGRESS_STCD, LON_FUND_PURPOSE_CODE')
  .then(function (codeData) {
    commonCodeList.fetchSizeList = codeData.showrows
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
    commonCodeList.progressStatus = codeData.lonAplProgressStcd
    commonCodeList.progressStatus.unshift({
      code: '', codeValue: i18n.global.t('label.view.all')
    })
    commonCodeList.fundPurpose = codeData.lonFundPurposeCode
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

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

const searchCriteria = [
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'APPLICATION_NO', codeValue: i18n.global.t('label.objt.applicationNo') }
]
commonCodeList.searchCriteriaList = searchCriteria

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

brListSearch()

const search = () => {
  searchParam.value.maxValue.value = '0'
  const newSearchParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowData, rowCounts)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        const _alertInfo = () => {
          rowData.value = []
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        applicationNo.value = data[0].applicationNo
        rowData.value = data
        rowCounts.value = data.length
      }
    })
}

const showPopup = (param) => {
  switch (param) {
    case 'searchKeyword' :
      if (searchParam.value.searchCriteria.value === 'CUSTOMER_NO') {
        showCstNoSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'CUSTOMER_NAME') {
        showCstNameSearch.value = true
      } else if (searchParam.value.searchCriteria.value === 'APPLICATION_NO') {
        showApplicationSearch.value = true
      }
  }
  switch (param) {
    case 'branchName' : showBrcSearch.value = true; break
    case 'employeeName' : showEmpSearch.value = true; break
  }
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

const getApcPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.searchKeyword.value = selectedPopupRowData.value.applicationNo
  search()
}

const searchParam = ref({
  helpSearchType: {
    value: 'lonHlpApc',
    initValue: 'lonHlpApc'
  },
  searchCriteria: {
    value: searchCriteria[0].code,
    required: false,
    description: i18n.global.t('label.view.searchItem')
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
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  branchName: {
    value: '',
    required: false
  },
  customerNo: {
    value: '',
    required: false
  },
  customerName: {
    value: '',
    required: false
  },
  applicationNo: {
    value: ''
  },
  applicationName: {
    value: ''
  },
  searchKeyword: {
    value: ''
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
  // freeformUtil.clear(searchParam)
  searchParam.value.branchCode.value = ''
  searchParam.value.branchName.value = ''
  // searchParam.value.customerName.value = ''
  // searchParam.value.customerNo.value = ''
  searchParam.value.employeeName.value = ''
  searchParam.value.employeeNo.value = ''
  searchParam.value.searchKeyword.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowCounts.value = 0
  rowData.value = []
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

search()

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

watchEffect(() => {
  // obj.model에 검색창 생성객체 내 해당 dropdown의 model명 입력
  // prop.dropdownList = '해당 model에 들어가야할 codeList 입력'
  if (commonCodeList.searchCriteriaList.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'searchCriteria').forEach(prop => { prop.dropdownList = commonCodeList.searchCriteriaList })
  }
})

</script>
