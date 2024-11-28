<template>
    <div class="height74">
                <div class="table_top_button_wrapper">
                    <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
                </div>
                  <div class="msg_info_form_box q-pr-md-important">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeNo') }}</label>
                        <CommonInputBox v-model="formParam.pledgeNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeStatus') }}</label>
                        <CommonSearchSelectBox :codeList="commonCodeList.pledgeStatusListCode" v-model="formParam.pledgeStatusCode.value" :disable="nonTarget"  ></CommonSearchSelectBox>
                    </div>
                    <div class="full-row">
                        <label class="form_label is_required">{{ $t('label.objt.collateralNo') }}</label>
                        <div class="horizontal-layout d-flex items-center">
                            <CommonInputBox class = "width25" maxlength="3" v-model="formParam.collateralNo.value" :disable="cdDisable"></CommonInputBox>
                            <q-icon name="search" size="sm" style="margin:0 20px 0 -35px;" class="help_button_simple" @click="nonTarget ? null :showColSearchPopup1()" />
                                <lonHlpCol :collateral-Status-Cd=searchParam.collateralStatusCd.value v-model="showColSearch1" @selected-popup-row-data = "getPopupRowData1"></lonHlpCol>
                            <CommonInputBox class = "width74" maxlength="3" v-model="formParam.collateralTitleName.value" :disable="cdDisable" style=" margin-left: -20px;"></CommonInputBox>
                        </div>
                    </div>
                    <div class="full-row">
                        <label class="form_label is_required">{{ $t('label.view.loanCustomer') }}</label>
                        <div class="horizontal-layout d-flex items-center">
                            <CommonInputBox class = "width25" maxlength="3" v-model="formParam.customerNo.value" :disable="cdDisable"></CommonInputBox>
                            <q-icon name="search" size="sm" style="margin:0 20px 0 -35px;" class="help_button_simple" @click="cdDisable ? null : showCstSearchPopup()" />
                                <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getPopupRowData2"></frmHlpCst>
                            <CommonInputBox class = "width74" maxlength="3" v-model="formParam.customerName.value" :disable="cdDisable" style=" margin-left: -20px;"></CommonInputBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.priority') }}</label>
                        <CommonInputBox maxlength="500" v-model="formParam.priority.value" ref="configDesc" :disable="cdDisable" style="text-align-last: center;"/>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.pledgeDate.value" :disable="(formParam.pledgeStatusCode.value === '90') || nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeType') }}</label>
                        <CommonSearchSelectBox :codeList="commonCodeList.pledgeTypeListCode" v-model="formParam.pledgeTpcd.value" :disable="nonTarget"  ></CommonSearchSelectBox>
                    </div>
                    <div>
                        <div class="width49" style="display: inline-block;margin-right: 1%;">
                            <label class="form_label">{{ $t('label.objt.expireDate') }}</label>
                            <CommonCalendarYMD v-model="formParam.expireDate.value" :disable="(formParam.pledgeStatusCode.value === '90') || nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                        </div>
                        <div class="width49" style="display: inline-block;">
                            <label class="form_label">{{ $t('label.objt.releaseDate') }}</label>
                            <CommonCalendarYMD v-model="formParam.releaseDate.value" :disable="(formParam.pledgeStatusCode.value !== '90') || nonTarget" style="text-align-last: center;"></CommonCalendarYMD>
                        </div>
                    </div>
                    <div>
                        <label :class="{'form_label': true, 'is_required': formParam.pledgeStatusCode.value === '10' }">{{ $t('label.objt.applicationNo') }}</label>
                        <div class="relative-container1 d-flex items-center">
                            <CommonInputBox maxlength="10" v-model="formParam.applicationNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="(formParam.pledgeStatusCode.value === '90') || nonTarget ? null : showApcSearchPopupFr()" />
                            <lonHlpApc
                            :customer-No=formParam.customerNo.value
                            :customer-Name=formParam.customerName.value
                            :progress-Status=searchParam.progressStatus.value
                            :show-apc-search="showApcSearch"
                            v-model="showApcSearch"
                            @selected-popup-row-data = "getPopupRowData3">
                        </lonHlpApc>
                        </div>
                    </div>
                    <div>
                        <label :class="{'form_label': true, 'is_required': formParam.pledgeStatusCode.value === '20' }">{{ $t('label.objt.contractNo') }}</label>
                        <div class="relative-container1 d-flex items-center">
                            <CommonInputBox maxlength="10" v-model="formParam.contractNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="(formParam.pledgeStatusCode.value === '90') || nonTarget ? null : showConSearchPopupFr()" />
                            <lonHlpCon
                                :customer-No=formParam.customerNo.value
                                :customer-Name=formParam.customerName.value
                                v-model="showConSearch"
                                @selected-popup-row-data = "getPopupRowData4">
                            </lonHlpCon>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.objt.reviewedAmount') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues"
                                :selectDisabled="cdDisable" :inputDisabled="(formParam.pledgeStatusCode.value === '90') || nonTarget">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.objt.pledgeAmount') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues2"
                                :selectDisabled="cdDisable" :inputDisabled="(formParam.pledgeStatusCode.value === '90') || nonTarget" :error="error" :errorMessage="errorMessage">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.collateralRecogRatio') }}</label>
                        <div style="display:flex; align-items: center;">
                          <CommonInputBox class="width95" maxlength="30" v-model="formParam.recognitionRatio.value" :disable="(formParam.pledgeStatusCode.value === '90') || nonTarget" ref="fixedInterestRate" style="text-align-last: right;"></CommonInputBox>
                          &nbsp;&nbsp;<q-icon style="float:right;" name="percent" />
                        </div>
                    </div>
                    <div>
                        <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.ourComPriorLien') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues3"
                                :selectDisabled="cdDisable" :inputDisabled="(formParam.pledgeStatusCode.value === '90') || nonTarget">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.objt.colValue') }} (= Reviewd*Ratio)</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues4"
                                :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label" style="vertical-align: top;">{{ $t('label.objt.otherComPriorLen') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues5"
                                :selectDisabled="cdDisable" :inputDisabled="(formParam.pledgeStatusCode.value === '90') || nonTarget">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div></div>
                    <div>
                        <label class="form_label is_required" style="vertical-align: top;">{{ $t('label.objt.maxPledgeAMT') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues6"
                                :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div class="full-row">
                        <label class="form_label">{{ $t('label.view.remark') }}</label>
                        <CommonInputBox v-model="formParam.rmk.value" :disable="nonTarget"></CommonInputBox>
                    </div>
                  </div>
                <div class="msg_info_form_triple_box" style="display: none;">
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
</template>

<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import lonHlpCon from 'src/components/pages/main/hlp/lon/lonHlpCon.vue'
import lonHlpCol from 'src/components/pages/main/hlp/lon/lonHlpCol.vue'
import { messageBox, frmHlpCst, frmHlpBrc, frmHlpEmp } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'

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
  commonCodeList: {
    default: []
  },
  modelValues: {
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
  modelValues5: {
    default: {}
  },
  modelValues6: {
    default: {}
  },
  showConSearch: {
    type: Boolean,
    default: false
  },
  showApcSearch: {
    type: Boolean,
    default: false
  },
  showColSearch1: {
    default: false
  },
  showCstSearch: {
    default: false
  },
  showBraSearch1: {
    default: false
  },
  showEmpSearch1: {
    default: false
  },
  showEmpSearch2: {
    default: false
  },
  showBraSearch2: {
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
  getPopupRowData1: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData2: {
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
// const showApcSearch = ref(false)
// const showConSearch = ref(false)
const formParam = ref(props.formParam)
const searchParam = ref(props.searchParam)
const showConSearch = ref(props.showConSearch)
const showApcSearch = ref(props.showApcSearch)

const showBraSearch1 = ref(props.showBraSearch1)
const showEmpSearch1 = ref(props.showEmpSearch1)
const showBraSearch2 = ref(props.showBraSearch2)
const showEmpSearch2 = ref(props.showEmpSearch2)
const showColSearch1 = ref(props.showColSearch1)
const showCstSearch = ref(props.showCstSearch)

const selectedPopupRowData = ref(props.selectedPopupRowData)
const rowData = ref(props.rowData)

/* =======================================================
    Freeform Funtion
======================================================= */

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

const showColSearchPopup1 = () => {
  showColSearch1.value = true
}

const showCstSearchPopup = () => {
  showCstSearch.value = true
}

const getPopupRowData3 = (event) => {
  selectedPopupRowData.value = event[0]
  const existingApplication = rowData.value.find(row => row.applicationNo === selectedPopupRowData.value.applicationNo)
  if (existingApplication) {
    messageBox.alertInfo(i18n.global.t('This is an already registered application number.')).onOk(() => {
      showApcSearchPopupFr()
    })
  } else {
    formParam.value.applicationNo.value = selectedPopupRowData.value.applicationNo
  }
}

const getPopupRowData4 = (event) => {
  selectedPopupRowData.value = event[0]
  const existingApplication = rowData.value.find(row => row.contractNo === selectedPopupRowData.value.contractNo)
  if (existingApplication) {
    messageBox.alertInfo(i18n.global.t('This is an already registered contract number.')).onOk(() => {
      showConSearchPopupFr()
    })
  } else {
    formParam.value.contractNo.value = selectedPopupRowData.value.contractNo
  }
}

const showConSearchPopupFr = () => {
  showConSearch.value = true
}

const showApcSearchPopupFr = () => {
  showApcSearch.value = true
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
