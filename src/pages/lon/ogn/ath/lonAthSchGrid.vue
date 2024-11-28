<template>
  <q-page-container>
      <q-page class="table_container" style="margin: 0px 30px">
          <div class="icon_button_wrapper">
              <div class="rows_box">
                  <label>{{ $t('label.view.showRows') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.fetchSizeList" v-model="searchParam.fetchSize.value"></CommonSelectBox>
                  <input type="hidden" v-model="searchParam.maxValue.value"/>
              </div>
              <div class="align_button_box">
                  <label >{{ rowCounts }} {{ $t('label.view.rows') }}</label>
                  <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
                  <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
              </div>
          </div>
          <div class="table_scroll_box">
              <ag-grid-vue
                  class="msg_table ag-theme-balham height73"
                  :rowData="rowData"
                  :columnDefs="gridProps.columnDefs(commonCodeList)"
                  :columnTypes="gridProps.columnTypes"
                  :groupDefaultExpanded="-1"
                  :defaultColDef="gridProps.defaultColDef"
                  @grid-ready="gridProps.onGridReady"
                  rowSelection="single"
                  :groupDisplayType="groupDisplayType"
                  @row-double-clicked="onRowDoubleClicked"
              ></ag-grid-vue>
          </div>
  </q-page>
  </q-page-container>
</template>

<script setup>
/* =======================================================
    Import Area
======================================================= */
import { gridProps } from './lonAthSchGridProps.vue'
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
/* =======================================================
    Global Variable
======================================================= */
const props = defineProps({
  commonCodeList: {
    default: []
  },
  searchParam: {
    default: {}
  },
  dataValue: {
    default: {}
  },
  rowCounts: {
    default: 0
  },
  rowData: {
    default: []
  },
  groupDisplayType: {
    default: 'groupRows'
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
  onRowDoubleClicked: {
    type: Function,
    /**
     *
     */
    default () {
    }
  }
})

const searchParam = ref(props.searchParam)
/* =======================================================
    Grid Function
======================================================= */

</script>
