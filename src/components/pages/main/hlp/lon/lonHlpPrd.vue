<template>
    <q-dialog v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width68" :style=dragablePopupStyle>
            <q-card-section class="popup_header"  v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.lonHlpPrd') }}</div>
                <q-space />
                <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
              <div class="modal_form table_search_modal">
                <div class="search_condition_wrapper">
                  <div class="domain_search_wrapper" style="display:flex; width:100%">
                    <div style="width:20%">
                        <CommonSelectBox :codeList="searchTypeList" v-model="searchParam.searchType.value"></CommonSelectBox>
                    </div>
                    <div style="width:65%">
                        <CommonInputBox v-model="searchParam.searchKeyword.value" :disable="false"></CommonInputBox>
                    </div>
                    <div class="button_box right_button_wrapper">
                      <CommonSearchButton :searchFunc="search" :clearFunc="clear"></CommonSearchButton>
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
// import { ajaxUtil, commonUtil, messageBox, gridPropsUtil } from 'skylark-ui-lib'
import { ajaxUtil, gridPropsUtil } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'

const searchTypeList = ref([])
const fetchSizeList = ref([])
const rowCounts = ref(0)

const clear = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowData.value = []
}

const commonCodeList = reactive({
  creditLineTpcd: ref([])
})

ajaxUtil.getCodeList('LON_CREDIT_LINE_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.creditLineTpcd = codeData.lonCreditLineTypeCode
    fetchSizeList.value = codeData.showrows
  })

const searchType = [
  { code: 'PRODUCT_NAME', codeValue: i18n.global.t('label.objt.productName') },
  { code: 'PRODUCT_CODE', codeValue: i18n.global.t('label.objt.productCode') }
]
searchTypeList.value = searchType

const searchParam = ref({
  searchType: {
    value: ''
  },
  searchKeyword: {
    value: ''
  },
  searchKind: {
    value: 'ProductType'
  },
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false
  },
  allYn: {
    value: ''
  }
})

searchParam.value.searchType.value = searchTypeList.value[0].code

const props = defineProps({
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

const rowData = ref([])

const showDialog = () => {
  model.value = true
  search()
}

const search = () => {
  searchParam.value.allYn.value = 'N'
  gridPropsUtil.searchRow('bsLonOrgAplService', 'LONORGAPL022', searchParam, rowData, rowCounts)
}

const nextSearch = () => {
  searchParam.value.allYn.value = 'N'
  gridPropsUtil.nextSearchRow(gridApi.value, 'bsLonOrgAplService', 'LONORGAPL022', searchParam, rowCounts)
}

const allSearch = () => {
  searchParam.value.allYn.value = 'Y'
  gridPropsUtil.allSearchRow(gridApi.value, 'bsLonOrgAplService', 'LONORGAPL022', searchParam, rowCounts)
}

const gridApi = ref(null)
const gridColumnApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const onDragable = (evt) => {
  dialogPos.x = dialogPos.x + evt.delta.x
  dialogPos.y = dialogPos.y + evt.delta.y
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
    field: 'productCode',
    headerName: i18n.global.t('label.objt.productCode'),
    width: 150,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'productName',
    headerName: i18n.global.t('label.objt.productName'),
    width: 500,
    editable: false
  },
  {
    field: 'openDate',
    headerName: i18n.global.t('label.objt.openDate'),
    width: 100,
    editable: false
  },
  {
    field: 'closeDate',
    headerName: i18n.global.t('label.objt.closeDate'),
    width: 100,
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'creditLineTpcd',
    headerName: i18n.global.t('label.objt.creditLineTpcd'),
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.creditLineTpcd, params.value)
    },
    width: 120,
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'intRateTpcd',
    hide: true
  },
  {
    field: 'collateralYn',
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

const dragablePopupStyle = computed(() => {
  return {
    transform: `translate(${dialogPos.x}px, ${dialogPos.y}px)`
  }
})

</script>
