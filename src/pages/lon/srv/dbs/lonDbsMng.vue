<template>
  <q-header class="header_page_title">
      <div class="title_wrapper">
          <page-title></page-title>
      </div>
  </q-header>
  <q-page-container>
      <q-page class="double_table_container" style="margin: 0px 30px; display: flex; min-height: 1px;">
        <div class="table_container containerWidth25">
          <div class="q-pa-md height80 scrollable-container">
            <q-list>
              <lonDbsMngLeftFreeform
                :form-param="formParam"
                :model-values3="modelValues3"
                :model-values4="modelValues4"
                :author-status="authorStatus"
                :author-line-datas="authorLineDatas"
                :show-apv-search="showApvSearch"
                :show-receipt-search="showReceiptSearch"
                :show-settle-search="showSettleSearch"
                :is-appv-popup-visible="isAppvPopupVisible"
                :is-settle-check="isSettleCheck"
                :is-popup-visible="isPopupVisible"
                :authorLineDatasClear="authorLineDatasClear"
                :get-apv-popup-row-data="getApvPopupRowData"
                :get-ath-popup-row-data="getAthPopupRowData"
                :tab="tab"
                :search="search"
              ></lonDbsMngLeftFreeform>
            </q-list>
          </div>
        </div>
        <div class="" style="flex-basis: 75%;">
            <q-tabs
              v-model="tab"
              align="left"
                indicator-color="transparent"
                active-color="deep-purple-10"
                active-bg-color="white"
            >
              <q-tab name="disbursement" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.disbursement')" @click="changeTab('disbursement')"/>
              <q-tab name="repaymentSchedule" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.repaymentSchedule')" @click="changeTab('repaymentSchedule')" :disable="disabledTabs.repaymentSchedule"/>
              <q-tab name="feeCommission" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.feeCommission')" @click="changeTab('feeCommission')" :disable="disabledTabs.feeCommission"/>
            </q-tabs>
            <q-tab-panels v-model="tab" class="tab_border height80">
              <q-tab-panel name="disbursement" style="overflow-y: hidden;">
                <lonDbsMngDisburseTab
                  :form-param="formParam"
                  :radio-disable-flag="radioDisableFlag"
                  :model-values1="modelValues1"
                  :model-values2="modelValues2"
                  :model-values3="modelValues3"
                  :model-values4="modelValues4"
                  :common-code-list="commonCodeList"
                  :search-param="searchParam"
                  :is-contract-expanded="isContractExpanded"
                  :is-disburse-expanded="isDisburseExpanded"
                  :cd-disable="cdDisable"
                  :non-target="nonTarget"
                  :is-search-mode="isSearchMode"
                  :update-trxn-mode="updateTrxnMode"
                  :handle-round-factor="handleRoundFactor"
                  :selected-popup-row-data="selectedPopupRowData"
                  :search="search"
                  :disburse-save="disburseSave"
                  :form-param-clear="formParamClear"
                  :model-values-clear="modelValuesClear"
                  :get-popup-row-data1=getPopupRowData1
                  :disburse-amount-error="disburseAmountError"
                  :disburse-amount-error-message="disburseAmountErrorMessage"
                  :maturity-date-set="maturityDateSet"
                ></lonDbsMngDisburseTab>
              </q-tab-panel>
            <q-tab-panel name="repaymentSchedule" >
                <lonDbsMngRepaymentTab
                  :form-param="formParam"
                  :schedule-param="scheduleParam"
                  :radio-disable-flag1="radioDisableFlag1"
                  :common-code-list="commonCodeList"
                  :row-data="rowData"
                  :cd-disable="cdDisable"
                  :non-target1="nonTarget1"
                  :plan-disable="planDisable"
                  :plan-disable1="planDisable1"
                  :grid-component="gridComponent"
                  :currency-param="currencyParam"
                  :day-disable="dayDisable"
                  :model-values="modelValues"
                  :repaysave="repaysave"
                  :update-trxnMode2="updateTrxnMode2"
                  :addRow="addRow"
                  :remove-row="removeRow"
                  :undo="undo"
                  :simulation="simulation"
                ></lonDbsMngRepaymentTab>
            </q-tab-panel>
            </q-tab-panels>
          </div>
  </q-page>
  </q-page-container>
</template>
<script setup>
/*
  302020 - Disbrusement Management

  Index.
  1. Import Area
  2. Global Variable
  3. Common Code Adapter
  4. Grid Props
  5. Grid Function
  6. Business Function
  7. popup
  8. TabKey event
  9. Loading Module
*/
/* =======================================================
        1. Import Area
    ======================================================= */
import { ref, reactive, watch, computed, nextTick, watchEffect, onMounted, onUnmounted } from 'vue'
import { endOfMonth, addYears, addMonths, subDays, addDays } from 'date-fns'
import dayjs from 'dayjs'
import { i18n } from 'boot/i18n'
import { ajaxUtil, commonUtil, messageBox, commonProp, freeformUtil, gridPropsUtil } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import { gridProps } from 'src/pages/lon/srv/dbs/lonDbsMngGridProps.vue'
import lonDbsMngLeftFreeform from 'src/pages/lon/srv/dbs/lonDbsMngProps/lonDbsMngLeftFreeform.vue'
import lonDbsMngDisburseTab from 'src/pages/lon/srv/dbs/lonDbsMngProps/lonDbsMngDisburseTab.vue'
import lonDbsMngRepaymentTab from 'src/pages/lon/srv/dbs/lonDbsMngProps/lonDbsMngRepaymentTab.vue'

/* =======================================================
      2. Global Variable
  ======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언
const tab = ref('disbursement')
const nonTarget = ref(false)
const excludeTarget = ref(true)
const nonTarget1 = ref(false)
const isAppvPopupVisible = ref(true)
const isSettleCheck = ref(true)
const authorLineComment = ref('Yon can enter if after the Disbursement is completed')
const authorStatus = ref('02')
const authorApproveStatus = ref('init')
const excludeTarget1 = ref(true)
const collateralTitleName = ref(null)
const collateralTpcd = ref(null)
const ccycdMarket = ref(null)
const customerNo = ref(null)
const colOwnerNo = ref(null)
const appraisalDate = ref(null)
const currencyCode = ref(null)
const expireDate = ref(null)
const rowData = ref([])
const rowData1 = ref([])
const resetRowData = ref([])
const rowCount = ref(0)
const isRewriteMode = ref(false)
const disabledTabs = reactive({
  repaymentSchedule: true,
  feeCommission: true
})
const freeformRefs = {
  collateralTpcd,
  ccycdMarket,
  collateralTitleName,
  customerNo,
  colOwnerNo,
  appraisalDate,
  currencyCode,
  expireDate

}

const changeTab = async (Name) => {
  if (Name === 'disbursement') {
    if (formParam.value.transactionMode.value === 'INQUIRY') {
      isSearchMode = true
      disabledTabs.repaymentSchedule = false
      if (!scheduleParam.value.transactionMode.value === 'INQUIRY') {
        scheduleParam.value.transactionMode.value = 'NEW'
      }
    }
  } else if (Name === 'repaymentSchedule') {
    scheduleSearch()
    if (formParam.value.repayProgTpcd.value === '05') {
      scheduleParam.value.repayDatePlanCd.value = ''
    }
  }
}

// 전역변수 선언
const session = useSessionStore()
const cdDisable = ref(true)
const dayDisable = ref(true)
const planDisable = ref(false)
const planDisable1 = ref(false)
const isPopupVisible = ref(true)

// 좌측 패널 전역변수
const showApvSearch = ref(false)
const showReceiptSearch = ref(false)
const showSettleSearch = ref(false)
const authorLineDatas = ref([])
const authorLineDataFlag = ref(true)

/* =======================================================
    3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  fundPurpose: ref([]),
  lonPeriodType: ref([]),
  lonRepayMethodCode: ref([]),
  lonInterestRateCode: ref([]),
  lonIntRateChangeMethod: ref([]),
  lonInterestReceiveCode: ref([]),
  lonPastdueCalcMethodCode: ref([]),
  lonHolidayApplyMethod: ref([]),
  lonDayCountCode: ref([]),
  countryTypeCode: ref([]),
  frmBaseRateTermCode: ref([]),
  lonRoundDigitCode: ref([]),
  lonRepayDatePlanCode: ref([]),
  lonRemainAmountCode: ref([]),
  employeeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

ajaxUtil.getCodeList('LON_FUND_PURPOSE_CODE,LON_PERIOD_TYPE,LON_REPAY_METHOD_CODE,LON_INTEREST_RATE_CODE,LON_INT_RATE_CHANGE_METHOD,LON_INTEREST_RECEIVE_CODE,LON_PASTDUE_CALC_METHOD_CODE,LON_HOLIDAY_APPLY_METHOD,LON_DAY_COUNT_CODE,FRM_BASE_RATE_TERM_CODE,LON_ROUND_DIGIT_CODE,LON_REPAY_DATE_PLAN_CODE,LON_REMAIN_AMOUNT_CODE')
  .then(function (codeData) {
    commonCodeList.fundPurpose = codeData.lonFundPurposeCode
    commonCodeList.lonPeriodType = codeData.lonPeriodType
    commonCodeList.lonRepayMethodCode = codeData.lonRepayMethodCode
    commonCodeList.lonInterestRateCode = codeData.lonInterestRateCode
    // Disbursement Date는 사용안함.
    commonCodeList.lonIntRateChangeMethod = codeData.lonIntRateChangeMethod.filter(id => id.code !== '03')
    commonCodeList.lonInterestReceiveCode = codeData.lonInterestReceiveCode
    commonCodeList.lonPastdueCalcMethodCode = codeData.lonPastdueCalcMethodCode
    commonCodeList.lonHolidayApplyMethod = codeData.lonHolidayApplyMethod
    commonCodeList.lonDayCountCode = codeData.lonDayCountCode
    commonCodeList.frmBaseRateTermCode = codeData.frmBaseRateTermCode
    commonCodeList.lonRoundDigitCode = codeData.lonRoundDigitCode
    commonCodeList.lonRepayDatePlanCode = codeData.lonRepayDatePlanCode
    commonCodeList.lonRemainAmountCode = codeData.lonRemainAmountCode
  })
ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })
ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

const branchCode = ref('')
const branchValue = ref('')
const employeeNo = ref('')
const employeeValue = ref('')

ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      branchCode.value = codeData.find(item => item.code === session.sysBranchCode)
      branchValue.value = branchCode.value.codeValue
      formParam.value.registBrnm.value = branchValue.value
      formParam.value.manageBrnm.value = branchValue.value
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

ajaxUtil.getEmployeeNoList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      employeeNo.value = codeData.find(item => item.code === session.sysEmployeeNo)
      employeeValue.value = employeeNo.value.codeValue
      formParam.value.registEmployeeNm.value = employeeValue.value
      formParam.value.manageEmployeeNm.value = employeeValue.value
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

/* =======================================================
    4. Grid Props
======================================================= */
const formParam = ref({
  originDisbursementAmt: {
    value: ''
  },
  originDisburseBalance: {
    value: ''
  },
  originMaturityDate: {
    value: ''
  },
  originSpreadRate: {
    value: 0
  },
  originIntRateTpcd: {
    value: ''
  },
  originBaseRateCode: {
    value: ''
  },
  feeCommission: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  contractNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.contractNo')
  },
  productCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.productType')
  },
  productName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.productType')
  },
  transactionDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.view.transactionDate')
  },
  disbursementNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.disbursementNo')
  },
  customerNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.customer')
  },
  customerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.customer')
  },
  fundPurposeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.fundPurpose')
  },
  currencyContractCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.contractAmt')
  },
  contractAmount: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.contractAmt')
  },
  contractBal: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.contractOutstanding')
  },
  contractDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.contractDate')
  },
  loanPrdTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.loanPeriodType')
  },
  loanTermYear: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.loanTerm')
  },
  loanTermMonth: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.loanTerm')
  },
  creditLineTpcd: {
    value: '',
    required: true
  },
  contractMaturityDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.maturityDate')
  },
  contractIntRateTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.intRateTpcd')
  },
  contractBaseRateCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  contractBaseRateName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  contractBaseRate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  contractBaseRateTermCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  contractSpreadRate: {
    value: 0,
    required: false,
    description: i18n.global.t('label.objt.spreadRate')
  },
  currencyCode: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: false,
    description: i18n.global.t('label.view.disbursementAmount')
  },
  disbursementAmt: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.disbursementAmount')
  },
  disburseBalance: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.disburseOutstanding')
  },
  repayProgTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.repaymentProgram')
  },
  disbursementDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.veiw.disbursementDate')
  },
  maturityDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.maturityDate')
  },
  intRateTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.intRateTpcd')
  },
  baseRateCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  baseRateName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateType')
  },
  baseRateApplydt: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseRateApplyDate')
  },
  rateTermCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.rateChangeCycle')
  },
  rateChangeCode: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.rateChangeMethod')
  },
  baseRate: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.baseRate')
  },
  interestRate: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.interestSpread')
  },
  spreadRate: {
    value: 0,
    required: false,
    description: i18n.global.t('label.view.interestSpread')
  },
  intRecvTpcd: {
    value: '01',
    required: false,
    description: i18n.global.t('label.veiw.interestReceiveType')
  },
  pastDueCalCode: {
    value: '02',
    required: false,
    description: i18n.global.t('label.view.pastDueCalcMethod')
  },
  pastdueSpread: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.pastRate')
  },
  gracePrdYear: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  gracePrdMonth: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  // amrtPrdMm: {
  //   value: 0,
  //   initValue: 0,
  //   required: false,
  //   description: i18n.global.t('label.objt.amortizationPeriod')
  // },
  holidayApplyCode: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.holidayApplyMethod')
  },
  dayCountCode: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.daysCalcMethod')
  },
  scheduleYn: {
    value: 'N',
    required: false,
    description: i18n.global.t('label.view.daysCalcMethod')
  },
  accuralStopYn: {
    value: 'N',
    required: false,
    description: i18n.global.t('label.view.daysCalcMethod')
  },
  registBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true,
    description: i18n.global.t('label.objt.branchCode')
  },
  registBrnm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.branchName')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true,
    description: i18n.global.t('label.objt.employeeNo')
  },
  registEmployeeNm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.employeeName')
  },
  registDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.objt.currentBusinessDate')
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true,
    description: i18n.global.t('label.objt.manageBranch')
  },
  manageBrnm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.manageBranch')
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true,
    description: i18n.global.t('label.objt.managementEmployee')
  },
  manageEmployeeNm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.managementEmployee')
  },
  manageDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.view.manageDate')
  },
  scheduleNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.scheduleNo')
  },
  roundFactor: {
    value: '',
    required: false
  },
  rmk: {
    value: '',
    required: false
  },
  settlementYn: {
    value: '',
    required: false
  },
  prgsStatusCode: {
    value: '',
    required: false
  },
  pastDueInterestRate: {
    value: 0,
    initValue: 0,
    required: true
  },
  contractUpdateFlag: { // Contract Maturity 변경 시 Update하기위한 Flag
    value: 'N',
    initValue: 'N',
    required: false
  },
  historyRmk: {
    value: '',
    required: false
  },
  lastRepayDate: {
    value: '',
    required: false
  },
  nextSchdDate: {
    value: '',
    required: false
  },
  lastIntChrgPrd: {
    value: '',
    required: false
  },
  nextSchdIntDate: {
    value: '',
    required: false
  },
  transactionMode: {
    value: 'NEW',
    required: true
  },
  applicationNo: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.applicationNo')
  },
  authorEmployeeNo: {
    value: '',
    initValue: ''
  },
  authorizationNo: {
    value: '',
    initValue: ''
  },
  authorizationStatus: {
    value: '',
    initValue: ''
  },
  authorizationDate: {
    value: '',
    initValue: ''
  },
  fromBtn: {
    value: ''
  },
  branchCd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true
  },
  userId: {
    value: session.sysUserId,
    initValue: session.sysUserId,
    required: true
  },
  facFlag: {
    value: '',
    required: false
  },
  jourIssueCancelTrxnYn: {
    value: 'N',
    initValue: 'N',
    required: true
  },
  settlementNo: {
    value: '',
    initValue: '',
    required: false
  },
  transactionStatusCd: { // 실행 일계처리를 위한 코드 값
    value: '02',
    initValue: '02',
    required: true
  },
  branchName: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.branchName')
  }
})

const scheduleParam = ref({
  disbursementNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.disbursementNo')
  },
  originScheduleNo: {
    value: '',
    required: false
  },
  scheduleNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.repayScheduleNo')
  },
  scheduleRegistDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.view.scheduleDate')
  },
  repayProgTpcd: {
    value: '',
    required: false,
    description: ''
  },
  frequencyMm: {
    value: '1',
    initValue: '1',
    required: true,
    description: i18n.global.t('label.view.repaymentFrequency')
  },
  roundDigitCd: {
    value: '03',
    initValue: '03',
    required: true,
    description: i18n.global.t('label.view.installRoundingDigitType')
  },
  repayDatePlanCd: {
    value: '02',
    required: false,
    description: i18n.global.t('label.view.repayDatePlanMethod')
  },
  repayPlanDay: {
    value: '',
    required: false,
    description: ''
  },
  initialDueDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.initialRepaymentDueDate')
  },
  finalDueDate: {
    value: '',
    required: false,
    description: ''
  },
  maturityDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.maturityDate')
  },
  remainAmountCode: {
    value: '02',
    required: true,
    description: i18n.global.t('label.view.remainingAmountMethod')
  },
  installmentCnt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.installmentCount')
  },
  currencyCode: {
    value: '',
    required: false,
    description: ''
  },
  installmentAmt: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.installmentRepaymentAmount')
  },
  disbursementAmt: {
    value: 0,
    required: false,
    description: ''
  },
  interestRate: {
    value: 0,
    required: false,
    description: ''
  },
  pastdueYn: {
    value: '',
    required: false,
    description: ''
  },
  gracePrdYear: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  gracePrdMonth: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  disbursementDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  dayCountCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.daysCalcMethod')
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  branchCode: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false
  },
  holidayApplyCode: {
    value: '',
    required: false
  },
  roundFactor: {
    value: '',
    required: false
  },
  lastRepaymentDate: {
    value: '',
    required: false
  },
  calculationPrincipal: {
    value: 0,
    required: false
  },
  increasedAmount: {
    value: 0,
    required: false
  },
  rateChangeCode: {
    value: '',
    required: false
  },
  repaymentPrincipal: {
    value: 0,
    required: false
  },
  repaymentIntAmt: {
    value: 0,
    required: false
  },
  transactionMode: {
    value: 'NEW',
    required: false
  },
  settlementYn: {
    value: '',
    required: false
  },
  prgsStatusCode: {
    value: '',
    required: false
  },
  acctgIssueNo: {
    value: 0,
    required: false
  }
})

const searchParam = ref({
  disbursementNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.disbursementNo')
  },
  scheduleNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.userName')
  },
  baseDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.baseDate')
  },
  helpSearchType: {
    value: 'FrmHlpBir',
    required: false,
    description: ''
  },
  businessCode: {
    value: 'LON',
    required: false,
    description: i18n.global.t('label.objt.businessCode')
  },
  searchKeyword: {
    value: '',
    required: false
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  transactionMode: {
    value: '',
    required: true
  }
})
const modelValues = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

const modelValues1 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

const modelValues2 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

const modelValues3 = ref({
  currency: {
    value: ' '
  },
  money: {
    value: ' '
  }
})

const modelValues4 = ref({
  currency: {
    value: ' '
  },
  money: {
    value: ' '
  }
})

watch(() => modelValues.value.currency.value, (newVal) => {
  scheduleParam.value.currencyCode.value = newVal
  if (gridProps.gridApi.value === null) {
    gridProps.gridApi.value = {}
  }
  gridProps.gridApi.value.scheduleParamValueCurrencyCodeValue = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  scheduleParam.value.installmentAmt.value = Number(newVal.replace(/,/g, ''))
})

watch(() => modelValues1.value.currency.value, (newVal) => {
  formParam.value.currencyContractCode.value = newVal
})
watch(() => modelValues1.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.contractAmount.value = Number(newVal.replace(/,/g, ''))
})

watch(() => modelValues2.value.currency.value, (newVal) => {
  formParam.value.currencyContractCode.value = newVal
})
watch(() => modelValues2.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.contractBal.value = Number(newVal.replace(/,/g, ''))
})

watch(() => modelValues3.value.currency.value, (newVal) => {
  formParam.value.currencyCode.value = newVal
})
watch(() => modelValues3.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.disbursementAmt.value = Number(newVal.replace(/,/g, ''))
})

watch(() => modelValues4.value.currency.value, (newVal) => {
  formParam.value.currencyCode.value = newVal
})
watch(() => modelValues4.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.disburseBalance.value = Number(newVal.replace(/,/g, ''))
})

const handleRoundFactor = (roundFactor) => {
  formParam.value.roundFactor.value = roundFactor
}
/* =======================================================
    5. Function
======================================================= */
let isSearchMode = false
const search = async () => {
  try {
    isSearchMode = true
    formParamClear()
    modelValuesClear()
    const data = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS012', searchParam)
    const response = await ajaxUtil.ajaxServiceData(data)
    if (response && Object.keys(response).length === 0) {
      const _alertInfo = () => {
        formParam.value.transactionMode.value = 'NEW'
        updateTrxnMode()
      }
      messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
    } else {
      for (const key in response) {
        if (key in formParam.value && response[key] !== null) {
          formParam.value[key].value = response[key]
        }
      }
      disabledTabs.repaymentSchedule = false
      searchParam.value.scheduleNo.value = formParam.value.scheduleNo.value
      modelValues1.value.currency.value = formParam.value.currencyContractCode.value
      modelValues1.value.money.value = formParam.value.contractAmount.value
      modelValues2.value.currency.value = formParam.value.currencyContractCode.value
      modelValues2.value.money.value = formParam.value.contractBal.value
      modelValues3.value.currency.value = formParam.value.currencyContractCode.value
      modelValues3.value.money.value = formParam.value.disbursementAmt.value
      modelValues4.value.currency.value = formParam.value.currencyContractCode.value
      modelValues4.value.money.value = formParam.value.disburseBalance.value
      formParam.value.originDisbursementAmt.value = formParam.value.disbursementAmt.value
      formParam.value.originDisburseBalance.value = formParam.value.disburseBalance.value
      formParam.value.originMaturityDate.value = formParam.value.maturityDate.value
      formParam.value.originSpreadRate.value = formParam.value.spreadRate.value
      formParam.value.originIntRateTpcd.value = formParam.value.intRateTpcd.value
      formParam.value.originBaseRateCode.value = formParam.value.baseRateCode.value

      isContractExpanded.value = true
      isDisburseExpanded.value = true
      isPopupVisible.value = false
      maturityDateSet()
      authorLineInquiry()
    }
    if (tab.value === 'repaymentSchedule') {
      scheduleSearch()
    }

    if (formParam.value.scheduleYn.value === 'N') {
      messageBox.alertInfo(i18n.global.t('msg.info.scheduleYnFlag'))
    }
  } catch (error) {
    messageBox.alertAjaxError(error)
  }
}

const scheduleSearch = async () => {
  try {
    isSearchMode = true
    rowData.value = []
    freeformUtil.clear(scheduleParam)
    freeformUtil.clear(modelValues)

    const data2 = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS022', searchParam)
    const response = await ajaxUtil.ajaxServiceData(data2)
    if (!response || Object.keys(response || {}).length === 0) {
      scheduleParam.value.transactionMode.value = 'NEW'
    } else {
      scheduleParam.value.transactionMode.value = 'INQUIRY'
      for (const key in response) {
        if (key in scheduleParam.value && response[key] !== null) {
          scheduleParam.value[key].value = response[key]
        }
      }
      modelValues.value.money.value = scheduleParam.value.installmentAmt.value
      modelValues.value.currency.value = scheduleParam.value.currencyCode.value
      searchParam.value.scheduleNo.value = scheduleParam.value.scheduleNo.value
      await gridPropsUtil.searchRow('bsLonSrvDbsService', 'LONSRVDBS032', searchParam, rowData, rowCount)
      totalValue()
    }
    updateTrxnMode2()
  } catch (error) {
    messageBox.alertAjaxError(error)
  }
}

const checkParam = () => {
  if (formParam.value.disbursementAmt.value === 0) {
    formParam.value.disbursementAmt.value = ''
  } else if (formParam.value.disburseBalance.value === 0) {
    formParam.value.disburseBalance.value = ''
  }
}

const disburseSave = () => {
  if (formParam.value.registEmployeeNo.value !== session.sysEmployeeNo) {
    messageBox.alertInfo(i18n.global.t('msg.info.managerCheck'))
    return
  }
  if (disburseAmountError.value) {
  // errorMessage를 alert하고 함수를 종료합니다.
    messageBox.alert(disburseAmountErrorMessage)
    return
  }
  // if (disburseBalError.value) {
  // // errorMessage를 alert하고 함수를 종료합니다.
  //   messageBox.alert(disburseBalErrorMessage)
  //   return
  // }

  interestValidationCheck()
  if (interestValidationCheck1.value) {
    return
  }
  interestApplyDateCheck()
  if (interestApplyDateCheck1.value) {
    return
  }
  const _alertInfoSaveNodata = () => {
    formParam.value = []
  }
  if (formParam.value.transactionMode.value === 'NEW') {
    checkParam()
    if (!freeformUtil.checkRequired(formParam, freeformRefs)) return
    const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS019', formParam)
    ajaxUtil.ajaxServiceData(saveParam)
      .then(function (response) {
        if (!response) {
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoSaveNodata)
        } else {
          const _confirm = () => {
            formParam.value.transactionMode.value = 'INQUIRY'
            updateTrxnMode()
            searchParam.value.disbursementNo.value = response
            search()
          }
          messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
        }
      })
  } else if (formParam.value.transactionMode.value === 'UPDATE') {
    validFormParam()
    const _confirmUpdate = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS009', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then(function (response) {
          if (!response) {
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoSaveNodata)
          } else {
            formParam.value.transactionMode.value = 'INQUIRY'
            updateTrxnMode()
            searchParam.value.disbursementNo.value = saveParam.disbursementNo
            search()
          }
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirmUpdate)
  } else if (formParam.value.transactionMode.value === 'DELETE') {
    const _confirmDelete = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS009', formParam)
      saveParam.businessReferNo = formParam.value.disbursementNo.value
      ajaxUtil.ajaxServiceCall(saveParam)
        .then(function (response) {
          if (!response) {
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoSaveNodata)
          } else {
            messageBox.alertInfo('확인 버튼을 누르고 INQUIRY로 이동하세요')
          }
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.delete'), _confirmDelete)
  }
}

const checkParam1 = () => {
  if (!formParam.value.repayProgTpcd.value === '05') {
    if (scheduleParam.value.frequencyMm.value === 0) {
      scheduleParam.value.frequencyMm.value = ''
    }
  }

  scheduleParam.value.initialDueDate.value = rowData.value[0].scheduleDate
  scheduleParam.value.finalDueDate.value = rowData.value[rowData.value.length - 2].scheduleDate
  scheduleParam.value.installmentCnt.value = rowData.value.length - 1
}

const repaysave = () => {
  if (formParam.value.registEmployeeNo.value !== session.sysEmployeeNo) {
    messageBox.alertInfo(i18n.global.t('msg.info.managerCheck'))
    return
  }
  const totalRow = rowData.value.find(row => row.id === 'total')

  if (scheduleParam.value.transactionMode.value === 'NEW') {
    checkParam1()
    if (!freeformUtil.checkRequired(scheduleParam, freeformRefs)) return
    const currency = currencyCodeList.value.find(c => c.code === scheduleParam.value.currencyCode.value)
    if (Number(totalRow.rSchdPrincipalAmt).toFixed(currency.subUnitDigit) !== Number(formParam.value.disbursementAmt.value).toFixed(currency.subUnitDigit)) {
      messageBox.alertError(i18n.global.t('msg.error.amountMismatch'))
      return
    }
    if (formParam.value.repayProgTpcd.value === '05') {
      simulation()

      if (!simulationSearch.value) {
        return messageBox.alertError(i18n.global.t('msg.error.searchFst'))
      }
    }
    const _repayConfirm = () => {
      // 합계 부분을 제외한 모든 행 데이터를 담을 배열을 생성한다.
      const rows = rowData.value.filter(row => row.id !== 'total')
      for (const idx in rows) {
        const scheduleDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
        const intCalcFromDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
        const intCalcToDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
        rows[idx].scheduleDate = scheduleDate
        rows[idx].intCalcFromDate = intCalcFromDate
        rows[idx].intCalcToDate = intCalcToDate
      }

      // 각 행에 repayProgTpcd, disbursementNo, pastdueYn을 설정한다.
      rows.forEach(row => {
        row.disbursementNo = formParam.value.disbursementNo.value
        row.pastdueYn = 'N'
      })
      if (scheduleParam.value.repayDatePlanCd.value !== '01') {
        scheduleParam.value.repayPlanDay.value = 0
      }
      // rSchdPrincipalAmt 값이 0이 아닌 첫 번째 행의 scheduleDate 값을 찾는다.
      const nextSchdDateRow = rows.find(row => row.rSchdPrincipalAmt !== 0)
      const nextSchddate = nextSchdDateRow ? dayjs(nextSchdDateRow.rScheduleDate).format('YYYY-MM-DD') : undefined
      const nextschdIntAmtRow = rows.find(row => row.rSchdIntAmt !== 0)
      const nextSchdIntdate = nextschdIntAmtRow ? dayjs(nextschdIntAmtRow.rScheduleDate).format('YYYY-MM-DD') : undefined
      // rows 배열 전체를 서버에 보낸다.
      const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS029', {

        rows,
        originScheduleNo: scheduleParam.value.originScheduleNo.value,
        // scheduleDate: scheduleParam.value.scheduleRegistDate.value,
        frequencyMm: scheduleParam.value.frequencyMm.value,
        roundDigitCd: scheduleParam.value.roundDigitCd.value,
        repayDatePlanCd: scheduleParam.value.repayDatePlanCd.value,
        repayPlanDay: scheduleParam.value.repayPlanDay.value,
        initialDueDate: scheduleParam.value.initialDueDate.value,
        finalDueDate: scheduleParam.value.finalDueDate.value,
        remainAmountCode: scheduleParam.value.remainAmountCode.value,
        installmentCnt: scheduleParam.value.installmentCnt.value,
        currencyCode: scheduleParam.value.currencyCode.value,
        installmentAmt: scheduleParam.value.installmentAmt.value,
        repayProgTpcd: formParam.value.repayProgTpcd.value,
        disbursementNo: formParam.value.disbursementNo.value,
        nextSchdDate: nextSchddate,
        nextSchdIntDate: nextSchdIntdate,
        lastIntChrgPrd: scheduleParam.value.disbursementDate.value
      })

      ajaxUtil.ajaxServiceData(saveParam)
        .then(function (response) {
          if (!response) {
            const _alertInfoSch = () => {
              scheduleParam.value = []
            }
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoSch)
          } else {
            scheduleParam.value.scheduleNo.value = response
            search()
          }
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _repayConfirm)
  } else if (scheduleParam.value.transactionMode.value === 'DELETE') {
    const _repayDelete = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS039', scheduleParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then(function (response) {
          if (!response) {
            const _alertInfoSchRowdata = () => {
              scheduleParam.value = []
              rowData.value = []
            }
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoSchRowdata)
          } else {
            scheduleParam.value.transactionMode.value = 'NEW'
            updateTrxnMode2()
            isRewriteMode.value = false
          }
        })
        .catch((error) => {
          messageBox.alertAjaxError(error)
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.delete'), _repayDelete)
  }
}

const gracePrdSet = () => {
  const disbursementDate = new Date(formParam.value.disbursementDate.value)
  const baseRateApplyDate = new Date(formParam.value.baseRateApplydt.value)

  const yearDifference = baseRateApplyDate.getFullYear() - disbursementDate.getFullYear()
  const monthDifference = baseRateApplyDate.getMonth() - disbursementDate.getMonth()

  const totalMonthDifference = yearDifference * 12 + monthDifference

  const totalMonths = formParam.value.gracePrdYear.value * 12 + formParam.value.gracePrdMonth.value - totalMonthDifference

  let gracePrdYear = Math.floor(totalMonths / 12)
  let gracePrdMonth = totalMonths % 12

  if (gracePrdYear < 0) {
    gracePrdYear = 0
  }

  if (gracePrdMonth < 0) {
    gracePrdMonth = 0
  }

  scheduleParam.value.gracePrdYear.value = gracePrdYear
  scheduleParam.value.gracePrdMonth.value = gracePrdMonth
}

const rewriteSimulation = async () => {
  const repayProgTpcd = formParam.value.repayProgTpcd.value
  const rateChangeCode = formParam.value.rateChangeCode.value
  const baseRateApplydt = formParam.value.baseRateApplydt.value
  const lastIntChrgPrd = formParam.value.lastIntChrgPrd.value
  const disbursementDate = formParam.value.disbursementDate.value

  if (repayProgTpcd === '04' && formParam.value.disbursementAmt.value === formParam.value.disburseBalance.value) {
    scheduleParam.value.disbursementDate.value = disbursementDate
    scheduleParam.value.disbursementAmt.value = formParam.value.disbursementAmt.value
  } else {
    if (new Date(baseRateApplydt) > new Date(lastIntChrgPrd)) {
      scheduleParam.value.disbursementDate.value = baseRateApplydt
    } else {
      scheduleParam.value.disbursementDate.value = lastIntChrgPrd
    }
    scheduleParam.value.disbursementAmt.value = formParam.value.disburseBalance.value
  }

  gracePrdSet()
  scheduleParam.value.repayProgTpcd.value = repayProgTpcd
  scheduleParam.value.rateChangeCode.value = rateChangeCode
  scheduleParam.value.interestRate.value = formParam.value.interestRate.value
  scheduleParam.value.disbursementNo.value = formParam.value.disbursementNo.value
  scheduleParam.value.dayCountCode.value = formParam.value.dayCountCode.value
  scheduleParam.value.holidayApplyCode.value = formParam.value.holidayApplyCode.value

  if (!freeformUtil.checkRequired(scheduleParam, freeformRefs)) return

  reWriteSimulationGrid()
}

const reWriteSimulationGrid = async () => { // 원금 스케줄 조회
  rowData.value = resetRowData.value

  const repayProgTpcd = formParam.value.repayProgTpcd.value
  const data = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS062', scheduleParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response) {
        rowData1.value = response

        const newArr = [
          ...rowData.value.filter(i => i.id !== 'total'),
          ...rowData1.value.filter(i => (i.rSchdIntAmt + i.rSchdPrincipalAmt > 0))
        ]

        rowData.value = newArr

        if (repayProgTpcd === '01') {
          const installment = rowData1.value[rowData1.value.length - 1]
          freeformUtil.clear(modelValues)
          nextTick(() => {
            modelValues.value.currency.value = modelValues1.value.currency.value
            modelValues.value.money.value = installment.installmentAmt
          })
        } else if (repayProgTpcd === '04') {
          if (rowData.value.length > 0) {
            // 마지막 스케줄 날짜를 저장
            const lastScheduleDate = rowData.value[rowData.value.length - 1].rScheduleDate

            // rowData.value를 순회하면서 remainedAmount나 remainedInt의 값이 0이 아닌 데이터를 찾아 scheduleDate를 변경
            rowData.value.forEach(item => {
              if (item.rSchdPrincipalAmt - item.rpmtPrincipalAmt !== 0 || item.rSchdIntAmt - item.rpmtIntAmt !== 0) {
                item.rScheduleDate = lastScheduleDate
              }
            })
          }
        }

        totalValue() // totalValue 호출 위치를 변경
        simulationSearch.value = true
      }
    })
}

const currencyCodeList = ref([])
ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    currencyCodeList.value = codeData
  })

const simulationSearch = ref(false)

const simulation = async () => {
  if (isRewriteMode.value && formParam.value.repayProgTpcd.value !== '05') {
    return rewriteSimulation()
  }

  scheduleParam.value.repayProgTpcd.value = formParam.value.repayProgTpcd.value
  scheduleParam.value.disbursementAmt.value = formParam.value.disbursementAmt.value
  scheduleParam.value.interestRate.value = formParam.value.interestRate.value
  scheduleParam.value.disbursementDate.value = formParam.value.disbursementDate.value
  scheduleParam.value.disbursementNo.value = formParam.value.disbursementNo.value
  if (isRewriteMode.value) {
    scheduleParam.value.initialDueDate.value = rowData.value[0].scheduleDate
    scheduleParam.value.lastRepaymentDate.value = formParam.value.baseRateApplydt.value
  } else {
    scheduleParam.value.lastRepaymentDate.value = scheduleParam.value.disbursementDate.value
  }

  // repayPlanDay값 '' -> null로 변환
  if (commonUtil.isEmpty(scheduleParam.value.repayPlanDay.value)) {
    scheduleParam.value.repayPlanDay.value = null
  }
  scheduleParam.value.gracePrdYear.value = formParam.value.gracePrdYear.value
  scheduleParam.value.gracePrdMonth.value = formParam.value.gracePrdMonth.value
  scheduleParam.value.dayCountCode.value = formParam.value.dayCountCode.value
  scheduleParam.value.holidayApplyCode.value = formParam.value.holidayApplyCode.value
  scheduleParam.value.maturityDate.value = formParam.value.maturityDate.value
  if (!freeformUtil.checkRequired(scheduleParam, freeformRefs)) return
  const fetchData = () => {
    if (formParam.value.repayProgTpcd.value !== '05') {
      // DB함수에서 처리하기 때문에 null값으로 변경
      scheduleParam.value.initialDueDate.value = null
      scheduleParam.value.finalDueDate.value = null
      scheduleParam.value.installmentCnt.value = null
      return gridPropsUtil.searchRow('bsLonSrvDbsService', 'LONSRVDBS042', scheduleParam, rowData, rowCount)
    } else {
      const rows = rowData.value.filter(row => row.id !== 'total')
      const combinedParams = {
        rows,
        repayProgTpcd: scheduleParam.value.repayProgTpcd.value,
        branchCode: scheduleParam.value.branchCode.value,
        currencyCode: scheduleParam.value.currencyCode.value,
        interestRate: scheduleParam.value.interestRate.value,
        roundDigitCd: scheduleParam.value.roundDigitCd.value,
        dayCountCode: scheduleParam.value.dayCountCode.value,
        disbursementAmt: scheduleParam.value.disbursementAmt.value,
        disbursementDate: scheduleParam.value.disbursementDate.value,
        lastRepaymentDate: scheduleParam.value.lastRepaymentDate.value,
        maxValue: scheduleParam.value.maxValue.value
      }
      return gridPropsUtil.searchRow('bsLonSrvDbsService', 'LONSRVDBS042', combinedParams, rowData, rowCount)
    }
  }

  fetchData().then(() => {
    const lastDataCnt = rowData.value.length - 1
    scheduleParam.value.initialDueDate.value = dayjs(rowData.value[0].rScheduleDate).format('YYYY-MM-DD')
    scheduleParam.value.finalDueDate.value = dayjs(rowData.value[lastDataCnt].rScheduleDate).format('YYYY-MM-DD')
    scheduleParam.value.installmentCnt.value = rowData.value.length
    if (formParam.value.repayProgTpcd.value === '01') {
    //   const installment = rowData.value[2]
      freeformUtil.clear(modelValues)
      nextTick(() => {
        modelValues.value.currency.value = modelValues1.value.currency.value
        // modelValues.value.money.value = installment.installmentAmt
      })
    }
    totalValue() // totalValue 호출 위치를 변경
    simulationSearch.value = true
  }).catch(error => {
    simulationSearch.value = false
    console.error('fetchData error:', error)
  })
}

const totalValue = () => {
// rSchdPrincipalAmt 합계 구하기
  const totalSchdPrincipalAmt = rowData.value.reduce((acc, row) => acc + Number(row.rSchdPrincipalAmt), 0)
  // rSchdIntAmt 합계 구하기
  const totalSchdIntAmt = rowData.value.reduce((acc, row) => acc + Number(row.rSchdIntAmt), 0)
  // 합계 결과를 total 행에 설정
  const totalRow = {
    id: 'total',
    rScheduleDate: '',
    rSchdPrincipalAmt: totalSchdPrincipalAmt,
    rSchdIntAmt: totalSchdIntAmt,
    rTotalAmt: totalSchdPrincipalAmt + totalSchdIntAmt
  }
  // rowData.value 배열을 복사하여 새로운 배열을 생성하고, 그 배열에 totalRow 추가
  rowData.value = [...rowData.value, totalRow]
}

// jwk 240604

// 결재선 목록조회
const authorLineInquiry = () => {
  formParam.value.applicationNo.value = formParam.value.disbursementNo.value
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH002', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas.length === 0) {
        authorLineDatas.value = []
      } else {
        const tmpList = []
        for (const data of datas) {
          const row = {
            icon: '',
            color: '',
            employeeNo: data.employeeNo,
            name: data.employeeName,
            position: data.employeePositionNm,
            status: '',
            sortSeq: data.sortSeq,
            finalApproverYn: data.finalApproverYn,
            userId: data.employeeNo,
            branchCode: data.branchCode,
            authorizationNo: data.authorizationNo,
            authorizationStatus: data.authResultCode,
            authorizationDate: data.authorizationDate
          }

          switch (data.authResultCode) {
            case '01': // 승인
              row.icon = 'check'
              row.color = 'green'
              row.status = 'Approved'
              break
            case '02': // 조건부 승인
              row.icon = 'edit'
              row.color = 'orange'
              row.status = 'Conditional Approved'
              break
            case '03': // 거절
              row.icon = 'close'
              row.color = 'red'
              row.status = 'Declined'
              break
            default:
              row.icon = 'schedule'
              row.color = 'blue'
              row.status = 'Progress'
              break
          }

          tmpList.push(row)
        }
        authorLineDatas.value = tmpList
      }
      updateAuthData()
    })
}

const authorLineDatasClear = () => {
  authorLineDataFlag.value = false
}

// 좌측 결재 데이터 변경
const updateAuthData = () => {
  const isRegistUser = formParam.value.registEmployeeNo.value === session.sysEmployeeNo
  // jw 임시 - 결제 여부 추가해야함
  if (isRegistUser === true && isSettleCheck.value === true) isAppvPopupVisible.value = false
  else isAppvPopupVisible.value = true
  // 기등록 데이터 존재
  if (authorLineDatas.value.length > 0) {
    authorStatus.value = '01'
    authorLineDatas.value.forEach((data, index) => {
      const list = []
      list.value = data
      if (list.value.status !== 'Progress' && index !== 0) {
        isAppvPopupVisible.value = true
        authorApproveStatus.value = 'approved'
      }
    })
  } else if (commonUtil.isEmpty(formParam.value.disbursementNo.value)) { // 선등록 필요
    setDisableSide()
  } else {
    authorStatus.value = '03' // 미등록
    authorLineComment.value = 'No Attached Data'
  }
}

// 좌측 사이드 데이터 초기화
const setDisableSide = () => {
  const ment = 'Yon can enter if after the settlement is completed'
  authorStatus.value = '02'
  isAppvPopupVisible.value = true
  authorLineComment.value = ment
}

const isContractExpanded = ref(false)
const isDisburseExpanded = ref(false)

/* =======================================================
    6. Freeform Object
======================================================= */
const selectedPopupRowData = ref([])
const gridComponent = ref(null)

const disableFlagObj = reactive({
  nonTarget, excludeTarget
})

const disableFlagObj1 = reactive({
  nonTarget1, excludeTarget1
})

const radioDisableFlag = ref({
  newRadio: {
    value: false,
    type: Boolean
  },
  inquiryRadio: {
    value: false,
    type: Boolean
  },
  updateRadio: {
    value: true,
    type: Boolean
  },
  deleteRadio: {
    value: true,
    type: Boolean
  }
})

const radioDisableFlag1 = ref({
  newRadio: {
    value: false,
    type: Boolean
  },
  inquiryRadio: {
    value: false,
    type: Boolean
  },
  updateRadio: {
    value: true,
    type: Boolean
  },
  deleteRadio: {
    value: true,
    type: Boolean
  }
})
/* =======================================================
    7. Freeform Funtion
======================================================= */
const addRow = () => {
  let dayCountCode
  if (formParam.value.dayCountCode.value === '01') {
    dayCountCode = 365
  } else {
    dayCountCode = 360
  }

  let roundUnit
  switch (scheduleParam.value.roundDigitCd.value) {
    case '01': roundUnit = 0.01; break
    case '02': roundUnit = 0.1; break
    case '03': roundUnit = 1; break
    case '04': roundUnit = 10; break
    case '05': roundUnit = 100; break
    case '06': roundUnit = 1000; break
    case '07': roundUnit = 10000; break
    case '08': roundUnit = 100000; break
    case '09': roundUnit = 1000000; break
    default: roundUnit = Math.pow(10, 3 - parseInt(scheduleParam.value.roundDigitCd.value)); break
  }

  const totalRow = rowData.value.find(row => row.id === 'total')
  if (totalRow) {
    const totalSchdPrincipalAmt = totalRow.rSchdPrincipalAmt
    // 이전 행의 scheduleDate, rSchdPrincipalAmt 값이 없거나 schdPrincipalAmt의 합계가 disbursementAmt보다 큰 경우 리턴
    if (rowData.value.length > 0 && (totalSchdPrincipalAmt >= formParam.value.disbursementAmt.value)) {
      return
    }
  }
  if (formParam.value.repayProgTpcd.value === '05') {
    const schDate = new Date(formParam.value.disbursementDate.value.substring(0, 11))
    schDate.setMonth(schDate.getMonth() + 1)
    const newRow = {
      rScheduleDate: schDate.toISOString().split('T')[0],
      rSchdPrincipalAmt: 0,
      rSchdIntAmt: 0,
      rpmtPrincipalAmt: 0,
      repayProgTpcd: formParam.value.repayProgTpcd.value,
      disbursementAmt: formParam.value.disbursementAmt.value,
      interestRate: formParam.value.interestRate.value,
      dayCount: dayCountCode,
      disbursementDate: formParam.value.disbursementDate.value,
      finalDueDate: scheduleParam.value.finalDueDate.value,
      roundUnit,
      roundFactor: scheduleParam.value.roundFactor.value,
      remainAmountCode: scheduleParam.value.remainAmountCode.value
    }
    rowData.value = [ // 합계 행을 제외하고 새로운 행 추가
      ...rowData.value.filter(row => row.id !== 'total'),
      newRow
    ]
  }
  // 합계 행 업데이트
  updateTotalRow('add')
}

const removeRow = () => {
  const length = rowData.value.length
  if (length > 1) {
    const removedAmt = rowData.value[length - 2].rSchdPrincipalAmt // 삭제할 행의 rSchdPrincipalAmt
    rowData.value = [...rowData.value.slice(0, length - 2), rowData.value[length - 1]] // 마지막에서 두 번째 행 삭제
    updateTotalRow('remove', removedAmt) // 행 삭제 후 합계 업데이트
  }
}
const undo = () => {
  rowData.value = [] // 모든 행 삭제
}
const updateTotalRow = (action, amt = 0) => {
  let totalSchdPrincipalAmt

  // 합계 행 찾기 (id나 다른 식별자를 사용)
  let totalRow = rowData.value.find(row => row.id === 'total')

  // 행 추가인 경우
  if (action === 'add') {
    totalSchdPrincipalAmt = rowData.value.reduce((sum, row) => sum + (row.rSchdPrincipalAmt || 0), 0)
  } else if (action === 'remove') { // 행 삭제인 경우
    totalSchdPrincipalAmt = totalRow.rSchdPrincipalAmt - amt // 이미 계산된 합계에서 삭제된 행의 값을 뺌
  }

  if (totalRow) {
  // 합계 행이 이미 있는 경우: 합계 업데이트
    totalRow.rSchdPrincipalAmt = totalSchdPrincipalAmt // 합계 업데이트
  } else {
  // 합계 행이 없는 경우: 합계 행 추가
    if (formParam.value.repayProgTpcd.value === '05') {
      totalRow = {
        id: 'total',
        rScheduleDate: '',
        rSchdPrincipalAmt: totalSchdPrincipalAmt,
        rSchdIntAmt: '',
        totalAmt: '',
        rpmtPrincipalAmt: ''
      // paidPrincipal: '',
      // paidInt: ''
      }
    }
    rowData.value.push(totalRow)
  }

  // 그리드 갱신
  gridProps.gridApi.value.refreshCells()
}

const updateTrxnMode = (event) => {
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    freeformUtil.disableControl(false, disableFlagObj)
    formParamClear()
    modelValuesClear()
    isSearchMode = false
    freeformUtil.clear(scheduleParam)
    rowData.value = []
    isContractExpanded.value = false
    isDisburseExpanded.value = false
    formParam.value.rateChangeCode.value = '01'
    formParam.value.intRecvTpcd.value = '01'
    formParam.value.holidayApplyCode.value = '01'
    formParam.value.pastDueCalCode.value = '02'
    formParam.value.scheduleYn.value = 'N'
    formParam.value.accuralStopYn.value = 'N'
    formParam.value.dayCountCode.value = '01'
    formParam.value.registEmployeeNo.value = session.sysEmployeeNo
    formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
    scheduleParam.value.transactionMode.value = 'NEW'
    authorLineDatas.value = []
    authorStatus.value = '02'
    updateTrxnMode2()
    disabledTabs.repaymentSchedule = true
    isPopupVisible.value = true
  } else if (transactionMode === 'INQUIRY') {
    formParamClear()
    modelValuesClear()
    freeformUtil.disableControl(true, disableFlagObj)
    isContractExpanded.value = false
    isDisburseExpanded.value = false
    isPopupVisible.value = false
    authorLineDatas.value = []
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(false, disableFlagObj)
    disabledTabs.repaymentSchedule = true
    if (!commonUtil.isEmpty(formParam.value.applicationNo.value) && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) isAppvPopupVisible.value = false
    isPopupVisible.value = false
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
    disabledTabs.repaymentSchedule = true
    isPopupVisible.value = true
  }

  controllRadioDisable(transactionMode)
}

const disableControl1 = (flag, disableFlagObj) => {
  disableFlagObj.nonTarget1 = flag
  disableFlagObj.excludeTarget1 = true
}

const updateTrxnMode2 = async (event) => {
  const transactionMode = (event === undefined) ? scheduleParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    isSearchMode = false
    disableControl1(false, disableFlagObj1)
    if (rowData.value.length === 0) {
      isRewriteMode.value = false
      freeformUtil.clear(scheduleParam)
      freeformUtil.clear(modelValues)
      await nextTick()
      modelValues.value.currency.value = formParam.value.currencyCode.value
      rowData.value = []

      if (formParam.value.repayProgTpcd.value === '01' || formParam.value.repayProgTpcd.value === '03' || formParam.value.repayProgTpcd.value === '04') {
        planDisable.value = true
        planDisable1.value = false
        dayDisable.value = false
        scheduleParam.value.installmentAmt.required = false
        scheduleParam.value.frequencyMm.value = '1'
        scheduleParam.value.roundDigitCd.value = '03'
        scheduleParam.value.repayDatePlanCd.value = '04' // disbursement Day로 고정
      } else if (formParam.value.repayProgTpcd.value === '05') { // 불균등
        planDisable.value = true
        dayDisable.value = true
        planDisable1.value = true
        scheduleParam.value.installmentAmt.required = false
        scheduleParam.value.frequencyMm.value = 0
        scheduleParam.value.roundDigitCd.value = '03'
        scheduleParam.value.repayDatePlanCd.value = ''
      } else { // 원금 균등
        planDisable1.value = false
        planDisable.value = false
        dayDisable.value = false
        scheduleParam.value.installmentAmt.required = false
        scheduleParam.value.frequencyMm.value = '1'
        scheduleParam.value.roundDigitCd.value = '03'
        scheduleParam.value.repayDatePlanCd.value = '01'
      }
    } else {
      isRewriteMode.value = true
      scheduleParam.value.initialDueDate.value = ''
      if (formParam.value.repayProgTpcd.value === '01' || formParam.value.repayProgTpcd.value === '03' || formParam.value.repayProgTpcd.value === '04') {
        planDisable.value = true
        planDisable1.value = false
        dayDisable.value = false
        scheduleParam.value.installmentAmt.required = false
        scheduleParam.value.frequencyMm.value = '1'
        scheduleParam.value.roundDigitCd.value = '03'
        scheduleParam.value.repayDatePlanCd.value = ''
        scheduleParam.value.repayDatePlanCd.value = '01'
        startUpdateRepaymentSchedule()
      } else if (formParam.value.repayProgTpcd.value === '05') { // 불균등
        planDisable.value = true
        dayDisable.value = true
        planDisable1.value = true
        scheduleParam.value.installmentAmt.required = false
        scheduleParam.value.frequencyMm.value = 0
        scheduleParam.value.roundDigitCd.value = '03'
        scheduleParam.value.repayDatePlanCd.value = ''
      } else { // 원금 균등
        planDisable1.value = false
        planDisable.value = false
        dayDisable.value = false
        scheduleParam.value.installmentAmt.required = false
        scheduleParam.value.frequencyMm.value = '1'
        scheduleParam.value.roundDigitCd.value = '03'
        scheduleParam.value.repayDatePlanCd.value = ''
        scheduleParam.value.repayDatePlanCd.value = '01'
        startUpdateRepaymentSchedule()
      }
    }
    scheduleParam.value.remainAmountCode.value = '02'
    scheduleParam.value.finalDueDate.value = formParam.value.maturityDate.value
  } else if (transactionMode === 'INQUIRY') {
    disableControl1(true, disableFlagObj1)
    planDisable.value = true
    planDisable1.value = true
    dayDisable.value = true
  } else if (transactionMode === 'UPDATE') {
    disableControl1(false, disableFlagObj1)
  } else if (transactionMode === 'DELETE') {
    disableControl1(true, disableFlagObj1)
    planDisable.value = true
    planDisable1.value = true
  }
  controllRadioDisable1(transactionMode)
}

const controllRadioDisable = (selectedRTransactionMode) => {
  if (selectedRTransactionMode === 'NEW') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    isPopupVisible.value = true
  } else if (selectedRTransactionMode === 'INQUIRY') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    isPopupVisible.value = true
  } else {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  }
}

const controllRadioDisable1 = (selectedRTransactionMode) => {
  if (selectedRTransactionMode === 'NEW') {
    radioDisableFlag1.value.newRadio.value = false
    if (scheduleParam.value.scheduleNo.value !== '') {
      radioDisableFlag1.value.inquiryRadio.value = false
    } else {
      radioDisableFlag1.value.inquiryRadio.value = true
    }
    radioDisableFlag1.value.updateRadio.value = true
    radioDisableFlag1.value.deleteRadio.value = true
  } else if (selectedRTransactionMode === 'INQUIRY') {
    if (formParam.value.scheduleYn.value === 'N') {
      radioDisableFlag1.value.newRadio.value = false
    } else {
      radioDisableFlag1.value.newRadio.value = true
    }

    radioDisableFlag1.value.inquiryRadio.value = false
    radioDisableFlag1.value.updateRadio.value = false
    radioDisableFlag1.value.deleteRadio.value = false
  } else {
    radioDisableFlag1.value.newRadio.value = true
    radioDisableFlag1.value.inquiryRadio.value = false
    radioDisableFlag1.value.updateRadio.value = false
    radioDisableFlag1.value.deleteRadio.value = false
  }
}

const getPopupRowData1 = (event) => {
  formParamClear()
  modelValuesClear()

  // Holiday dayCount 초기값 세팅
  formParam.value.holidayApplyCode.value = '01'
  formParam.value.dayCountCode.value = '01'

  for (const key in event) {
    if (key in formParam.value && event[key] !== null) {
      formParam.value[key].value = event[key]
    }
  }

  formParam.value.currencyContractCode.value = event.currencyCode
  formParam.value.contractMaturityDate.value = event.maturityDate
  formParam.value.contractIntRateTpcd.value = event.intRateTpcd
  formParam.value.contractSpreadRate.value = event.spreadRate.toFixed(5)
  modelValues1.value.currency.value = event.currencyCode
  modelValues1.value.money.value = event.contractAmount
  modelValues2.value.currency.value = event.currencyCode
  modelValues2.value.money.value = event.contractBal
  modelValues3.value.currency.value = event.currencyCode
  modelValues4.value.currency.value = event.currencyCode
  if (event.contractBal !== 0) {
    modelValues3.value.money.value = event.contractBal
  } else {
    modelValues3.value.money.value = ''
  }

  searchParam.value.searchKeyword.value = formParam.value.contractNo.value
  searchParam.value.baseDate.value = formParam.value.disbursementDate.value
  const newSearchParam = commonUtil.inputValueToJson('bsFrmHlpCmmService', 'FRMHLPCMM002', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        // messageBox.alertInfo(i18n.global.t('msg.nodata.found'))
        // console.log('nodata')
      } else {
        if (formParam.value.intRateTpcd.value === '02') {
          formParam.value.baseRateCode.value = data[0].baseRateCode
          formParam.value.baseRateName.value = data[0].baseRateName
          formParam.value.baseRateApplydt.value = data[0].applyDate
          formParam.value.baseRate.value = data[0].baseRate
          formParam.value.rateTermCode.value = data[0].rateTermCode
          formParam.value.contractBaseRateName.value = data[0].baseRateName
        } else {
          formParam.value.baseRateCode.value = ''
          formParam.value.baseRateName.value = ''
          formParam.value.baseRate.value = 0
          formParam.value.rateTermCode.value = ''
          formParam.value.contractBaseRateName.value = ''
          if (formParam.value.intRateTpcd.value === '01' && formParam.value.baseRateApplydt.value === '') {
            formParam.value.baseRateApplydt.value = formParam.value.disbursementDate.value
          }
        }
      }
    })
  isContractExpanded.value = true
  isDisburseExpanded.value = true
}

const startUpdateRepaymentSchedule = () => { // Schedule이 존재하지만 실행 Update로 인해 Schedule Yn이 N이 된 경우 스케줄 업데이트를 실행해야함.
  if (formParam.value.repayProgTpcd.value === '04') {
    rowData.value = rowData.value.filter(i => {
      if (i.id === 'total') return false

      const differentAmt = formParam.value.disbursementAmt.value !== formParam.value.disburseBalance.value

      if (differentAmt) {
        // return !(new Date(i.intCalcFromDate) >= new Date(formParam.value.baseRateApplydt.value) &&
        //      (i.rSchdPrincipalAmt - i.rpmtPrincipalAmt) === i.rSchdPrincipalAmt &&
        //      (i.schdIntAmt - i.rpmtIntAmt) === i.schdIntAmt)
        return rowData.value
      } else {
        return ''
      }
    })
  } else {
    if (formParam.value.repayProgTpcd.value === '01') {
      scheduleParam.value.increasedAmount.value = formParam.value.disbursementAmt.value - rowData.value[rowData.value.length - 1].rSchdPrincipalAmt
    }

    rowData.value =
    rowData.value.filter(i => i.id !== 'total' &&
       ((i.rSchdPrincipalAmt - i.rpmtPrincipalAmt) !== (i.rSchdPrincipalAmt) ||
        (i.rSchdIntAmt - i.rpmtIntAmt) !== (i.rSchdIntAmt))
    )

    const targetRowData = rowData.value[rowData.value.length - 1]

    const repayProgTpcd = formParam.value.repayProgTpcd.value
    if (repayProgTpcd === '01' || repayProgTpcd === '02' || repayProgTpcd === '03') {
      if (targetRowData.rSchdPrincipalAmt !== targetRowData.rpmtPrincipalAmt ||
        targetRowData.rSchdIntAmt !== targetRowData.rpmtIntAmt) {
        scheduleParam.value.repaymentPrincipal.value = targetRowData.rpmtPrincipalAmt
        scheduleParam.value.repaymentIntAmt.value = targetRowData.rpmtIntAmt
      }

      rowData.value =
      rowData.value.filter(i => i.rSchdPrincipalAmt - i.rpmtPrincipalAmt === 0 && i.rSchdIntAmt - i.rpmtIntAmt === 0)
    }
  }

  resetRowData.value = rowData.value
  scheduleParam.value.originScheduleNo.value = scheduleParam.value.scheduleNo.value

  scheduleParam.value.scheduleNo.value = ''
  if (rowData.value.length > 0) {
    scheduleParam.value.lastRepaymentDate.value = rowData.value[rowData.value.length - 1].intCalcToDate
    scheduleParam.value.calculationPrincipal.value = rowData.value[rowData.value.length - 1].intCalcPrinciple - rowData.value[rowData.value.length - 1].rpmtPrincipalAmt
  } else {
    scheduleParam.value.lastRepaymentDate.value = formParam.value.disbursementDate.value
    scheduleParam.value.calculationPrincipal.value = formParam.value.disburseBalance.value
  }
  totalValue()
}

const firstDisbursement = ref(false)
const maturityDateSet = () => {
  if (formParam.value.loanPrdTpcd.value !== '02') { // After Disbursement Date
    return
  }

  const contractAmount = formParam.value.contractAmount.value
  const contractBal = formParam.value.contractBal.value
  if (formParam.value.transactionMode.value === 'NEW') {
    firstDisbursement.value = contractAmount === contractBal
  }

  if (firstDisbursement.value) { // 계약의 첫 실행인 경우
    const disbursementDate = new Date(formParam.value.disbursementDate.value)
    let yearTerm = 0
    if (formParam.value.loanTermYear.value !== null && formParam.value.loanTermYear.value !== '') {
      yearTerm = parseInt(formParam.value.loanTermYear.value)
    }

    let monthTerm = 0
    if (formParam.value.loanTermMonth.value !== null && formParam.value.loanTermMonth.value !== '') {
      monthTerm = parseInt(formParam.value.loanTermMonth.value)
    }

    let contractMaturityDate = addMonths(addYears(disbursementDate, yearTerm), monthTerm)
    contractMaturityDate = subDays(contractMaturityDate, 1)
    formParam.value.contractMaturityDate.value = dayjs(addDays(contractMaturityDate, 1)).format(commonProp.dateformat.dateType)

    formParam.value.maturityDate.value = formParam.value.contractMaturityDate.value
    formParam.value.contractUpdateFlag.value = 'Y'
  }
}

watch(
  () => [formParam.value.baseRate.value, formParam.value.spreadRate.value],

  () => {
    formParam.value.interestRate.value = Number(formParam.value.baseRate.value) + Number(formParam.value.spreadRate.value)
  },
  { immediate: true }
)

watch(
  () => [formParam.value.disbursementAmt.value],

  () => {
    if (formParam.value.transactionMode.value === 'NEW') {
      modelValues4.value.money.value = modelValues3.value.money.value
    } else if (formParam.value.transactionMode.value === 'UPDATE') {
      const repayAmt = Number(formParam.value.originDisbursementAmt.value) - Number(formParam.value.originDisburseBalance.value)
      const result = Number(formParam.value.disbursementAmt.value) - repayAmt

      modelValues4.value.money.value = result
    }
  },
  { immediate: true }
)

let oldMaturityDate = formParam.value.maturityDate.value
let updating = false
watch(
  () => [formParam.value.maturityDate.value],
  () => {
    if (updating) {
      return
    }
    updating = true

    const maturityDate = new Date(formParam.value.maturityDate.value)
    const contractMaturityDate = new Date(formParam.value.contractMaturityDate.value)

    if (maturityDate > contractMaturityDate) {
      const _alertInfoMaturityDate = () => {
        formParam.value.maturityDate.value = oldMaturityDate
        updating = false
      }
      messageBox.alertInfo(i18n.global.t("It cannot be greater than the Contract's MaturityDate value."), _alertInfoMaturityDate)
    } else {
      oldMaturityDate = formParam.value.maturityDate.value
      updating = false
    }
  },
  { immediate: true }
)

let oldDisburseDate = formParam.value.disbursementDate.value
let updating1 = false

watch(
  () => [formParam.value.disbursementDate.value],
  () => {
    if (isRewriteMode.value) return
    if (formParam.value.transactionMode.value === 'INQUIRY') return
    const disubrsementDate = new Date(formParam.value.disbursementDate.value)
    const transactionDate = new Date(formParam.value.transactionDate.value)

    if (disubrsementDate > transactionDate) {
      messageBox.alertError('Always Business Date >= Disbursement Date')
      formParam.value.disbursementDate.value = formParam.value.transactionDate.value
    }
    searchParam.value.baseDate.value = formParam.value.disbursementDate.value
    const newSearchParam = commonUtil.inputValueToJson('bsFrmHlpCmmService', 'FRMHLPCMM002', searchParam)
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        if (data.length === 0) {
          // console.log('nodata')
        } else {
          if (formParam.value.intRateTpcd.value === '02') {
            formParam.value.baseRateCode.value = data[0].baseRateCode
            formParam.value.baseRateName.value = data[0].baseRateName
            formParam.value.baseRateApplydt.value = data[0].applyDate
            formParam.value.baseRate.value = data[0].baseRate
            formParam.value.rateTermCode.value = data[0].rateTermCode
          } else {
            formParam.value.baseRateCode.value = formParam.value.contractBaseRateCode.value
            formParam.value.baseRateName.value = formParam.value.contractBaseRateName.value
            formParam.value.baseRate.value = formParam.value.contractBaseRate.value
            formParam.value.rateTermCode.value = formParam.value.contractBaseRateTermCode.value
            formParam.value.baseRateApplydt.value = formParam.value.disbursementDate.value
          }
        }
      })
    if (updating1) {
      return
    }
    updating1 = true

    const disbursementDate = new Date(formParam.value.disbursementDate.value)
    const contractDate = new Date(formParam.value.contractDate.value)

    if (disbursementDate < contractDate) {
      const _alertInfoLessDate = () => {
        formParam.value.disbursementDate.value = oldDisburseDate
        updating1 = false
      }
      messageBox.alertInfo(i18n.global.t('cannot be less than contractdate.'), _alertInfoLessDate)
    } else {
      oldDisburseDate = formParam.value.disbursementDate.value
      updating1 = false
    }

    maturityDateSet()
  },
  { immediate: true }
)

// const finalDueDateError = computed(() => {
//   const result = (new Date(scheduleParam.value.finalDueDate.value).getTime()) > (new Date(formParam.value.maturityDate.value).getTime())
// })
// const doNotMatchErrorMessage = 'Maturity Date and the Final Due Date do not match'
watch(
  () => scheduleParam.value.finalDueDate.value,
  (newVal, oldVal) => {
    const maturityDate = new Date(formParam.value.maturityDate.value).getTime()
    const finalDueDate = new Date(newVal).getTime()

    if (scheduleParam.value.transactionMode.value !== 'INQUIRY' &&
        finalDueDate > maturityDate) {
      messageBox.alertError('The Final Due Date cannot be later than the Maturity Date.')
      scheduleParam.value.finalDueDate.value = oldVal
    }
  },
  { immediate: true }
)

// let oldInitialDueDate = scheduleParam.value.initialDueDate.value
// let updating2 = false

const disburseAmountError = computed(() => {
  const result = Number(formParam.value.disbursementAmt.value) > Number(formParam.value.contractBal.value)
  const result1 = Number(formParam.value.disbursementAmt.value) > Number(formParam.value.contractBal.value) + Number(formParam.value.originDisbursementAmt.value)
  if (!isSearchMode) {
    return result
  } else if (isSearchMode && formParam.value.transactionMode.value !== 'INQUIRY') {
    return result1
  }
  return null
})
const disburseAmountErrorMessage = 'Disbursement Amount cannot exceed Contract Outstanding.'

// let prevInitialDueDate
// let prevFrequencyMm
// watch(
//   [
//     () => scheduleParam.value.initialDueDate.value,
//     () => scheduleParam.value.frequencyMm.value,
//     () => scheduleParam.value.repayDatePlanCd.value,
//     () => scheduleParam.value.repayPlanDay.value
//   ],
//   (newValues, oldValues) => {
//     if (isSearchMode) return

//     const newInitialDueDate = newValues[0]
//     const newFrequencyMm = newValues[1]
//     const newRepayDatePlanCd = newValues[2]
//     const newRepayPlanDay = newValues[3]
//     const oldRepayDatePlanCd = oldValues[2]
//     const oldRepayPlanDay = oldValues[3]

//     // let initialDateParts
//     if (
//       newInitialDueDate !== prevInitialDueDate ||
//       newFrequencyMm !== prevFrequencyMm ||
//       newRepayDatePlanCd !== oldRepayDatePlanCd ||
//       newRepayPlanDay !== oldRepayPlanDay
//     ) {
//       const initialDateParts = newInitialDueDate.split('-')
//       const initialDate = new Date(initialDateParts[0], initialDateParts[1] - 1, initialDateParts[2])
//       let repayDate = initialDate

//       const finalDateParts = scheduleParam.value.finalDueDate.value.split('-')
//       const finalDate = new Date(finalDateParts[0], finalDateParts[1] - 1, finalDateParts[2])

//       const diffInMonths = (finalDate.getFullYear() - initialDate.getFullYear()) * 12 +
//       (finalDate.getMonth() - initialDate.getMonth())

//       // 첫 달 이후의 repayDate 계산
//       switch (newRepayDatePlanCd) {
//         case '01':
//           repayDate.setDate(newRepayPlanDay)
//           break
//         case '02':
//           repayDate.setDate(1)
//           break
//         case '03':
//           repayDate = new Date(repayDate.getFullYear(), repayDate.getMonth() + 1, 0) // 그 달의 마지막 날
//           break
//       }

//       // frequencyMm을 고려하여 installmentCnt를 계산합니다.
//       const installmentCnt = Math.ceil(diffInMonths / newFrequencyMm)

//       const endDate = new Date(repayDate.getFullYear(), repayDate.getMonth() + (installmentCnt - 1) * newFrequencyMm, repayDate.getDate())
//       const finalInstallmentCnt = endDate < finalDate ? installmentCnt + 1 : installmentCnt
//       scheduleParam.value.installmentCnt.value = finalInstallmentCnt

//       prevInitialDueDate = newInitialDueDate
//       prevFrequencyMm = newFrequencyMm
//     }
//     // validatePledgeAmount()
//   },
//   { deep: true }
// )

watch(
  [() => scheduleParam.value.repayDatePlanCd.value],
  (newValues) => {
    if (isSearchMode) return

    let targetDate
    const baseRateApplydt = formParam.value.baseRateApplydt.value
    const lastIntChrgPrd = formParam.value.lastIntChrgPrd.value
    const baseRateApplydtObj = new Date(baseRateApplydt)
    const lastIntChrgPrdObj = new Date(lastIntChrgPrd)

    if (isRewriteMode.value) {
      targetDate = baseRateApplydtObj > lastIntChrgPrdObj ? baseRateApplydtObj : lastIntChrgPrdObj
    } else {
      targetDate = new Date(formParam.value.disbursementDate.value)
    }

    if (newValues[0] === '02') {
      scheduleParam.value.repayPlanDay.value = ''
      dayDisable.value = true

      targetDate.setDate(1) // 일자를 1일로 설정
      targetDate.setMonth(targetDate.getMonth() + 1) // 다음 달로 설정

      if (new Date(targetDate) > new Date(scheduleParam.value.finalDueDate.value)) {
        targetDate = new Date(scheduleParam.value.finalDueDate.value)
      }

      targetDate.setDate(1)
      scheduleParam.value.initialDueDate.value = targetDate.toISOString().split('T')[0]
    } else if (newValues[0] === '03') {
      scheduleParam.value.repayPlanDay.value = ''
      dayDisable.value = true

      const nextEndDay = targetDate.getDate() === endOfMonth(targetDate).getDate() ? endOfMonth(addMonths(targetDate, 1)) : endOfMonth(targetDate)

      if (nextEndDay > new Date(scheduleParam.value.finalDueDate.value)) {
        targetDate = new Date(scheduleParam.value.finalDueDate.value)
      } else {
        targetDate = nextEndDay
      }

      scheduleParam.value.initialDueDate.value = targetDate.toISOString().split('T')[0]
    } else if (newValues[0] === '01') {
      scheduleParam.value.repayPlanDay.value = ''
      if (formParam.value.repayProgTpcd.value === '05') {
        dayDisable.value = true
      } else {
        dayDisable.value = false
      }
    } else if (newValues[0] === '04') {
      scheduleParam.value.repayPlanDay.value = ''
      dayDisable.value = true
      targetDate.setDate(targetDate.getDate()) // 일자를 실행일의 일자로 설정
      targetDate.setMonth(targetDate.getMonth() + 1) // 다음 달로 설정
      scheduleParam.value.initialDueDate.value = targetDate.toISOString().split('T')[0]
    }
  },
  { deep: true }
)

watch(
  [() => scheduleParam.value.repayPlanDay.value],
  (newValues) => {
    if (isSearchMode) return
    if (scheduleParam.value.repayDatePlanCd.value === '01') {
      let targetDate // 스케줄 재작성 시 baseRateApplydt를 기준으로 신규 스케줄 작성시 disbursementDate를 기준으로 진행
      if (isRewriteMode.value) {
        targetDate = new Date(formParam.value.baseRateApplydt.value)
      } else {
        targetDate = new Date(formParam.value.disbursementDate.value)
      }
      let closestDay
      const newValue = Number(newValues[0]) + 1

      if (targetDate.getDate() < newValues[0]) {
        closestDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), newValue)
      } else {
        closestDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, newValue)
      }

      scheduleParam.value.initialDueDate.value = closestDay.toISOString().split('T')[0]
    }
  },
  { deep: true }
)

const gracePeriodTotalMonths = ref(0)
watch(
  [
    () => scheduleParam.value.installmentCnt.value,
    () => scheduleParam.value.roundDigitCd.value
  ],
  ([newinstallmentCnt, newRoundDigitCd], [oldinstallmentCnt, oldRoundDigitCd]) => {
    if (!newinstallmentCnt || isSearchMode) return // 값이 비어있거나 검색 모드일 때는 로직을 실행하지 않음
    if (
      newinstallmentCnt !== oldinstallmentCnt ||
    newRoundDigitCd !== oldRoundDigitCd
    ) {
      if (formParam.value.repayProgTpcd.value === '02') { // 원금 균등 상환
        const disbursementDate = new Date(formParam.value.disbursementDate.value)
        const baseRateApplyDate = new Date(formParam.value.baseRateApplydt.value)

        const yearDifference = baseRateApplyDate.getFullYear() - disbursementDate.getFullYear()
        const monthDifference = baseRateApplyDate.getMonth() - disbursementDate.getMonth()

        const totalMonthDifference = yearDifference * 12 + monthDifference

        const gracePeriodSet = (isRewriteMode.value) ? totalMonthDifference : 0
        gracePeriodTotalMonths.value = formParam.value.gracePrdYear.value * 12 + formParam.value.gracePrdMonth.value - gracePeriodSet

        if (gracePeriodTotalMonths.value < 0) {
          gracePeriodTotalMonths.value = 0
        }

        const installmentCnt = newinstallmentCnt - gracePeriodTotalMonths.value

        let calculatedValue
        if (isRewriteMode.value) {
          calculatedValue = formParam.value.disburseBalance.value / installmentCnt
        } else {
          calculatedValue = formParam.value.disbursementAmt.value / installmentCnt
        }
        // roundDigitCd 값
        let roundUnit
        switch (scheduleParam.value.roundDigitCd.value) {
          case '01': roundUnit = 0.01; break
          case '02': roundUnit = 0.1; break
          case '03': roundUnit = 1; break
          case '04': roundUnit = 10; break
          case '05': roundUnit = 100; break
          case '06': roundUnit = 1000; break
          case '07': roundUnit = 10000; break
          case '08': roundUnit = 100000; break
          case '09': roundUnit = 1000000; break
          default: roundUnit = Math.pow(10, 3 - parseInt(scheduleParam.value.roundDigitCd.value)); break
        }
        // 라운딩 처리
        if (formParam.value.roundFactor.value === 'D') {
          calculatedValue = Math.floor(Math.abs(Number(calculatedValue) / Number(roundUnit))) * Number(roundUnit)
        } else if (formParam.value.roundFactor.value === 'R') {
          calculatedValue = Math.round(Math.abs(Number(calculatedValue) / Number(roundUnit))) * Number(roundUnit)
        } else if (formParam.value.roundFactor.value === 'U') {
          calculatedValue = Math.ceil(Math.abs(Number(calculatedValue) / Number(roundUnit))) * Number(roundUnit)
        } else {
        // roundFactor 값이 D, R, U 중 하나가 아닌 경우, 원래의 값 그대로 사용
          calculatedValue = Number(calculatedValue)
        }
        modelValues.value.currency.value = ''
        nextTick(() => {
          modelValues.value.money.value = calculatedValue
          modelValues.value.currency.value = formParam.value.currencyCode.value
        })
      }
    }
  },
  { deep: true }
)

// watch(rowData, (newValue) => {
//   if (newValue.length > 0 && newValue[0].scheduleDate) {
//     scheduleParam.value.initialDueDate.value = newValue[0].scheduleDate
//     scheduleParam.value.installmentCnt.value = newValue.length - 1
//   }
// 첫 번째 행의 scheduleDate 값을 scheduleParam.initialDueDate.value에 설정
// if (formParam.value.repayProgTpcd.value !== '05') {
//   if (newValue.length > 0) {
//     scheduleParam.value.initialDueDate.value = newValue[0].scheduleDate
//     scheduleParam.value.installmentCnt.value = newValue.length - 1
//   }
// } else {
//   if (newValue.length > 0 && rowData.value[0].scheduleDate) {
//     scheduleParam.value.initialDueDate.value = rowData.value[0].scheduleDate
//     scheduleParam.value.installmentCnt.value = rowData.value.length - 1
//   }
// }
// }, { deep: true })

const handleMessage = (event) => {
  const receivedData = event.data.initParams.refNo
  searchParam.value.disbursementNo.value = receivedData
  formParam.value.transactionMode.value = 'INQUIRY'
  updateTrxnMode()
  search()
}
onMounted(() => {
  window.addEventListener('message', handleMessage)
  window.top.postMessage({
    e: 'requestData'
  })
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})

const currencyParam = ref(modelValues.value.currency.value)
watch(() => modelValues.value.currency.value, (newVal) => {
  currencyParam.value = newVal
//   gridProps.gridApi.value.redrawRows()
})

watch(() => formParam.value.disbursementNo.value, newVal => {
  if (newVal.length === 12 && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  } else {
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  }
})

watch(() => formParam.value.settlementYn.value, newVal => {
  if (newVal === 'Y') {
    radioDisableFlag.value.updateRadio.value = true
  } else {
    radioDisableFlag.value.updateRadio.value = false
  }
})

watchEffect(() => {
  if (scheduleParam.value.repayDatePlanCd.value === '01' &&
      (scheduleParam.value.repayPlanDay.value === '' || scheduleParam.value.repayPlanDay.value === 0)) {
    const repayDay = new Date(formParam.value.disbursementDate.value).getDate()

    scheduleParam.value.repayPlanDay.value = repayDay
  }
})

const interestApplyDateCheck1 = ref(false)
const interestApplyDateCheck = () => {
  if (formParam.value.baseRateApplydt.value === 'Invalid Date') {
    formParam.value.baseRateApplydt.value = ''
  }
  const originIntApplyDt = formParam.value.baseRateApplydt.value
  const baseRateApplyDate = new Date(formParam.value.baseRateApplydt.value).getTime()
  const disbursementDate = new Date(formParam.value.disbursementDate.value).getTime()
  const transactionDate = new Date(formParam.value.transactionDate.value).getTime()

  if (formParam.value.baseRateApplydt.value !== '') {
    if (disbursementDate <= baseRateApplyDate && baseRateApplyDate <= transactionDate) {
      // formParam.value.baseRateApplydt.value = baseRateApplyDate
      formParam.value.baseRateApplydt.value = originIntApplyDt
      interestApplyDateCheck1.value = false
    } else {
      messageBox.alertError('The interest Apply Date must be equal to or greater than the Disruption Date and less than or equal to today\'s date.')
      formParam.value.baseRateApplydt.value = formParam.value.disbursementDate.value
      interestApplyDateCheck1.value = true
    }
  }
}

const interestValidationCheck1 = ref(false)
const interestValidationCheck = () => {
  if (formParam.value.contractBaseRate.value === '') {
    formParam.value.contractBaseRate.value = 0
  }
  if (formParam.value.contractSpreadRate.value === '') {
    formParam.value.contractSpreadRate.value = 0
  }

  formParam.value.spreadRate.value = parseFloat(formParam.value.spreadRate.value).toFixed(5)
  formParam.value.contractSpreadRate.value = parseFloat(formParam.value.contractSpreadRate.value).toFixed(5)

  const checks = [
    ['contractIntRateTpcd', 'intRateTpcd'],
    ['contractBaseRateCode', 'baseRateCode'],
    ['contractBaseRateName', 'baseRateName'],
    ['contractBaseRate', 'baseRate'],
    ['contractBaseRateTermCode', 'rateTermCode'],
    ['contractSpreadRate', 'spreadRate']
  ]

  const allValid = checks.every(([contractKey, baseKey]) => {
    return formParam.value[contractKey].value === formParam.value[baseKey].value
  })

  interestValidationCheck1.value = !allValid

  if (interestValidationCheck1.value === false) { // Ok
    return interestValidationCheck1.value
  } else {
    messageBox.alertError('Contract rate and Disbursement rate do not match. Update contract data to disbursement data')
    formParam.value.intRateTpcd.value = formParam.value.contractIntRateTpcd.value
    formParam.value.baseRateCode.value = formParam.value.contractBaseRateCode.value
    formParam.value.baseRateName.value = formParam.value.contractBaseRateName.value
    formParam.value.baseRate.value = formParam.value.contractBaseRate.value
    formParam.value.rateTermCode.value = formParam.value.contractBaseRateTermCode.value
    formParam.value.spreadRate.value = formParam.value.contractSpreadRate.value

    return interestValidationCheck1.value
  }
}

const validFormParam = () => {
  const disubrsementAmtChangeRmk = 'Disbursement Amount Change/ '
  const maturityDateChangeRmk = 'Maturity Date Change/ '
  const rateChangeRmk = 'Rate Change'

  formParam.value.historyRmk.value = ''

  if (formParam.value.originDisbursementAmt.value !== formParam.value.disbursementAmt.value) { // 금액 변경 시 rmk 추가
    formParam.value.historyRmk.value += disubrsementAmtChangeRmk
  }

  if (formParam.value.originMaturityDate.value !== formParam.value.maturityDate.value) { // 만기일 변경 시 rmk 추가
    formParam.value.historyRmk.value += maturityDateChangeRmk
  }

  formParam.value.originSpreadRate.value = parseFloat(formParam.value.originSpreadRate.value).toFixed(5)
  if (formParam.value.originIntRateTpcd.value !== formParam.value.intRateTpcd.value ||
      formParam.value.originSpreadRate.value !== formParam.value.spreadRate.value ||
      formParam.value.originBaseRateCode.value !== formParam.value.baseRateCode.value) { // 금리 변경 시 rmk 추가
    formParam.value.historyRmk.value += rateChangeRmk
  }

  const historyRmkValue = formParam.value.historyRmk.value
  if (historyRmkValue.endsWith('/ ')) {
    formParam.value.historyRmk.value = historyRmkValue.slice(0, -2)
  }
}

const formParamClear = () => {
  freeformUtil.clear(formParam)
  disabledTabs.repaymentSchedule = true
  formParam.value.registBrcd.value = session.sysBranchCode
  formParam.value.manageBrcd.value = session.sysBranchCode
  formParam.value.registEmployeeNo.value = session.sysEmployeeNo
  formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
  formParam.value.registBrnm.value = branchValue.value
  formParam.value.manageBrnm.value = branchValue.value
  formParam.value.registEmployeeNm.value = employeeValue.value
  formParam.value.manageEmployeeNm.value = employeeValue.value
  // 결제 번호
  formParam.value.settlementNo.value = ''
}
const modelValuesClear = () => {
  modelValues.value.money.value = ''
  modelValues1.value.money.value = ''
  modelValues2.value.money.value = ''
  modelValues3.value.money.value = ''
  modelValues4.value.money.value = ''
}
/* =======================================================
  9. popup
======================================================= */
// [FUNCTION11] 팝업 호출 이벤트
const getApvPopupRowData = (event) => {
  if (formParam.value.applicationNo.value) {
    authorLineInquiry()
  }
  updateAuthData()
}

// 결재 이후 조작
const getAthPopupRowData = (event) => {
  const finalApproverYn = event.value.finalApproverYn.value
  const result = event.value.authorizationStatus.value
  if (finalApproverYn === 'Y' && result === '01') {
    console.log('최종 결재자 승인, 일계처리 여기서 진행')
    jurnalEntry()
  } else {
    formParam.value.authorEmployeeNo.value = ''
    formParam.value.authorizationStatus.value = ''
    formParam.value.authorizationNo.value = ''
    formParam.value.authorizationDate.value = ''
  }
  authorLineInquiry()
}

// 일계처리
const jurnalEntry = () => {
  formParam.value.facFlag.value = 'N'
  // formParam.value.jourIssueCancelTrxnYn.value = 'Y'
  // console.log('최종 데이터 : ' + JSON.stringify(formParam.value))
  const glSaveParam = commonUtil.inputValueToJson('bsLonSrvDbsService', 'LONSRVDBS049', formParam)
  ajaxUtil.ajaxServiceData(glSaveParam)
    .then(function (response) {
      if (response.length === 0) {
        //
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
        // console.log('response 1: ' + JSON.stringify(response[1]))
        // rightRowData.value = response[1]
      }
      formParam.value.facFlag.value = ''
    })
}

</script>
<style scoped>
.relative-container1 {
  position: relative;
  display: flex;
}
.relative-container {
  position: relative;
}
.all-full-row {
  grid-column-start: span 3;
}
.full-row {
  grid-column-start: span 2;
}
.radios-wrapper {
  display: flex;
  justify-content: center;
}

.radio-wrapper {
  display: flex;
  align-items: center;
}
.horizontal-layout {
  display: flex; /* Use flex for the inner items */
  justify-content: flex-start;
  gap: 10px;
}
.flex-grow {
  flex-grow: 1;
}
.container {
  display: flex;
  justify-content: space-between;
}

.field-area {
  flex: 1;
  margin-right: 20px;
}

.grid-area {
  flex: 2;
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
</style>
