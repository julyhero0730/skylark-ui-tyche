<template>
      <q-dialog v-model="model" persistent class="popup table_search_popup opened">
          <q-card class="popup_inner width68" :style=dragablePopupStyle>
              <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                  <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                  <div class="popup_title">{{ $t('label.view.lonHlpSet') }}</div>
                  <q-space />
                  <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
              </q-card-section>
              <q-separator/>
              <q-card-section>
                  <div class="q-ml-md">
                  <div class="msg_info_form_quadruple_box width97" style="display:flex; justify-content: space-between;" >
                        <div class="row" style="flex-grow: 2;">
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.settlementType') }}</label>
                            <q-card class="my-card">
                                <div class="radios-wrapper" style="display: flex; justify-content: space-between; margin: 0 50px 0 50px;">
                                    <div class="radio-wrapper" style="margin-right: 25px; display: flex; align-items: center;">
                                        <q-radio v-model="formParam.transactionStatusCd.value" val="01" :disable="nonTarget"/>
                                        <label class="form_label" style="margin-bottom: 0;">{{ $t('label.view.receive') }}</label>
                                    </div>
                                    <div class="radio-wrapper" style="margin-right: 25px; display: flex; align-items: center;">
                                        <q-radio v-model="formParam.transactionStatusCd.value" val="02" :disable="nonTarget"/>
                                        <label class="form_label" style="margin-bottom: 0;">{{ $t('label.view.pay') }}</label>
                                    </div>
                                </div>
                            </q-card>
                        </div>
                        </div>
                        <div class="width13">
                          <label class="form_label is_required" style="text-align-last: right;">{{ $t('label.view.journalNo') }}</label>
                            <div class="double_input_box width50" style ="margin-left: auto;">
                              <CommonInputBox maxlength="5" placeholder="" v-model="formParam.acctgIssueNo.value" :disable="true" style="text-align-last: right;"></CommonInputBox>
                            </div>
                        </div>
                    </div>
                    <div v-if="(true)">
                      <div class="msg_info_form_double_box width97" style="display: flex; justify-content: space-between;">
                        <div class="width51">
                          <label class="form_label is_required">{{ $t('label.view.settlementMethod') }}</label>
                            <div class="horizontal-layout d-flex items-center">
                                  <CommonSelectBox class="width35" :codeList="commonCodeList.userAccountType" v-model="formParam.userAccountType.value" :disable="settleAccountFlag"></CommonSelectBox>
                                  <CommonDirectSearchBox maxlength="30" v-model="formParam.partnerId.value" class="width40" :disable="accountFlag" @directSearchVal="getSetDirectSearch"></commonDirectSearchBox>
                                  <q-icon name="search" size="sm" style="margin:2px 20px 0 -40px;" class="help_button_simple" @click="accountFlag ? null : showPopup('')" />
                            </div>
                        </div>
                        <div class="width40" style="">
                          <label class="form_label is_required">{{ $t('label.view.transactionAmt') }}</label>
                                  <CommonCurFormatterBox
                                     :modelValues="settleAmtCurForm" :selectDisabled="accountFlag" :inputDisabled="accountFlag">
                                  </CommonCurFormatterBox>
                        </div>
                      </div>
                    </div>
                    <div v-if="(false)" class="msg_info_form_quadruple_box" style="display: flex">
                      <div class="full-row" style="flex-grow: 2;">
                            <div>
                                <label style=" margin-top: 20px;" class="form_label is_required">{{ $t('label.view.principal') }}</label>
                            </div>
                            <div class="width97">
                              <div style="display: flex; justify-content: space-between;" >
                                    <CommonSelectBox class="width20" style="margin-right: 10px;" :codeList="commonCodeList.userAccountType" v-model="formParam.prinAccountType.value" :disable="settlePrinFlag"></CommonSelectBox>
                                    <CommonDirectSearchBox class="width25" maxlength="30" v-model="formParam.partnerId.value" :disable="prinFlag" @directSearchVal="getSetDirectSearch"></commonDirectSearchBox>
                                    <q-icon name="search" size="sm" style="margin:8px 20px 0 -40px;" class="help_button_simple" @click="prinFlag ? null : showPopup('')" />
                                    <CommonCurFormatterBox
                                        :modelValues="prinAmtCurForm" class="width44" style=" margin-left: 100px;" :selectDisabled="prinFlag" :inputDisabled="prinFlag">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                            <div >
                                <label style=" margin-top: 20px;" class="form_label is_required">{{ $t('label.view.interest') }}</label>
                            </div>
                            <div class="width97">
                                <div style="display: flex; justify-content: space-between;" >
                                    <CommonSelectBox class= "width20" style=" margin-right: 10px;" :codeList="commonCodeList.userAccountType" v-model="formParam.interAccountType.value" :disable="settleInterFlag"></CommonSelectBox>
                                    <CommonDirectSearchBox class="width25" maxlength="30" v-model="formParam.partnerId.value" :disable="interFlag" @directSearchVal="getSetDirectSearch"></commonDirectSearchBox>
                                    <q-icon name="search" size="sm" style="margin:8px 20px 0 -40px;" class="help_button_simple" @click="interFlag ? null : showPopup('')" />
                                    <CommonCurFormatterBox
                                        :modelValues="interAmtCurForm" class="width44" style=" margin-left: 100px;" :selectDisabled="interFlag" :inputDisabled="interFlag">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                            <div>
                                <label style=" margin-top: 20px;" class="form_label is_required">{{ $t('label.view.pastDue') }}</label>
                            </div>
                            <div class="width97">
                                <div style="display: flex; justify-content: space-between;" >
                                    <CommonSelectBox class= "width20" style="margin-right: 10px;" :codeList="commonCodeList.userAccountType" v-model="formParam.pastAccountType.value" :disable="settlePastFlag"></CommonSelectBox>
                                    <CommonDirectSearchBox class="width25" maxlength="30" v-model="formParam.partnerId.value" :disable="pastFlag" @directSearchVal="getSetDirectSearch"></commonDirectSearchBox>
                                    <q-icon name="search" size="sm" style="margin:8px 20px 0 -40px;" class="help_button_simple" @click="pastFlag ? null : showPopup('')" />
                                    <CommonCurFormatterBox
                                        :modelValues="pastAmtCurForm" class="width44" style="margin-left: 100px;" :selectDisabled="pastFlag" :inputDisabled="pastFlag">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div  class="msg_info_form_triple_box" style="display: flex; justify-content: space-between; margin-top: -4%;">
                        <label style="margin-top:8px" class="form_label">{{ $t('label.view.journalStatusCd') }}</label>
                            <q-card class="my-card" style="box-shadow: none;">
                                <div class="radios-wrapper" style="display: flex; margin: 0 10px 0 20px;">
                                    <div class="radio-wrapper" style="margin-right: 25px; display: flex; align-items: center;">
                                        <q-radio v-model="formParam.journalStatusCd.value" val="01" :disable="nonTarget"/>
                                        <label class="form_label" style="margin-bottom: 0;">{{ $t('label.view.yes') }}</label>
                                    </div>
                                    <div class="radio-wrapper" style="margin-right: 25px; display: flex; align-items: center;">
                                        <q-radio v-model="formParam.journalStatusCd.value" val="02" :disable="nonTarget"/>
                                        <label class="form_label" style="margin-bottom: 0;">{{ $t('label.view.no') }}</label>
                                    </div>
                                </div>
                            </q-card>
                    <q-btn v-if="(false)" flat :disable="btnFlag" :label="$t('label.view.simulation')" class="btn btmBtn" style="margin-right:100px" @click="saveFac()"/>
                        </div> -->
                  <div class="msg_info_form_double_box">
                    <div class="table_scroll_box">
                        <label class="form_label" style="color:red">{{ $t('label.view.dr') }}</label>
                              <ag-grid-vue
                                  class="msg_table ag-theme-balham height20"
                                  :columnDefs="ColumnDefs"
                                  :columnTypes="columnTypes"
                                  :rowData="leftRowDataHlp"
                                  :defaultColDef="defaultColDef"
                                  :stopEditingWhenCellsLoseFocus="false"
                                  rowSelection="single"
                                  @grid-ready="onLeftGridReady"
                              ></ag-grid-vue>
                          </div>
                          <div class="table_scroll_box">
                            <label class="form_label" style="color:red">{{ $t('label.view.cr') }}</label>
                              <ag-grid-vue
                                  class="msg_table ag-theme-balham height20"
                                  :columnDefs="ColumnDefs"
                                  :columnTypes="columnTypes"
                                  :rowData="rightRowDataHlp"
                                  :defaultColDef="defaultColDef"
                                  :stopEditingWhenCellsLoseFocus="false"
                                  rowSelection="single"
                                  @grid-ready="onRightGridReady"
                              ></ag-grid-vue>
                          </div>
                        </div>
                        <q-btn flat :disable="btnFlag" :label="$t('label.view.simulation')" class="btn btmBtn" style="margin-top: 15px; margin-left: auto; margin-right: 3%;" @click="saveFacSimul()"/>
                      <div class="msg_info_form_triple_box" style="display: flex">
                        <div class="full-width">
                          <label class="form_label">{{ $t('label.view.remark') }}</label>
                          <CommonInputBox class="width97 height10" type="textarea" v-model="formParam.briefsNote.value" :disable="btnFlag"></CommonInputBox>
                        </div>
                    </div>
                <div class="toBottom width97" style="margin-top:20px; display: flex; justify-content: center;" >
                  <div style="display: flex; justify-content: space-between; width: fit-content;">
                      <q-btn flat :disable="btnFlag" :label="$t('label.view.ok')" class="btn btmBtn" style="margin-right:30px" @click="save()"/>
                      <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn"  v-close-popup @click="closePopup"/>
                  </div>
                </div>
                </div>
              </q-card-section>
          </q-card>
      </q-dialog>
  </template>

  <style>
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-leave-to {
    opacity: 0;
  }
  .q-scroll-area::-webkit-scrollbar {
    width: 0;
  }
  </style>

<script setup>

/* =======================================================
        1. Import Area
    ======================================================= */
import { ajaxUtil, messageBox, freeformUtil, commonUtil, gridPropsUtil } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive, watch, nextTick } from 'vue'
import { useSessionStore } from 'stores/session'
import { AgGridVue } from 'ag-grid-vue3'

/* =======================================================
        2. Global Variable
    ======================================================= */
// const session = useSessionStore()
// 부모 컴포넌트로 데이터 보내기 위한 작업
const emit = defineEmits(['update:modelValue', 'selectedPopupRowData', 'close-popup'])

const lonDisbursementNoHlp = ref('')
const lonCustomerNoHlp = ref('')
const lonRepaymentNoHlp = ref('')
const transactionDateHlp = ref('')
const currencyCodeHlp = ref('')
const okBtnFlag = ref(true)
const btnFlag = ref(false)

// 실행 결제 정보 Flag
const accountFlag = ref(true)
const settleAccountFlag = ref(true)
// 상환 결제 원금, 이자 ,연체이자 Flag
const prinFlag = ref(true)
const interFlag = ref(true)
const pastFlag = ref(true)
const settlePrinFlag = ref(true)
const settleInterFlag = ref(true)
const settlePastFlag = ref(true)
const simulationFlag = ref(true)

const session = useSessionStore()

const props = defineProps({
  leftRowData: {
    default: []
  },
  rightRowData: {
    default: []
  },
  lonDisbursementNo: {
    type: String
  },
  lonCurrencyCode: {
    type: String
  },
  lonDisbursementAmt: {
    type: Number
  },
  lonCustomerNo: {
    type: String
  },
  lonTransactionDate: {
    type: String
  },
  lonTransactionMode: {
    type: String
  },
  lonRepaymentNo: {
    type: String
  },
  transactionDate: {
    type: String
  },
  currencyCode: {
    type: String
  },
  nonTarget: {
    type: Boolean,
    default: true
  },
  modelValue:
  {
    type: Boolean,
    required: true
  },
  lonPrincipleAmt: {
    type: Number
  },
  lonIntAmt: {
    type: Number
  },
  lonPastdueAmt: {
    type: Number
  },
  lonTotalRepayAmt: {
    type: Number
  },
  search: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  lonTransactionStatusCd: {
    type: String
  }
})

const nonTarget = ref(props.nonTarget)
const amtFlag = ref(false)
const defaultColDef = gridPropsUtil.getDefaultColDef(200)

watch(props, (newVal) => {
  if (newVal.nonTarget) {
    nonTarget.value = true
  } else {
    nonTarget.value = false
  }
})

const model = computed({
  /**
     *
     */
  get () {
    if (props.modelValue) {
      showDialog()
    }
    return props.modelValue
  },
  /**
     *
     */
  set (newValue) {
    emit('update:modelValue', newValue)
  }
})

const showDialog = async () => {
  lonCustomerNoHlp.value = props.lonCustomerNo
  lonDisbursementNoHlp.value = props.lonDisbursementNo
  transactionDateHlp.value = props.transactionDate
  currencyCodeHlp.value = props.currencyCode
  if (!(props.lonRepaymentNo == null || props.lonRepaymentNo === undefined)) {
    lonRepaymentNoHlp.value = props.lonRepaymentNo
  }
  model.value = true
  rowData.value = []
  leftRowDataHlp.value = []
  rightRowDataHlp.value = []
  freeformUtil.clear(totalAmtCurForm)
  freeformUtil.clear(settleAmtCurForm)
  freeformUtil.clear(prinAmtCurForm)
  freeformUtil.clear(interAmtCurForm)
  freeformUtil.clear(pastAmtCurForm)
  freeformUtil.clear(formParam)
  await nextTick()
  // repayDisable(false)
  setTranStatusCd()
  setDisable('')
  setSearch()
}

// 팝업 오픈시 데이터 세팅
const setTranStatusCd = () => {
  if (props.lonDisbursementNo.substring(0, 3) === 'LDS' && props.lonTransactionStatusCd === '02') {
    formParam.value.transactionStatusCd.value = '02'
    // 여신 실행건에 대한 이벤트 유형 값 L001
    formParam.value.eventType.value = 'L001'
  } else {
    formParam.value.transactionStatusCd.value = '01'
    // 여신 상환건에 대한 이벤트 유형 값 L002
    formParam.value.eventType.value = 'L002'
  }
  formParam.value.businessReferNo.value = props.lonDisbursementNo
  formParam.value.customerNo.value = props.lonCustomerNo
  formParam.value.lonTransactionDate.value = props.lonTransactionDate
  formParam.value.settlementYn.value = props.settlementYn
  formParam.value.repaymentNo.value = props.lonRepaymentNo
  formParam.value.disbursementNo.value = props.lonDisbursementNo
  totalAmtCurForm.value.currency.value = props.lonCurrencyCode
  settleAmtCurForm.value.currency.value = props.lonCurrencyCode
  totalAmtCurForm.value.money.value = props.lonDisbursementAmt
  settleAmtCurForm.value.money.value = props.lonDisbursementAmt
}

const closePopup = () => {
  resetAll()
}

const rowData = ref([])
const leftRowDataHlp = ref([])
const rightRowDataHlp = ref([])

const gridLeftApi = ref(null)
const gridRightApi = ref(null)

const gridRightColumnApi = ref(null)
const gridLeftColumnApi = ref(null)

// Debit
const onLeftGridReady = (params) => {
  gridLeftApi.value = params.api
  gridLeftColumnApi.value = params.columnApi
}
// Credit
const onRightGridReady = (params) => {
  gridRightApi.value = params.api
  gridRightColumnApi.value = params.columnApi
}

const formParam = ref({
  customerNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.customerNo')
  },
  transactionDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.view.transactionDate')
  },
  businessReferNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.businessReferNo')
  },
  transactionStatusCd: {
    value: '01',
    initValue: '01',
    required: true,
    description: i18n.global.t('label.objt.transactionStatus')
  },
  journalStatusCd: {
    value: '02',
    initValue: '02',
    required: false,
    description: i18n.global.t('label.objt.transactionStatus')
  },
  lonTransactionDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.transactionDate')
  },
  currencyCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.currencyCode')
  },
  transactionAmt: {
    value: 0,
    required: true,
    description: i18n.global.t('label.objt.transactionAmt')
  },
  stlCcyCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.stlCcyCode')
  },
  settlementAmt: {
    value: 0,
    required: true,
    description: i18n.global.t('label.objt.settlementAmt')
  },
  exchangeTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.exchangeTpcd')
  },
  exchangeRate: {
    value: 0,
    initValue: '0',
    required: false,
    description: i18n.global.t('label.objt.exchangeRate')
  },
  briefsNote: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.briefsNote')
  },
  acctgIssueNo: {
    value: '0',
    initValue: '0',
    required: false,
    description: i18n.global.t('label.objt.acctgIssueNo')
  },
  drCrFlag: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.drCrFlag')
  },
  accountTypeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.accountTypeCode')
  },
  partnerId: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.partnerId')
  },
  settlementYn: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.settlementYn')
  },
  userAccountType: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.userAccountType')
  },
  prinAccountType: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.prinAccountType')
  },
  interAccountType: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.interAccountType')
  },
  pastAccountType: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.pastAccountType')
  },
  settlementNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.settlementNo')
  },
  branchCd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true
  },
  employeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true
  },
  employeeName: {
    value: session.sysUserName,
    initValue: session.sysUserName,
    required: true
  },
  userId: {
    value: session.sysUserId,
    initValue: session.sysUserId,
    required: true
  },
  facFlag: {
    value: 'Y',
    initValue: 'Y',
    required: true
  },
  jourIssueCancelTrxnYn: {
    value: 'N',
    initValue: 'N',
    required: true
  },
  repaymentNo: {
    value: '',
    initValue: '',
    required: false
  },
  disbursementNo: {
    value: '',
    initValue: '',
    required: false
  },
  eventType: {
    value: '',
    initValue: '',
    required: false
  },
  amountType: {
    value: '',
    initValue: '',
    required: false
  },
  paidPrincipal: {
    value: 0,
    initValue: 0,
    required: false
  },
  paidInt: {
    value: 0,
    initValue: 0,
    required: false
  },
  paidPastdue: {
    value: 0,
    initValue: 0,
    required: false
  },
  ccyPrincipal: {
    value: '',
    initValue: '',
    required: false
  },
  ccyInt: {
    value: '',
    initValue: '',
    required: false
  },
  ccyPastdue: {
    value: '',
    initValue: '',
    required: false
  },
  repayDetailCodePrin: {
    value: '',
    initValue: '',
    required: false
  },
  repayDetailCodeInter: {
    value: '',
    initValue: '',
    required: false
  },
  repayDetailCodePast: {
    value: '',
    initValue: '',
    required: false
  },
  prinEventType: {
    value: '',
    initValue: '',
    required: false
  },
  prinAmountType: {
    value: '',
    initValue: '',
    required: false
  },
  interEventType: {
    value: '',
    initValue: '',
    required: false
  },
  interAmountType: {
    value: '',
    initValue: '',
    required: false
  },
  pastEventType: {
    value: '',
    initValue: '',
    required: false
  },
  pastAmountType: {
    value: '',
    initValue: '',
    required: false
  },
  prinAcctgIssueNo: {
    value: '',
    initValue: '',
    required: false
  },
  interAcctgIssueNo: {
    value: '',
    initValue: '',
    required: false
  },
  pastAcctgIssueNo: {
    value: '',
    initValue: '',
    required: false
  }
})

const columnTypes = {
  centerAligned: {
    cellClass: 'centered'
  }
}

// 일계처리 그리드 컬럼
const ColumnDefs = [
  {
    field: 'jarrAccountCode',
    width: 130,
    editable: false,
    type: 'centerAligned' //
  },
  {
    field: 'jarrTrxnDrCrFlag',
    width: 130,
    editable: false,
    valueFormatter: (params) => {
      //  return gridPropsUtil.lookupValue(codeList.drCrFlagList, params.value)
    },
    valueParser: (params) => {
      //   return gridPropsUtil.lookupKey(codeList.drCrFlagList, params.newValue)
    },
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrIssueDailySeq',
    width: 130,
    editable: false,
    type: 'rightAligned',
    hide: true
  },
  {
    field: 'jarrIssueDate',
    width: 130,
    // headerComponent: CommonHeaderMark,
    // headerComponentParams: { isRequired: true },
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrIssueDailyDetailSeq',
    width: 100,
    editable: false,
    type: 'rightAligned',
    hide: true
  },
  {
    field: 'jarrIssueOperBranchCode',
    width: 146,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrIssueAcctBranchCode',
    width: 145,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrIssueTrxnBranchCode',
    width: 130,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrAccountSubCode',
    width: 150,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrMajorAccountYn',
    width: 120,
    editable: false,
    valueFormatter: (params) => {
      //   return gridPropsUtil.lookupValue(codeList.yesNoFlagList, params.value)
    },
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrProductName',
    width: 185,
    headerName: i18n.global.t('label.objt.productName'),
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'jarrCurrencyCode',
    width: 100,
    headerName: i18n.global.t('label.objt.trxnCurrency'),
    editable: false,
    type: 'centerAligned'
  },
  {
    field: 'jarrTrxnAmount',
    width: 120,
    headerName: i18n.global.t('label.objt.trxnAmount'),
    editable: false,
    type: 'rightAligned',
    valueFormatter: (params) => {
      const roundFactorUsed = false
      return commonUtil.balanceFormatter(params, params.data.currencyCode, commonCodeList.brcCurrencyCodeList, roundFactorUsed)
    },
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: (params) => {
      const precisionVal = commonUtil.setPrecision(params.data.currencyCode, commonCodeList.brcCurrencyCodeList)
      const inputParam = {
        precision: precisionVal
      }
      return inputParam
    }
    // valueFormatter: (params) => {
    //   if (params.data.jarrTrxnAmount === undefined || params.data.jarrTrxnAmount === null || params.data.jarrTrxnAmount === '') {
    //     params.data.jarrTrxnAmount = 0
    //   }
    //   const roundFactorUsed = false
    //   return commonUtil.balanceFormatter(params, currencyCode, codeList.jarrTrxnAmount, roundFactorUsed)
    // }
  },
  {
    field: 'jarrCustomerNo',
    width: 130,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrBusinessCode',
    width: 130,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrUnitBusinessCode',
    width: 130,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrTrxnCode',
    width: 130,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrBusinessReferNo',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrProductCode',
    width: 130,
    editable: false,
    type: 'centerAligned',
    hide: true
  },
  {
    field: 'jarrTrxnExchRateKind',
    width: 130,
    editable: false,
    valueFormatter: (params) => {
      // return gridPropsUtil.lookupValue(codeList.exchRateKindList, params.value)
    },
    hide: true
  },
  {
    field: 'jarrTceqAmount',
    width: 130,
    editable: false,
    type: 'rightAligned',
    hide: true
  },
  {
    field: 'jarrTrxnExchRate',
    width: 130,
    editable: false,
    type: 'rightAligned',
    hide: true
  },
  {
    field: 'jarrBaseExchRate',
    width: 130,
    editable: false,
    type: 'rightAligned',
    hide: true
  },
  {
    field: 'jarrCurrencyCode',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrBaseExchRate',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrBceqAmount',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrFeeCode',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrFeeName',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrExpenseItemCode',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrExpenseItemName',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'jarrRemark',
    width: 130,
    editable: false,
    hide: true
  },
  {
    field: 'organizationCode',
    hide: true
  },
  {
    field: 'serialNo',
    hide: true
  },
  {
    field: 'jarrIssueUserId',
    hide: true
  },
  {
    field: 'jarrCcaUserId',
    hide: true
  }
]

/* =======================================================
        3. Common Code Adapter
    ======================================================= */
// 공통코드 조회
ajaxUtil.getCodeList('USER_ACCOUNT_TYPE')
  .then(function (codeData) {
    commonCodeList.userAccountType = codeData.userAccountType
  })

// 통화 코드 및 기타 코드 가져오기
ajaxUtil.getCurrencyCodeForBranch().then(function (codeData) {
  commonCodeList.brcCurrencyCodeList = codeData
})

const commonCodeList = reactive({
  userAccountType: ref([]),
  jarrTrxnAmount: ref([]),
  brcCurrencyCodeList: ref([]),
  countryTypeCode: ref([])
})

const setDisable = (flag) => {
  if (flag === 'disable') {
    okBtnFlag.value = true
  } else {
    okBtnFlag.value = false
  }
}

// 결제 유형 필수 체크
const userAccountTypeCheck = (flag) => {
  let shouldProceed = true
  if (flag === '01') {
    if (!(settleAccountFlag.value)) {
      if (commonUtil.isEmpty(formParam.value.userAccountType.value)) {
        messageBox.alertError('Please enter settlement type.')
        shouldProceed = false
        return
      }
    }
    // 총합에 대해서만 값을 입력하기 때문에 원금, 이자, 연체이자 type 검사하는 부분 주석처리
    // if (!(settlePrinFlag.value)) {
    //   if (commonUtil.isEmpty(formParam.value.prinAccountType.value)) {
    //     messageBox.alertError('Please enter principal settlement type.')
    //     shouldProceed = false
    //     return
    //   }
    // }
    // if (!(settleInterFlag.value)) {
    //   if (commonUtil.isEmpty(formParam.value.interAccountType.value)) {
    //     messageBox.alertError('Please enter interest settlement type.')
    //     shouldProceed = false
    //     return
    //   }
    // }
    // if (!(settlePastFlag.value)) {
    //   if (commonUtil.isEmpty(formParam.value.pastAccountType.value)) {
    //     messageBox.alertError('Please enter pastdue settlement type.')
    //     shouldProceed = false
    //     return
    //   }
    // }
  } else if (flag === '02') {
    if (!(settleAccountFlag.value)) {
      if (commonUtil.isEmpty(formParam.value.userAccountType.value)) {
        messageBox.alertError('Please enter settlement type.')
        shouldProceed = false
        return
      }
    }
  } else {
    //
  }
  return shouldProceed
}

// 결제 테이블 적재 이벤트
const save = () => {
  // 여신 실행 결제 등록 서비스 호출
  if (!freeformUtil.checkRequired(formParam)) return
  const _alertInfo = () => {
    formParam.value = []
  }
  if (formParam.value.transactionStatusCd.value !== '01') {
    // 결제금액과 total 금액 같은지 확인
    if (!(formParam.value.transactionAmt.value === formParam.value.settlementAmt.value)) {
      messageBox.alertInfo(i18n.global.t('The settlement amount and the total amount are different.'))
      return
    }
    if (!simulationFlag.value) {
      messageBox.alertInfo(i18n.global.t('Please select the Save button after the simulation.'))
      return
    }
    // 결제유형 확인
    if (!userAccountTypeCheck(formParam.value.transactionStatusCd.value)) return
    const _confirmDbs = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS079', formParam)
      // 실행건은 현재 원금 부분만 결제 하기 때문에 amountType 01로 고정 추후 수정 필요

      saveParam.amountType = '01'
      saveParam.businessReferNo = props.lonDisbursementNo
      saveParam.transactionMode = 'NEW'
      if (props.lonTransactionMode === 'UPDATE') {
        saveParam.transactionMode = 'UPDATE'
      }
      ajaxUtil.ajaxServiceData(saveParam)
        .then(function (response) {
          if (!response) {
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
          } else {
            formParam.value.settlementNo.value = response
            formParam.value.settlementYn.value = 'Y'
            closePopup()
            props.search()
            model.value = false
          }
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirmDbs)
  } else {
    // 여신 상환 결제 등록 서비스 호출
    // 결제금액과 total 금액 같은지 확인 사용안함 주석처리
    // if (!(formParam.value.transactionAmt.value ===
    // (formParam.value.paidPrincipal.value + formParam.value.paidInt.value + formParam.value.paidPastdue.value))) {
    //   messageBox.alertInfo(i18n.global.t('The settlement amount and the total amount are different.'))
    //   return
    // }
    // 결제유형 확인
    // formParam.value.jourIssueCancelTrxnYn.value = 'Y'
    if (!userAccountTypeCheck(formParam.value.transactionStatusCd.value)) return
    const _confirmRpm = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS079', formParam)
      saveParam.businessReferNo = props.lonRepaymentNo
      saveParam.transactionMode = 'NEW'
      if (props.lonTransactionMode === 'UPDATE' || props.settlementYn === 'Y') {
        saveParam.transactionMode = 'UPDATE'
      }
      ajaxUtil.ajaxServiceData(saveParam)
        .then(function (response) {
          if (!response) {
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
          } else {
            formParam.value.settlementNo.value = response
            formParam.value.settlementYn.value = 'Y'
            closePopup()
            props.search()
            model.value = false
          }
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirmRpm)
  }
}

// 일계처리 시뮬레이션
const saveFacSimul = () => {
  // 실행 시뮬레이션
  if (formParam.value.transactionStatusCd.value !== '01') {
    formParam.value.facFlag.value = 'Y'
    // formParam.value.jourIssueCancelTrxnYn.value = 'Y'
    if (!userAccountTypeCheck(formParam.value.transactionStatusCd.value)) return
    const glSaveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS049', formParam)
    ajaxUtil.ajaxServiceData(glSaveParam)
      .then(function (response) {
        if (response.length === 0) {
          leftRowDataHlp.value = []
          rightRowDataHlp.value = []
        } else {
          const left = []
          const right = []
          // console.log('response  : ' + JSON.stringify(response))
          for (let i = 0; i < response.length; i++) {
            if (response[i].jarrTrxnDrCrFlag === 'D') {
              left.push(response[i])
            } else {
              right.push(response[i])
            }
          }
          leftRowDataHlp.value = left
          rightRowDataHlp.value = right
          simulationFlag.value = true
        }
      })
  } else {
    // 상환 시뮬레이션
    formParam.value.facFlag.value = 'Y'
    // formParam.value.jourIssueCancelTrxnYn.value = 'Y'
    if (!userAccountTypeCheck(formParam.value.transactionStatusCd.value)) return
    const glSaveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS049', formParam)
    ajaxUtil.ajaxServiceData(glSaveParam)
    // setGlSaveParam(glSaveParam)
      .then(function (response) {
        if (response.length === 0) {
          leftRowDataHlp.value = []
          rightRowDataHlp.value = []
        } else {
          const left = []
          const right = []
          // console.log('response  : ' + JSON.stringify(response))
          for (let i = 0; i < response.length; i++) {
            if (response[i].jarrTrxnDrCrFlag === 'D') {
              left.push(response[i])
            } else {
              right.push(response[i])
            }
          }
          leftRowDataHlp.value = left
          rightRowDataHlp.value = right
        }
      })
  }
}
// popup 실행이후 결제 내역 조회
const setSearch = () => {
  if (formParam.value.transactionStatusCd.value !== '01') {
    const searchParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS072', formParam)
    searchParam.businessReferNo = props.lonDisbursementNo
    ajaxUtil.ajaxServiceData(searchParam)
      .then(function (data) {
        if (data.length === 0) {
          settleAccountFlag.value = false
        } else {
          // console.log('disbursement : ' + JSON.stringify(data[0].accountTypeCode))
          formParam.value.userAccountType.value = data[0].accountTypeCode
          formParam.value.briefsNote.value = data[0].briefsNote
          formParam.value.settlementNo.value = data[0].settlementNo
          if (!commonUtil.isEmpty(data[0].settlementNo)) {
            settleAccountFlag.value = true
          }
          if (data[0].acctgIssueNo !== 0 && (!commonUtil.isEmpty(data[0].acctgIssueNo))) {
            formParam.value.journalStatusCd.value = '01'
            formParam.value.acctgIssueNo.value = data[0].acctgIssueNo
          } else {
            formParam.value.journalStatusCd.value = '02'
          }
          searchJnlList(data)
        }
      })
  } else {
    const searchParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS072', formParam)
    searchParam.businessReferNo = props.lonRepaymentNo
    ajaxUtil.ajaxServiceData(searchParam)
      .then(function (data) {
        if (data.length === 0) {
          repayParamSet()
        } else {
          searchDataSet(data)
          searchJnlList(data)
        }
      })
  }
}

// 일계번호가 있을 경우 일계처리 내역 조회
// (현재 일계처리 원금,이자,연체이자 별계로 진행 중이므로 조회 쿼리 referNo로 조회 추후 issueNo로 수정 필요)
const searchJnlList = (data) => {
  if (data.length === 0) {
    leftRowDataHlp.value = []
    rightRowDataHlp.value = []
  } else {
    const left = []
    const right = []
    // console.log('response  : ' + JSON.stringify(response))
    for (let i = 0; i < data.length; i++) {
      if (data[i].jarrTrxnDrCrFlag === 'D') {
        left.push(data[i])
      } else if (data[i].jarrTrxnDrCrFlag === 'C') {
        right.push(data[i])
      }
    }
    leftRowDataHlp.value = left
    rightRowDataHlp.value = right
  }
}

// 결제 정보 테이블에 등록된 상환내역이 없을 경우 상환 화면의 파라미터 셋팅
const repayParamSet = () => {
  settleAccountFlag.value = false
  const lonPrincipleAmt = props.lonPrincipleAmt
  const lonIntAmt = props.lonIntAmt
  const lonPastdueAmt = props.lonPastdueAmt
  const lonCurrencyCode = props.lonCurrencyCode

  if ((!commonUtil.isEmpty(lonPrincipleAmt)) && lonPrincipleAmt !== 0) {
    formParam.value.repayDetailCodePrin.value = '01'
    formParam.value.prinAmountType.value = '01'
    prinAmtCurForm.value.money.value = lonPrincipleAmt
    prinAmtCurForm.value.currency.value = lonCurrencyCode
    // const repayParam = 'principal'
    // repayDisable(repayParam)
  }
  if ((!commonUtil.isEmpty(lonIntAmt)) && lonIntAmt !== 0) {
    formParam.value.repayDetailCodeInter.value = '02'
    formParam.value.interAmountType.value = '02'
    interAmtCurForm.value.money.value = props.lonIntAmt
    interAmtCurForm.value.currency.value = lonCurrencyCode
    // const repayParam = 'interest'
    // repayDisable(repayParam)
  }
  if ((!commonUtil.isEmpty(lonPastdueAmt)) && lonPastdueAmt !== 0) {
    formParam.value.repayDetailCodePast.value = '03'
    formParam.value.pastAmountType.value = '03'
    pastAmtCurForm.value.money.value = lonPastdueAmt
    pastAmtCurForm.value.currency.value = lonCurrencyCode
    // const repayParam = 'pastdue'
    // repayDisable(repayParam)
  }
  totalAmtCurForm.value.currency.value = lonCurrencyCode
  totalAmtCurForm.value.money.value = props.lonTotalRepayAmt
  settleAmtCurForm.value.currency.value = lonCurrencyCode
  settleAmtCurForm.value.money.value = props.lonTotalRepayAmt
  formParam.value.journalStatusCd.value = '02'
}

// 결제내역이 등록 된 상환 내역일 경우 DB에서 조회된 데이터 셋팅
const searchDataSet = (data) => {
  const prinParam = data.find(obj => obj.amountType === '01') // 원금
  const interParam = data.find(obj => obj.amountType === '02') // 이자
  const pastParam = data.find(obj => obj.amountType === '03') // 연체이자

  if (prinParam || interParam || pastParam) {
    formParam.value.acctgIssueNo.value = (prinParam || interParam || pastParam).acctgIssueNo
    formParam.value.userAccountType.value = (prinParam || interParam || pastParam).accountTypeCode
  }

  settleAccountFlag.value = true

  if (!commonUtil.isEmpty(prinParam)) {
    formParam.value.repayDetailCodePrin.value = prinParam.amountType
    formParam.value.prinAmountType.value = prinParam.amountType
    prinAmtCurForm.value.money.value = prinParam.settlementAmt
    prinAmtCurForm.value.currency.value = prinParam.stlCcyCode
    formParam.value.prinAccountType.value = prinParam.accountTypeCode
    formParam.value.prinAcctgIssueNo.value = prinParam.acctgIssueNo
    // const repayParam = 'principal'
    // searchDisable(repayParam)
  }
  if (!commonUtil.isEmpty(interParam)) {
    formParam.value.repayDetailCodeInter.value = interParam.amountType
    formParam.value.interAmountType.value = interParam.amountType
    interAmtCurForm.value.money.value = interParam.settlementAmt
    interAmtCurForm.value.currency.value = interParam.stlCcyCode
    formParam.value.interAccountType.value = interParam.accountTypeCode
    formParam.value.interAcctgIssueNo.value = interParam.acctgIssueNo
    // const repayParam = 'interest'
    // searchDisable(repayParam)
  }
  if (!commonUtil.isEmpty(pastParam)) {
    formParam.value.repayDetailCodePast.value = pastParam.amountType
    formParam.value.pastAmountType.value = pastParam.amountType
    pastAmtCurForm.value.money.value = pastParam.settlementAmt
    pastAmtCurForm.value.currency.value = pastParam.stlCcyCode
    formParam.value.pastAccountType.value = pastParam.accountTypeCode
    formParam.value.pastAcctgIssueNo.value = pastParam.acctgIssueNo
    // const repayParam = 'pastdue'
    // searchDisable(repayParam)
  }
  // briefsNote 값이 있는지 확인하고 설정
  if (prinParam && prinParam.briefsNote) {
    formParam.value.briefsNote.value = prinParam.briefsNote
  } else if (interParam && interParam.briefsNote) {
    formParam.value.briefsNote.value = interParam.briefsNote
  } else if (pastParam && pastParam.briefsNote) {
    formParam.value.briefsNote.value = pastParam.briefsNote
  }

  // total값은 화면 파라미터로 세팅
  totalAmtCurForm.value.currency.value = props.lonCurrencyCode
  totalAmtCurForm.value.money.value = props.lonTotalRepayAmt
  settleAmtCurForm.value.currency.value = props.lonCurrencyCode
  settleAmtCurForm.value.money.value = props.lonTotalRepayAmt
}

// 현재는 Total값만 보여주기 때문에 사용안함 주석처리
// 상환 원금, 이자, 연체이자 금액이 존재함에 따라 결제 유형 disable 세팅
// 상환 테이블에 이력이 있는 원금, 이자, 연체이자는 결제 유형 선택 가능하게 변경
// const repayDisable = (flag) => {
//   if (flag === 'principal') {
//     settlePrinFlag.value = false
//   } else if (flag === 'interest') {
//     settleInterFlag.value = false
//   } else if (flag === 'pastdue') {
//     settlePastFlag.value = false
//   } else {
//     prinFlag.value = true
//     interFlag.value = true
//     pastFlag.value = true
//     settlePrinFlag.value = true
//     settleInterFlag.value = true
//     settlePastFlag.value = true
//   }
// }
// 현재는 Total값만 보여주기 때문에 사용안함 주석처리
// 상환 테이블에 이력이 있는 원금, 이자, 연체이자는 결제 유형 선택 가능하게 변경
// const searchDisable = (flag) => {
//   if (flag === 'principal') {
//     settlePrinFlag.value = true
//   } else if (flag === 'interest') {
//     settleInterFlag.value = true
//   } else if (flag === 'pastdue') {
//     settlePastFlag.value = true
//   } else {
//     prinFlag.value = true
//     interFlag.value = true
//     pastFlag.value = true
//     settlePrinFlag.value = true
//     settleInterFlag.value = true
//     settlePastFlag.value = true
//   }
// }

const totalAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

const settleAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

const prinAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

const interAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

const pastAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

// 토탈 변경된 값에 대해 반응
watch(() => totalAmtCurForm.value.currency.value, (newVal) => {
  totalAmtCurForm.value.currency.value = newVal
  formParam.value.currencyCode.value = newVal
})

watch(() => totalAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.transactionAmt.value = Number(newVal.replace(/,/g, ''))
})
// 결제 변경된 값에 대해 반응
watch(() => settleAmtCurForm.value.currency.value, (newVal) => {
  settleAmtCurForm.value.currency.value = newVal
  formParam.value.stlCcyCode.value = newVal
})

watch(() => settleAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.settlementAmt.value = Number(newVal.replace(/,/g, ''))
})
// 원금 금액 변경된 값에 대해 반응
watch(() => prinAmtCurForm.value.currency.value, (newVal) => {
  prinAmtCurForm.value.currency.value = newVal
  formParam.value.ccyPrincipal.value = newVal
})

watch(() => prinAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.paidPrincipal.value = Number(newVal.replace(/,/g, ''))
})
// 이자 금액 변경된 값에 대해 반응
watch(() => interAmtCurForm.value.currency.value, (newVal) => {
  interAmtCurForm.value.currency.value = newVal
  formParam.value.ccyInt.value = newVal
})

watch(() => interAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.paidInt.value = Number(newVal.replace(/,/g, ''))
})
// 연체이자 금액 변경된 값에 대해 반응
watch(() => pastAmtCurForm.value.currency.value, (newVal) => {
  pastAmtCurForm.value.currency.value = newVal
  formParam.value.ccyPastdue.value = newVal
})

watch(() => pastAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.paidPastdue.value = Number(newVal.replace(/,/g, ''))
})
// 일계 등록여부에 대해 반응
watch(() => formParam.value.acctgIssueNo.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '02' && newVal !== 0 && newVal !== null) {
    formParam.value.journalStatusCd.value = '01'
  } else {
    formParam.value.journalStatusCd.value = '02'
  }
})

watch(() => formParam.value.prinAcctgIssueNo.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '01' && newVal !== 0 && newVal !== null) {
    formParam.value.journalStatusCd.value = '01'
  } else {
    formParam.value.journalStatusCd.value = '02'
  }
})

watch(() => formParam.value.interAcctgIssueNo.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '01' && newVal !== 0 && newVal !== null) {
    formParam.value.journalStatusCd.value = '01'
  } else {
    formParam.value.journalStatusCd.value = '02'
  }
})

watch(() => formParam.value.pastAcctgIssueNo.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '01' && newVal !== 0 && newVal !== null) {
    formParam.value.journalStatusCd.value = '01'
  } else {
    formParam.value.journalStatusCd.value = '02'
  }
})

watch(() => formParam.value.userAccountType.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '01') {
    formParam.value.prinAccountType.value = newVal
    formParam.value.interAccountType.value = newVal
    formParam.value.pastAccountType.value = newVal
  }
})

watch(() => formParam.value.journalStatusCd.value, (newVal) => {
  if (newVal === '01') {
    setSearch()
    btnFlag.value = true
  } else {
    btnFlag.value = false
  }
})

watch(() => formParam.value.settlementNo.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '02' && props.lonTransactionMode === 'INQUIRY' && newVal !== null && formParam.value.journalStatusCd.value === '02') {
    btnFlag.value = true
  } else {
    btnFlag.value = false
  }
})

// total 금액 0인 건에 대해서 버튼 비활성화(상환 내역 없을경우에 발생)
watch(() => formParam.value.transactionAmt.value, (newVal) => {
  if (formParam.value.transactionStatusCd.value === '01' && newVal === 0 && newVal === null) {
    btnFlag.value = true
  }
})

const resetAll = (data) => {
  formClear()
}

const formClear = async () => {
  freeformUtil.clear(formParam)
  freeformUtil.clear(totalAmtCurForm)
  freeformUtil.clear(settleAmtCurForm)
  freeformUtil.clear(prinAmtCurForm)
  freeformUtil.clear(interAmtCurForm)
  freeformUtil.clear(pastAmtCurForm)
  leftRowDataHlp.value = []
  rightRowDataHlp.value = []
  amtFlag.value = false
}

/* =======================================================
      9. popup
  ======================================================= */

const showPopup = (type) => {
//   showCstSearch.value = false

//   switch (type) {
//     case 'gua' : showGuaSearch.value = true; break
//     case 'guarantor' : showGuarantorSearch.value = true; break
//     case 'cst' : showCstSearch.value = true; break
//   }
}

const getSetDirectSearch = (event) => {
//   if (event !== '') {
//     formParam.value.guarantorName.value = event.customerName
//   } else {
//     formParam.value.guarantorName.value = ''
//   }
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
  /* .msg_info_form_triple_box {
      display: grid;
      gap: 20px 30px;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 24px 0 0;
      overflow: hidden;
  } */
  .msg_info_form_double_box {
      display: grid;
      gap: 20px 20px;
      grid-template-columns: 1fr 1fr;
      padding: 25px 0 0;
      overflow: hidden;
      width: 97%;
  }

  .btmBtn {
      width: 15vh;
  }
  </style>
