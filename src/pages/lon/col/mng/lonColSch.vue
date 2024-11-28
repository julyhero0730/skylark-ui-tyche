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
    <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getPopupRowData4"></frmHlpCst>

    <lonColSchGrid
      :search-param="searchParam"
      :row-count="rowCount"
      :row-data="rowData"
      :next-search="nextSearch"
      :all-search="allSearch"
      :onSelectionChanged="onSelectionChanged"
      :common-code-list="commonCodeList"
    ></lonColSchGrid>
</template>
<script setup>
/*
    303010 - Collateral Search

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
import { ref, reactive, watchEffect, onMounted } from 'vue'
import { i18n } from 'boot/i18n'
import { ajaxUtil, freeformUtil, commonProp, gridPropsUtil, frmHlpCst } from 'skylark-ui-lib'
import { gridProps } from 'src/pages/lon/col/mng/lonColSchGridProps.vue'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'
import lonColSchGrid from 'src/pages/lon/col/mng/lonColSchGrid.vue'
// import { useRouter } from 'vue-router'

/* =======================================================
        2. Global Variable
    ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언

// 전역변수 선언
const session = useSessionStore()
const rowData = ref([])
const rowCount = ref(0)

/* =======================================================
      3. Common Code Adapter
  ======================================================= */
const commonCodeList = reactive({
  fetchSizeList: ref([]),
  collateralTypeCode: ref([]),
  collateralStatusCode: ref([]),
  collateralDetailTypeCode: ref([]),
  ownerRelationRTypeCode: ref([]),
  countryTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCodeList('SHOWROWS,LON_COLLATERAL_TYPE_CODE,LON_COLLATERAL_STATUS_CODE,LON_COLLATERAL_DETAIL_TYPE_CODE,LON_OWNER_RELATION_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.collateralTypeCode = [{ code: '', codeValue: i18n.global.t('label.view.all') }].concat(codeData.lonCollateralTypeCode)
    commonCodeList.collateralStatusCode = codeData.lonCollateralStatusCode
    commonCodeList.collateralDetailTypeCode = codeData.lonCollateralDetailTypeCode
    commonCodeList.ownerRelationRTypeCode = codeData.lonOwnerRelationTypeCode
    commonCodeList.fetchSizeList = codeData.showrows
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })
/* =======================================================
      4. Grid Props
  ======================================================= */
const searchParam = ref({
  collateralStatusCd: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  collateralTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  customerNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  customerName: {
    value: '',
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
    required: false
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

const topSearchPaneObject = ref([
  {
    type: 'label',
    label: i18n.global.t('label.view.customerNo')
  },
  {
    type: 'input',
    model: 'customerName',
    css: 'width: 150px;'
  },
  {
    type: 'popup',
    model: 'customerNo'
  },
  {
    type: 'label',
    label: i18n.global.t('label.objt.collateralStatus')
  },
  {
    type: 'dropdown',
    model: 'collateralStatusCd',
    dropdownList: [],
    css: 'width: 150px;'
  },
  {
    type: 'label',
    label: i18n.global.t('label.objt.collateralType')
  },
  {
    type: 'dropdown',
    model: 'collateralTpcd',
    dropdownList: [],
    css: 'width: 150px;'
  }
])
/* =======================================================
      5. Grid Function
  ======================================================= */

const clear = () => {
  searchParam.value.collateralTpcd.value = ''
  searchParam.value.collateralStatusCd.value = '01'
  searchParam.value.customerNo.value = ''
  searchParam.value.customerName.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = 0
  rowData.value = []
}

const search = () => {
  searchParam.value.maxValue.value = '0'
  gridPropsUtil.searchRow('bsLonColMngService', 'LONCOLSCH002', searchParam, rowData, rowCount)
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonColMngService', 'LONCOLSCH002', searchParam, rowCount)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonColMngService', 'LONCOLSCH002', searchParam, rowCount)
}

const onSelectionChanged = () => {
  const selectedRows = gridProps.gridApi.value.getSelectedRows()
  if (selectedRows.length > 0) {
    const collateralNo = selectedRows[0].collateralNo
    freeformUtil.selectedRowDataToFreeformData(selectedRows[0], formParam.value)
    const menuId = '303020'
    const refNo = collateralNo

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

/* =======================================================
      6. Freeform Object
  ======================================================= */
const showCstSearch = ref(false)
const selectedPopupRowData = ref([])
/* =======================================================
      7. Freeform Funtion
  ======================================================= */
const getPopupRowData4 = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.customerNo.value = selectedPopupRowData.value.customerNo
  searchParam.value.customerName.value = selectedPopupRowData.value.customerName
  search()
}

const showSearchPopup = (param) => {
  if (param === 'customerNo') {
    showCstSearch.value = true
  }
}

watchEffect(() => {
  if (commonCodeList.collateralStatusCode.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'collateralStatusCd').forEach(prop => { prop.dropdownList = commonCodeList.collateralStatusCode })
  }
  if (commonCodeList.collateralTypeCode.length > 0) {
    topSearchPaneObject.value.filter(obj => obj.model === 'collateralTpcd').forEach(prop => { prop.dropdownList = commonCodeList.collateralTypeCode })
  }
})

onMounted(() => {
  search()
})

</script>
<style scoped>
.relative-container {
   position: relative;
   display: flex;
}
</style>
