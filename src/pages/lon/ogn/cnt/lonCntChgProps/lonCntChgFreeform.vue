<template>
  <q-tabs
              v-model="tab"
              align="left"
                indicator-color="transparent"
                active-color="deep-purple-10"
                active-bg-color="white"
            >
              <q-tab name="contract" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.view.contract')"/>
              <q-tab name="applicants" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.applicants')" />
            </q-tabs>
            <q-tab-panels v-model="tab" class="tab_border height80">
                <q-tab-panel name="contract" class="" >
                    <div class="table_top_button_wrapper">
                        <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
                    </div>
                    <div class="scrollable-container height65">

                        <div class="msg_info_form_triple_box">
                          <div>
                              <label class="form_label is_required">{{ $t('label.objt.applicationNo') }}</label>
                              <div class="relative-container1 d-flex items-center">
                                <template v-if="formParam.transactionMode.value === 'NEW'">
                                  <CommonDirectSearchBox class="width100" maxlength="30" :placeholder="placeholder()" :disable="apcDisable"></CommonDirectSearchBox>
                                </template>
                                <template v-if="formParam.transactionMode.value !== 'NEW'">
                                  <CommonDirectSearchBox class="width100" maxlength="30" :placeholder="placeholder()" v-model="formParam.applicationNo.value" @update:model-value="newValue => applicationNoChange(newValue)" hlpType="lonHlpApc" ref="applicationNo" :searchCode="formParam.applicationNo.value" :disable="apcDisable" @directSearchVal="getDirectSearchData"></CommonDirectSearchBox>
                                </template>
                                <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="apcDisable ? null : showPopup('apc')" />
                                <lonHlpApc v-model="showApcSearch" :select-type="'changeApplication'" @selected-popup-row-data = "getApcPopupRowData"></lonHlpApc>
                              </div>
                            </div>
                            <div>
                                <label class="form_label is_required">{{ $t('label.objt.contractNo') }}</label>
                                <div class="relative-container1 d-flex items-center">
                                    <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.contractNo.value" hlpType="lonHlpCon" :searchCode="formParam.contractNo.value" :disable="cCDisable" @directSearchVal="getcntDirectSearch"></CommonDirectSearchBox>
                                    <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cCDisable ? null : showPopup('con')" />
                                    <lonHlpCon
                                        v-model="showConSearch"
                                        :prgsStatusCode="searchParam.prgsStatusCode.value"
                                        @selected-popup-row-data = "getConPopupRowData">
                                    </lonHlpCon>
                                </div>
                            </div>

                          <div>
                              <label class="form_label is_required">{{ $t('label.objt.progressStatus') }}</label>
                              <CommonSelectBox :codeList="commonCodeList.progressStatus" v-model="formParam.prgsStatusCode.value" :disable="cdDisable"></CommonSelectBox>
                          </div>
                          <div>
                              <label class="form_label is_required">{{ $t('label.view.customer') }}</label>
                              <div style=" display: flex; align-items: center">
                                  <CommonInputBox class="width37" maxlength="30" v-model="formParam.customerNo.value" :disable=cdDisable ref="customerNo" style="text-align-last: center; margin-right: 8px;"></CommonInputBox>
                                  <CommonInputBox class="width61" maxlength="30" v-model="formParam.customerName.value" :disable=cdDisable ref="customerName" style="text-align-last: center;"></CommonInputBox>
                              </div>
                          </div>
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.productType') }}</label>
                            <div class="width100" style="display: flex; align-items: center;">
                              <CommonInputBox class="width37" v-model="formParam.productCode.value" :disable=cdDisable style="text-align-last: center; margin-right: 8px;"></CommonInputBox>
                              <CommonInputBox class="width61" v-model="formParam.productName.value" :disable=cdDisable style="text-align-last: left;"></CommonInputBox>
                            </div>
                          </div>
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.loanMethod') }}</label>
                            <CommonSelectBox :codeList="commonCodeList.loanMethod" v-model="formParam.creditLineTpcd.value" :disable="cdDisable"></CommonSelectBox>
                          </div>
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.contractDate') }}</label>
                            <div class="date_input_box">
                                <CommonCalendarYMD v-model="formParam.contractDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
                            </div>
                          </div>
                          <div>
                              <label class="form_label is_required">{{ $t('label.objt.repaymentSource') }}</label>
                              <CommonSelectBox :codeList="commonCodeList.repaymentSource" v-model="formParam.repaySourceCode.value" :disable="cdDisable"></CommonSelectBox>
                          </div>
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.fundPurpose') }}</label>
                            <CommonSelectBox :codeList="commonCodeList.fundPurpose" v-model="formParam.fundPurposeCode.value" :disable="cdDisable"></CommonSelectBox>
                          </div>
                          <div>
                              <label class="form_label is_required">{{ $t('label.objt.repaymentProgram') }}</label>
                              <CommonSelectBox :codeList="commonCodeList.repaymentProgram" v-model="formParam.repayProgTpcd.value" :disable="cdDisable"></CommonSelectBox>
                          </div>
                        </div>

                        <div class="msg_info_form_triple_box" style="margin-top: 10px;">
                            <q-list class="custom-gray rounded-borders all-full-row bordered-items" >

                              <div class="text-center text-white full-width">{{ $t('label.view.contractChangeApc') }}</div>
                              <q-card :bordered="true">
                                <q-card-section>
                                  <div class="msg_info_form_triple_box">
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.applicationType') }}</label>
                            <CommonSelectBox :codeList="commonCodeList.applicationType" @update:model-value="changeApc" v-model="formParam.applicationTpcd.value" :disable="apcTypeDisable"></CommonSelectBox>
                          </div>
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.applicationDate') }}</label>
                            <CommonCalendarYMD v-model="formParam.applicationDate.value" :disable="cCDisable" style="text-align-last: center;"></CommonCalendarYMD>
                          </div>
                        </div>
                        <div class="msg_info_form_triple_box">
                            <div>
                                <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.view.contractAmt') }}</label>
                                <div class="double_input_box">
                                    <CommonCurFormatterBox
                                        class="width100"
                                        :modelValues="contractCurForm"
                                        :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                            <div>
                                <label class="form_label" style="vertical-align: top;">{{ $t('label.view.changeApcAmt') }}</label>
                                <div class="double_input_box">
                                    <CommonCurFormatterBox
                                        class="width100"
                                        :modelValues="changeAmtCurForm"
                                        :selectDisabled="cdDisable" :inputDisabled="amountFlag">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                            <div>
                                <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.objt.contractBalance') }}</label>
                                <div class="double_input_box">
                                    <CommonCurFormatterBox
                                        class="width100"
                                        :modelValues="balanceCurForm"
                                        :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                        </div>
                        <div class="msg_info_form_triple_box">
                          <div>
                              <label class="form_label is_required">{{ $t('label.view.cntMaturityDate') }}</label>
                              <CommonCalendarYMD maxlength="30" v-model="formParam.maturityDate.value" :disable=cdDisable  style="text-align-last: center;"></CommonCalendarYMD>
                          </div>
                          <div>
                              <label class="form_label">{{ $t('label.view.changeMaturity') }}</label>
                              <CommonCalendarYMD maxlength="30" v-model="formParam.changeMaturityDate.value" :disable=maturityFlag  style="text-align-last: center;"></CommonCalendarYMD>
                          </div>
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.gracePeriod') }}</label>
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <div class="width47" style="display: flex; align-items: center;">
                                    <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.year') }}</label>
                                <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdYear.value" :disable="maturityFlag"  style="text-align-last: right;"></CommonInputBox>
                                </div>
                                <div class="width47" style="display: flex; align-items: center;">
                                    <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.month') }}</label>
                                <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdMonth.value" :disable="maturityFlag"  style="text-align-last: right;"></CommonInputBox>
                                </div>
                            </div>
                          </div>

                          <div>
                              <label class="form_label is_required">{{ $t('label.objt.intRateType') }}</label>
                              <CommonSelectBox :codeList="commonCodeList.intRateType" @update:model-value="intRateTypeChange" v-model="formParam.changeIntRateTpcd.value" :disable="rateFlag" style="margin-bottom: 10px;"></CommonSelectBox>
                              <CommonSelectBox :codeList="commonCodeList.intRateType" v-model="formParam.intRateTpcd.value" :disable="cdDisable"></CommonSelectBox>
                          </div>
                          <div>
                              <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
                              <div class="relative-container1 d-flex items-center" style="padding-bottom: 10px;">
                                <CommonInputBox class="width100" v-model="formParam.changeBaseRateName.value" :disable=cdDisable style="text-align-last: left;"></CommonInputBox>
                                <q-icon name="search" size="sm" style="position:absolute; right:10px; top:40%; transform: translateY(-50%);" class="help_button_simple" @click="baseRateFlag ? null : showPopup('bir')" />
                                <frmHlpBir :base-date=formParam.contractDate.value v-model="showBirSearch" @selected-popup-row-data = "getBirPopupRowData"></frmHlpBir>
                              </div>
                              <div class="relative-container1 d-flex items-center">
                                <CommonInputBox class="width100" v-model="formParam.baseRateName.value" :disable=cdDisable style="text-align-last: left;"></CommonInputBox>
                                <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" />
                              </div>
                          </div>
                          <div style="align-items: center;">
                            <div class="width100">
                                <label class="form_label is_required">{{ $t('label.view.spreadPercent') }}</label>
                                <div style="align-items: center;">
                                <CommonInputBox placeholder="0" maxlength="30" v-model="formParam.changeSpreadRate.value" :disable="spreadRateFlag" style="text-align-last: right; padding-bottom: 10px;"></CommonInputBox>
                                <CommonInputBox placeholder="0" maxlength="30" v-model="formParam.spreadRate.value" :disable="cdDisable" style="text-align-last: right;"></CommonInputBox>
                                </div>
                            </div>
                          </div>

                          </div>
                          <div class="msg_info_form_single_box">
                            <div>
                                <label class="form_label">{{ $t('label.objt.remark') }}</label>
                                <CommonInputBox class="height10" :disable=nonTarget type="textarea" v-model="formParam.rmk.value"></CommonInputBox>
                            </div>
                          </div>
                                </q-card-section>
                              </q-card>
                            </q-list>
                        </div>

                    </div>
                </q-tab-panel>
            </q-tab-panels>
</template>
<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
import { frmHlpBir } from 'skylark-ui-lib'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import lonHlpCon from 'src/components/pages/main/hlp/lon/lonHlpCon.vue'
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
  contractCurForm: {
    default: {}
  },
  changeAmtCurForm: {
    default: {}
  },
  balanceCurForm: {
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
  cdDisable: {
    default: true
  },
  cCDisable: {
    default: false
  },
  apcDisable: {
    default: false
  },
  nonTarget: {
    default: false
  },
  amountFlag: {
    default: false
  },
  maturityFlag: {
    default: false
  },
  rateFlag: {
    default: false
  },
  baseRateFlag: {
    default: false
  },
  spreadRateFlag: {
    default: false
  },
  apcTypeDisable: {
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
  changeApc: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  intRateTypeChange: {
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
const formParam = ref(props.formParam)
const showApcSearch = ref(props.showApcSearch)
const showConSearch = ref(props.showConSearch)
const showBirSearch = ref(props.showBirSearch)
const tab = ref('contract')
/* =======================================================
    Freeform Funtion
======================================================= */

const showPopup = (type, param1, param2, param3, param4) => {
  switch (type) {
    case 'apc' : showApcSearch.value = true; break
    case 'bir' : showBirSearch.value = true; break
    case 'con' : showConSearch.value = true; break
  }
}

const selectedPopupRowData = ref([])

const getDirectSearchData = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    props.getApcPopupRowData(selectedPopupRowData.value)
  }
}

const getcntDirectSearch = async (event) => {
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

</script>
<style scoped>
.double_input_box {
    display: flex;
    gap: 10px;
}
.relative-container1 {
   position: relative;
}
.custom-gray {
  background-color: #4850b2;
}

.text-center.full-width {
    text-align: center;
    line-height: 50px;
}
.bordered-items > .q-expansion-item {
  border: 1px solid rgb(153, 153, 153);
}
.msg_info_form_triple_box {
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: visible;
}
</style>
