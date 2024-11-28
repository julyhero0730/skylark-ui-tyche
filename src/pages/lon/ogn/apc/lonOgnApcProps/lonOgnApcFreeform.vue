<template>
        <div class="table_top_button_wrapper">
            <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
        </div>
        <div class="scrollable-container height65 q-pr-md">

          <div class="triple_box">
              <div>
                  <label class="form_label">{{ $t('label.objt.applicationNo') }}</label>
                  <div class="width100" style=" display: flex; align-items: center;">
                    <template v-if="formParam.transactionMode.value !== 'INQUIRY'">
                    <CommonInputBox class="width100" outlined placeholder="Auto Generate" :disable=apcDisableFlag @update:model-value="newValue => applicationNoChange(newValue)" maxlength="30" v-model="formParam.applicationNo.value" ref="applicationNo" style="text-align-last: center;"></CommonInputBox>
                    </template>
                    <template v-if="formParam.transactionMode.value === 'INQUIRY'">
                    <CommonDirectSearchBox class="width100" outlined :disable=apcDisableFlag maxlength="30" v-model="formParam.applicationNo.value" hlpType="lonHlpApc" :searchCode="formParam.applicationNo.value" @directSearchVal="getApcDirectSearch" style="text-align-last: center;"></CommonDirectSearchBox>
                    </template>
                    <q-icon name="search" size="sm" style="margin-left:-30px;" class="help_button_simple" @click="showPopup('apc')" />
                    <lonHlpApc v-model="showApcSearch" :select-type="'newApplication'" @selected-popup-row-data = "getApcPopupRowData"></lonHlpApc>
                  </div>
              </div>
              <div>
                <label class="form_label is_required">{{ $t('label.view.customer') }}</label>
                <div style="display: flex; align-items: center">
                  <CommonDirectSearchBox class="width37" maxlength="30" v-model="formParam.customerNo.value" :disable=disableFlag ref="customerNo" hlpType="frmHlpCst" :searchCode="formParam.customerNo.value" @directSearchVal="getCstDirectSearch" style="margin-right:8px;"></CommonDirectSearchBox>
                  <CommonInputBox class="width61" maxlength="30" v-model="formParam.customerName.value" :readonly="true" :disable=disableFlag ref="customerName" style="text-align-last: center;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" @click="showPopup('cust')" />
                  <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data = "getCustPopupRowData"></frmHlpCst>
                </div>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.prgsStatusCode') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.prgsStatusCode" v-model="formParam.prgsStatusCode.value" :disable="fixFlag"></CommonSelectBox>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.applicationTpcd') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.applicationTpcd" v-model="formParam.applicationTpcd.value" :disable="true"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label is_required">{{ $t('label.objt.productCode') }}</label>
                <div class="width100" style="display: flex; align-items: center;">
                  <CommonDirectSearchBox class="width37" maxlength="30" v-model="formParam.productCode.value" :disable=disableFlag ref="productName" hlpType="lonHlpPrd" :searchCode="formParam.productCode.value" @directSearchVal="getPrdDirectSearch" style="margin-right:8px;"></CommonDirectSearchBox>
                  <CommonInputBox class="width61" v-model="formParam.productName.value" :readonly="true" :disable=disableFlag ref="productName" style="text-align-last: left;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" @click="showPopup('prd')" />
                  <lonHlpPrd v-model="showPrdSearch" @selected-popup-row-data = "getPrdPopupRowData"></lonHlpPrd>
                </div>
              </div>

              <div>
                  <label class="form_label">{{ $t('label.objt.contractNo') }}</label>
                  <CommonInputBox maxlength="30" v-model="formParam.contractNo.value" :disable=fixFlag ref="contractNo" style="text-align-last: center;"></CommonInputBox>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.applicationDate') }}</label>
                  <CommonCalendarYMD v-model="formParam.applicationDate.value" :disable="disableFlag" style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                <label class="form_label is_required">{{ $t('label.objt.creditLineTpcd') }}</label>
                <CommonSelectBox :codeList="commonCodeList.creditLineTpcd" v-model="formParam.creditLineTpcd.value" :disable="creditLineFlag"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.fundPurposeCode') }}</label>
                <CommonSelectBox :codeList="commonCodeList.fundPurposeCode" v-model="formParam.fundPurposeCode.value" :disable="disableFlag"></CommonSelectBox>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.applicationAmount') }}</label>
                <div class="double_input_box">
                    <CommonCurFormatterBox
                        class="width100"
                        :modelValues="modelValues"
                        :selectDisabled="disableFlag" :inputDisabled="disableFlag">
                    </CommonCurFormatterBox>
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.repaySourceCode') }}</label>
                <CommonSelectBox :codeList="commonCodeList.repaySourceCode" v-model="formParam.repaySourceCode.value" :disable="disableFlag"></CommonSelectBox>
              </div>
            </div>
            <!-- Loan Info -->
            <div class="triple_box">
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.intRateType') }}</label>
                  <CommonSelectBox :selectChangeFunc="intRatetTypeChange" ref="intRateType" :codeList="commonCodeList.intRateType" v-model="formParam.intRateTpcd.value" :disable="intRateTypeFlag"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.baseRateType') }}</label>
                <div class="width100" style="display: flex; align-items: center;">
                  <CommonInputBox class="width100" v-model="formParam.baseRateName.value" :disable=variablaFlag :readonly="true" ref="baseRateCode" style="text-align-last: left;"></CommonInputBox>
                  <q-icon :disable=variablaFlag  name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" @click="showPopup('bir')" />
                  <frmHlpBir
                    :business-Code=formParam.businessCode.value
                    :baseDate=formParam.applicationDate.value
                    v-model="showBirSearch"
                    @selected-popup-row-data="getBirPopupRowData"
                  ></frmHlpBir>
                </div>
              </div>
              <div>
                  <label class="form_label">{{ $t('label.objt.baseRateApplyDate') }}</label>
                  <CommonCalendarYMD maxlength="30" v-model="formParam.baseRateApplydt.value" :disable=variablaFlag ref="baseRateApplydt" style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.baseRate') }}</label>
                <div style="display:flex; align-items: center;">
                  <CommonInputBox class="width95" v-model="formParam.baseRate.value" :disable=variablaFlag :readonly="true" ref="baseRate" style="text-align-last: right;"></CommonInputBox>
                  &nbsp;&nbsp;<q-icon style="float:right;" name="percent" />
                </div>
              </div>
              <div>
                <label class="form_label is_required">{{ $t('label.objt.spread') }}</label>
                <div style="display:flex; align-items: center;">
                  <CommonInputBox class="width95" @update:model-value="newValue => changeSpread(newValue)" maxlength="30" v-model="formParam.spreadRate.value" :disable=disableFlag ref="spreadRate" style="text-align-last: right;"></CommonInputBox>
                  &nbsp;<q-icon style="float:right;" name="percent" />&nbsp;&nbsp;
                </div>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.interestRate') }}</label>
                <div style="display:flex; align-items: center;">
                  <CommonInputBox class="width95" maxlength="30" v-model="formParam.interestRate.value" :disable=true ref="interestRate" style="text-align-last: right;"></CommonInputBox>
                  &nbsp;<q-icon style="float:right;" name="percent" />
                </div>
              </div>
              <div>
                  <label class="form_label">{{ $t('label.objt.loanPrdTpcd') }}</label>
                  <CommonSelectBox :selectChangeFunc="periodChange()" :codeList="commonCodeList.loanPrdTpcd" v-model="formParam.loanPrdTpcd.value" :disable="disableFlag"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.loanTerm') }}</label>
                <div style="display:flex; align-items: center;">
                  {{ $t('label.view.year') }}
                  <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermYear.value" :disable="loanTermFlag" ref="loanTermYear" style="text-align-last: right; margin: 0px 10px"></CommonInputBox>
                  <div style="margin: 0 5px 0 10px;">{{ $t('label.view.months') }}</div>
                  <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.loanTermMonth.value" :disable="loanTermFlag" ref="loanTermMonth" style="text-align-last: right;"></CommonInputBox>
                </div>
              </div>
              <div>
                  <label class="form_label">{{ $t('label.objt.maturityDate') }}</label>
                  <CommonCalendarYMD maxlength="30" v-model="formParam.maturityDate.value" :disable=loanMaturityFlag ref="maturityDate" style="text-align-last: center;"></CommonCalendarYMD>
              </div>
              <div>
                  <label class="form_label is_required">{{ $t('label.objt.repayProgTpcd') }}</label>
                  <CommonSelectBox :codeList="commonCodeList.repayProgTpcd" v-model="formParam.repayProgTpcd.value" :disable="repayProgFlag"></CommonSelectBox>
              </div>
              <div>
                <label class="form_label">{{ $t('label.objt.gracePeriod') }}</label>
                <div style="display:flex; align-items: center;">
                  {{ $t('label.view.year') }}
                  <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdYear.value" :disable=disableFlag ref="gracePrdYear" style="text-align-last: right; margin: 0px 10px"></CommonInputBox>
                  <div style="margin: 0 5px 0 10px;">{{ $t('label.view.months') }}</div>
                  <CommonInputBox maxlength="30" placeholder="0" v-model="formParam.gracePrdMonth.value" :disable=disableFlag ref="gracePrdMonth" style="text-align-last: right;"></CommonInputBox>
                </div>
              </div>
            </div>
            <div class="msg_info_form_single_box">
              <div>
                  <label class="form_label">{{ $t('label.objt.remark') }}</label>
                  <CommonInputBox class="height10" :disable=disableFlag type="textarea" v-model="formParam.rmk.value"></CommonInputBox>
              </div>
            </div>
            <div class="triple_box" style="display: none;">
              <div>
                <label class="form_label is_required">{{ $t('label.objt.registInfo') }}</label>
                <div style="display: flex; align-items: center;">
                  <CommonInputBox maxlength="30" v-model="formParam.registBrcd.value" :disable=true style="width:373px; text-align-last: center;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" @click="fixFlag ? null : showPopup('brch1')" />
                  <frmHlpBrc v-model="showBranch1Search" @selected-popup-row-data = "getBranch1PopupRowData" ></frmHlpBrc>
                </div>
              </div>
              <div style="margin-top:26px;">
                <div style="display: flex; align-items: center;">
                  <CommonInputBox maxlength="30" v-model="formParam.registEmployeeNo.value" :disable=true style="width:373px; text-align-last: center;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" :disable=true @click="fixFlag ? null : showPopup('usr1')" />
                  <frmHlpEmp v-model="showUser1Search" @selected-popup-row-data = "getUser1PopupRowData" ></frmHlpEmp>
                </div>
              </div>
              <div style="margin-top:26px;">
                <CommonCalendarYMD maxlength="30" v-model="formParam.registDate.value" :disable=true ref="registDate" style="text-align-last: center; width:100%"></CommonCalendarYMD>
              </div>
            </div>
            <div class="triple_box" style="display: none;">
              <div>
                <label class="form_label is_required">{{ $t('label.objt.manageInfo') }}</label>
                <div style=" display: flex; align-items: center;">
                  <CommonInputBox maxlength="30" v-model="formParam.manageBrcd.value" :disable=true style="width:373px; text-align-last: center;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" @click="fixFlag ? null : showPopup('brch2')" />
                  <frmHlpBrc v-model="showBranch2Search" @selected-popup-row-data = "getBranch2PopupRowData"></frmHlpBrc>
                </div>
              </div>
              <div style="margin-top:26px;">
                <div style=" display: flex; align-items: center;">
                  <CommonInputBox maxlength="30" v-model="formParam.manageEmployeeNo.value" :disable=true style="width:373px; text-align-last: center;"></CommonInputBox>
                  <q-icon name="search" size="sm" style="margin:0 0px 0 -30px;" class="help_button_simple" @click="fixFlag ? null : showPopup('usr2')" />
                  <frmHlpEmp v-model="showUser2Search" @selected-popup-row-data = "getUser2PopupRowData"></frmHlpEmp>
                </div>
              </div>
              <div style="margin-top:26px;">
                <CommonCalendarYMD maxlength="30" v-model="formParam.manageDate.value" :disable=true ref="spreadRate" style="text-align-last: center; width:100%"></CommonCalendarYMD>
              </div>
            </div>
        </div>
</template>

<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref, watch } from 'vue'
import { frmHlpCst, frmHlpEmp, frmHlpBrc, frmHlpBir, commonUtil } from 'skylark-ui-lib'
import lonHlpApc from 'src/components/pages/main/hlp/lon/lonHlpApc.vue'
import lonHlpPrd from 'src/components/pages/main/hlp/lon/lonHlpPrd.vue'

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
  freeformRefs: {
    default: {}
  },
  customerNo: {
    default: null
  },
  customerName: {
    default: null
  },
  contractNo: {
    default: null
  },
  productName: {
    default: null
  },
  baseRateCode: {
    default: null
  },
  spreadRate: {
    default: null
  },
  interestRate: {
    default: null
  },
  loanTermYear: {
    default: null
  },
  loanTermMonth: {
    default: null
  },
  maturityDate: {
    default: null
  },
  gracePrdYear: {
    default: null
  },
  gracePrdMonth: {
    default: null
  },
  registDate: {
    default: null
  },
  showBranch1Search: {
    type: Boolean,
    default: false
  },
  showUser1Search: {
    type: Boolean,
    default: false
  },
  showApcSearch: {
    type: Boolean,
    default: false
  },
  showCustomerSearch: {
    type: Boolean,
    default: false
  },
  disableFlag: {
    type: Boolean,
    default: false
  },
  apcDisableFlag: {
    type: Boolean,
    default: true
  },
  fixedFlag: {
    type: Boolean,
    default: false
  },
  showPrdSearch: {
    type: Boolean,
    default: false
  },
  showBirSearch: {
    type: Boolean,
    default: false
  },
  showBranch2Search: {
    type: Boolean,
    default: false
  },
  showUser2Search: {
    type: Boolean,
    default: false
  },
  isCalendarOpen: {
    type: Boolean,
    default: false
  },
  loanMaturityFlag: {
    type: Boolean,
    default: true
  },
  loanTermFlag: {
    type: Boolean,
    default: true
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
  intRatetTypeChange: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  periodChange: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  setApplicationData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  changeFlag: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  baseRateInfo: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  cstDirectSearch: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  prdDirectSearch: {
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
  getPrdDirectSearch: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getCstDirectSearch: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getApcDirectSearch: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  variablaFlag: {
    default: false
  },
  repayProgFlag: {
    default: false
  },
  creditLineFlag: {
    default: false
  },
  intRateTypeFlag: {
    default: false
  }
})

/* =======================================================
    Freeform Object
  ======================================================= */
// const tab = ref('application')
// const session = useSessionStore()
// const fromDate = session.sysCurrentBusinessDate
const fixFlag = ref(true)
const formParam = ref(props.formParam)
const showApcSearch = ref(props.showApcSearch)
const showCustomerSearch = ref(props.showCustomerSearch)
const showPrdSearch = ref(props.showPrdSearch)
const showBirSearch = ref(props.showBirSearch)
const showBranch1Search = ref(props.showBranch1Search)
const showUser1Search = ref(props.showUser1Search)
const showBranch2Search = ref(props.showBranch2Search)
const showUser2Search = ref(props.showUser2Search)
const isCalendarOpen = ref(props.isCalendarOpen)
const modelValues = ref(props.modelValues)
const variablaFlag = ref(props.variablaFlag)
const repayProgFlag = ref(props.repayProgFlag)
const creditLineFlag = ref(props.creditLineFlag)
const intRateTypeFlag = ref(props.intRateTypeFlag)

/* =======================================================
    Freeform Funtion
======================================================= */

watch(props, (newProps) => {
  if (newProps.variablaFlag) {
    variablaFlag.value = true
  } else {
    variablaFlag.value = false
  }

  if (newProps.repayProgFlag) {
    repayProgFlag.value = true
  } else {
    repayProgFlag.value = false
  }

  if (newProps.creditLineFlag) {
    creditLineFlag.value = true
  } else {
    creditLineFlag.value = false
  }

  if (newProps.intRateTypeFlag) {
    intRateTypeFlag.value = true
  } else {
    intRateTypeFlag.value = false
  }
})

const getCustPopupRowData = (event) => {
  formParam.value.customerNo.value = event[0].customerNo
  formParam.value.customerName.value = event[0].customerName
}
const getBranch1PopupRowData = (event) => {
  formParam.value.registBrcd.value = event[0].branchCode
}
const getBranch2PopupRowData = (event) => {
  formParam.value.manageBrcd.value = event[0].branchCode
}
const getUser1PopupRowData = (event) => {
  formParam.value.registEmployeeNo.value = event[0].employeeNo
}
const getUser2PopupRowData = (event) => {
  formParam.value.manageEmployeeNo.value = event[0].employeeNo
}

const getBirPopupRowData = (event) => {
  formParam.value.baseRate.value = event[0].baseRate
  formParam.value.baseRateCode.value = event[0].baseRateCode
  formParam.value.baseRateApplydt.value = event[0].applyDate
  formParam.value.baseRateName.value = event[0].baseRateName
  changeSpread(formParam.value.spreadRate.value)
}

// [FUNCTION10] 입력 데이터에 따른 Spread 값 변경
const changeSpread = (newValue) => {
  const newVal = commonUtil.isEmpty(parseFloat(newValue)) ? 0 : parseFloat(newValue)
  let baseRateValue = ''
  if (formParam.value.intRateTpcd.value === '02' || formParam.value.intRateTpcd.value === '03') {
    baseRateValue = parseFloat(formParam.value.baseRate.value)
  }

  if (!commonUtil.isEmpty(baseRateValue)) {
    if (newVal > 0) formParam.value.interestRate.value = Math.round((parseFloat(baseRateValue) + parseFloat(newVal)) * 1000000) / 1000000
    else formParam.value.interestRate.value = baseRateValue
  } else {
    if (newVal > 0) formParam.value.interestRate.value = newVal
    else formParam.value.interestRate.value = 0
  }
}

const showPopup = (type, param1, param2, param3, param4) => {
  const trMode = formParam.value.transactionMode.value
  // 아래 팝업만 모든 상황에서 조회 가능
  if (type !== 'col' && type !== 'atc' && type !== 'ath' && type !== 'apv' && type !== 'apc') {
    if (trMode === 'INQUIRY' || trMode === 'DELETE') return
  }
  showCustomerSearch.value = false
  showBranch1Search.value = false
  showUser1Search.value = false
  showBranch2Search.value = false
  showUser2Search.value = false
  showApcSearch.value = false
  showPrdSearch.value = false
  // 팝업별 파라미터 세팅 및 화면 오픈
  switch (type) {
    case 'cust' : showCustomerSearch.value = true; break
    case 'brch1' : showBranch1Search.value = true; break
    case 'usr1' : showUser1Search.value = true; break
    case 'brch2' : showBranch2Search.value = true; break
    case 'usr2' : showUser2Search.value = true; break
    case 'apc' :
      if (formParam.value.transactionMode.value !== 'INQUIRY') return
      showApcSearch.value = true; break
    case 'prd' : showPrdSearch.value = true; break
    case 'bir' :
      if (props.variablaFlag) return
      showBirSearch.value = true; break
  }
  isCalendarOpen.value = true
}

</script>
<style scoped>
.double_input_box {
    display: flex;
    gap: 10px;
}

.triple_box {
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: visible;
}
</style>
