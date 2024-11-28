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
                    <label >{{ props.rowCounts }} {{ $t('label.view.rows') }}</label>
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
    </q-page>
    </q-page-container>
</template>

<script setup>
/* =======================================================
    1. Import Area
======================================================= */
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/ogn/cnt/lonCntSchGrudProps.vue'
import { ref } from 'vue'
/* =======================================================
    Global Variable
======================================================= */
const props = defineProps({
  searchParam: {
    default: {}
  },
  rowCounts: {
    default: '0'
  },
  rowData: {
    default: []
  },
  commonCodeList: {
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

const searchParam = ref(props.searchParam)

/* =======================================================
    Function
======================================================= */

</script>
