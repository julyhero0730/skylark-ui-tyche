<template>
    <q-dialog v-model="model" persistent class="popup table_search_popup opened">
        <q-card style="min-width:60%;" class="popup_inner">
            <q-card-section class="popup_header">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="text-h6">{{ $t('label.view.lonHlpAqc') }}</div>
                <q-btn flat class="popup_close_button" v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="modal_form table_search_modal">
                    <div class="table_rows_wrapper">
                      <div class="rows_box">
                            <label class="searchLabel">{{ $t('label.view.showRows') }}</label>
                            <div class="select_dropdown rows_dropdown">
                                <CommonSelectBox :codeList="fetchSizeList" v-model="searchParam.fetchSize.value" ></CommonSelectBox>
                                <input type="hidden" v-model="searchParam.maxValue.value"/>
                            </div>
                            <div class="button_box right_button_wrapper custom_search_button">
                                <q-btn flat class="button" @click="okAqc()"><img src="~/assets/images/label-label-ic-check.svg" alt /></q-btn>
                            </div>
                        </div>
                    </div>
                            <div class="table_scroll_box">
                                <ag-grid-vue
                                    style=" height: 50vh"
                                    class="msg_table ag-theme-balham"
                                    :columnDefs="gridProps.columnDefs(commonCodeList)"
                                    :columnTypes="gridProps.columnTypes"
                                    :rowData="rowData"
                                    :defaultColDef="gridProps.defaultColDef"
                                    :stopEditingWhenCellsLoseFocus="false"
                                    rowSelection="single"
                                    @grid-ready="gridProps.onGridReady"
                                    @valueGetter="cellValueGetter"
                                    @cellValueChanged="modifyAqc"
                                    :getRowStyle="getRowStyle"
                                ></ag-grid-vue>
                            </div>
                        <div class="button_box form_button_box">
                        <q-btn flat class="btn bg_deep close_button" v-close-popup :label="$t('label.view.exit')"></q-btn>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ajaxUtil, commonUtil, messageBox, gridPropsUtil } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const commonCodeList = reactive({
  lonAqcTypeCode: ref([]),
  lonAqcTypeCode2: ref([])
})

ajaxUtil.getCodeList('SHOWROWS,LON_AQC_TYPE_CODE')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showrows
    commonCodeList.lonAqcTypeCode = codeData.lonAqcTypeCode
  })

const searchRatioParam = commonUtil.inputValueToJson('bsLonAqcSchService', 'LONAQCMNG0022')
ajaxUtil.ajaxServiceData(searchRatioParam)
  .then(function (data) {
    commonCodeList.lonAqcTypeCode2 = data
  })

const props = defineProps({
  assetReferNo: {
    type: String
  },
  serialNo: {
    type: Number
  },
  organizationCode: {
    type: String
  },
  assetAmount: {
    type: Number
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

const rowData = ref([])
const fetchSizeList = ref([])

const searchParam = ref({
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
  },
  helpSearchType: {
    value: 'lonHlpApc',
    required: false,
    description: ''
  },
  assetReferNo: {
    value: '',
    required: false,
    description: ''
  },
  organizationCode: {
    value: '',
    required: false,
    description: ''
  },
  serialNo: {
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

const showDialog = () => {
  search()
  model.value = true
}

const search = () => {
  searchParam.value.assetReferNo.value = props.assetReferNo
  searchParam.value.organizationCode.value = props.organizationCode
  searchParam.value.serialNo.value = props.serialNo
  const newSearchParam = commonUtil.inputValueToJson('bsLonAqcSchService', 'LONAQCMNG0021', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        messageBox.alertInfo(i18n.global.t('msg.nodata.found')).onOk(() => {
          rowData.value = []
        })
      } else {
        rowData.value = data
      }
    })
}

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
  },
  /**
   *
   */
  columnDefs (codeList) {
    return [
      {
        headerName: '#',
        width: 45,
        colId: 0,
        valueGetter: (params) => { return params.node.rowIndex + 1 },
        type: 'centerAligned',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'assetReferNo',
        headerName: i18n.global.t('label.veiw.referenceNo'),
        width: 120,
        editable: false,
        type: 'centerAligned'
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 120,
        type: 'centerAligned'
      },
      {
        field: 'aqcTypeCode',
        headerName: i18n.global.t('label.view.classification'),
        width: 150,
        editable: false,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(commonCodeList.lonAqcTypeCode, params.value)
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'requestReserveAmount',
        headerName: i18n.global.t('label.view.requestReserveAmount'),
        type: 'rightAligned',
        valueFormatter: (params) => {
          return commonUtil.formatNumber(params.value)
        },
        width: 200
      },
      {
        field: 'allowanceRatio',
        headerName: i18n.global.t('label.view.allowanceRatio'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'finalAqcTypeCode',
        headerName: i18n.global.t('label.view.finalClassification'),
        width: 150,
        editable: true,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(commonCodeList.lonAqcTypeCode, params.value)
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: gridPropsUtil.cellEditorParams(commonCodeList.lonAqcTypeCode),
        headerComponent: CommonHeaderMark
      },
      {
        field: 'finalAllowanceRatio',
        headerName: i18n.global.t('label.view.finalAllowanceRatio'),
        width: 180,
        editable: false,
        type: 'centerAligned',
        valueGetter: (params) => { return params.data.finalAqcTypeCode },
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(commonCodeList.lonAqcTypeCode2, params.value)
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'finalRequestReserveAmount',
        headerName: i18n.global.t('label.view.finalRequestReserveAmount'),
        type: 'rightAligned',
        valueGetter: (params) => { return (Number(gridPropsUtil.lookupValue(commonCodeList.lonAqcTypeCode2, params.data.finalAqcTypeCode)) * params.data.assetAmount) / 100 },
        valueFormatter: (params) => {
          return commonUtil.formatNumber(params.value)
        },
        width: 200
      }
    ]
  }
}

const modifyAqc = () => {
  gridPropsUtil.modifyRow(gridProps.gridApi.value, gridProps.gridColumnApi.value)
}

const okAqc = () => {
  const dataRows = gridProps.gridApi.value.rowModel.rowsToDisplay.filter(v => v.data.chk === 'C' || v.data.chk === 'U' || v.data.chk === 'D')
  const datas = []

  // 필수값 validation check
  const items = []
  gridProps.gridApi.value.forEachNode((node) => {
    items.push(node.data)
  })
  for (const index in items) {
    requireParam.value.assetReferNo.value[index] = items[index].assetReferNo
    requireParam.value.serialNo.value[index] = items[index].serialNo
    requireParam.value.organizationCode.value[index] = items[index].organizationCode
    requireParam.value.finalAqcTypeCode.value[index] = items[index].finalAqcTypeCode
    requireParam.value.finalAllowanceRatio.value[index] = items[index].finalAllowanceRatio
    requireParam.value.requestReserveAmount.value[index] = items[index].requestReserveAmount
  }
  for (const index in dataRows) {
    datas.push(dataRows[index].data)
  }
  if (gridPropsUtil.gridRequiredChk(requireParam, gridProps.gridApi.value)) {
    const saveParam = commonUtil.inputValueToJson('bsLonAqcSchService', 'LONAQCMNG0091', null)
    saveParam.datas = datas
    ajaxUtil.ajaxServiceCall(saveParam)
      .then((response) => {
        messageBox.alertAjaxSuccess(response).onOk(() => {
          highlightedRow(dataRows)
        })
      })
      .catch((error) => {
        messageBox.alertAjaxError(error).onOk(() => {
        })
      })
  }
  search()
}

let highlightRows = new Set()

// 필수값 validation check
const requireParam = ref({
  assetReferNo: {
    value: [],
    required: true,
    description: ''
  },
  serialNo: {
    value: [],
    required: true,
    description: ''
  },
  organizationCode: {
    value: [],
    required: true,
    description: ''
  },
  finalAqcTypeCode: {
    value: [],
    required: true,
    description: ''
  },
  finalAllowanceRatio: {
    value: [],
    required: true,
    description: ''
  },
  requestReserveAmount: {
    value: [],
    required: true,
    description: ''
  }
})

const highlightedRow = (dataRows) => {
  // highlight 부분 수정
  highlightRows = new Set(dataRows.map(row => row.data.languageCode + '_' + row.data.sysMessageId))
  setTimeout(() => {
    highlightRows = new Set() // 일정 시간 후에 highlight 해제
    gridProps.gridApi.value.redrawRows() // 그리드의 스타일을 갱신
  }, 5000) // highlight 시간을 조정하려면 이 값을 변경
}
const getRowStyle = (params) => {
  const rowKey = params.data.languageCode + '_' + params.data.sysMessageId
  if (highlightRows.has(rowKey)) {
    return { backgroundColor: '#eec4ff' }
  }
}
</script>
