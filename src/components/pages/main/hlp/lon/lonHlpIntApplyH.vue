<template>
  <q-dialog v-model="model" persistent class="popup table_search_popup opened">
      <q-card class="popup_inner width68" :style=dragablePopupStyle>
          <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
              <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
              <div class="popup_title">{{ $t('label.view.interestChangeHistory') }}</div>
              <q-space />
              <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
          </q-card-section>
          <q-separator/>
          <q-card-section>
              <div class="modal_form table_search_modal">
                  <div class="search_condition_wrapper">
                      <div class="domain_search_wrapper">
                          <div>
                              <div class="relative-container d-flex items-center">
                                  <label class="form_label" style="margin: 12px">{{ $t('label.view.disbursementNo') }}</label>
                                  <CommonInputBox maxlength="10" v-model="searchParam.disbursementNo.value" disable></CommonInputBox>
                              </div>
                          </div>
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
                                  class="msg_table ag-theme-balham height47"
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
import { ajaxUtil, commonUtil, gridPropsUtil, commonProp } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  option: { type: String, required: false }
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

const searchParam = ref({
  helpSearchType: {
    value: 'lonHlpIntApplyH',
    required: false,
    description: ''
  },
  disbursementNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.disbursementNo')
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

const showDialog = () => {
  searchParam.value.disbursementNo.value = props.option
  if (props.disbursementNo !== '') {
    search()
  }
  model.value = true
}

const search = () => {
  gridPropsUtil.searchRow('bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowData, rowCounts)
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

const rowCounts = ref(0)
const gridApi = ref(null)
const gridColumnApi = ref(null)
const fetchSizeList = ref([])
const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const commonCodeList = reactive({
  branchTypeCode: ref([]),
  brcCurrencyCodeList: ref([]),
  intRateTypeCode: ref([]),
  lonPastdueCalcMethodCode: ref([]),
  lonIntRateChangeMethod: ref([])
})
ajaxUtil.getCodeList('INT_RATE_TYPE_CODE, LON_INT_RATE_CHANGE_METHOD, LON_PASTDUE_CALC_METHOD_CODE,SHOWROWS')
  .then(function (codeData) {
    commonCodeList.intRateTypeCode = codeData.intRateTypeCode
    commonCodeList.lonPastdueCalcMethodCode = codeData.lonPastdueCalcMethodCode
    commonCodeList.lonIntRateChangeMethod = codeData.lonIntRateChangeMethod
    fetchSizeList.value = codeData.showrows
  })
ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })
ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })
const columnDefs = [
  {
    headerName: '#',
    width: 40,
    colId: 0,
    valueGetter: (params) => { return params.node.rowIndex + 1 },
    type: 'centerAligned',
    headerComponent: CommonHeaderMark,
    pinned: 'left'
  },
  {
    field: 'applyDate',
    headerName: i18n.global.t('label.view.applyDate'),
    width: 90,
    editable: false,
    cellRenderer: (params) => {
      return dayjs(params.value).format(commonProp.dateformat.dateType)
    },
    type: 'centerAligned',
    headerComponent: CommonHeaderMark,
    pinned: 'left'
  },
  {
    field: 'currencyCode',
    headerName: i18n.global.t('label.view.ccy'),
    width: 50,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.countryTypeCode, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark,
    pinned: 'left'
  },
  {
    field: 'disbursementAmt',
    headerName: i18n.global.t('label.view.disbursementAmt'),
    type: 'rightAligned',
    width: 100,
    // valueFormatter: (params) => {
    //   const roundFactorUsed = false
    //   return commonUtil.balanceFormatter(params, params.data.currencyCode, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    // },
    valueFormatter: (params) => {
      return commonUtil.formatNumber(params.value)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(params.data.currencyCode, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    headerComponent: CommonHeaderMark,
    pinned: 'left'
  },
  {
    field: 'maturityDate',
    headerName: i18n.global.t('label.objt.maturityDate'),
    width: 100,
    editable: false,
    cellRenderer: (params) => {
      return dayjs(params.value).format(commonProp.dateformat.dateType)
    },
    type: 'centerAligned',
    headerComponent: CommonHeaderMark,
    pinned: 'left'
  },
  {
    field: 'intRateTpcd',
    headerName: i18n.global.t('label.objt.intRateTpcd'),
    width: 125,
    editable: false,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.intRateTypeCode, params.value)
    },
    type: 'centerAligned',
    headerComponent: CommonHeaderMark
  },
  {
    field: 'baseRateCode',
    headerName: i18n.global.t('label.objt.baseRateCd'),
    width: 110,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'rateChangeCode',
    headerName: i18n.global.t('label.view.rateChangeMethod'),
    width: 140,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.lonIntRateChangeMethod, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'interestRate',
    headerName: i18n.global.t('label.view.baseRateSpreadRate'),
    width: 180,
    type: 'centerAligned',
    // valueFormatter: (params) => params.data.spreadRate.toFixed(5) + ' %',
    valueGetter: params => `${params.data.baseRate.toFixed(5)}%  /  ${params.data.spreadRate.toFixed(5)}%`,
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'pastDueCalCode',
    headerName: i18n.global.t('label.view.pastDueCalcMethod'),
    width: 150,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.lonPastdueCalcMethodCode, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'pastdueInterestRate',
    headerName: i18n.global.t('label.view.pastDueSpreadRate'),
    width: 180,
    type: 'centerAligned',
    // valueFormatter: (params) => params.data.pastdueInterestRate.toFixed(5) + ' %',
    valueGetter: params => `${params.data.pastdueSpread.toFixed(5)}%  /  ${params.data.pastdueInterestRate.toFixed(5)}%`,
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'historyRmk',
    headerName: i18n.global.t('label.view.remark'),
    width: 250,
    cellEditorParams: {
      maxLength: 100
    }
  },
  {
    field: 'updateDatetime',
    headerName: i18n.global.t('label.objt.updateDatetime'),
    width: 120,
    type: 'centerAligned',
    editable: false,
    cellRenderer: (params) => {
      return dayjs(params.value).format(commonProp.dateformat.dateTimeTypeMm)
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'employeeNo',
    headerName: i18n.global.t('label.objt.employeeNo'),
    width: 120,
    hide: true,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'employeeName',
    headerName: i18n.global.t('label.objt.employeeName'),
    width: 110,
    type: 'centerAligned',
    editable: false,
    headerComponent: CommonHeaderMark
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
<style scoped>
.relative-container {
 position: relative;
}
.custom_search_button {
position: relative;
transform: translateY(36%);
}
</style>
