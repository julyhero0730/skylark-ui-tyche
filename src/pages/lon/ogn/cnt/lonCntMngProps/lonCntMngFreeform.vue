<template>
  <q-tabs
    v-model="tab"
    align="left"
      indicator-color="transparent"
      active-color="deep-purple-10"
      active-bg-color="white"
  >
    <q-tab name="contract" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.view.contract')"/>
    <q-tab name="applicants" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.applicants')" @click="applicantsClick" />
  </q-tabs>
  <q-tab-panels v-model="tab" class="tab_border height80">
    <q-tab-panel name="contract">
        <div class="table_top_button_wrapper">
            <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
        </div>
        <div class="scrollable-container height65 q-pr-md">

            <div class="triple_box">
              <div>
                  <label class="form_label">{{ $t('label.objt.applicationNo') }}</label>
                  <div class="relative-container1 d-flex items-center">
                    <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.applicationNo.value" @update:model-value="newValue => applicationNoChange(newValue)" hlpType="lonHlpApc" ref="applicationNo" :searchCode="formParam.applicationNo.value" :disable="formParam.transactionMode.value !== 'NEW'" @directSearchVal="getDirectSearchData"></CommonDirectSearchBox>
                    <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cCDisable ? null : showPopup('apc')" />
                    <lonHlpApc :progress-status=searchParam.prgsStatusCode.value v-model="showApcSearch" @selected-popup-row-data = "getApcPopupRowData"></lonHlpApc>
                  </div>
                </div>
                <div>
                    <label class="form_label">{{ $t('label.objt.applicationDate') }}</label>
                    <CommonCalendarYMD v-model="formParam.applicationDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.progressStatus') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.progressStatus" v-model="formParam.prgsStatusCode.value" :disable="cdDisable"></CommonSelectBox>
              </div>
              <div>
                    <label class="form_label is_required">{{ $t('label.objt.contractNo') }}</label>
                    <div class="relative-container1 d-flex items-center">
                        <CommonDirectSearchBox class="width100" maxlength="30" :placeholder="placeholder()" v-model="formParam.contractNo.value" hlpType="lonHlpCon" :searchCode="formParam.contractNo.value" :disable="formParam.transactionMode.value === 'NEW'" @directSearchVal="getDirectSearchData1"></CommonDirectSearchBox>
                        <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="showPopup('con')" />
                        <lonHlpCon
                            v-model="showConSearch"
                            @selected-popup-row-data = "getConPopupRowData">
                        </lonHlpCon>
                    </div>
                </div>
              <div>
                <label class="form_label is_required">{{ $t('label.objt.contractDate') }}</label>
                <div class="date_input_box">
                    <CommonCalendarYMD v-model="formParam.contractDate.value" :disable="nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                </div>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.applicationType') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.applicationType" v-model="formParam.applicationTpcd.value" :disable="cdDisable"></CommonSelectBox>
                </div>
            </div>
            <div class="triple_box">
                <div>
                    <label class="form_label is_required">{{ $t('label.view.customer') }}</label>
                    <div style=" display: flex; align-items: center">
                        <CommonInputBox class="width37" maxlength="30" v-model="formParam.customerNo.value" :disable=cdDisable ref="customerNo" style="text-align-last: center; margin-right:8px;"></CommonInputBox>
                        <CommonInputBox class="width61" maxlength="30" v-model="formParam.customerName.value" :disable=cdDisable ref="customerName" style="text-align-last: center;"></CommonInputBox>
                    </div>
                </div>
                <div>
                  <label class="form_label">{{ $t('label.objt.loanMethod') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.loanMethod" v-model="formParam.creditLineTpcd.value" :disable="cdDisable"></CommonSelectBox>
                </div>
                <div>
                  <label class="form_label">{{ $t('label.objt.productType') }}</label>
                  <div class="relative-container1 d-flex items-center">
                    <CommonInputBox class="width100" v-model="formParam.productName.value" :disable=cdDisable style="text-align-last: left;"></CommonInputBox>
                  </div>
                </div>
            </div>
            <div class="triple_box">
                <div>
                    <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.view.contractAmt') }}</label>
                    <div class="double_input_box">
                        <CommonCurFormatterBox
                            class="width100"
                            :modelValues="modelValues"
                            :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                        </CommonCurFormatterBox>
                    </div>
                </div>
                <div>
                  <label class="form_label">{{ $t('label.objt.fundPurpose') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.fundPurpose" v-model="formParam.fundPurposeCode.value" :disable="cdDisable"></CommonSelectBox>
                </div>
                <div>
                    <label class="form_label">{{ $t('label.objt.repaymentSource') }}</label>
                    <CommonSelectBox :codeList="commonCodeList.repaymentSource" v-model="formParam.repaySourceCode.value" :disable="cdDisable"></CommonSelectBox>
                </div>
            </div>
            <div class="triple_box">
              <div>
                  <label class="form_label">{{ $t('label.objt.intRateType') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.intRateType" v-model="formParam.intRateTpcd.value" :disable="cdDisable"></CommonSelectBox>
              </div>
              <div>
                  <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
                  <div class="relative-container1 d-flex items-center">
                    <CommonInputBox class="width100" v-model="formParam.baseRateName.value" :disable=cdDisable style="text-align-last: left;"></CommonInputBox>
                    <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showPopup('bir')" />
                    <frmHlpBir :base-date=formParam.contractDate.value v-model="showBirSearch" @selected-popup-row-data = "getBirPopupRowData"></frmHlpBir>
                  </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.veiw.baseRateApplyDate') }}</label>
                <div class="date_input_box">
                    <CommonCalendarYMD v-model="formParam.baseRateApplydt.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.baseRate') }}</label>
                <CommonInputBox placeholder="0" maxlength="30" v-model="formParam.baseRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div class="width48">
                    <label class="form_label">{{ $t('label.objt.interestRate') }}</label>
                    <div style="display: flex; align-items: center;">
                    <CommonInputBox placeholder="0" maxlength="30" v-model="formParam.spreadRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                    <q-icon name="percent" style="margin-left: 5px;"/>
                    </div>
                </div>
                <div class="width48">
                    <label class="form_label">{{ $t('label.objt.spread') }}</label>
                    <div style="display: flex; align-items: center;">
                    <CommonInputBox placeholder="0" maxlength="30" v-model="formParam.interest.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                    <q-icon name="percent" style="margin-left: 5px;"/>
                    </div>
                </div>
              </div>
              <div></div>
              <div>
                  <label class="form_label">{{ $t('label.objt.loanPeriodType') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.loanPeriodType" v-model="formParam.loanPrdTpcd.value" :disable="cdDisable"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.loanTerm') }}</label>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div class="width47" style="display: flex; align-items: center;">
                        <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                    <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermYear.value" :disable=cdDisable style="text-align-last: right;"></CommonInputBox>
                    </div>
                    <div class="width47" style="display: flex; align-items: center;">
                        <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                    <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermMonth.value" :disable=cdDisable  style="text-align-last: right;"></CommonInputBox>
                    </div>
                </div>
              </div>
              <div>
                  <label class="form_label">{{ $t('label.objt.maturityDate') }}</label>
                  <CommonCalendarYMD maxlength="30" v-model="formParam.maturityDate.value" :disable=cdDisable  style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                  <label class="form_label">{{ $t('label.objt.repaymentProgram') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.repaymentProgram" v-model="formParam.repayProgTpcd.value" :disable="cdDisable"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.gracePeriod') }}</label>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div class="width47" style="display: flex; align-items: center;">
                        <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                    <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdYear.value" :disable="cdDisable"  style="text-align-last: right;"></CommonInputBox>
                    </div>
                    <div class="width47" style="display: flex; align-items: center;">
                        <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                    <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdMonth.value" :disable="cdDisable"  style="text-align-last: right;"></CommonInputBox>
                    </div>
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.amortizationPeriod') }}</label>
                <div style="display: flex; align-items: center; position: relative; padding-right:60px;">
                    <CommonNumberInput class="width100" maxlength="30" placeholder="0" v-model="formParam.amrtPrdMm.value" :disable="cdDisable"></CommonNumberInput>
                    <label class="form_label" style="position: absolute; right: 0;">{{ $t('label.view.months') }}</label>
                </div>
              </div>
              </div>
              <div class="msg_info_form_single_box">
                <div>
                    <label class="form_label">{{ $t('label.objt.remark') }}</label>
                    <CommonInputBox class="height10" :disable=nonTarget type="textarea" v-model="formParam.rmk.value"></CommonInputBox>
                </div>
              </div>
              <div style="display: none;">
                <div>
                    <label class="form_label is_required">{{ $t('label.objt.registInfo') }}</label>
                    <div class="relative-container1 d-flex items-center">
                        <CommonInputBox maxlength="10" v-model="formParam.registBrnm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                        <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showBraSearchPopup1()" />
                        <frmHlpBrc v-model="showBraSearch1" @selected-popup-row-data = "getPopupRowData5"></frmHlpBrc>
                    </div>
                </div>
                <div>
                    <label class="form_label is_required"></label>
                    <div class="relative-container1 d-flex items-center">
                        <CommonInputBox maxlength="10" v-model="formParam.registEmployeeNm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                        <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showEmpSearchPopup1()" />
                        <frmHlpEmp v-model="showEmpSearch1" @selected-popup-row-data = "getPopupRowData6"></frmHlpEmp>
                    </div>
                </div>
                <div>
                    <label class="form_label is_required"></label>
                    <div class="date_input_box">
                        <CommonCalendarYMD v-model="formParam.registDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                    </div>
                </div>
                <div>
                    <label class="form_label is_required">{{ $t('label.objt.manageInfo') }}</label>
                    <div class="relative-container1 d-flex items-center">
                        <CommonInputBox maxlength="10" v-model="formParam.manageBrnm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                        <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showBraSearchPopup2()" />
                        <frmHlpBrc v-model="showBraSearch2" @selected-popup-row-data = "getPopupRowData7"></frmHlpBrc>
                    </div>
                </div>
                <div>
                    <label class="form_label is_required"></label>
                    <div class="relative-container1 d-flex items-center">
                        <CommonInputBox maxlength="10" v-model="formParam.manageEmployeeNm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                        <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showEmpSearchPopup2()" />
                        <frmHlpEmp v-model="showEmpSearch2" @selected-popup-row-data = "getPopupRowData8"></frmHlpEmp>
                    </div>
                </div>
                <div>
                    <label class="form_label is_required"></label>
                    <div class="date_input_box">
                        <CommonCalendarYMD v-model="formParam.manageDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                    </div>
                </div>
            </div>
        </div>
    </q-tab-panel>
    <q-tab-panel name="applicants">
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
              <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getCstPopupRowData"></frmHlpCst>
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
            <CommonSelectBox :codeList="commonCodeList.creditRateList" v-model="applicantsSearchResult.creditRating.value"></CommonSelectBox>
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
  </q-tab-panel>
  </q-tab-panels>
</template>
<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
import { frmHlpBir, frmHlpBrc, frmHlpEmp, frmHlpCst } from 'skylark-ui-lib'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import lonHlpCon from 'src/components/pages/main/hlp/lon/lonHlpCon.vue'
import { gridProps } from 'src/pages/lon/ogn/cnt/lonCntMngProps/lonOgnCntApplicantsHistoryGridProps.vue'
import { gridProps2 } from 'src/pages/lon/ogn/cnt/lonCntMngProps/lonOgnCntApplicantsPastDueGridProps.vue'
import { AgGridVue } from 'ag-grid-vue3'
/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  searchParam: {
    default: {}
  },
  radioDisableFlag: {
    default: {}
  },
  modelValues: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  showApcSearch: {
    default: false
  },
  showConSearch: {
    default: false
  },
  showBirSearch: {
    default: false
  },
  showEmpSearch1: {
    default: false
  },
  showBraSearch1: {
    default: false
  },
  showBraSearch2: {
    default: false
  },
  showEmpSearch2: {
    default: false
  },
  showCstSearch: {
    type: Boolean,
    default: false
  },
  cdDisable: {
    default: true
  },
  cCDisable: {
    default: false
  },
  nonTarget: {
    default: false
  },
  save: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  updateTrxnMode: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  applicationNoChange: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getApcPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getConPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getBirPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData5: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData6: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData7: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData8: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getCstPopupRowData: {
    type: Function,
    /**
     *
     */
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
const showApcSearch = ref(props.showApcSearch)
const showConSearch = ref(props.showConSearch)
const showBirSearch = ref(props.showBirSearch)
const showEmpSearch1 = ref(props.showEmpSearch1)
const showBraSearch2 = ref(props.showBraSearch2)
const showEmpSearch2 = ref(props.showEmpSearch2)
const showBraSearch1 = ref(props.showBraSearch1)
const tab = ref('contract')
const showCstSearch = ref(props.showCstSearch)
const applicantsSearchResult = ref(props.applicantsSearchResult)
/* =======================================================
    Freeform Funtion
======================================================= */

const showPopup = (type, param1, param2, param3, param4) => {
  showCstSearch.value = false
  switch (type) {
    case 'apc' : showApcSearch.value = true; break
    case 'bir' : showBirSearch.value = true; break
    case 'con' :
      if (formParam.value.transactionMode.value === 'NEW') return
      showConSearch.value = true; break
    case 'cust' :
      showCstSearch.value = true; break
  }
}
const showBraSearchPopup1 = () => {
  showBraSearch1.value = true
}

const showEmpSearchPopup1 = () => {
  showEmpSearch1.value = true
}

const showBraSearchPopup2 = () => {
  showBraSearch2.value = true
}

const showEmpSearchPopup2 = () => {
  showEmpSearch2.value = true
}

const selectedPopupRowData = ref([])

const getDirectSearchData = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getApcPopupRowData(selectedPopupRowData.value)
  }
}

const getDirectSearchData1 = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getConPopupRowData(selectedPopupRowData.value)
  }
}

const placeholder = () => {
  if (formParam.value.transactionMode.value === 'NEW') {
    return 'Auto Generate'
  }
}

const getCstDirectSearch = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getCstPopupRowData(selectedPopupRowData.value)
  }
}

const applicantsClick = () => {
  console.log('applicants Click')
  if (formParam.value.customerNo.value !== applicantsSearchResult.value.customerNo.value) {
    props.getCstPopupRowData(selectedPopupRowData.value)
  }
}

</script>
<style scoped>
.double_input_box {
    display: flex;
    gap: 10px;
}
.relative-container1 {
   position: relative;
}

.triple_box {
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: visible;
}
.box-section+.box-section {
  margin-top: 34px;
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
