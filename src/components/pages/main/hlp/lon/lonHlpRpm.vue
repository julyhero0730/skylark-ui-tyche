<template>
    <q-dialog v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width69" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.lonHlpRpm') }}</div>
                <q-space />
                <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="modal_form table_search_modal">
                    <div class="search_condition_wrapper">
                        <div class="domain_search_wrapper">
                            <div>
                                <label class="form_label">{{ $t('label.view.disbursementNo') }}</label>
                                <div class="relative-container d-flex items-center">
                                    <CommonInputBox maxlength="10" v-model="searchParam.disbursementNo.value" :disable="cdDisable"></CommonInputBox>
                                    <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="showDbsSearchPopup()" />
                                    <lonHlpDbs v-model="showDbsSearch" @selected-popup-row-data = "getPopupRowData"></lonHlpDbs>
                                </div>
                            </div>
                        </div>
                        <div class="button_box right_button_wrapper custom_search_button">
                            <CommonSearchButton  :clearFunc="clear" :searchFunc="search"></CommonSearchButton>
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
                        <div class="button_box form_button_box">
                        <q-btn flat class="btn bg_deep close_button" @click="okButtonClicked" :label="$t('label.view.ok')"></q-btn>
                        <q-btn flat class="btn bg_deep close_button" v-close-popup :label="$t('label.view.exit')"></q-btn>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ajaxUtil, commonUtil, gridPropsUtil, messageBox, commonProp } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import dayjs from 'dayjs'
import lonHlpDbs from 'src/components/pages/main/hlp/lon/lonHlpDbs.vue'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const clear = () => {
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  searchParam.value.disbursementNo.value = ''
  rowData.value = []
}

const commonCodeList = reactive({
  brcCurrencyCodeList: ref([])

})
ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

const props = defineProps({
  disbursementNo: {
    type: String
  },
  currencyCode: {
    type: String
  },
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

const rowCounts = ref(0)
const rowData = ref([])
const fetchSizeList = ref([])

const searchParam = ref({
  searchKeyword: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  disbursementNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  currencyCode: {
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
  helpSearchType: {
    value: 'lonHlpRpm',
    required: false,
    description: ''
  },
  allYn: {
    value: ''
  }
})

const showDialog = () => {
  searchParam.value.searchKeyword.value = ''
  if (props.disbursementNo !== '') {
    searchParam.value.disbursementNo.value = props.disbursementNo
    searchParam.value.currencyCode.value = props.currencyCode
  }
  search()
  model.value = true
}

const search = () => {
  searchParam.value.allYn.value = 'N'
  gridPropsUtil.searchRow('bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowData, rowCounts)
}

const nextSearch = () => {
  searchParam.value.allYn.value = 'N'
  gridPropsUtil.nextSearchRow(gridApi.value, 'bsLonHlpCmmService', 'LONHLPCMM002', searchParam, rowCounts)
}

const allSearch = () => {
  searchParam.value.allYn.value = 'Y'
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

const gridApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
}

const columnDefs = [
  {
    headerName: '#',
    width: 47,
    valueGetter: (params) => { return params.node.rowIndex + 1 },
    type: 'centerAligned',
    headerComponent: CommonHeaderMark
  },
  {
    field: 'scheduleDate',
    headerName: i18n.global.t('label.view.scheduleDate'),
    width: 130,
    editable: false,
    type: 'centerAligned',
    cellRenderer: (params) => {
      return dayjs(params.value).format(commonProp.dateformat.dateType)
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'schdPrincipalAmt',
    headerName: i18n.global.t('label.view.scheduleAmount'),
    width: 140,
    type: 'rightAligned',
    valueGetter: (params) => {
      const schdPrincipalAmt = Number(params.data.schdPrincipalAmt) || 0
      return schdPrincipalAmt
    },
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'schdIntAmt',
    headerName: i18n.global.t('label.view.scheduleInt'),
    width: 120,
    type: 'rightAligned',
    editable: false,
    valueGetter: (params) => {
      const schdIntAmt = Number(params.data.schdIntAmt) || 0
      return schdIntAmt
    },
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'totalAmt',
    headerName: i18n.global.t('label.view.totalAmt'),
    width: 130,
    editable: false,
    valueGetter: (params) => {
      const schdPrincipalAmt = Number(params.data.schdPrincipalAmt)
      const schdIntAmt = Number(params.data.schdIntAmt)
      const totalAmt = schdPrincipalAmt + schdIntAmt
      return totalAmt
    },
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    type: 'rightAligned',
    headerComponent: CommonHeaderMark
  },
  {
    field: 'rpmtPrincipalAmt',
    headerName: i18n.global.t('label.view.repaidPrincipal'),
    width: 120,
    type: 'rightAligned',
    editable: false,
    valueGetter: (params) => {
      const rpmtPrincipalAmt = Number(params.data.rpmtPrincipalAmt) || 0
      return rpmtPrincipalAmt
    },
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'rpmtIntAmt',
    headerName: i18n.global.t('label.view.repaidInt'),
    width: 120,
    type: 'rightAligned',
    editable: false,
    valueGetter: (params) => {
      const rpmtIntAmt = Number(params.data.rpmtIntAmt) || 0
      return rpmtIntAmt
    },
    valueFormatter: (params) => {
      if (params.data.rpmtIntAmt === undefined || params.data.rpmtIntAmt === null || params.data.rpmtIntAmt === '') {
        params.data.rpmtIntAmt = 0
      }
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'remainingPrincipal',
    headerName: i18n.global.t('label.view.remainedAmount'),
    width: 146,
    type: 'rightAligned',
    valueGetter: (params) => {
      const schdPrincipalAmt = Number(params.data.schdPrincipalAmt) || 0
      const rpmtPrincipalAmt = Number(params.data.rpmtPrincipalAmt) || 0
      const remainingPrincipal = schdPrincipalAmt - rpmtPrincipalAmt
      return remainingPrincipal
    },
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'remainingInt',
    headerName: i18n.global.t('label.view.remainedInt'),
    type: 'rightAligned',
    width: 140,
    valueGetter: (params) => {
      const schdIntAmt = Number(params.data.schdIntAmt) || 0
      const rpmtIntAmt = Number(params.data.rpmtIntAmt) || 0
      const remainingInt = schdIntAmt - rpmtIntAmt
      return remainingInt
    },
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(searchParam.value.currencyCode.value, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
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

ajaxUtil.getCodeList('SHOWROWS')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showrows
  })

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows.length > 0) {
    const selectedRow = selectedRows[0]
    // remainingPrincipal 및 remainingInt 값이 0이 아닌지 확인
    if (selectedRow.schdPrincipalAmt - selectedRow.rpmtPrincipalAmt !== 0 || selectedRow.schdIntAmt - selectedRow.rpmtIntAmt !== 0) {
      emit('selectedPopupRowData', selectedRows)
      model.value = false
    } else {
      // 선택되지 않도록 알림 표시
      messageBox.alertInfo('This schedule has already been repaid.')
    }
  }
}

const okButtonClicked = () => {
  onRowDoubleClicked()
}

const showDbsSearch = ref(false)
const selectedPopupRowData = ref([])

const getPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.disbursementNo.value = selectedPopupRowData.value.disbursementNo
}

const showDbsSearchPopup = () => {
  showDbsSearch.value = true
}

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
