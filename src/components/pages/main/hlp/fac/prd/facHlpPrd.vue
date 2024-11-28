<template>
    <q-dialog v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width68" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.FacHlpPrd') }}</div>
                <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="modal_form table_search_modal">
                    <div class="search_condition_wrapper">
                            <div class="domain_search_wrapper" id="select1">
                                <CommonSelectBox :codeList="searchTypeList" v-model="searchParam.searchType.value" @update:model-value="selectChange"></CommonSelectBox>
                                <CommonSelectBox :codeList="productTypeCodeList" v-model="searchParam.searchKeyword.value"></CommonSelectBox>
                            </div>
                            <div class="domain_search_wrapper" id="select2" style="display: none;">
                                <CommonSelectBox :codeList="searchTypeList" v-model="searchParam.searchType.value" @update:model-value="selectChange"></CommonSelectBox>
                                <CommonInputBox  maxlength="100" v-model="searchParam.searchKeyword.value"></CommonInputBox>
                            </div>
                        <div class="button_box right_button_wrapper">
                          <CommonSearchButton :searchFunc="search" :useClear="false"></CommonSearchButton>
                        </div>
                    </div>
                    <div class="table_rows_wrapper">
                        <div class="rows_box" >
                            <label class="searchLabel">{{ $t('label.view.showRows') }}</label>
                            <div class="select_dropdown rows_dropdown">
                                <CommonSelectBox :codeList="fetchSizeList" v-model="searchParam.fetchSize.value"></CommonSelectBox>
                                <input type="hidden" v-model="searchParam.maxValue.value"/>
                            </div>
                        </div>
                    </div>
                    <div class="table_scroll_box">
                        <ag-grid-vue
                            class="msg_table ag-theme-balham height46"
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
import { computed, onMounted, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  disable: {
    type: Boolean,
    default: false
  }
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

const emit = defineEmits(['update:modelValue', 'selectedPopupRowData'])

const rowData = ref([])
const fetchSizeList = ref([])
const searchTypeList = ref([])
const productTypeCodeList = ref([])

const searchType = [
  { code: 'PRODUCT_TYPE', codeValue: i18n.global.t('label.objt.productType') },
  { code: 'PRODUCT_CODE', codeValue: i18n.global.t('label.objt.productCode') },
  { code: 'PRODUCT_NAME', codeValue: i18n.global.t('label.objt.productName') }
]
searchTypeList.value = searchType

const searchParam = ref({
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
    description: ''
  },
  helpSearchType: {
    value: 'FacHlpPrd',
    required: false,
    description: ''
  }
})

const showDialog = () => {
  searchParam.value.searchKeyword.value = ''
  model.value = true
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

const dialogPos = {
  x: 0,
  y: 0
}

const selectChange = (event) => {
  searchParam.value.searchKeyword.value = ''
  const select1div = document.getElementById('select1')
  const select2div = document.getElementById('select2')
  if (event === 'PRODUCT_TYPE') {
    select1div.style.display = 'flex'
    select2div.style.display = 'none'
  } else {
    select1div.style.display = 'none'
    select2div.style.display = 'flex'
  }
}

const search = () => {
  const newSearchParam = commonUtil.inputValueToJson('bsFacHlpCmmService', 'FACHLPCMM002', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        const _alertInfo = () => {
          rowData.value = []
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        rowData.value = data
      }
    })
}

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
    field: 'productType',
    headerName: i18n.global.t('label.objt.productType'),
    width: 115,
    editable: false,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(productTypeCodeList.value, params.value)
    },
    type: 'centerAligned'
  },
  {
    field: 'productCode',
    headerName: i18n.global.t('label.objt.productCode'),
    width: 115,
    editable: false
  },
  {
    field: 'accountCode',
    headerName: i18n.global.t('label.objt.accountCode'),
    width: 120,
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
    editable: false
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

ajaxUtil.getCodeList('SHOWROWS,PRODUCT_TYPE')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showrows
    productTypeCodeList.value = codeData.productType
  })

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  emit('selectedPopupRowData', selectedRows)
  model.value = false
}
/* =======================================================
  6. Init
======================================================= */
onMounted(() => {
  search()
})
</script>
