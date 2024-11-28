<template>
<div class="scrollable-container height70 q-pr-md">
  <section class="box-section">
    <div class="triple_box">
      <div>
        <label class="form_label is_required">{{ $t('label.view.customer') }}</label>
        <div class="form_customer">
          <CommonDirectSearchBox class="width37" maxlength="30" v-model="applicantsSearchResult.customerNo.value" :readonly="true" :disable=disableFlag ref="customerNo" hlpType="frmHlpCst" :searchCode="formParam.customerNo.value" @directSearchVal="getCstDirectSearch"></CommonDirectSearchBox>
          <CommonInputBox class="width61" maxlength="30" v-model="applicantsSearchResult.customerName.value" :readonly="true" :disable=disableFlag ref="customerName"></CommonInputBox>
          <button type="button" class="help_button_simple" @click="showPopup('cust')">
            <q-icon name="search" size="sm" />
          </button>
          <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data = "getCstPopupRowData"></frmHlpCst>
        </div>
      </div>
      <div>
        <label class="form_label">{{ $t('label.objt.customerTypeCode') }}</label>
        <CommonSelectBox :codeList="commonCodeList.customerTypeCode" v-model="applicantsSearchResult.customerType.value" :readonly="true" :disable=disableFlag></CommonSelectBox>
      </div>
      <div>
        <label class="form_label">{{ $t('label.view.customerDetailType') }}</label>
        <CommonSelectBox :codeList="commonCodeList.customerDetailTypeCode" v-model="applicantsSearchResult.customerDetailType.value" :readonly="true" :disable=disableFlag></CommonSelectBox>
      </div>
      <div>
        <label class="form_label">{{ $t('label.view.creditRating') }}</label>
        <CommonSelectBox :codeList="commonCodeList.creditRateList"></CommonSelectBox>
      </div>
      <div>
        <label class="form_label">{{ $t('label.objt.evaluationDate') }}</label>
        <CommonCalendarYMD v-model="applicantsSearchResult.evaluationDate.value" :readonly="true" :disable="disableFlag"></CommonCalendarYMD>
      </div>
      <div>
        <label class="form_label">{{ $t('label.objt.expireDate') }}</label>
        <CommonCalendarYMD v-model="applicantsSearchResult.expireDate.value" :readonly="true" :disable="disableFlag"></CommonCalendarYMD>
      </div>
    </div>
  </section>
  <section class="box-section">
    <q-list class="qlist-box text-white rounded-borders all-full-row bordered-items">
      <q-expansion-item :label="$t('label.view.loanHistory')">
        <template v-slot:header>
          <div class="text-center full-width">{{ $t('label.view.loanHistory') }}</div>
        </template>
        <q-card>
          <q-card-section>
            <div class="table_scroll_box">
              <ag-grid-vue
                class="msg_table ag-theme-balham height55"
                :getRowStyle="gridProps.getRowStyle"
                :columnDefs="gridProps.columnDefs(commonCodeList)"
                :columnTypes="gridProps.columnTypes"
                :rowData="historyRowData"
                :defaultColDef="gridProps.defaultColDef"
                :pinnedBottomRowData="gridProps.pinnedBottomRowData"
                @grid-ready="gridProps.onGridReady"
                rowSelection="single"
            ></ag-grid-vue>
          </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item :label="$t('label.view.pastDueRecord')">
        <template v-slot:header>
          <div class="text-center full-width">{{ $t('label.view.pastDueRecord') }}</div>
        </template>
        <q-card>
          <q-card-section>
            <div class="table_scroll_box">
              <ag-grid-vue
                class="msg_table ag-theme-balham height55"
                :getRowStyle="gridProps2.getRowStyle"
                :columnDefs="gridProps2.columnDefs(commonCodeList)"
                :columnTypes="gridProps2.columnTypes"
                :rowData="pastDueRowData"
                :defaultColDef="gridProps2.defaultColDef"
                :pinnedBottomRowData="gridProps2.pinnedBottomRowData"
                @grid-ready="gridProps2.onGridReady"
                rowSelection="single"
            ></ag-grid-vue>
          </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </section>
</div>
</template>

<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
import { frmHlpCst } from 'skylark-ui-lib'
import { gridProps } from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcApplicantsHistoryGridProps.vue'
import { gridProps2 } from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcApplicantsPastDueGridProps.vue'
import { AgGridVue } from 'ag-grid-vue3'

/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  showCustomerSearch: {
    type: Boolean,
    default: false
  },
  getCstPopupRowData: {
    type: Function,
    default () {
    }
  },
  applicantsSearchResult: {
    default: {}
  },
  historyRowData: {
    default: []
  },
  pastDueRowData: {
    default: []
  }
})

/* =======================================================
    Freeform Object
  ======================================================= */
const formParam = ref(props.formParam)
const showCustomerSearch = ref(props.showCustomerSearch)
const customerNo = ref(props.customerNo)
const selectedPopupRowData = ref([])
const applicantsSearchResult = ref(props.applicantsSearchResult)

/* =======================================================
    Freeform Function
======================================================= */

const getCstDirectSearch = async (event) => {
  if (event !== '') {
    console.log(selectedPopupRowData.value)
    selectedPopupRowData.value = event
    props.getCstPopupRowData(selectedPopupRowData.value)
  }
}

const showPopup = (type, param1, param2, param3, param4) => {
  const trMode = formParam.value.transactionMode.value
  // 아래 팝업만 모든 상황에서 조회 가능
  if (type !== 'col' && type !== 'atc' && type !== 'ath' && type !== 'apv' && type !== 'apc') {
    if (trMode === 'INQUIRY' || trMode === 'DELETE') return
  }
  showCustomerSearch.value = false
  // showBranch1Search.value = false
  // showUser1Search.value = false
  // showBranch2Search.value = false
  // showUser2Search.value = false
  // showApcSearch.value = false
  // showPrdSearch.value = false
  // 팝업별 파라미터 세팅 및 화면 오픈
  switch (type) {
    case 'cust' : showCustomerSearch.value = true; break
    // case 'brch1' : showBranch1Search.value = true; break
    // case 'usr1' : showUser1Search.value = true; break
    // case 'brch2' : showBranch2Search.value = true; break
    // case 'usr2' : showUser2Search.value = true; break
    // case 'apc' :
      // if (formParam.value.transactionMode.value !== 'INQUIRY') return
      // showApcSearch.value = true; break
    // case 'prd' : showPrdSearch.value = true; break
    // case 'bir' :
      // if (props.variablaFlag) return
      // showBirSearch.value = true; break
  }
  // isCalendarOpen.value = true
}

</script>

<style scoped>
.box-section+.box-section {
  margin-top: 34px;
}
.triple_box {
  display: grid;
  gap: 20px 30px;
  grid-template-columns: 1fr 1fr 1fr;
  overflow: visible;
}
.text-center.full-width {
  text-align: center;
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.form_customer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}
.form_customer > .help_button_simple {
  position: absolute;
  right: 8px;
}
.bordered-items > .q-expansion-item {
  margin: 20px 0;
  background-color: #4850b2;
}
</style>
