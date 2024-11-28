<template>
  <div class="table_top_button_wrapper button_box">
    <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="disburseSave" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
    </div>
  <div class="scrollable-container">
      <div class="msg_info_form_triple_box q-pr-md q-pt-md">
          <div>
              <label class="form_label">{{ $t('label.objt.contractNo') }}</label>
              <div class="relative-container d-flex items-center">
                <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.contractNo.value" hlpType="lonHlpCon" :searchCode="formParam.contractNo.value" :disable="formParam.transactionMode.value !== 'NEW'" @directSearchVal="getDirectSearchData1"></CommonDirectSearchBox>
                    <!-- <CommonInputBox maxlength="10" v-model="formParam.contractNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox> -->
                    <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="formParam.transactionMode.value === 'NEW' && showConSearchPopup()" />
                    <lonHlpCon v-model="showConSearch" @selected-popup-row-data = "getSearchPopupData1"></lonHlpCon>
              </div>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.productType') }}</label>
              <CommonInputBox v-model="formParam.productName.value" :disable="cdDisable"></CommonInputBox>
          </div>
          <div>
              <label class="form_label">{{ $t('label.view.transactionDate') }}</label>
              <CommonCalendarYMD v-model="formParam.transactionDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
          </div>
          <div>
              <label class="form_label is_required">{{ $t('label.view.disbursementNo') }}</label>
              <div class="relative-container d-flex items-center">
                <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.disbursementNo.value" hlpType="lonHlpDbs" :searchCode="formParam.disbursementNo.value" :disable="formParam.transactionMode.value !== 'INQUIRY'" @directSearchVal="getDirectSearchData2"></CommonDirectSearchBox>
                    <!-- <CommonInputBox maxlength="10" v-model="formParam.disbursementNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox> -->
                    <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="formParam.transactionMode.value === 'INQUIRY' && showDbsSearchPopup()" />
                    <lonHlpDbs v-model="showDbsSearch" @selected-popup-row-data = "getSearchPopupData2"></lonHlpDbs>
              </div>
          </div>
          <div>
              <label class="form_label">{{ $t('label.view.customer') }}</label>
              <div class="relative-container d-flex items-center">
                  <CommonInputBox class="width100" maxlength="10" v-model="formParam.customerName.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showCstSearchPopup()" />
                  <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getPopupRowData3"></frmHlpCst>
              </div>
          </div>
          <div>
              <label class="form_label">{{ $t('label.objt.fundPurpose') }}</label>
              <CommonSelectBox :codeList="commonCodeList.fundPurpose" v-model="formParam.fundPurposeCode.value" :disable="cdDisable" ></CommonSelectBox>
          </div>
          <q-list class="custom-gray text-white rounded-borders all-full-row bordered-items" >
          <q-expansion-item v-model="isContractExpanded">
          <template v-slot:header>
              <div class="text-center full-width">{{ $t('label.view.contractInfo') }}</div>
          </template>
              <q-card>
              <q-card-section>
                  <div class="msg_info_form_triple_box" style="overflow-y: hidden;">
                      <div>
                          <label class="form_label">{{ $t('label.view.contractAmt') }}</label>
                          <div class="double_input_box">
                              <CommonCurFormatterBox
                                  class="width100" :modelValues="modelValues1" :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                              </CommonCurFormatterBox>
                          </div>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.view.contractOutstanding') }}</label>
                          <div class="double_input_box">
                              <CommonCurFormatterBox
                                  :modelValues="modelValues2" class="width100" :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                              </CommonCurFormatterBox>
                          </div>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.objt.contractDate') }}</label>
                          <CommonCalendarYMD v-model="formParam.contractDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                      </div>
                  </div>
                  <div class="msg_info_form_triple_box">
                      <div>
                          <label class="form_label">{{ $t('label.objt.loanPeriodType') }}</label>
                          <CommonSelectBox :codeList="commonCodeList.lonPeriodType" v-model="formParam.loanPrdTpcd.value" :disable="cdDisable" ></CommonSelectBox>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.objt.loanTerm') }}</label>
                          <div style="display: flex; align-items: center; justify-content: space-between;">
                              <div class="width48" style="display: flex; align-items: center;">
                                  <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                              <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermYear.value" :disable=cdDisable style="text-align-last: right;"></CommonInputBox>
                              </div>
                              <div class="width48" style="display: flex; align-items: center;">
                                  <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                              <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermMonth.value" :disable=cdDisable  style="text-align-last: right;"></CommonInputBox>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.objt.maturityDate') }}</label>
                          <CommonCalendarYMD v-model="formParam.contractMaturityDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                      </div>
                  </div>
                  <div class="msg_info_form_triple_box">
                      <div>
                          <label class="form_label is_required">{{ $t('label.objt.intRateTpcd') }}</label>
                          <CommonSelectBox :codeList="commonCodeList.lonInterestRateCode" v-model="formParam.contractIntRateTpcd.value" :disable="cdDisable" ></CommonSelectBox>
                      </div>
                      <div>
                        <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
                          <div class="relative-container d-flex items-center">
                              <CommonInputBox class="width100"  maxlength="10" v-model="formParam.contractBaseRateName.value" :disable="cdDisable"></CommonInputBox>
                              <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%); color: #080808;" class="help_button_simple" disalbe />
                              <frmHlpBir v-model="showBirSearch" @selected-popup-row-data = "getPopupRowData4"></frmHlpBir>
                          </div>
                      </div>
                      <div>
                        <label class="form_label is_required">{{ $t('label.objt.spreadRate') }}</label>
                          <div style="display:flex; align-items: center;">
                          <CommonInputBox class="width93" placeholder="0" maxlength="30" v-model="formParam.contractSpreadRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                          &nbsp;&nbsp;<q-icon style="float:right; color: #080808;" name="percent" />
                          </div>
                      </div>
                  </div>
              </q-card-section>
              </q-card>
          </q-expansion-item>

          <q-expansion-item v-model="isDisburseExpanded">
          <template v-slot:header>
              <div class="text-center full-width">{{ $t('label.view.disburseInfo') }}</div>
          </template>
              <q-card>
              <q-card-section>
                  <div class="msg_info_form_triple_box" style="overflow-y: hidden;">
                      <div>
                          <label class="form_label is_required">{{ $t('label.view.disbursementAmount') }}</label>
                          <div class="double_input_box">
                              <CommonCurFormatterBox
                                  :modelValues="modelValues3" class="width100" @update:roundFactor="handleRoundFactor" :selectDisabled="cdDisable" :inputDisabled="nonTarget" :error="disburseAmountError" :errorMessage="disburseAmountErrorMessage">
                              </CommonCurFormatterBox>
                          </div>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.view.disburseOutstanding') }}</label>
                          <div class="double_input_box">
                              <CommonCurFormatterBox
                                  :modelValues="modelValues4" class="width100" :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                              </CommonCurFormatterBox>
                          </div>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.objt.repaymentProgram') }}</label>
                          <CommonSelectBox :codeList="commonCodeList.lonRepayMethodCode" v-model="formParam.repayProgTpcd.value" :disable="cdDisable" ></CommonSelectBox>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.veiw.disbursementDate') }}</label>
                          <CommonCalendarYMD :auto-position="false" v-model="formParam.disbursementDate.value" :disable="nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.objt.maturityDate') }}</label>
                          <CommonCalendarYMD :auto-position="false" v-model="formParam.maturityDate.value" :disable="nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.objt.intRateTpcd') }}</label>
                          <CommonSelectBox :codeList="commonCodeList.lonInterestRateCode" v-model="formParam.intRateTpcd.value" :disable="formParam.transactionMode.value !== 'UPDATE'" ></CommonSelectBox>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
                          <div class="relative-container d-flex items-center">
                              <CommonInputBox class="width100" maxlength="10" v-model="formParam.baseRateName.value" :disable="cdDisable"></CommonInputBox>
                              <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%); color: #080808;" class="help_button_simple" @click="nonTarget ? null : showBirSearchPopup()" />
                              <frmHlpBir v-model="showBirSearch" @selected-popup-row-data = "getPopupRowData4"></frmHlpBir>
                          </div>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.view.rateChangeCycle') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.frmBaseRateTermCode" v-model="formParam.rateTermCode.value" :disable="cdDisable" ></CommonSearchSelectBox>
                      </div>
                      <div style="display: flex; height: 63px;">
                        <div class="width65" style="display: inline-block; margin-right: 1%;">
                          <label class="form_label">{{ $t('label.view.changeApplyDate') }}</label>
                          <CommonCalendarYMD v-model="formParam.baseRateApplydt.value" :disable="nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                        </div>
                        <div class="width34" style="display: inline-flex; align-items: flex-end; justify-content: center;">
                          <q-btn color="primary" icon="history" label="History" @click="showInterestHSearchPopup()"></q-btn>
                          <lonHlpIntApplyH
                            v-model="showIntApplyHSearch"
                            v-model:option="formParam.disbursementNo.value"
                          ></lonHlpIntApplyH>
                        </div>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.view.rateChangeMethod') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonIntRateChangeMethod" v-model="formParam.rateChangeCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.objt.baseRate') }}</label>
                          <div style="display:flex; align-items: center;">
                          <CommonInputBox class="width93" maxlength="30" v-model="formParam.baseRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                          &nbsp;&nbsp;<q-icon style="float:right; color: #080808;" name="percent" />
                          </div>
                      </div>
                      <div>
                          <div class="width44" style="display: inline-block; margin-right: 1%;">
                              <label class="form_label is_required">{{ $t('label.view.interestSpreadRate') }}</label>
                              <CommonInputBox placeholder="0" maxlength="30" v-model="formParam.spreadRate.value" :disable="formParam.transactionMode.value !== 'UPDATE'" style="text-align-last: right;"></CommonInputBox>
                          </div>
                          <div class="width50" style="display: inline-block;">
                              <label class="form_label"></label>
                              <div style="display: flex; align-items: center;">
                                  <CommonInputBox class="width100" placeholder="0" maxlength="30" v-model="formParam.interestRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                                  <q-icon name="percent" style="margin-left: 4px; z-index: 1000; color: #080808;"/>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.veiw.interestReceiveType') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonInterestReceiveCode" v-model="formParam.intRecvTpcd.value" :disable="nonTarget" ></CommonSearchSelectBox>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.view.pastDueCalcMethod') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonPastdueCalcMethodCode" v-model="formParam.pastDueCalCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
                      </div>
                      <div>
                          <div class="width44" style="display: inline-block; margin-right: 1%;">
                            <label class="form_label">{{ $t('label.view.pastDueSpreadRate') }}</label>
                              <CommonSearchInputBox class="width100" maxlength="30" v-model="formParam.pastdueSpread.value" :disable="nonTarget" style="text-align-last: right;"></CommonSearchInputBox>
                          </div>
                          <div class="width50" style="display: inline-block;">
                              <label class="form_label"></label>
                              <div style="display: flex; align-items: center;">
                                  <CommonInputBox class="width100" placeholder="0" maxlength="30" v-model="formParam.pastDueInterestRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                                  <q-icon name="percent" style="margin-left: 4px; z-index: 1000; color: #080808;"/>
                              </div>
                          </div>
                      </div>
                      <div>
                          <label class="form_label">{{ $t('label.objt.gracePeriod') }}</label>
                          <div style="display: flex; align-items: center; justify-content: space-between;">
                              <div class="width48" style="display: flex; align-items: center;">
                                  <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                              <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdYear.value" :disable="nonTarget" style="text-align-last: right;"></CommonInputBox>
                              </div>
                              <div class="width48" style="display: flex; align-items: center;">
                                  <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                              <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdMonth.value" :disable="nonTarget"  style="text-align-last: right;"></CommonInputBox>
                              </div>
                          </div>
                      </div>
                      <!-- <div>
                          <label class="form_label">{{ $t('label.objt.amortizationPeriod') }}</label>
                          <div style="display: flex; align-items: center; position: relative; padding-right:60px;">
                              <CommonNumberInput maxlength="30" placeholder="0" v-model="formParam.amrtPrdMm.value" :disable="nonTarget" style="width: 100%;"></CommonNumberInput>
                              <label class="form_label" style="position: absolute; right: 0;">{{ $t('label.view.months') }}</label>
                          </div>
                      </div> -->
                      <div>
                          <label class="form_label is_required">{{ $t('label.view.holidayApplyMethod') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonHolidayApplyMethod" v-model="formParam.holidayApplyCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
                      </div>
                      <div>
                          <label class="form_label is_required">{{ $t('label.view.daysCalcMethod') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonDayCountCode" v-model="formParam.dayCountCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
                      </div>
                  </div>
                  <div class="full-width" style="padding-top: 24px;">
                      <label class="form_label">{{ $t('label.view.remark') }}</label>
                      <CommonInputBox class="width100" type="textarea" v-model="formParam.rmk.value" :disable="nonTarget"></CommonInputBox>
                  </div>
                  <!-- height  daysCalcMethod 컴포넌트 가려짐 -->
                  <div style="margin-bottom: 10%;"></div>
              </q-card-section>
              </q-card>
          </q-expansion-item>
          </q-list>
    </div>
      <div class="msg_info_form_triple_box" style="display: none;">
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.registInfo') }}</label>
                  <div class="relative-container d-flex items-center">
                      <CommonInputBox maxlength="10" v-model="formParam.registBrnm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                      <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showBraSearchPopup1()" />
                      <frmHlpBrc v-model="showBraSearch1" @selected-popup-row-data = "getPopupRowData5"></frmHlpBrc>
                  </div>
              </div>
              <div>
                  <label class="form_label is_required"></label>
                  <div class="relative-container d-flex items-center">
                      <CommonInputBox maxlength="10" v-model="formParam.registEmployeeNm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                      <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showEmpSearchPopup1()" />
                      <frmHlpEmp v-model="showEmpSearch1" @selected-popup-row-data = "getPopupRowData6"></frmHlpEmp>
                  </div>
              </div>
              <div>
                  <label class="form_label is_required"></label>
                  <div class="date_input_box">
                      <CommonCalendarYMD v-model="formParam.registDate.value" :disable="true" style="text-align-last: center;"></CommonCalendarYMD>
                  </div>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.manageInfo') }}</label>
                  <div class="relative-container d-flex items-center">
                      <CommonInputBox maxlength="10" v-model="formParam.manageBrnm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                      <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showBraSearchPopup2()" />
                      <frmHlpBrc v-model="showBraSearch2" @selected-popup-row-data = "getPopupRowData7"></frmHlpBrc>
                  </div>
              </div>
              <div>
                  <label class="form_label is_required"></label>
                  <div class="relative-container d-flex items-center">
                      <CommonInputBox maxlength="10" v-model="formParam.manageEmployeeNm.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                      <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showEmpSearchPopup2()" />
                      <frmHlpEmp v-model="showEmpSearch2" @selected-popup-row-data = "getPopupRowData8"></frmHlpEmp>
                  </div>
              </div>
              <div>
                  <label class="form_label is_required"></label>
                  <div class="date_input_box">
                      <CommonCalendarYMD v-model="formParam.manageDate.value" :disable="true" style="text-align-last: center;"></CommonCalendarYMD>
                  </div>
              </div>
          </div>
  </div>
</template>

<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref, watch } from 'vue'
import { frmHlpBir, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import lonHlpCon from 'src/components/pages/main/hlp/lon/lonHlpCon.vue'
import lonHlpDbs from 'src/components/pages/main/hlp/lon/lonHlpDbs.vue'
import lonHlpIntApplyH from 'src/components/pages/main/hlp/lon/lonHlpIntApplyH.vue'
import { useSessionStore } from 'src/stores/session'
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
  modelValues1: {
    default: {}
  },
  modelValues2: {
    default: {}
  },
  modelValues3: {
    default: {}
  },
  modelValues4: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  searchParam: {
    default: {}
  },
  isContractExpanded: {
    type: Boolean,
    default: false
  },
  isDisburseExpanded: {
    type: Boolean,
    default: false
  },
  cdDisable: {
    type: Boolean,
    default: true
  },
  nonTarget: {
    type: Boolean,
    default: false
  },
  isSearchMode: {
    default: false
  },
  updateTrxnMode: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  handleRoundFactor: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  selectedPopupRowData: {
    default: []
  },
  search: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  disburseSave: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  formParamClear: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  modelValuesClear: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  getPopupRowData1: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  disburseAmountError: {
    default: ''
  },
  disburseAmountErrorMessage: {
    default: ''
  },
  maturityDateSet: {
    type: Function,
    /**
     * Loan Period Type === '02' -> Contract Maturity Date Update
     */
    default () { }
  }
})
/* =======================================================
    Freeform Object
  ======================================================= */
const cdDisable = ref(props.cdDisable)
const nonTarget = ref(props.nonTarget)
const formParam = ref(props.formParam)
const searchParam = ref(props.searchParam)
const isSearchMode = ref(props.isSearchMode)
const selectedPopupRowData = ref(props.selectedPopupRowData)
const isContractExpanded = ref(props.isContractExpanded)
const isDisburseExpanded = ref(props.isContractExpanded)
const modelValues1 = ref(props.modelValues1)
const modelValues2 = ref(props.modelValues2)
const modelValues3 = ref(props.modelValues3)
const modelValues4 = ref(props.modelValues4)
const nonTarget2 = ref(false)
const showBirSearch = ref(false)
const showConSearch = ref(false)
const showDbsSearch = ref(false)
const showCstSearch = ref(false)
const showBraSearch1 = ref(false)
const showBraSearch2 = ref(false)
const showEmpSearch1 = ref(false)
const showEmpSearch2 = ref(false)
const showIntApplyHSearch = ref(false)
const session = useSessionStore()

/* =======================================================
    Freeform Funtion
======================================================= */
const showConSearchPopup = () => {
  showConSearch.value = true
}

const showDbsSearchPopup = () => {
  showDbsSearch.value = true
}

const showCstSearchPopup = () => {
  showCstSearch.value = true
}

const showBirSearchPopup = () => {
  if (formParam.value.transactionMode.value === 'UPDATE' && formParam.value.intRateTpcd.value === '02') { // Variable Rate 일때만 true
    showBirSearch.value = true
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

const showInterestHSearchPopup = () => {
  showIntApplyHSearch.value = true
}

const getDirectSearchData1 = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getPopupRowData1(selectedPopupRowData.value)
  }
}

const getSearchPopupData1 = async (event) => {
  selectedPopupRowData.value = event[0]
  props.getPopupRowData1(selectedPopupRowData.value)
  const originMaturityDate = formParam.value.contractMaturityDate.value
  props.maturityDateSet(originMaturityDate) // Contract의 Loan Period Type이 02인 경우 실행에서 계산하여 등록 해줘야함
}

const getDirectSearchData2 = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    getPopupRowData2(selectedPopupRowData.value)
  } else {
    props.formParamClear()
    props.modelValuesClear()
  }
}

const getSearchPopupData2 = async (event) => {
  selectedPopupRowData.value = event[0]
  getPopupRowData2(selectedPopupRowData.value)
}

const getPopupRowData2 = async (event) => {
  props.formParamClear()
  props.modelValuesClear()
  searchParam.value.disbursementNo.value = event.disbursementNo
  props.search()
}

const getPopupRowData3 = (event) => {
  selectedPopupRowData.value = event[0]
}

const getPopupRowData4 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.baseRateCode.value = selectedPopupRowData.value.baseRateCode
  formParam.value.baseRateName.value = selectedPopupRowData.value.baseRateName
  formParam.value.baseRate.value = selectedPopupRowData.value.baseRate
  formParam.value.rateTermCode.value = selectedPopupRowData.value.rateTermCode
  if (formParam.value.transactionMode.value === 'UPDATE') {
    formParam.value.baseRateApplydt.value = session.sysCurrentBusinessDate
  }
}

const getPopupRowData5 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.registBrcd.value = selectedPopupRowData.value.branchCode
  formParam.value.registBrnm.value = selectedPopupRowData.value.branchName
}

const getPopupRowData6 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.registEmployeeNo.value = selectedPopupRowData.value.employeeNo
  formParam.value.registEmployeeNm.value = selectedPopupRowData.value.employeeName
}

const getPopupRowData7 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.manageBrcd.value = selectedPopupRowData.value.branchCode
  formParam.value.manageBrnm.value = selectedPopupRowData.value.branchName
}

const getPopupRowData8 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.manageEmployeeNo.value = selectedPopupRowData.value.employeeNo
  formParam.value.manageEmployeeNm.value = selectedPopupRowData.value.employeeName
}

/* =======================================================
    Watch
  ======================================================= */
watch(() => props.nonTarget, newVal => {
  nonTarget.value = newVal
})
watch(() => props.cdDisable, newVal => {
  cdDisable.value = newVal
})
watch(() => props.isContractExpanded, newVal => {
  isContractExpanded.value = newVal
})
watch(() => props.isSearchMode, newVal => {
  isSearchMode.value = newVal
})
watch(() => props.isDisburseExpanded, newVal => {
  isDisburseExpanded.value = newVal
})
watch(() => formParam.value.transactionMode.value, newVal => {
  switch (newVal) {
    case 'NEW' :
    case 'INQUIRY' :
    case 'DELETE' :
      nonTarget2.value = true
      break
    case 'UPDATE' :
      nonTarget2.value = false
      break
    default:
      nonTarget2.value = true
      break
  }
  if (formParam.value.intRateTpcd.value === '01') {
    nonTarget2.value = true
  }
})

watch(() => formParam.value.intRateTpcd.value, newVal => {
  if (formParam.value.transactionMode.value === 'UPDATE') {
    if (newVal === '01') { // Fixed
      formParam.value.baseRateCode.value = ''
      formParam.value.baseRateName.value = ''
      formParam.value.rateTermCode.value = ''
      formParam.value.baseRate.value = 0
      formParam.value.baseRateApplydt.value = session.sysCurrentBusinessDate
      nonTarget2.value = true
    } else {
      formParam.value.baseRateApplydt.value = session.sysCurrentBusinessDate
      nonTarget2.value = false
    }
  }
})

watch(props, (newProps) => {
  if (newProps.isContractExpanded) {
    isContractExpanded.value = newProps.isContractExpanded
    isDisburseExpanded.value = newProps.isDisburseExpanded
  } else {
    isContractExpanded.value = false
    isDisburseExpanded.value = false
  }
})

watch(
  () => ({
    pastDueCalCode: formParam.value.pastDueCalCode.value,
    pastdueSpread: formParam.value.pastdueSpread.value
  }),
  (newVal) => {
    formParam.value.pastDueCalCode.value = newVal.pastDueCalCode
    formParam.value.pastdueSpread.value = newVal.pastdueSpread
    if (formParam.value.pastDueCalCode.value === '01') {
      formParam.value.pastDueInterestRate.value = Number(formParam.value.pastdueSpread.value)
      // formParam.value.pastDueInterestRate.value = pastdueSpread
    } else if (formParam.value.pastDueCalCode.value === '02') {
      formParam.value.pastDueInterestRate.value = Number(formParam.value.interestRate.value) + Number(formParam.value.pastdueSpread.value)
      // formParam.value.pastDueInterestRate.value = (interestRate + pastdueSpread) * 100
    } else if (formParam.value.pastDueCalCode.value === '03') {
      // formParam.value.pastDueInterestRate.value = Number(formParam.value.interestRate.value) * (1 + Number(formParam.value.pastdueSpread.value))
      formParam.value.pastDueInterestRate.value = (Number(formParam.value.interestRate.value) * (1 + Number(formParam.value.pastdueSpread.value) / 100)).toFixed(5)
    }
  }
)

</script>
<style scoped>
.custom-gray {
  background-color: #4850b2;
}
.bordered-items > .q-expansion-item {
  border: 1px solid rgb(153, 153, 153);
}
.text-center.full-width {
    text-align: center;
    width: 100%;

    line-height: 50px;
}
/* .new_container의 간격 설정 */
.double_input_box {
    display: flex;
    gap: 10px;
    width: 100%;
}

.double_input_box > * {
    flex: 1;
}
.relative-container {
   position: relative;
}
.all-full-row {
    grid-column-start: span 3;
}

</style>
