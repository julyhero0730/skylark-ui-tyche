<template>
  <q-tabs
    v-model="tab"
    align="left"
      indicator-color="transparent"
      active-color="deep-purple-10"
      active-bg-color="white"
  >
  <q-tab name="application" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.application')"/>
  <q-tab name="applicants" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.applicants')" @click="applicantsClick" />
</q-tabs>
<q-tab-panels v-model="tab" class="tab_border height80">
  <q-tab-panel name="application">
    <div class="table_top_button_wrapper">
      <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="approve" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
      &nbsp;&nbsp;&nbsp;<q-btn
        :disable="isApproverFlag"
        align="between"
        class="btn"
        label="Authorization"
        @click="showPopup('ath', session.sysEmployeeNo, formParam.authResultCode, formParam.authorizationNo.value, formParam.authorizationDate, 'Modify')"
        icon="edit"
      />
    </div>
    <lonHlpAth
      :application-No=formParam.applicationNo.value
      :approve-Employee-No=formParam.authorEmployeeNo.value
      :apply-Employee-No=formParam.registEmployeeNo.value
      :from-Btn=formParam.fromBtn.value
      v-model="showAthSearch"
      :approve="approve"
      @selected-popup-row-data="getAthPopupRowData">
    </lonHlpAth>
    <!-- 결재 정보 -->
    <div class="scrollable-container height65 q-pr-md">
        <div class="msg_info_form_quadruple_box">
          <div>
              <label class="form_label">{{ $t('label.objt.authorizationNo') }}</label>
              <div class="width100" style="display: flex; align-items: center;">
                <!-- <q-input outlined bg-color="input-grey" placeholder="Auto Generate" :disable=true maxlength="30" v-model="formParam.authorizationNo.value" ref="authorizationNo" style="text-align-last: center; width:100%"></q-input> -->
                <CommonDirectSearchBox maxlength="30"
                  v-model="formParam.authorizationNo.value"
                  hlpType="lonHlpAto" ref="authorizationNo"
                  :searchCode="formParam.authorizationNo.value"
                  :disable="formParam.transactionMode.value === 'NEW'"
                  @directSearchVal="getDirectSearchData"
                  class="width100">
                </CommonDirectSearchBox>
                <q-icon name="search" size="sm" style="margin-left:-30px;" class="help_button_simple" @click="showPopup('ato')" />
                <lonHlpAto v-model="showAtoSearch" @selected-popup-row-data="getAtoPopupRowData"></lonHlpAto>
              </div>
          </div>
          <div>
              <label class="form_label is_required">{{ $t('label.objt.authorizationDate') }}</label>
              <CommonCalendarYMD v-model="formParam.authorizationDate.value" :disable=true style="text-align-last: center;"></CommonCalendarYMD>
          </div>
          <div>
              <label class="form_label is_required">{{ $t('label.objt.approvalLineStaff') }}</label>
              <CommonInputBox  v-model="formParam.approvalLineStaff.value" :disable=true style="text-align-last: center;"></CommonInputBox>
          </div>
          <div>
              <label class="form_label is_required">{{ $t('label.objt.authorizationStatus') }}</label>
              <CommonSelectBox :codeList="commonCodeList.authorizationStatus" v-model="formParam.authResultCode.value" :disable=true></CommonSelectBox>
          </div>
        </div><br>
        <q-separator/>
        <!-- Contract Info -->
        <div class="msg_info_form_triple_box">
          <div>
              <label class="form_label">{{ $t('label.objt.applicationNo') }}</label>
              <div class="width100" style=" display: flex; align-items: center;">
                <CommonDirectSearchBox maxlength="30"
                  v-model="formParam.applicationNo.value"
                  @update:model-value="newValue => applicationNoChange(newValue)"
                  hlpType="lonHlpApc" ref="applicationNo"
                  :searchCode="formParam.applicationNo.value"
                  :disable="formParam.transactionMode.value !== 'NEW'"
                  @directSearchVal="getDirectSearchData1"
                  class="width100">
                </CommonDirectSearchBox>
                <!-- <q-input outlined bg-color="input-grey" placeholder="Auto Generate" :disable=true @update:model-value="newValue => applicationNoChange(newValue)" maxlength="30" v-model="formParam.applicationNo.value" ref="applicationNo" style="text-align-last: center; width:100%"></q-input> -->
                <q-icon name="search" size="sm" style="margin-left:-30px;" class="help_button_simple" @click="showPopup('apc')" />
                <lonHlpApc v-model="showApcSearch" @selected-popup-row-data = "getApcPopupRowData"></lonHlpApc>
              </div>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.applicationDate') }}</label>
              <CommonCalendarYMD v-model="formParam.applicationDate.value" :disable=true style="text-align-last: center;"></CommonCalendarYMD>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.applicationTpcd') }}</label>
              <CommonSelectBox :codeList="commonCodeList.applicationTpcd" v-model="formParam.applicationTpcd.value" :disable=true></CommonSelectBox>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.prgsStatusCode') }}</label>
              <CommonSelectBox :codeList="commonCodeList.prgsStatusCode" v-model="formParam.prgsStatusCode.value" :disable=true></CommonSelectBox>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.contractNo') }}</label>
              <CommonInputBox placeholder="Auto Generate" maxlength="30" v-model="formParam.contractNo.value" :disable=true ref="contractNo" style="text-align-last: center;"></CommonInputBox>
          </div>
          <div>
            <label class="form_label is_required">{{ $t('label.view.customer') }}</label>
            <div style=" display: flex; align-items: center">
                <CommonInputBox class="width37 q-mr-sm" maxlength="30" v-model="formParam.customerNo.value" :disable=true ref="customerNo" style="text-align-last: center;"></CommonInputBox>
                <CommonInputBox class="width61" maxlength="30" v-model="formParam.customerName.value" :disable=true ref="customerName" style="text-align-last: center;"></CommonInputBox>
            </div>
          </div>
          <div>
            <label class="form_label">{{ $t('label.objt.creditLineTpcd') }}</label>
            <CommonSelectBox :codeList="commonCodeList.creditLineTpcd" v-model="formParam.creditLineTpcd.value" :disable=true></CommonSelectBox>
          </div>

          <div>
            <label class="form_label">{{ $t('label.objt.productCode') }}</label>
            <div class="width100" style="display: flex; align-items: center;">
              <CommonInputBox v-model="formParam.productName.value" :disable=true ref="productName" style="text-align-last: left; width:100%;"></CommonInputBox>
            </div>
          </div>
          <div>
            <label class="form_label">{{ $t('label.objt.applicationAmount') }}</label>
            <div class="double_input_box">
                <CommonCurFormatterBox
                    :modelValues="modelValues"
                    class="width100"
                    :selectDisabled="true"
                    :inputDisabled="true">
                </CommonCurFormatterBox>
            </div>
          </div>
          <div>
            <label class="form_label">{{ $t('label.objt.fundPurposeCode') }}</label>
            <CommonSelectBox :codeList="commonCodeList.fundPurposeCode" v-model="formParam.fundPurposeCode.value" :disable=true></CommonSelectBox>
          </div>

          <div>
            <label class="form_label">{{ $t('label.objt.repaySourceCode') }}</label>
            <CommonSelectBox :codeList="commonCodeList.repaySourceCode" v-model="formParam.repaySourceCode.value" :disable=true></CommonSelectBox>
          </div>
        </div>
        <!-- Loan Info -->
        <div class="msg_info_form_triple_box">
          <div>
              <label class="form_label">{{ $t('label.objt.intRateType') }}</label>
              <CommonSelectBox  ref="intRateType" :codeList="commonCodeList.intRateType" v-model="formParam.intRateTpcd.value" :disable=true></CommonSelectBox>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
              <CommonInputBox v-model="formParam.baseRateName.value" :disable=variablaFlag ref="baseRateCode" style="text-align-last: left"></CommonInputBox>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.baseRateApplyDate') }}</label>
              <CommonCalendarYMD maxlength="30" v-model="formParam.baseRateApplydt.value" :disable=variablaFlag ref="baseRateApplydt" style="text-align-last: center;"></CommonCalendarYMD>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.baseRate') }}</label>
              <div style="display:flex; align-items: center;">
                <CommonInputBox class="width95" maxlength="30" v-model="formParam.baseRate.value" :disable=variablaFlag ref="baseRate" style="text-align-last: right; margin: 0px"></CommonInputBox>
                &nbsp;&nbsp;<q-icon style="float:right;" name="percent" />
              </div>
          </div>
          <div style="display:flex;">
              <div>
                <label class="form_label">{{ $t('label.objt.spread') }}</label>
                <div style="display:flex; align-items: center;">
                  <CommonInputBox class="width85" placeholder="0" @update:model-value="newValue => changeSpread(newValue)" maxlength="30" v-model="formParam.spreadRate.value" :disable=true ref="spreadRate" style="text-align-last: right;"></CommonInputBox>
                  <q-icon style="float:right;  margin: 0 5px;" name="percent" />
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.interestRate') }}</label>
                <div style="display:flex; align-items: center;">
                  <CommonInputBox class="width85" placeholder="0" maxlength="30" v-model="formParam.interestRate.value" :disable=true ref="interestRate" style="text-align-last: right;"></CommonInputBox>
                  <q-icon style="float:right; margin: 0 5px;" name="percent" />
                </div>
              </div>
          </div>
          <div></div>
          <div>
              <label class="form_label">{{ $t('label.objt.loanPrdTpcd') }}</label>
              <CommonSelectBox :codeList="commonCodeList.loanPrdTpcd" v-model="formParam.loanPrdTpcd.value" :disable=true></CommonSelectBox>
          </div>
          <div>
            <label class="form_label">{{ $t('label.objt.loanTerm') }}</label>
            <div style="display:flex; align-items: center;">
              Year
              <CommonInputBox class="width37" maxlength="30" placeholder="0" v-model="formParam.loanTermYear.value" :disable=loanTermFlag ref="loanTermYear" style="text-align-last: right; margin: 0 10px"></CommonInputBox>
              Month
              <CommonInputBox class="width37" maxlength="30" placeholder="0" v-model="formParam.loanTermMonth.value" :disable=loanTermFlag ref="loanTermMonth" style="text-align-last: right; margin: 0 10px"></CommonInputBox>
            </div>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.maturityDate') }}</label>
              <CommonCalendarYMD maxlength="30" v-model="formParam.maturityDate.value" :disable=loanMaturityFlag ref="maturityDate" style="text-align-last: center;"></CommonCalendarYMD>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.repayProgTpcd') }}</label>
              <CommonSelectBox :codeList="commonCodeList.repayProgTpcd" v-model="formParam.repayProgTpcd.value" :disable=true></CommonSelectBox>
          </div>
          <div>
            <label class="form_label">{{ $t('label.objt.gracePeriod') }}</label>
            <div style="display:flex; align-items: center;">
              Year
              <CommonInputBox class="width37" maxlength="30" placeholder="0" v-model="formParam.gracePrdYear.value" :disable=true ref="gracePrdYear" style="text-align-last: right;margin: 0px 10px"></CommonInputBox>
              Month
              <CommonInputBox class="width37" maxlength="30" placeholder="0" v-model="formParam.gracePrdMonth.value" :disable=true ref="gracePrdMonth" style="text-align-last: right;margin: 0px 10px"></CommonInputBox>
            </div>
          </div>
          <div>
            <label class="form_label">{{ $t('label.objt.amortizationPeriod') }}</label>
            <div style="display:flex; align-items: center;">
                <CommonInputBox class="width80 q-mr-sm" maxlength="30" v-model="formParam.amrtPrdMm.value" :disable=true ref="amrtPrdMm" style="text-align-last: right;"></CommonInputBox>
                Months
            </div>
          </div>
        </div>
        <div class="msg_info_form_single_box" style="margin-top:15px">
          <div>
              <label class="form_label">{{ $t('label.objt.remark') }}</label>
              <CommonInputBox class="q-mb-md" :disable=true type="textarea" v-model="formParam.rmk.value"></CommonInputBox>
          </div>
        </div>
        <div class="msg_info_form_triple_box" style="display: none;">
          <div>
            <label class="form_label">{{ $t('label.objt.registInfo') }}</label>
            <div style=" display: flex; align-items: center;">
              <CommonInputBox maxlength="30" v-model="formParam.registBrcd.value" :disable=true ref="registBrcd" style="width:373px; text-align-last: center;"></CommonInputBox>
            </div>
          </div>
          <div style="margin-top:26px;">
            <div style=" display: flex; align-items: center;">
              <CommonInputBox maxlength="30" v-model="formParam.registEmployeeNo.value" :disable=true ref="registEmployeeNo" style="width:373px; text-align-last: center;"></CommonInputBox>
            </div>
          </div>
          <div style="margin-top:26px;">
            <CommonCalendarYMD maxlength="30" v-model="formParam.registDate.value" :disable=true ref="registDate" style="text-align-last: center; width:100%"></CommonCalendarYMD>
          </div>
        </div>
        <div class="msg_info_form_triple_box" style="display: none;">
          <div>
            <label class="form_label">{{ $t('label.objt.manageInfo') }}</label>
            <div style=" display: flex; align-items: center;">
              <CommonInputBox maxlength="30" v-model="formParam.manageBrcd.value" :disable=true ref="manageBrcd" style="width:373px; text-align-last: center;"></CommonInputBox>
            </div>
          </div>
          <div style="margin-top:26px;">
            <div style=" display: flex; align-items: center;">
              <CommonInputBox maxlength="30" v-model="formParam.manageEmployeeNo.value" :disable=true ref="manageEmployeeNo" style="width:373px; text-align-last: center;"></CommonInputBox>
            </div>
          </div>
          <div style="margin-top:26px;">
            <CommonCalendarYMD maxlength="30" v-model="formParam.manageDate.value" :disable=true ref="manageDate" style="text-align-last: center; width:100%"></CommonCalendarYMD>
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
import { ref, watch } from 'vue'
import { commonUtil, frmHlpCst } from 'skylark-ui-lib'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import lonHlpAto from 'src/components/pages/main/hlp/lon/lonHlpAto.vue'
import lonHlpAth from 'src/components/pages/main/hlp/lon/lonHlpAth.vue'
import { gridProps } from 'src/pages/lon/ogn/ath/lonOgnAthProps/lonOgnAthApplicantsHistoryGridProps.vue'
import { gridProps2 } from 'src/pages/lon/ogn/ath/lonOgnAthProps/lonOgnAthApplicantsPastDueGridProps.vue'
import { AgGridVue } from 'ag-grid-vue3'

/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
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
  isCalendarOpen: {
    default: false
  },
  showColSearch: {
    default: false
  },
  showAtcSearch: {
    default: false
  },
  showApcSearch: {
    default: false
  },
  showAthSearch: {
    default: false
  },
  showAtoSearch: {
    default: false
  },
  showCstSearch: {
    type: Boolean,
    default: false
  },
  isApproverFlag: {
    default: true
  },
  variablaFlag: {
    default: true
  },
  loanTermFlag: {
    default: true
  },
  loanMaturityFlag: {
    default: true
  },
  getAtoPopupRowData: {
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
  getAthPopupRowData: {
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
  approve: {
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
  session: {
    default: ''
  },
  applicationNoChange: {
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
const tab = ref('application')
const formParam = ref(props.formParam)
const showColSearch = ref(props.showColSearch)
const showAtcSearch = ref(props.showAtcSearch)
const showApcSearch = ref(props.showApcSearch)
const showAthSearch = ref(props.showAthSearch)
const showAtoSearch = ref(props.showAtoSearch)
const showCstSearch = ref(props.showCstSearch)
const isCalendarOpen = ref(props.isCalendarOpen)
const applicantsSearchResult = ref(props.applicantsSearchResult)

watch(() => props.formParam, (newVal) => {
  formParam.value = newVal
})
/* =======================================================
    Freeform Funtion
======================================================= */
const showPopup = (type, param1, param2, param3, param4, fromBtn) => {
  showColSearch.value = false
  showAtcSearch.value = false
  showApcSearch.value = false
  showAthSearch.value = false
  showAtoSearch.value = false
  showCstSearch.value = false

  switch (type) {
    case 'col' :
      if (!commonUtil.isEmpty(param1)) formParam.value.pledgeNo.value = param1
      else formParam.value.pledgeNo.value = ''
      showColSearch.value = true; break
    case 'atc' :
      if (!commonUtil.isEmpty(param1)) formParam.value.postAttachNo.value = param1
      else formParam.value.postAttachNo.value = ''
      showAtcSearch.value = true; break
    case 'apc' :
      if (formParam.value.transactionMode.value !== 'NEW') return
      showApcSearch.value = true; break
    case 'ath' :
      formParam.value.authorEmployeeNo.value = !commonUtil.isEmpty(param1) ? param1 : formParam.value.authorEmployeeNo.value
      formParam.value.authResultCode.value = !commonUtil.isEmpty(param2) ? param2.value : formParam.value.authResultCode.value
      formParam.value.authorizationNo.value = !commonUtil.isEmpty(param3) ? param3 : formParam.value.authorizationNo.value
      formParam.value.authorizationDate.value = !commonUtil.isEmpty(param4) ? param4.value : formParam.value.authorizationDate.value
      formParam.value.fromBtn.value = !commonUtil.isEmpty(fromBtn) ? fromBtn : ''
      showAthSearch.value = true
      break
    case 'ato' :
      if (formParam.value.transactionMode.value === 'NEW') return
      showAtoSearch.value = true; break
    case 'cust' :
      showCstSearch.value = true; break
  }
  isCalendarOpen.value = true
}

const selectedPopupRowData = ref([])

const getDirectSearchData = async (event) => {
  console.log(event)
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getAtoPopupRowData(selectedPopupRowData.value)
  }
}

const getDirectSearchData1 = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getApcPopupRowData(selectedPopupRowData.value)
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
    width: 100%;
}
.double_input_box > * {
    flex: 1;
}
.msg_info_form_triple_box {
    max-height: 600px;
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: visible;
}
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
