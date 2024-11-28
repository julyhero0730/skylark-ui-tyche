<template>
  <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
      <q-card class="popup_inner width69" :style=dragablePopupStyle>
          <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
              <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
              <div class="popup_title">{{ $t('label.view.hlpLonGua') }}</div>
              <q-space />
              <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <div class="modal_form table_search_modal">
              <div class="search_condition_wrapper">
                <div class="domain_search_wrapper width100">
                  <div style="display: flex; align-items: center;">
                    <label class="form_label" style="margin-bottom: 0px;">{{ $t('label.view.searchCriteria') }}</label>
                  </div>
                  <div style="margin-right: 10px;">
                      <CommonSelectBox @update:model-value="selectChange" :codeList="commonCodeList.searchCriteria" v-model="searchParam.searchCriteria.value"></CommonSelectBox>
                  </div>
                  <div>
                    <div style=" display: flex; align-items: center;">
                      <!-- 최초 HELP OPEN(Search Criteria 빈값일때) - 기능X 디자인용 -->
                        <template v-if="searchParam.searchCriteria.value === ''">
                          <CommonDirectSearchBox :disable="true"></commonDirectSearchBox>&nbsp;&nbsp;
                          <q-icon name="search" size="sm" style="margin:0 10px 0 -35px;" class="help_button_simple"/>
                        </template>
                        <template v-if="searchParam.searchCriteria.value === 'GUARANTOR_CUSTOMER'">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.searchKeyword.value" hlpType="frmHlpCst" :searchCode="searchParam.searchKeyword.value" @keyup.enter="getCstEnterSearch" @directSearchVal="getCstDirectSearch"></commonDirectSearchBox>&nbsp;&nbsp;
                        </template>

                        <template v-if="searchParam.searchCriteria.value === 'LOAN_CUSTOMER'">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.searchKeyword.value" hlpType="frmHlpCst" :searchCode="searchParam.searchKeyword.value" @keyup.enter="getCstNmEnterSearch" @directSearchVal="getCstDirectSearch"></commonDirectSearchBox>&nbsp;&nbsp;
                        </template>

                        <template v-if="searchParam.searchCriteria.value === 'GUANTEE_NO'">
                          <CommonDirectSearchBox maxlength="30" v-model="searchParam.searchKeyword.value" hlpType="lonHlpGua" :searchCode="searchParam.searchKeyword.value" @keyup.enter="getGuaEnterSearch" @directSearchVal="getGuaDirectSearch"></commonDirectSearchBox>
                          <q-icon name="search" size="sm" style="margin:0 10px 0 -35px;" class="help_button_simple"/>
                        </template>

                        <template v-if="searchParam.searchCriteria.value !== 'GUANTEE_NO' && searchParam.searchCriteria.value !== ''">
                          <q-icon name="search" size="sm" style="margin:0 10px 0 -35px;" class="help_button_simple" @click="showPopup('cust')" />
                          <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data = "getCustPopupRowData"></frmHlpCst>
                          <!-- <CommonInputBox maxlength="30" v-model="searchParam.customerName.value" :disable="true"></CommonInputBox> -->
                        </template>
                    </div>
                  </div>
                  <div class="button_box right_button_wrapper custom_search_button">
                          <CommonSearchButton  :clearFunc="clear" :searchFunc="search"></CommonSearchButton>
                      </div>
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
import { ajaxUtil, commonUtil, gridPropsUtil, frmHlpCst } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'

const clear = () => {
  searchParam.value.searchCriteria.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = '0'
  rowData.value = []
}

const showCustomerSearch = ref(false)
const isCalendarOpen = ref(false)

const commonCodeList = reactive({
  searchCriteria: ref([]),
  applicationType: ref([]),
  countryTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

const searchCriteriaHlp = [
  { code: 'GUARANTOR_CUSTOMER', codeValue: i18n.global.t('label.objt.guarantorCustomer') },
  { code: 'LOAN_CUSTOMER', codeValue: i18n.global.t('label.view.loanCustomer') },
  { code: 'GUANTEE_NO', codeValue: i18n.global.t('label.objt.guaranteeNo') }
]
commonCodeList.searchCriteria = searchCriteriaHlp

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

const showPopup = (type) => {
  showCustomerSearch.value = false

  switch (type) {
    case 'cust' : showCustomerSearch.value = true; break
  }
  isCalendarOpen.value = true
}
const getCustPopupRowData = (event) => {
  searchParam.value.searchKeyword.value = event[0].customerNo
  searchParam.value.customerName.value = event[0].customerName
  search()
}

const props = defineProps({
  customerNo: {
    type: String
  },
  customerName: {
    type: String
  },
  searchCriteria: {
    default: ''
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
  searchType: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchType')
  },
  guarantorNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeNo')
  },
  guarantorName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeName')
  },
  searchCriteria: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchCriteria')
  },
  customerNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.customerNo')
  },
  customerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.customerName')
  },
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  helpSearchType: {
    value: 'lonHlpGua',
    required: false
  }
})

const closePopup = () => {
  clear()
}

const getCstDirectSearch = (event) => {
  if (event !== '') {
    searchParam.value.searchKeyword.value = event.customerNo
    searchParam.value.customerName.value = event.customerName
    search()
  } else {
    searchParam.value.customerName.value = ''
    rowData.value = []
  }
}

const getGuaDirectSearch = (event) => {
  if (event !== '') {
    rowData.value = []
    rowData.value.push(event)
  } else {
    rowData.value = []
  }
}

const getCstEnterSearch = () => {
  searchParam.value.searchType.value = 'CUSTOMER_NO'
  search()
}
const getCstNmEnterSearch = () => {
  searchParam.value.searchType.value = 'CUSTOMER_NAMW'
  search()
}
const getGuaEnterSearch = () => {
  search()
}

const selectChange = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.customerName.value = ''
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
    field: 'guaranteeNo',
    headerName: i18n.global.t('label.objt.guaranteeNo'),
    width: 150,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'guaranteeStatusNm',
    headerName: i18n.global.t('label.frb.status'),
    width: 150,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'guarantorNo',
    headerName: i18n.global.t('label.objt.guarantorNo'),
    width: 120,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'guarantorName',
    headerName: i18n.global.t('label.objt.guarantorName'),
    width: 200,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'customerNo',
    headerName: i18n.global.t('label.objt.borrowerNo'),
    width: 120,
    type: 'centerAligned',
    editable: false

  },
  {
    field: 'customerName',
    headerName: i18n.global.t('label.objt.borrower'),
    width: 200,
    type: 'centerAligned',
    editable: false

  },
  {
    field: 'borrowerRelation',
    headerName: i18n.global.t('label.objt.relationCustomer'),
    width: 150,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'guaranteeTypeNm',
    headerName: i18n.global.t('label.objt.guaranteeType'),
    width: 150,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'currencyCode',
    headerName: i18n.global.t('label.view.ccy'),
    width: 70,
    type: 'centerAligned',
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.countryTypeCode, params.value)
    },
    editable: false
  },
  {
    field: 'totalGuaranteeAmt',
    headerName: i18n.global.t('label.objt.guaranteeAmount'),
    width: 150,
    editable: false,
    cellEditor: 'agNumberCellEditor',
    type: 'rightAligned',
    valueFormatter: (params) => {
      if (params.data && params.data.currencyCode) {
        const roundFactorUsed = false
        return commonUtil.balanceFormatter(params, params.data.currencyCode, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
      }
    },
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(params.data.currencyCode, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    },
    cellRenderer: (params) => {
      const roundFactorUsed = false
      return params.value ? commonUtil.balanceFormatter(params, params.data.currencyCode, commonCodeList.brcCurrencyCodeList, roundFactorUsed) : ''
    }
  },
  {
    field: 'cnt',
    headerName: i18n.global.t('label.objt.guaranteeCnt'),
    width: 150,
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'manageBrcd',
    headerName: i18n.global.t('label.objt.manageBranch'),
    width: 150,
    type: 'centerAligned',
    editable: false
  },
  {
    field: 'maxValue',
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

ajaxUtil.getCodeList('SHOWROWS')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showrows
  })

const onRowDoubleClicked = () => {
  const selectedRows = gridApi.value.getSelectedRows()
  emit('selectedPopupRowData', selectedRows)
  model.value = false
}

const showDialog = () => {
  if (props.customerNo !== '') {
    searchParam.value.searchKeyword.value = props.customerNo
    searchParam.value.customerName.value = props.customerName
    searchParam.value.searchCriteria.value = props.searchCriteria
  }
  search()
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
transform: translateY(20%);
}
</style>
