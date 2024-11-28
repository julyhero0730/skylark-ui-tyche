<template>
  <div>
                <div class="icon_button_wrapper">
                    <div class="rows_box">
                        <label>{{ $t('label.view.showRows') }}</label>
                        <CommonSelectBox :codeList="commonCodeList.fetchSizeList.value" v-model="searchParam.fetchSize.value"></CommonSelectBox>
                        <input type="hidden" v-model="searchParam.maxValue.value"/>
                    </div>
                    <div class="align_button_box">
                        <span class="box_label">{{ rowCounts }}</span>
                        <span class="box_label">{{ $t('label.view.rows') }}</span>
                        <q-btn flat class="button" @click="nextSearch()"><img src="~/assets/images/form-btn-dnarrow-11.svg" alt /></q-btn>
                        <q-btn flat class="button" @click="allSearch()"><img src="~/assets/images/form-btn-dnarrow-22.svg" alt /></q-btn>
                    </div>
                </div>
                <div class="table_scroll_box width100">
                      <ag-grid-vue
                          class="msg_table ag-theme-balham height74"
                          rowSelection="single"
                          :columnDefs="gridProps.columnDefs(commonCodeList)"
                          :columnTypes="gridProps.columnTypes"
                          :defaultColDef="gridProps.defaultColDef"
                          :rowData="rowData"
                          :selected="false"
                          @grid-ready="gridProps.onGridReady"
                          @selection-changed="onSelectionChanged"
                      ></ag-grid-vue>
                </div>
            </div>
</template>
<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/col/mng/lonColPlgGridProps.vue'

/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  searchParam: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  rowData: {
    default: []
  },
  rowCounts: {
    default: []
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
  onSelectionChanged: {
    type: Function,
    /**
     *
     */
    default () {
    }
  }

})
/* =======================================================
    Freeform Object
  ======================================================= */
const searchParam = ref(props.searchParam)

/* =======================================================
    Freeform Funtion
======================================================= */
</script>
