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
  <frmHlpBrc v-model="showBrcSearch" @selected-popup-row-data="getPopupRowData1"></frmHlpBrc>
  <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data="getCustPopupRowData"></frmHlpCst>
  <q-page-container>
    <q-page class="table_container" style="margin: 0 30px">
      <div class="table_rows_wrapper" style="margin: 0px 0px">
        <div class="rows_box">
          <label>{{ $t('label.view.showRows') }}</label>
          <div class="select_dropdown rows_dropdown">
            <CommonSelectBox :codeList="commonCodeList.fetchSizeList.value" v-model="searchParam.fetchSize.value" ></CommonSelectBox>
            <input type="hidden" v-model="searchParam.maxValue.value"/>
          </div>
          <div class="align_button_box">
            <span class="box_label">{{ rowCounts }}</span>
            <span class="box_label">{{ $t('label.view.rows') }}</span>
            <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
            <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
          </div>
        </div>
      </div>
      <div class="table_scroll_box">
        <ag-grid-vue
          class="ag-theme-balham height74"
          rowSelection="single"
          :columnDefs="gridProps.columnDefs(commonCodeList)"
          :columnTypes="gridProps.columnTypes"
          :defaultColDef="gridProps.defaultColDef"
          :rowData="rowData"
          :selected="false"
          @grid-ready="gridProps.onGridReady"
        ></ag-grid-vue>
      </div>
    </q-page>
  </q-page-container>
</template>
<script setup>
/*
      305010 - Past Due
      Index.
      1. Import Area
      2. Global Variable
      3. Common Code Adapter
      4. Grid Props
      5. Grid Function
      6. Freeform Object
      7. Freeform Funtion
      8. Business Function
      9. popup
      10. TabKey event
      11. Loading Module
  */

/* =======================================================
      1. Import Area
  ======================================================= */
import { ref, reactive, onMounted, watch } from 'vue'
import { i18n } from 'boot/i18n'
import { commonUtil, ajaxUtil, messageBox, freeformUtil, gridPropsUtil, frmHlpCst, frmHlpBrc } from 'skylark-ui-lib'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/pmg/psd/lonPmgPsdGridProps.vue'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'
/* =======================================================
      2. Global Variable
  ======================================================= */
// 전역변수 선언
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref([])
rowCounts.value = ref(0)
const showBrcSearch = ref(false)
const showCustomerSearch = ref(false)
const selectedPopupRowData = ref([])
/* =======================================================
      3. Common Code Adapter
  ======================================================= */
const commonCodeList = reactive({
  fetchSizeList: ref([])
})

ajaxUtil.getCodeList('SHOWROWS')
  .then(function (codeData) {
    commonCodeList.fetchSizeList.value = codeData.showrows
  })
/* =======================================================
      4. Grid Props
  ======================================================= */

const searchParam = ref({
  fetchSize: {
    value: 100,
    required: false,
    description: i18n.global.t('label.view.showRows')
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  branchCode: {
    value: session.sysBranchCode,
    required: true
  },
  branchName: {
    value: '',
    required: true
  },
  customerNo: {
    value: '',
    required: false
  },
  customerInfo: {
    value: '',
    required: false
  },
  customerName: {
    value: '',
    required: false
  },
  asOfDate: {
    value: dayjs(session.sysPreviousBusinessDay).format('YYYY-MM-DD'),
    required: true
  },
  asFromDate: {
    value: null,
    required: false
  },
  asToDate: {
    value: null,
    required: false
  },
  searchKeyword: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.searchItem')
  },
  manageBrcd: {
    value: '0',
    required: false
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
    css: 'width: 120px;'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.customer')
  },
  {
    type: 'popup',
    model: 'customerName',
    css: 'width: 120px;'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.asOf')
  },
  {
    type: 'calendarYmd',
    model: 'asOfDate',
    css: 'width: 160px;'
  },
  {
    type: 'label',
    label: i18n.global.t('label.view.pastdueDays')
  },
  {
    type: 'input',
    inputType: 'number',
    model: 'asFromDate',
    maxlength: '5',
    css: 'width:80px;'
  },
  {
    type: 'tilde'
  },
  {
    type: 'input',
    inputType: 'number',
    model: 'asToDate',
    maxlength: '5',
    css: 'width:80px;'
  }
])
/* =======================================================
      5. Grid Function
  ======================================================= */
ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    commonCodeList.branchNameList = codeData
    for (const index in commonCodeList.branchNameList) {
      if (commonCodeList.branchNameList[index].code === searchParam.value.branchCode.value) {
        searchParam.value.branchName.value = commonCodeList.branchNameList[index].codeValue
      }
    }
  }
  )
const clear = () => {
  searchParam.value.customerName.value = ''
  searchParam.value.customerNo.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  searchParam.value.asFromDate.value = null
  searchParam.value.asToDate.value = null
  searchParam.value.asOfDate.value = dayjs(session.sysPreviousBusinessDay).format('YYYY-MM-DD')

  rowCounts.value = 0
  rowData.value = []
  freeformUtil.clear(modelValues)
}

const pstDueHandle = () => {
  // 데이터전처리 from Date, to Date null이나 '' 일때 0으로 치환
  if (searchParam.value.asFromDate.value === '' || searchParam.value.asFromDate.value === null) {
    if ((searchParam.value.asToDate.value !== '') && (searchParam.value.asToDate.value !== null)) {
      searchParam.value.asFromDate.value = 0
    }
  }
  if (searchParam.value.asToDate.value === '' || searchParam.value.asToDate.value === null) {
    if ((searchParam.value.asFromDate.value !== '') && (searchParam.value.asFromDate.value !== null)) {
      searchParam.value.asToDate.value = 9999999
    }
  }
}

const search = () => {
  searchParam.value.maxValue.value = '0'
  const newSearchParam = commonUtil.inputValueToJson('bsLonPmgPsdService', 'LONPMGPSD002', searchParam, rowData, rowCounts)
  pstDueHandle()
  return new Promise((resolve, reject) => {
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        if (data.length === 0) {
          const _alertInfo = () => {
            rowData.value = []
            rowCounts.value = 0
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
        } else {
          rowData.value = []
          rowCounts.value = 0
          rowData.value = data
          rowCounts.value = data.length
        }
        resolve(rowData.value)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonPmgPsdService', 'LONPMGPSD002', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonPmgPsdService', 'LONPMGPSD002', searchParam, rowCounts)
}

const showPopup = (type) => {
  showBrcSearch.value = false
  showCustomerSearch.value = false

  switch (type) {
    case 'branchName' : showBrcSearch.value = true; break
    case 'customerName' : showCustomerSearch.value = true; break
  }
}

const getPopupRowData1 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.branchCode.value = selectedPopupRowData.value.branchCode
  searchParam.value.branchName.value = selectedPopupRowData.value.branchName
}

const getCustPopupRowData = (event) => {
  searchParam.value.customerNo.value = event[0].customerNo
  searchParam.value.customerName.value = event[0].customerName
}

/* =======================================================
      6. Freeform Object
  ======================================================= */

const modelValues = ref({
  currency: {
    value: '',
    initValue: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues.value.currency.value, (newVal) => {
  modelValues.value.currency.value = newVal
  searchParam.value.currencyCode.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  searchParam.value.pastduePrincipal.value = Number(newVal.replace(/,/g, ''))
})
/* =======================================================
     7. Freeform Funtion
  ======================================================= */
onMounted(() => {
  search()
})

</script>
