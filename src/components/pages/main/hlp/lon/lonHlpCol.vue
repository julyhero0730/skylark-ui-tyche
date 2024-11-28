<template>
    <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width69" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.lonHlpCol') }}</div>
                <q-space />
                <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button"></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="modal_form table_search_modal">
                    <div class="search_condition_wrapper">
                        <div class="domain_search_wrapper">
                            <CommonSelectBox :codeList="searchTypeList" v-model="searchParam.searchType.value" @update:model-value="selectChange"></CommonSelectBox>
                            <CommonInputBox maxlength="100" v-model="searchParam.searchKeyword.value"></CommonInputBox>
                        </div>
                        <div class="button_box right_button_wrapper">
                            <CommonSearchButton :searchFunc="search" :useClear="false"></CommonSearchButton>
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
                                    :rowData="rowData"
                                    :defaultColDef="defaultColDef"
                                    :stopEditingWhenCellsLoseFocus="false"
                                    rowSelection="single"
                                    @grid-ready="onGridReady"
                                    @rowDoubleClicked="onRowDoubleClicked"
                                ></ag-grid-vue>
                            </div>
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
import { ajaxUtil, gridPropsUtil, commonUtil } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'

const commonCodeList = reactive({
  collateralTypeCode: ref([]),
  collateralStatusCode: ref([]),
  lonOwnerRelationTypeCode: ref([])
})

ajaxUtil.getCodeList('LON_COLLATERAL_TYPE_CODE,LON_COLLATERAL_STATUS_CODE,SHOWROWS,LON_OWNER_RELATION_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.collateralTypeCode = codeData.lonCollateralTypeCode
    commonCodeList.collateralStatusCode = codeData.lonCollateralStatusCode
    fetchSizeList.value = codeData.showrows
    commonCodeList.lonOwnerRelationTypeCode = codeData.lonOwnerRelationTypeCode
  })

const props = defineProps({
  customerNo: {
    type: String
  },
  collateralStatusCd: {
    type: String
  },
  modelValue: { type: Boolean, required: true }
})

const model = computed({
  get () {
    if (props.modelValue) {
      showDialog()
    }
    return props.modelValue
  },
  set (newValue) {
    emit('update:modelValue', newValue)
  }
})

const dialogPos = {
  x: 0,
  y: 0
}

const emit = defineEmits(['update:modelValue', 'selectedPopupRowData'])

const rowCounts = ref(0)
const rowData = ref([])
const fetchSizeList = ref([])
const searchTypeList = ref([])

const searchType = [
  { code: 'CUSTOMER_NAME', codeValue: i18n.global.t('label.objt.customerName') },
  { code: 'CUSTOMER_NO', codeValue: i18n.global.t('label.view.customerNo') },
  { code: 'COLLATERAL_TITLE_NAME', codeValue: i18n.global.t('label.objt.collateralTitle') },
  { code: 'COLLATERAL_NO', codeValue: i18n.global.t('label.objt.collateralNo') }
]
searchTypeList.value = searchType

const searchParam = ref({
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
  collateralStatusCd: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.collateralStatus')
  },
  fetchSize: {
    value: 100,
    required: false,
    description: i18n.global.t('label.view.showRows')
  },
  maxValue: {
    value: '0',
    required: false
  },
  helpSearchType: {
    value: 'lonHlpCol',
    required: false,
    description: ''
  }
})

const gridApi = ref(null)
const gridColumnApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const columnDefs = [
  {
    headerName: '#',
    width: 50,
    colId: 0,
    valueGetter: (params) => { return params.node.rowIndex + 1 },
    type: 'centerAligned'
  },
  {
    field: 'collateralNo',
    headerName: i18n.global.t('label.objt.collateralNo'),
    width: 115,
    editable: false
  },
  {
    field: 'collateralTitleName',
    headerName: i18n.global.t('label.objt.collateralTitle'),
    width: 136,
    editable: false
  },
  {
    field: 'customerNo',
    headerName: i18n.global.t('label.view.customerNo'),
    width: 115,
    editable: false
  },
  {
    field: 'customerName',
    headerName: i18n.global.t('label.objt.customerName'),
    width: 136,
    editable: false
  },
  {
    field: 'ownerRelationTpcd',
    headerName: i18n.global.t('label.objt.ownerRelationType'),
    width: 160,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.lonOwnerRelationTypeCode, params.value)
    },
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'colOwnerName',
    headerName: i18n.global.t('label.objt.collateralOwner'),
    width: 136,
    editable: false
  },
  {
    field: 'collateralTpcd',
    headerName: i18n.global.t('label.objt.collateralType'),
    width: 125,
    editable: false,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.collateralTypeCode, params.value)
    }
  },
  {
    field: 'collateralStatusCd',
    headerName: i18n.global.t('label.objt.collateralStatus'),
    width: 130,
    editable: false,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.collateralStatusCode, params.value)
    }
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
    field: 'registerDate',
    hide: true
  },
  {
    field: 'releaseDate',
    hide: true
  },
  {
    field: 'expireDate',
    hide: true
  },
  {
    field: 'colOwnerNo',
    hide: true
  },
  {
    field: 'ccycdMarket',
    hide: true
  },
  {
    field: 'marketAmt',
    hide: true
  },
  {
    field: 'appraisalTypeCode',
    hide: true
  },
  {
    field: 'appraisalInstitutionNm',
    hide: true
  },
  {
    field: 'appraisalDate',
    hide: true
  },
  {
    field: 'currencyCode',
    hide: true
  },
  {
    field: 'appraisalAmt',
    hide: true
  },
  {
    field: 'rmk',
    hide: true
  },
  {
    field: 'collateralDetailCd',
    hide: true
  },
  {
    field: 'quantitySize',
    hide: true
  },
  {
    field: 'unitName',
    hide: true
  },
  {
    field: 'countryCode',
    hide: true
  },
  {
    field: 'locationCode',
    hide: true
  },
  {
    field: 'collateralAddr',
    hide: true
  },
  {
    field: 'makerName',
    hide: true
  },
  {
    field: 'licensePlateNo',
    hide: true
  },
  {
    field: 'purchaseDate',
    hide: true
  },
  {
    field: 'ccycdPurchase',
    hide: true
  },
  {
    field: 'purchasePrice',
    hide: true
  },
  {
    field: 'productYear',
    hide: true
  },
  {
    field: 'modelNm',
    hide: true
  },
  {
    field: 'referenceNo',
    hide: true
  },
  {
    field: 'additionalInfo',
    hide: true
  },
  {
    field: 'issueNm',
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

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  emit('selectedPopupRowData', selectedRows)
  model.value = false
}

const selectChange = () => {
  searchParam.value.searchKeyword.value = ''
}

const showDialog = () => {
  searchParam.value.searchKeyword.value = ''
  if (!commonUtil.isEmpty(props.customerNo)) {
    searchParam.value.searchType.value = searchType[1].code
    searchParam.value.searchKeyword.value = props.customerNo
    searchParam.value.collateralStatusCd.value = props.collateralStatusCd
    search()
  }
  model.value = true
}

// const search = () => {
//   const newSearchParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', searchParam)
//   ajaxUtil.ajaxServiceData(newSearchParam)
//     .then(function (data) {
//       if (data.length === 0) {
//         // messageBox.alertInfo(i18n.global.t('msg.nodata.found')).onOk(() => {
//         //   rowData.value = []
//         // })
//       } else {
//         rowData.value = data
//       }
//     })
// }

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
