<template>
  <div class="height74">
                <div class="table_top_button_wrapper">
                    <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
                </div>
                <div class="msg_info_form_box q-pr-md-important">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.customer') }}</label>
                        <CommonInputBox v-model="formParam.customer.value" :disable="cdDisable"></CommonInputBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.veiw.referenceNo') }}</label>
                        <CommonInputBox v-model="formParam.assetReferNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                        <q-icon name="search" size="sm" style="margin:-20px 10px 0 0px; float: right ; transform: translateY(-50%);" class="help_button_simple"  @click="cdDisable ? null : showDbsSearchPopup()" />
                        <lonHlpDbs v-model="showDbsSearch" @selected-popup-row-data = "getDbsPopupRowData"></lonHlpDbs>
                    </div>
                    <div class="full-row">
                        <label class="form_label is_required">{{ $t('label.objt.productCode') }}</label>
                        <div class="horizontal-layout d-flex items-center">
                            <CommonInputBox maxlength="3" v-model="formParam.productCode.value" style="width: 300px; text-align-last: center;" :disable="cdDisable"></CommonInputBox>
                            <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="cdDisable ? null :showPrdSearchPopup()" />
                                <lonHlpPrd :product-Code=formParam.productCode.value v-model="showPrdSearch" @selected-popup-row-data = "getPrdPopupRowData"></lonHlpPrd>
                            <CommonInputBox maxlength="3" v-model="formParam.productName.value" :disable="cdDisable" class="w_100" style="width: 100%; margin-left: -20px;"></CommonInputBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.disbursementDate') }}</label>
                        <CommonInputBox v-model="formParam.disbursementDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.maturityDate') }}</label>
                        <CommonInputBox v-model="formParam.maturity.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                        <label class="form_label" style="vertical-align: top;">{{ $t('label.view.classAmt') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                :modelValues="classAmtModelValues"
                                 style="width: 100%; text-align-last: center;" :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.view.pastDueDate') }}</label>
                        <CommonInputBox v-model="formParam.pastdueOccurDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                          <label class="form_label is_required">{{ $t('label.view.finalClassification') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcTypeCodeFinal.value" :disable="cdDisable" ></CommonSearchSelectBox>
                    </div>
                    <div>
                          <label class="form_label is_required">{{ $t('label.view.aqcCodeSys') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcCodeSys.value" :disable="cdDisable" ></CommonSearchSelectBox>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.view.allowanceRatio') }}</label>
                        <CommonInputBox v-model="formParam.requestReserveRate.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                        <div>
                            <label class="form_label" style="display: inline;">{{ $t('label.view.reqRrvAmtExRT') }}</label>
                        </div>
                        <div class="double_table_container_2">
                             <div class="double_input_box" style="width: 150%;">
                                 <CommonCurFormatterBox
                                 :modelValues="requestReserveModelValues"
                                 :selectDisabled="cdDisable" :inputDisabled="cdDisable" style="text-align-last: center;">
                                 </CommonCurFormatterBox>
                            </div>
                            <div style="position: relative;">
                                <div style="width: 50%; position: absolute; right: 0; margin: 0 10px;">
                                    <CommonInputBox v-model="formParam.exchangeRate.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                          <label class="form_label">{{ $t('label.view.aqcBasicType') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonAqcMethodCode" v-model="formParam.aqcBasicTpcd.value" :disable="nonTarget" ></CommonSearchSelectBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.view.adjustmentDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.aqcDateAdj.value" :disable="nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                    </div>
                    <div>
                          <label class="form_label">{{ $t('label.view.adjustmentAqcType') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.lonAqcTypeCode" v-model="formParam.aqcCodeAdj.value" :disable="nonTarget" ></CommonSearchSelectBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.view.adjustmentValidityPeriod') }}</label>
                        <CommonCalendarYMD v-model="formParam.adjustValidityDate.value" :disable="nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                    </div>
                    <div class="full-row">
                        <label class="form_label">{{ $t('label.view.adjustmentReason') }}</label>
                        <CommonInputBox v-model="formParam.aqcReasonAdj.value" :disable="nonTarget"></CommonInputBox>
                    </div>
                </div>
                <div class="msg_info_form_triple_box" style="display: none;">
                </div>
            </div>
</template>

<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
// import { messageBox, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
// import { i18n } from 'boot/i18n'
import lonHlpPrd from 'src/components/pages/main/hlp/lon/lonHlpPrd.vue'
import lonHlpDbs from 'src/components/pages/main/hlp/lon/lonHlpDbs.vue'
/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  customer: {
    default: {}
  },
  searchParam: {
    default: {}
  },
  radioDisableFlag: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  classAmtModelValues: {
    default: {}
  },
  requestReserveModelValues: {
    default: {}
  },
  showPrdSearch: {
    default: false
  },
  showDbsSearch: {
    default: false
  },
  cdDisable: {
    default: true
  },
  nonTarget: {
    default: false
  },
  errorMessage: {
    default: 'Pledge Amount cannot exceed Max Amount.'
  },
  error: {
    type: Boolean
  },
  showConSearchPopup: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  showApcSearchPopup: {
    type: Function,
    /**
     *
     */
    default () {
    }
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
  getPrdPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getDbsPopupRowData: {
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
  rowData: {
    default: []
  }

})
/* =======================================================
    Freeform Object
  ======================================================= */
const formParam = ref(props.formParam)
const showPrdSearch = ref(props.showPrdSearch)
const showDbsSearch = ref(props.showDbsSearch)
/* =======================================================
    Freeform Funtion
======================================================= */
const showPrdSearchPopup = () => {
  showPrdSearch.value = true
}

const showDbsSearchPopup = () => {
  showDbsSearch.value = true
}
</script>

<style scoped>
.relative-container {
   position: relative;
   display: flex;
}
.relative-container1 {
   position: relative;
}
.full-row {
    grid-column-start: span 2;
}
.horizontal-layout {
   display: flex; /* Use flex for the inner items */
   justify-content: flex-start;
   gap: 10px;
}
.double_input_box {
    display: flex;
    gap: 10px;
    width: 100%;
}

.double_input_box > * {
    flex: 1;
}
.q-pr-md-important {
  padding-right: 16px !important; /* q-pr-md의 기본 값은 16px */
}
</style>
