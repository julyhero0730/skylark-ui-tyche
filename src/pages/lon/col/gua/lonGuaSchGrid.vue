<template>
  <div class="icon_button_wrapper">
                  <div class="rows_box" style="flex: 1;">
                      <label>{{ $t('label.view.showRows') }}</label>
                      <CommonSelectBox :codeList="commonCodeList.fetchSizeList" v-model="searchParam.fetchSize.value"></CommonSelectBox>
                      <input type="hidden" v-model="searchParam.maxValue.value"/>
                  </div>
                    <div class="radios-wrapper" style="display: flex; flex: 1;">
                        <div class="radio-wrapper" style="margin-right: 70px;">
                            <q-radio @update:model-value="radioHandleChange" v-model="searchParam.transactionStatusCd.value" val="01"/>
                            <label class="radio-wrapper">{{ $t('label.objt.registration') }}</label>
                        </div>
                        <div class="radio-wrapper" style="margin-right: 70px;">
                            <q-radio @update:model-value="radioHandleChange" v-model="searchParam.transactionStatusCd.value" val="02"/>
                            <label class="radio-wrapper">{{ $t('label.view.contract') }}</label>
                        </div>
                        <div class="radio-wrapper">
                            <q-radio @update:model-value="radioHandleChange" v-model="searchParam.transactionStatusCd.value" val="05"/>
                            <label class="radio-wrapper">{{ $t('label.objt.release') }}</label>
                        </div>
                    </div>
                    <div style="flex: 1;"></div>
                  <div class="align_button_box">
                      <label >{{ rowCounts }} {{ $t('label.view.rows') }}</label>
                      <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
                      <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
                  </div>
              </div>
              <div class="table_scroll_box width100">
                  <ag-grid-vue
                      class="msg_table ag-theme-balham height74"
                      :rowData="rowData"
                      :columnDefs="gridProps.columnDefs(commonCodeList)"
                      :columnTypes="gridProps.columnTypes"
                      :defaultColDef="gridProps.defaultColDef"
                      @grid-ready="gridProps.onGridReady"
                      rowSelection="single"
                      @row-double-clicked="onSelectionChanged"
                  ></ag-grid-vue>
              </div>
  </template>

<script setup>
/* =======================================================
      Import Area
  ======================================================= */
import { ref } from 'vue'
import { freeformUtil } from 'skylark-ui-lib'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/col/gua/lonGuaSchGridProps.vue'

/* =======================================================
      Global Variable
  ======================================================= */
const props = defineProps({
  rowData: {
    default: []
  },
  commonCodeList: {
    default: []
  },
  searchParam: {
    default: {}
  },
  rowCounts: {
    default: 0
  },
  search: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  nextSearch: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  allSearch: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  radioHandleChange: {
    type: Function,
    /**
       *
       */
    default () {
    }
  }
})
const formParam = ref({
  guaranteeNo: {
    value: ''
  }
})
const searchParam = ref(props.searchParam)

/* =======================================================
      Grid Function
  ======================================================= */

const onSelectionChanged = () => {
  const selectedRows = gridProps.gridApi.value.getSelectedRows()
  if (selectedRows.length > 0) {
    freeformUtil.selectedRowDataToFreeformData(selectedRows[0], formParam.value)
    const menuId = '303050'
    const refNo = selectedRows[0].guaranteeNo

    window.top.postMessage({
      e: 'openTabMenu',
      params: {
        menuId,
        refNo,
        timestamp: new Date().getTime() // 현재 시간의 타임스탬프 추가
      }
    })
  }
}
</script>
<style scope>
  /* .icon_button_wrapper .radio_box {
    display: flex;
    align-items: center;
    gap: 4px;
    position: absolute;
    right: 50%;
    bottom: 0;
  } */
</style>
