<template>
  <q-header class="header_page_title">
      <div class="title_wrapper">
          <page-title></page-title>
      </div>
  </q-header>
  <q-page-container>
  <q-page class="double_table_container" style="margin: 0px 30px; display: flex;">
  <div class="table_container containerWidth25">
    <div class="q-pa-md height80" style="overflow: auto;">
      <q-list>
      <lonOrnApcLeftPannel
        :form-param="formParam"
        :attached-datas="attachedDatas"
        :show-atc-search="showAtcSearch"
        :showAthSearch="showAthSearch"
        :show-apv-search="showApvSearch"
        :show-col-search="showColSearch"
        :show-gua-search="showGuiSearch"
        :author-line-datas="authorLineDatas"
        :is-popup-visible1="isPopupVisible1"
        :is-popup-visible2="isPopupVisible2"
        :is-popup-visible3="isPopupVisible3"
        :is-popup-add-guarantee="isPopupAddGuarantee"
        :author-line-comment="authorLineComment"
        :collateral-comment="collateralComment"
        :attach-comment="attachComment"
        :attached-status="attachedStatus"
        :author-status="authorStatus"
        :collateral-status="collateralStatus"
        :collateral-datas="collateralDatas"
        :guarantee-datas="guaranteeDatas"
        :delete-collateral-data="deleteCollateralData"
        :delete-guarantee-data="deleteGuaranteeData"
        :delete-attach-data="deleteAttachData"
        :get-atc-popup-row-data="getAtcPopupRowData"
        :get-apv-popup-row-data="getApvPopupRowData"
        :get-ath-popup-row-data="getAthPopupRowData"
        :get-col-popup-row-data="getColPopupRowData"
        :get-gui-popup-row-data="getGuiPopupRowData"
        :check-collateral-flag="checkCollateralFlag"
        :authorLineDatasClear="authorLineDatasClear"
      >
      </lonOrnApcLeftPannel>
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
  <q-tab name="application" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.application')"/>
  <q-tab name="applicants" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.applicants')" @click="applicantsClick" />
  <q-tab name="RepaymentScheduleSimulation" class="tab_page_wrapper center_tab inline_tab" :label="$t('label.objt.repaySchSimulation')" />
  </q-tabs>
  <q-tab-panels v-model="tab" class="tab_border height80">
    <q-tab-panel name="application">
      <lonOrnApcFreeform
        :form-param="formParam"
        :get-apc-popup-row-data="getApcPopupRowData"
        :radio-disable-flag="radioDisableFlag"
        :model-values="modelValues"
        :common-code-list="commnoCodeList"
        :customerNo="customerNo"
        :customer-name="customerName"
        :contract-no="contractNo"
        :product-name="productName"
        :base-rate-code="baseRateCode"
        :spread-rate="spreadRate"
        :interest-rate="interestRate"
        :loan-term-year="loanTermYear"
        :loan-term-month="loanTermMonth"
        :maturity-date="maturityDate"
        :grace-prd-month="gracePrdYear"
        :regist-date="registDate"
        :show-branch1-search="showBranch1Search"
        :show-user1-search="showUser1Search"
        :show-apc-search="showApcSearch"
        :show-customer-search="showCustomerSearch"
        :disable-flag="disableFlag"
        :apc-disable-flag="apcDisableFlag"
        :show-prd-search="showPrdSearch"
        :variabla-flag="variablaFlag"
        :show-bir-search="showBirSearch"
        :show-branch2-search="showBranch2Search"
        :show-user2-search="showUser2Search"
        :loanTermFlag="loanTermFlag"
        :save="save"
        :update-trxn-mode="updateTrxnMode"
        :application-no-change="applicationNoChange"
        :int-ratet-type-change="intRatetTypeChange"
        :set-application-data="setApplicationData"
        :period-change="periodChange"
        :loan-maturity-flag="loanMaturityFlag"
        :repay-prog-flag="repayProgFlag"
        :credit-line-flag="creditLineFlag"
        :change-flag="changeFlag"
        :int-rate-type-flag="intRateTypeFlag"
        :base-rate-info="baseRateInfo"
        :get-prd-popup-row-data="getPrdPopupRowData"
        :get-prd-direct-search="getPrdDirectSearch"
        :get-cst-direct-search="getCstDirectSearch"
        :get-apc-direct-search="getApcDirectSearch"
      ></lonOrnApcFreeform>
    </q-tab-panel>

    <q-tab-panel name="applicants">
      <lonOgnApcApplicants
        :form-param="formParam"
        :common-code-list="commonCodeList"
        :show-customer-search="showCustomerSearch"
        :get-cst-popup-row-data="getCstPopupRowData"
        :applicants-search-result="applicantsSearchResult"
        :history-row-data="historyRowData"
        :past-due-row-data="pastDueRowData"
      ></lonOgnApcApplicants>
    </q-tab-panel>

    <q-tab-panel name="RepaymentScheduleSimulation">
      <lonOgnApcSimulation
        :form-param="formParam"
        :common-code-list="commonCodeList"
        :radio-disable-flag="radioDisableFlag"
        :lonAmt-cur-form="lonAmtCurForm"
        :schedule-param="scheduleParam"
        :grid-btn-disable="gridBtnDisable"
        :schedule-disable="scheduleDisable"
        :plan-disable="planDisable"
        :day-disable="dayDisable"
        :year-month-disable="yearMonthDisable"
        :simulation="simulation"
        :row-data="rowData"
        :currency-param="currencyParam"
        :addRow="addRow"
        :undo="undo"
        :remove-row="removeRow"
        :plan-cd-change="planCdChange"
      ></lonOgnApcSimulation>
    </q-tab-panel>
  </q-tab-panels>
  </div>
  </q-page>
  </q-page-container>
</template>
<script setup>
/**
301020 화면 - 여신신청관리

[FUNCTION01] OK버튼 클릭이벤트 (신청/변경/삭제)
[FUNCTION02] 통화코드 변경이벤트
[FUNCTION03] 지점코드 조회
[FUNCTION04] 첨부파일 목록조회
[FUNCTION05_1] 담보 목록조회
[FUNCTION05_2] 보증 목록조회
[FUNCTION06] 결재선 목록조회
[FUNCTION07] 좌측패널의 기존 데이터 내용조회 (신규 추가와 다르게 세팅해야 해서 구분)
[FUNCTION08] 거래모드 변경이벤트
[FUNCTION09] 금리타입 변경 이벤트
[FUNCTION10] 입력 데이터에 따른 Spread 값 변경
[FUNCTION11] 팝업 호출 이벤트
[FUNCTION12] 좌측 패널 초기화 이벤트
[FUNCTION13] 결재선 데이터 변경 이벤트
[FUNCTION14] 담보 데이터 변경 이벤트
[FUNCTION15] 첨부 문서 데이터 변경 이벤트
[FUNCTION16] 여신 신청번호 변경 이벤트
[FUNCTION17] 여신신청 정보세팅
[FUNCTION18] 첨부문서 삭제 이벤트
[FUNCTION19_1] 담보 삭제 이벤트
[FUNCTION19_2] 보증 삭제 이벤트
[FUNCTION20] 여신신청 조회이벤트
*/

/* =======================================================
  1. Import Area
======================================================= */
import { reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ajaxUtil, freeformUtil, commonProp, commonUtil, messageBox, gridPropsUtil } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
// import { VMoney } from 'v-money'
import dayjs from 'dayjs'
import { i18n } from 'boot/i18n'
import lonOrnApcLeftPannel from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcLeftPannel.vue'
import lonOrnApcFreeform from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcFreeform.vue'
import lonOgnApcApplicants from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcApplicants.vue'
import lonOgnApcSimulation from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcSimulation.vue'
import { gridProps } from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcSimulationGridProps.vue'
import { addYears, addMonths } from 'date-fns'

/* =======================================================
  2. Global Variable
======================================================= */
const tab = ref('application')
const disableFlag = ref(false)
const apcDisableFlag = ref(true)
const checkCollateralFlag = ref(false) // 신용대출인지 담보대출인지 check
const checkBoxDisableFlag = ref(true)
const session = useSessionStore()
const showCustomerSearch = ref(false)
const showBranch1Search = ref(false)
const showUser1Search = ref(false)
const showBranch2Search = ref(false)
const showUser2Search = ref(false)
const showApvSearch = ref(false)
const showColSearch = ref(false)
const showGuiSearch = ref(false)
const showAtcSearch = ref(false)
const showApcSearch = ref(false)
const showPrdSearch = ref(false)
const showAthSearch = ref(false)
const showBirSearch = ref(false)
const fromDate = session.sysCurrentBusinessDate
const isPopupVisible1 = ref(true)
const isPopupVisible2 = ref(true)
const isPopupVisible3 = ref(true)
const isPopupAddGuarantee = ref(true)
const authorLineDataFlag = ref(true)
const gridBtnDisable = ref(false)
const scheduleDisable = ref(false)
const planDisable = ref(false)
const dayDisable = ref(true)
const yearMonthDisable = ref(false)
const authorStatus = ref('02')
const collateralStatus = ref('02')
const attachedStatus = ref('02')
const authorLineDatas = ref([])
const collateralDatas = ref([])
const guaranteeDatas = ref([])
const attachedDatas = ref([])
const branchTypeList = ref([])
const rowData = ref([])
const rowCount = ref(0)
const transactionMode = ref(null)
const applicationNo = ref(null)
const applicationTpcd = ref(null)
const prgsStatusCode = ref(null)
const customerNo = ref(null)
const customerName = ref(null)
const applicationDate = ref(null)
const productCode = ref(null)
const productName = ref(null)
const creditLineTpcd = ref(null)
const fundPurposeCode = ref(null)
const currencyCode = ref(null)
const applicationAmount = ref(null)
const loanPrdTpcd = ref(null)
const loanTermYear = ref(null)
const loanTermMonth = ref(null)
const baseRateCode = ref(null)
const baseRateName = ref(null)
const spreadRate = ref(null)
const intRateTpcd = ref(null)
const interestRate = ref(null)
const repayProgTpcd = ref(null)
const gracePrdYear = ref(null)
const gracePrdMonth = ref(null)
const amrtPrdMm = ref(null)
const repaySourceCode = ref(null)
const registBrcd = ref(null)
const registEmployeeNo = ref(null)
const registDate = ref(null)
const manageBrcd = ref(null)
const manageEmployeeNo = ref(null)
const manageDate = ref(null)
const contractNo = ref(null)
const maturityDate = ref(null)
const lnAmt = ref(0)
const authorLineComment = ref('You can enter if after the application is completed')
const collateralComment = ref('You can enter if after the application is completed')
const attachComment = ref('Yon cau enter if after the application is completed')
const authorApproveStatus = ref('init')
const loanTermFlag = ref(true)
const loanMaturityFlag = ref(true)
const fixedFlag = ref(false)
const variablaFlag = ref(true)
const repayProgFlag = ref(false)
const creditLineFlag = ref(false)
const intRateTypeFlag = ref(false)
const langCode = session.sysLangCd

// 코드로 코드디코드값 세팅
const lookupValue = (mappings, key) => {
  const _selectedCode = []
  for (const index in mappings) {
    _selectedCode.push(mappings[index])
  }
  const _codeValue = _selectedCode.find(v => v.code === key)
  if (_codeValue === undefined) {
    return key
  } else {
    return _codeValue.codeValue
  }
}

// [FUNCTION03] 지점코드조회
const brListSearch = () => {
  const brSearchParam = ref({
    searchType: {
      value: 'BRANCH_CODE'
    },
    searchKeyword: {
      value: ''
    },
    fetchSize: {
      value: 100
    },
    maxValue: {
      value: '0'
    },
    helpSearchType: {
      value: 'FrmHlpBrc'
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsFrmHlpCmmService', 'FRMHLPCMM002', brSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'))
      } else {
        const branchCodeList = []
        branchCodeList.push({
          code: '', codeValue: i18n.global.t('label.view.all')
        })
        const _branchCode = data

        for (const index in _branchCode) {
          const row = {
            code: _branchCode[index].branchCode,
            decode: _branchCode[index].branchName,
            codeValue: _branchCode[index].branchName,
            codeName: _branchCode[index].branchName,
            fullCodeName: _branchCode[index].branchName
          }
          branchCodeList.push(row)
        }
        branchTypeList.value = branchCodeList
      }
    })
}

const prdParam = ref({
  loanMinAmount: {
    value: ''
  },
  loanMaxAmount: {
    value: ''
  },
  loanDefaultAmount: {
    value: ''
  },
  loanTermMonthMin: {
    value: ''
  },
  loanTermMonthMax: {
    value: ''
  },
  loanTermYearMin: {
    value: ''
  },
  loanTermYearMax: {
    value: ''
  },
  intMinRate: {
    value: ''
  },
  intMaxRate: {
    value: ''
  }
})

const formParam = ref({
  applicationNo: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.applicationNo')
  },
  applicationTpcd: {
    value: '01',
    initValue: '01',
    required: true,
    description: i18n.global.t('label.objt.applicationTpcd')
  },
  prgsStatusCode: {
    value: '000',
    initValue: '000',
    required: true,
    description: i18n.global.t('label.objt.prgsStatusCode')
  },
  customerNo: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  applicationDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateType),
    required: true,
    description: i18n.global.t('label.objt.applicationDate')
  },
  productCode: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.productCode')
  },
  productName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.productCode')
  },
  creditLineTpcd: {
    value: '02',
    initValue: '02',
    required: true,
    description: i18n.global.t('label.objt.creditLineTpcd')
  },
  fundPurposeCode: {
    value: '00001',
    initValue: '00001',
    required: false,
    description: i18n.global.t('label.objt.fundPurposeCode')
  },
  currencyCode: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: 'Loan Amount CCY'
  },
  applicationAmount: {
    value: 0,
    required: true,
    description: i18n.global.t('label.objt.applicationAmount')
  },
  loanPrdTpcd: {
    value: '01',
    initValue: '01',
    required: false,
    description: i18n.global.t('label.objt.loanPrdTpcd')
  },
  loanTermYear: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTerm')
  },
  loanTermMonth: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTerm')
  },
  baseRateCode: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.baseRate')
  },
  baseRateApplydt: {
    value: '',
    initValue: '',
    required: false
  },
  baseRate: {
    value: 0.00000,
    initValue: 0.00000,
    type: Number
  },
  baseRateName: {
    value: '',
    initValue: ''
  },
  spreadRate: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.spreadRate'),
    type: Number
  },
  interestRate: {
    value: 0.00000,
    initValue: 0.00000,
    type: Number,
    required: true,
    description: i18n.global.t('label.objt.interestRate')
  },
  intRateTpcd: {
    value: '01',
    initValue: '01',
    required: true,
    description: i18n.global.t('label.objt.intRateType')
  },
  repayProgTpcd: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.repayProgTpcd')
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
  repaySourceCode: {
    value: '001',
    initValue: '001',
    required: false,
    description: i18n.global.t('label.objt.repaySourceCode')
  },
  creditClCode: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.creditCollateralLoan')
  },
  registBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false
  },
  branchName: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.branchName')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: false
  },
  registDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateType),
    required: false
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: false
  },
  manageDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateType),
    required: false
  },
  contractNo: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.contractNo')
  },
  contractDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.contractDate')
  },
  maturityDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.maturityDate')
  },
  pledgeNo: {
    value: '',
    initValue: '',
    required: false
  },
  guaranteeNo: {
    value: '',
    initValue: '',
    required: false
  },
  postAttachNo: {
    value: '',
    initValue: ''
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
  businessCode: {
    value: 'LON',
    initValue: 'LON'
  },
  amrtPrdMm: {
    value: '',
    initValue: ''
  },
  fromBtn: {
    value: ''
  },
  rmk: {
    value: ''
  },
  transactionMode: {
    value: 'NEW',
    initValue: 'NEW',
    required: true
  },
  businessDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateType),
    required: false
  },
  langCode: {
    value: langCode,
    initValue: langCode
  }
})

const applicantsSearchResult = ref({
  customerNo: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerType: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.customerTypeCode')
  },
  customerDetailType: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.customerDetailType')
  },
  creditRating: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.creditRating')
  },
  evaluationDate: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.evaluationDate')
  },
  expireDate: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.expireDate')
  }
})
const historyRowData = ref([])
const pastDueRowData = ref([])

const scheduleParam = ref({
  applicationDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateType),
    required: true,
    description: i18n.global.t('label.objt.applicationDate')
  },
  installmentAmt: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.installmentRepaymentAmount')
  },
  loanTermYear: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTerm')
  },
  loanTermMonth: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.loanTerm')
  },
  maturityDate: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.maturityDate')
  },
  currencyCode: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: 'Loan Amount CCY'
  },
  applicationAmount: {
    value: 0,
    required: true,
    description: i18n.global.t('label.objt.applicationAmount')
  },
  interestRate: {
    value: 0.00000,
    initValue: 0.00000,
    type: Number,
    required: true,
    description: i18n.global.t('label.objt.interestRate')
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
  holidayApplyCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.holidayApplyMethod')
  },
  repayProgTpcd: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.repayProgTpcd')
  },
  frequencyMm: {
    value: '1',
    initValue: '',
    required: false,
    description: i18n.global.t('label.view.repaymentFrequency')
  },
  lonAmtCurForm: {
    value: ''
  },
  //   initialDueDate: {
  //     value: '',
  //     required: true,
  //     description: i18n.global.t('label.view.initialRepaymentDueDate')
  //   },
  finalDueDate: {
    value: formParam.value.maturityDate.value,
    required: false,
    description: ''
  },
  disbursementDate: {
    value: formParam.value.applicationDate.value,
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  disbursementAmt: {
    value: formParam.value.applicationAmount.value,
    required: false,
    description: ''
  },
  installmentCnt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.installmentCount')
  },
  roundDigitCd: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.view.installRoundingDigitType')
  },
  remainAmountCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.remainingAmountMethod')
  },
  repayDatePlanCd: {
    value: '02',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.repayDatePlanMethod')
  },
  repayPlanDay: {
    value: '',
    required: false,
    description: 'Repay Plan Day'
  },
  dayCountCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.daysCalcMethod')
  },
  branchCode: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  }
})

const modelValues = ref({
  currency: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency
  },
  money: {
    value: ''
  }
})

watch(() => modelValues.value.currency.value, (newVal) => {
  formParam.value.currencyCode.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.applicationAmount.value = newVal.replace(/,/g, '')
})

const lonAmtCurForm = ref({
  currency: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency
  },
  money: {
    value: ''
  }
})

watch(() => lonAmtCurForm.value.currency.value, (newVal) => {
  scheduleParam.value.currencyCode.value = newVal
})

watch(() => lonAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  scheduleParam.value.applicationAmount.value = newVal.replace(/,/g, '')
})

watch(() => tab.value, (newVal) => {
  // 'NEW'일때 APPLICATION TAB에서 직접 작성 후 SIMULATION TAB으로 이동시 데이터 세팅
  if (newVal === 'RepaymentScheduleSimulation') {
    for (const key in formParam.value) {
      if (key in scheduleParam.value && formParam.value[key].value !== null) {
        scheduleParam.value[key].value = formParam.value[key].value
      }
    }
    lonAmtCurForm.value.currency.value = formParam.value.currencyCode.value
    lonAmtCurForm.value.money.value = formParam.value.applicationAmount.value
    planCdChange('02') // repayDatePlanCd 초기값 세팅(First day)
  }
})

watch(
  [
    () => scheduleParam.value.loanTermYear.value,
    () => scheduleParam.value.loanTermMonth.value,
    () => scheduleParam.value.applicationDate.value,
    () => tab.value
  ],
  (newValue) => {
    // applicationDate를 변경할 경우 initialDueDate 자동변경
    // if (newValue[2] && scheduleParam.value.repayDatePlanCd.value === '01') { // '01' = Specify Day
    //   changeRepayPlanDay(scheduleParam.value.repayPlanDay.value)
    // } else if (newValue[2] && scheduleParam.value.repayDatePlanCd.value !== '01') {
    //   planCdChange(scheduleParam.value.repayDatePlanCd.value)
    // }

    // Loan Term 입력시 Maturity Date 자동변경
    // Loan Term 값이 있을때 applicationDate를 변경한 경우에도 Maturity Date 자동변경
    if (Number(newValue[0]) + Number(newValue[1]) !== 0) {
      const applicationDate = new Date(scheduleParam.value.applicationDate.value)

      let yearTerm = 0
      if (!commonUtil.isEmpty(scheduleParam.value.loanTermYear.value)) {
        yearTerm = parseInt(scheduleParam.value.loanTermYear.value)
      }

      let monthTerm = 0
      if (!commonUtil.isEmpty(scheduleParam.value.loanTermMonth.value)) {
        monthTerm = parseInt(scheduleParam.value.loanTermMonth.value)
      }
      const resultDate = addMonths(addYears(applicationDate, yearTerm), monthTerm)

      scheduleParam.value.maturityDate.value = resultDate.toISOString().split('T')[0]
    }
  }
)

const currencyParam = ref(lonAmtCurForm.value.currency.value)
watch(() => lonAmtCurForm.value.currency.value, (newVal) => {
  currencyParam.value = newVal
})

// watch(() => scheduleParam.value.repayPlanDay.value, (newVal) => {
//   // repayPlanDay 입력시 initialDueDate 자동변경
//   changeRepayPlanDay(newVal)
// })

watch(() => scheduleParam.value.repayProgTpcd.value, (newVal) => {
  if (newVal === '05') { // '05' = 불균등 상환방식
    rowData.value = []
    yearMonthDisable.value = true
    scheduleParam.value.loanTermYear.value = ''
    scheduleParam.value.loanTermMonth.value = ''
    scheduleParam.value.gracePrdYear.value = ''
    scheduleParam.value.gracePrdMonth.value = ''
  } else {
    yearMonthDisable.value = false
  }
})

// const changeRepayPlanDay = (newVal) => {
//   const applicationDate = new Date(scheduleParam.value.applicationDate.value)
//   // repayDatePlanCd = Specify Day('01')일때 입력한 일수로 initialDueDate 계산
//   let disbursementDate
//   const newDay = Number(newVal) + 1
//   if (scheduleParam.value.repayDatePlanCd.value === '01') {
//     if (applicationDate.getDate() <= newVal) { // 첫상환일까지 한달이 안되는 경우 다다음달에 상환
//       disbursementDate = new Date(applicationDate.getFullYear(), applicationDate.getMonth() + 1, newDay)
//     } else {
//       disbursementDate = new Date(applicationDate.getFullYear(), applicationDate.getMonth() + 2, newDay)
//     }
//     scheduleParam.value.initialDueDate.value = disbursementDate.toISOString().split('T')[0]
//   }
// }

// [FUNCTION04] 첨부파일 목록조회
const attachListInquiry = () => {
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL032', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas.length === 0) {
        attachedDatas.value = []
      } else {
        const tmpList = []
        for (const data of datas) {
          const row = {
            icon: '',
            color: 'grey',
            type: lookupValue(commonCodeList.collateralTpcd, data.collateralTpcd),
            name: lookupValue(commonCodeList.attachKindCode, data.attachKindCode),
            desc: data.attachKindNm,
            postAttachNo: data.postAttachNo,
            referTableNm: data.referTableNm,
            originReferNo: data.originReferNo
          }

          const type = data.attachKindCode

          if (type === 'LAP001' || type === 'LAP002' || type === 'LAP003') { // Card Icon
            row.icon = 'credit_card'
          } else if (type === 'LAP004' || type === 'LAP005' || type === 'LAP006' || type === 'LAP010' || type === 'LAP999') { // Docu Icon , ETC
            row.icon = 'description'
          } else if (type === 'LAP007' || type === 'LAP008' || type === 'LAP009') { // Certificate Icon
            row.icon = 'license'
          }

          tmpList.push(row)
        }
        attachedDatas.value = tmpList
      }
      updateAttachData()
    })
}

const currencyCodeList = ref([])
ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    currencyCodeList.value = codeData
  })
const moneyFormat = ref({
  decimal: '.',
  thousands: ',',
  prefix: '',
  suffix: '',
  precision: 0,
  masked: false
})

// [FUNCTION05_1] 담보 목록조회
const collateralListInquiry = () => {
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL012', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas.length === 0) {
        collateralDatas.value = []
      } else {
        const tmpList = []
        for (const data of datas) {
          const row = {
            icon: '',
            color: 'grey',
            type: lookupValue(commonCodeList.collateralTpcd, data.collateralTpcd),
            name: data.collateralTitleName,
            collateralNo: data.collateralNo,
            pledgeNo: data.pledgeNo,
            pledgeAmount: data.pledgeAmount,
            ccycdPledge: formParam.value.currencyCode.value,
            status: authorApproveStatus.value,
            plgAmount: data.pledgeAmount
          }

          const currency = currencyCodeList.value.find(c => c.code === row.ccycdPledge)
          if (currency) {
            moneyFormat.value.decimal = currency.decimalPoint
            moneyFormat.value.precision = currency.subUnitDigit
            let oldMoneyValue
            if (typeof row.pledgeAmount === 'number') {
              oldMoneyValue = row.pledgeAmount
            } else {
              oldMoneyValue = Number(row.pledgeAmount.replace(/,/g, '')) // 콤마 제거
            }
            let newMoneyValue = oldMoneyValue
            if (currency.subUnitDigit > 0) {
            // 소수점이 없을 때만 소수점을 추가합니다.
              if (!String(oldMoneyValue).includes('.')) {
                newMoneyValue = (oldMoneyValue).toFixed(currency.subUnitDigit)
              }
            } else {
              newMoneyValue = oldMoneyValue.toFixed(0) // 화폐 단위에 따라 소수점 아래 자릿수를 없애는 코드 추가
            }
            newMoneyValue = parseFloat(newMoneyValue).toFixed(currency.subUnitDigit)
            row.pledgeAmount = newMoneyValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 금액을 새로 설정
          }

          switch (data.collateralTpcd) {
            case '100': // Real Estate
              row.icon = 'apartment'
              break
            case '200': // Vehicle
              row.icon = 'directions_car'
              break
            case '900': // Others
              row.icon = 'more_horiz'
              break
          }
          tmpList.push(row)
        }
        collateralDatas.value = tmpList
      }
      updateColData()
    })
}

// [FUNCTION05_2] 보증 목록조회
const guaranteeListInquiry = () => {
  const guaSearchParam = ref({
    applicationNo: {
      value: formParam.value.applicationNo.value
    }
  })
  const searchParam = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA0023', guaSearchParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas.length === 0) {
        guaranteeDatas.value = []
      } else {
        const tmpList = []
        for (const data of datas) {
          const row = {
            icon: 'person',
            color: 'grey',
            type: data.guaranteeStatusNm,
            name: '보증인 ' + data.guarantorName,
            guaranteeNo: data.guaranteeNo,
            guaranteeAmt: data.guaranteeAmt,
            currencyCode: formParam.value.currencyCode.value,
            guaranteeTypeCode: data.guaranteeTypeCode,
            guaAmount: data.guaranteeAmt
          }

          const currency = currencyCodeList.value.find(c => c.code === row.currencyCode)
          if (currency) {
            moneyFormat.value.decimal = currency.decimalPoint
            moneyFormat.value.precision = currency.subUnitDigit
            let oldMoneyValue
            if (typeof row.guaranteeAmt === 'number') {
              oldMoneyValue = row.guaranteeAmt
            } else {
              oldMoneyValue = Number(row.guaranteeAmt.replace(/,/g, '')) // 콤마 제거
            }
            let newMoneyValue = oldMoneyValue
            if (currency.subUnitDigit > 0) {
            // 소수점이 없을 때만 소수점을 추가합니다.
              if (!String(oldMoneyValue).includes('.')) {
                newMoneyValue = (oldMoneyValue).toFixed(currency.subUnitDigit)
              }
            } else {
              newMoneyValue = oldMoneyValue.toFixed(0) // 화폐 단위에 따라 소수점 아래 자릿수를 없애는 코드 추가
            }
            newMoneyValue = parseFloat(newMoneyValue).toFixed(currency.subUnitDigit)
            row.guaranteeAmt = newMoneyValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') // 금액을 새로 설정
          }

          tmpList.push(row)
        }
        guaranteeDatas.value = tmpList
      }
      updateColData()
    })
}

// [FUNCTION06] 결재선 목록조회
const authorLineInquiry = () => {
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
      // 모든 결재선 삭제시 담당자 본인 결재 정보 제거
      if (datas.length === 1 && datas[0].employeeNo === session.sysEmployeeNo) {
        authorLineDatas.value = []
      }
      updateAuthData()
    })
}

const freeformRefs = {
  lnAmt, transactionMode, applicationNo, intRateTpcd, spreadRate, baseRateCode, baseRateName, interestRate, applicationTpcd, prgsStatusCode, customerNo, customerName, applicationDate, productName, productCode, creditLineTpcd, amrtPrdMm, fundPurposeCode, currencyCode, applicationAmount, loanPrdTpcd, loanTermYear, loanTermMonth, repayProgTpcd, gracePrdYear, gracePrdMonth, repaySourceCode, registBrcd, registEmployeeNo, registDate, manageBrcd, manageEmployeeNo, manageDate, contractNo, maturityDate
}

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

// [FUNCTION08] 거래모드 변경이벤트
const updateTrxnMode = (event) => {
// 플래그 초기화
  disableFlag.value = true
  apcDisableFlag.value = true
  fixedFlag.value = true
  loanTermFlag.value = true
  variablaFlag.value = true
  loanMaturityFlag.value = true
  checkBoxDisableFlag.value = true
  isPopupVisible1.value = true
  isPopupVisible2.value = true
  isPopupVisible3.value = true
  isPopupAddGuarantee.value = true
  repayProgFlag.value = true
  creditLineFlag.value = true
  intRateTypeFlag.value = true
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  // case 1. 신규 등록
  if (transactionMode === 'NEW') {
    freeformUtil.clear(formParam, freeformRefs)
    freeformUtil.clear(modelValues, freeformRefs)
    freeformUtil.clear(scheduleParam)
    rowData.value = []
    lonAmtCurForm.value.currency.value = session.sysBaseCurrency
    lonAmtCurForm.value.money.value = ''
    attachedDatas.value = []
    authorLineDatas.value = []
    collateralDatas.value = []
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    // 좌측패널 신청 필요 모드로 변경
    authorStatus.value = '02'
    collateralStatus.value = '02'
    attachedStatus.value = '02'
    // 좌측패널 내용 초기화
    updateAuthData()
    updateColData()
    updateAttachData()
    // 신규 신청의 초기값 세팅
    formParam.value.applicationDate.value = dayjs(fromDate).format(commonProp.dateformat.dateType)
    formParam.value.prgsStatusCode.value = '000'
    formParam.value.applicationTpcd.value = '01'
    formParam.value.creditLineTpcd.value = '02'
    formParam.value.fundPurposeCode.value = '00001'
    formParam.value.repaySourceCode.value = '001'
    formParam.value.intRateTpcd.value = '01'
    formParam.value.loanPrdTpcd.value = '01'
    formParam.value.registBrcd.value = session.sysBranchCode
    formParam.value.registDate.value = dayjs(fromDate).format(commonProp.dateformat.dateType)
    formParam.value.registEmployeeNo.value = session.sysEmployeeNo
    formParam.value.manageBrcd.value = session.sysBranchCode
    formParam.value.manageDate.value = dayjs(fromDate).format(commonProp.dateformat.dateType)
    formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
    modelValues.value.currency.value = session.sysBaseCurrency

    // 신규 초기값 입력 가능 모드로 변경
    disableFlag.value = false
    apcDisableFlag.value = true
    fixedFlag.value = false
    loanTermFlag.value = false
    variablaFlag.value = true
    loanMaturityFlag.value = false
    checkBoxDisableFlag.value = false
    repayProgFlag.value = false
    creditLineFlag.value = false
    intRateTypeFlag.value = false

    // case 2. 조회 모드 (입력 불가)
  } else if (transactionMode === 'INQUIRY') {
    apcDisableFlag.value = false
    freeformUtil.clear(formParam, freeformRefs)
    freeformUtil.clear(modelValues, freeformRefs)
    attachedDatas.value = []
    authorLineDatas.value = []
    collateralDatas.value = []
    guaranteeDatas.value = []
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    // case 3. 변경 모드 (신청자만 변경가능)
  } else if (transactionMode === 'UPDATE') {
    if (!commonUtil.isEmpty(formParam.value.applicationNo.value) && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
      disableFlag.value = false
      apcDisableFlag.value = true
      fixedFlag.value = false
      loanTermFlag.value = false
      variablaFlag.value = true
      loanMaturityFlag.value = false
      checkBoxDisableFlag.value = false
      isPopupAddGuarantee.value = false
      intRatetTypeChange(formParam.value.intRateTpcd.value)
      periodChange()
    } else {
      formParam.value.transactionMode.value = 'INQUIRY'
      updateTrxnMode()
    }
  }
}

// [FUNCTION09] 주기타입 변경 이벤트
const periodChange = () => {
  const type = formParam.value.loanPrdTpcd.value
  const trMode = formParam.value.transactionMode.value
  if (trMode === 'NEW' || trMode === 'UPDATE') {
  // After Contract Date
    if (type === '01' || type === '02') {
      formParam.value.maturityDate.value = ''
      loanTermFlag.value = false
      loanMaturityFlag.value = true
      // Fixed Date
    } else {
      formParam.value.loanTermMonth.value = ''
      formParam.value.loanTermYear.value = ''
      loanTermFlag.value = true
      loanMaturityFlag.value = false
    }
  }
}

/* =======================================================
  3. Common Code Adapter
======================================================= */
const commonCodeList = reactive({
  applicationTpcd: ref([]),
  prgsStatusCode: ref([]),
  fundPurposeCode: ref([]),
  creditLineTpcd: ref([]),
  currencyCode: ref([]),
  loanPrdTpcd: ref([]),
  repayProgTpcd: ref([]),
  repaySourceCode: ref([]),
  intRateType: ref([]),
  collateralTpcd: ref([]),
  baseRateCode: ref([]),
  attachKindCode: ref([]),
  brcCurrencyCodeList: ref([]),
  lonRepayDatePlanCode: ref([]),
  branchNameList: ref([]),
  customerTypeCode: ref([]),
  customerDetailTypeCode: ref([])
})
ajaxUtil.getCodeList('SHOWROWS, LON_COLLATERAL_TYPE_CODE, LON_APPLICATION_TYPE_CODE, LON_APL_PROGRESS_STCD, LON_INTEREST_RATE_CODE, LON_FUND_PURPOSE_CODE, CREDIT_LINE_TYPE_CODE, LON_PERIOD_TYPE, LON_REPAY_METHOD_CODE, LON_RPMT_SOURCE_CODE, LON_REPAY_DATE_PLAN_CODE, CUSTOMER_TYPE_CODE, CUSTOMER_DETAIL_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.applicationTpcd = codeData.lonApplicationTypeCode
    commonCodeList.prgsStatusCode = codeData.lonAplProgressStcd
    commonCodeList.creditLineTpcd = codeData.creditLineTypeCode
    commonCodeList.fundPurposeCode = codeData.lonFundPurposeCode
    commonCodeList.loanPrdTpcd = codeData.lonPeriodType
    commonCodeList.repayProgTpcd = codeData.lonRepayMethodCode.filter(v => v.code !== '06')
    commonCodeList.repaySourceCode = codeData.lonRpmtSourceCode
    commonCodeList.intRateType = codeData.lonInterestRateCode
    commonCodeList.collateralTpcd = codeData.lonCollateralTypeCode
    commonCodeList.lonRepayDatePlanCode = codeData.lonRepayDatePlanCode.filter(v => v.code !== '04')
    commonCodeList.customerTypeCode = codeData.customerTypeCode
    commonCodeList.customerDetailTypeCode = codeData.customerDetailTypeCode
    brListSearch()
  })

ajaxUtil.getPrefixCodeList('ATTACH_KIND_CODE', 'LAP')
  .then(function (codeData) {
    commonCodeList.attachKindCode = codeData.attachKindCode
  })

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

// Branch Name 세팅
ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    formParam.value.branchName.value = commonCodeList.branchNameList = codeData.filter(v => v.code === session.sysBranchCode)[0].codeValue
  })

/* =======================================================
  7. Freeform Funtion
======================================================= */
// [FUNCTION09] 금리타입 변경 이벤트
const intRatetTypeChange = (event) => {
  const type = formParam.value.intRateTpcd.value
  const trMode = formParam.value.transactionMode.value
  if ((trMode === 'NEW' || trMode === 'UPDATE') && event !== type) {
  // 금리 내용 초기화
    if (event === '01') { // 고정금리
      fixedFlag.value = false
      variablaFlag.value = true
      formParam.value.baseRate.value = 0
      formParam.value.baseRateCode.value = ''
      formParam.value.baseRateName.value = ''
      formParam.value.baseRateApplydt.value = ''
      formParam.value.interestRate.value = 0
      formParam.value.spreadRate.value = ''
    } else if (event === '02') { // 변동금리
      fixedFlag.value = true
      variablaFlag.value = false
    } else if (event === '') { // Optional
      fixedFlag.value = true
      variablaFlag.value = true
    }
  }
}

// [FUNCTION01] OK 버튼 클릭이벤트
const save = () => {
  const money = Number(modelValues.value.money.value.replace(/,/g, ''))
  const loanMinAmount = prdParam.value.loanMinAmount.value
  const loanMaxAmount = prdParam.value.loanMaxAmount.value
  const loanTermYearMin = prdParam.value.loanTermYearMin.value === '' ? 0 : prdParam.value.loanTermYearMin.value
  const loanTermYearMax = prdParam.value.loanTermYearMax.value === '' ? 0 : prdParam.value.loanTermYearMax.value
  const loanTermMonthMin = prdParam.value.loanTermMonthMin.value === '' ? 0 : prdParam.value.loanTermMonthMin.value
  const loanTermMonthMax = prdParam.value.loanTermMonthMax.value === '' ? 0 : prdParam.value.loanTermMonthMax.value
  const termYear = formParam.value.loanTermYear.value === '' ? 0 : formParam.value.loanTermYear.value
  const termMonth = formParam.value.loanTermMonth.value === '' ? 0 : formParam.value.loanTermMonth.value
  const interestRate = formParam.value.interestRate.value

  // 01. Valication Check
  if (formParam.value.applicationAmount.value === '0') {
    formParam.value.applicationAmount.value = ''
  }

  if (formParam.value.transactionMode.value === 'INQUIRY') return
  if (!freeformUtil.checkRequired(formParam, freeformRefs)) return
  if (commonUtil.isEmpty(formParam.value.applicationDate.value)) {
    messageBox.alertError('Application Date is required')
    return
  }
  // 1) 금리 타입별 조건 체크
  if (formParam.value.intRateTpcd.value === '01' && commonUtil.isEmpty(formParam.value.interestRate.value)) { // Fixed Rate
    messageBox.alertError('Interest Rate is required')
    return
  } else if (formParam.value.intRateTpcd.value === '02') { // Variable Rate
    if (commonUtil.isEmpty(formParam.value.baseRateCode.value)) {
      messageBox.alertError('Variable Interest Rate Type is required')
      return
    } else if (commonUtil.isEmpty(formParam.value.baseRateApplydt.value)) {
      messageBox.alertError('Base Rate Apply Date is required')
      return
    }
  }
  // 2) 만기일 타입별 조건 체크
  if (formParam.value.loanPrdTpcd.value === '01' || formParam.value.loanPrdTpcd.value === '02') { // 대출 약정 후, 실행 후
    if (commonUtil.isEmpty(formParam.value.loanTermYear.value) && commonUtil.isEmpty(formParam.value.loanTermMonth.value)) {
      messageBox.alertError('Loan Term is required')
      return
    }
  } else if (formParam.value.loanPrdTpcd.value === '03') { // 고정 만기일
    if (commonUtil.isEmpty(formParam.value.maturityDate.value)) {
      messageBox.alertError('Maturity Date is required')
      return
    }
  }

  // 3) 신청 일자 검증
  if (new Date(formParam.value.applicationDate.value) > new Date(session.sysCurrentBusinessDate)) {
    messageBox.alertError('Application Date cannot exceed the current business date.')
    return
  }

  // 02. Formatting

  // 1) 날짜 포맷팅
  formParam.value.applicationDate.value = dayjs(formParam.value.applicationDate.value).format('YYYY-MM-DD')
  formParam.value.registDate.value = dayjs(formParam.value.registDate.value).format('YYYY-MM-DD')
  formParam.value.manageDate.value = dayjs(formParam.value.manageDate.value).format('YYYY-MM-DD')
  if (!commonUtil.isEmpty(formParam.value.baseRateApplydt.value)) formParam.value.baseRateApplydt.value = dayjs(formParam.value.baseRateApplydt.value).format('YYYY-MM-DD')

  // 2) 숫자 포맷팅
  formParam.value.spreadRate.value = !commonUtil.isEmpty(formParam.value.spreadRate.value) ? parseFloat(formParam.value.spreadRate.value) : 0
  formParam.value.amrtPrdMm.value = !commonUtil.isEmpty(formParam.value.amrtPrdMm.value) ? parseFloat(formParam.value.amrtPrdMm.value) : 0

  // 03. Prodcut 등록된 대출 상품의 데이터와 비교

  // 1) Loan Amount 설정금액 범위비교

  if ((loanMinAmount + loanMaxAmount) !== 0) {
    if ((money < loanMinAmount) || (money > loanMaxAmount)) {
      messageBox.alertError('Loan Amount range is ' + loanMinAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ~ ' + loanMaxAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      return
    }
  }

  // 2) Loan Method, Interest Rate Type - Optional일 경우
  if (formParam.value.creditLineTpcd.value === '') {
    messageBox.alertError('Please select a Loan Method option')
    return
  } else if (formParam.value.intRateTpcd.value === '') {
    messageBox.alertError('Please select a Interest Rate Type option')
    return
  }

  // 3) 대출기간 비교
  const loanTermMsg =
'Loan term range is ' + '\'Min Year:' + loanTermYearMin + ' ,Min Month:' + loanTermMonthMin + ', Max Year:' + loanTermYearMax + ', Max Month:' + loanTermMonthMax + '\''

  if (loanTermYearMin !== 0 && loanTermMonthMin !== 0 && loanTermYearMax !== 0 && loanTermMonthMax !== 0) {
    if (termYear < loanTermYearMin || termYear > loanTermYearMax) {
      messageBox.alertError(loanTermMsg)
      return
    } else if (termYear === loanTermYearMin && termMonth < loanTermMonthMin) {
      messageBox.alertError(loanTermMsg)
      return
    } else if (termYear === loanTermYearMax && termMonth > loanTermMonthMax) {
      messageBox.alertError(loanTermMsg)
      return
    }
  } else if (termYear.toString() === '0' && termMonth.toString() === '0') {
    messageBox.alertError('Loan Term value cannot be \'0\'')
    return
  }

  // 4) Interest Rate 범위 비교
  if (prdParam.value.intMinRate.value !== 0 && prdParam.value.intMaxRate.value !== 0) {
    if (interestRate < prdParam.value.intMinRate.value || interestRate > prdParam.value.intMaxRate.value) {
      messageBox.alertError('Interest Rate range is ' + prdParam.value.intMinRate.value + '% ~ ' + prdParam.value.intMaxRate.value + '%')
      return
    }
  } else if (interestRate === 0) {
    messageBox.alertError('Interest Rate value cannot be 0%')
    return
  }
  // 04. 서비스 호출
  const _confirm = () => {
    const saveParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL009', formParam)
    ajaxUtil.ajaxServiceCall(saveParam)
      .then((response) => {
        const _alertAjaxSuccess = () => {
          const tmpApplicationNo = response.data.result.data
          if (formParam.value.transactionMode.value === 'NEW') {
            formParam.value.transactionMode.value = 'INQUIRY'
            // updateTrxnMode()
          }
          if (formParam.value.transactionMode.value !== 'DELETE') {
            search(tmpApplicationNo)
          }
        }
        messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
      })
      .catch((error) => {
        messageBox.alertAjaxError(error)
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

const simulation = () => {
  // [1]. installmentCnt 값 계산 (총 상환 횟수)
//   const initialDateParts = scheduleParam.value.initialDueDate.value.split('-')
//   const initialDate = new Date(initialDateParts[0], initialDateParts[1] - 1, initialDateParts[2])
//   const repayDate = initialDate

  //   const finalDateParts = scheduleParam.value.maturityDate.value.split('-')
  //   const finalDate = new Date(finalDateParts[0], finalDateParts[1] - 1, finalDateParts[2])

  //   // (만기일자 - 최초 상환 일자)의 개월수
  //   const diffInMonths = (finalDate.getFullYear() - initialDate.getFullYear()) * 12 +
  //       (finalDate.getMonth() - initialDate.getMonth())

  //   // 첫 달 이후의 repayDate 계산
  //   repayDate.setDate(1) // 현재화면에선 repayDatePlanCd = Firstday('02') 고정

  //   // frequencyMm을 고려하여 installmentCnt를 계산합니다.(여신신청에선 frequencyMm 1개월로 고정)
  //   const installmentCnt = Math.ceil(diffInMonths / scheduleParam.value.frequencyMm.value)

  //   const endDate = new Date(repayDate.getFullYear(), repayDate.getMonth() + (installmentCnt - 1) * scheduleParam.value.frequencyMm.value, repayDate.getDate())
  //   const finalInstallmentCnt = endDate < finalDate ? installmentCnt + 1 : installmentCnt
  //   scheduleParam.value.installmentCnt.value = finalInstallmentCnt

  // [2]. 원금균등일때 Installment Repayment Amount 계산
  //   if (scheduleParam.value.repayProgTpcd.value === '02') {
  //     let calculatedValue = scheduleParam.value.applicationAmount.value / scheduleParam.value.installmentCnt.value
  //     calculatedValue = Math.floor(Math.abs(Number(calculatedValue) / Number(1))) * Number(1)
  //     scheduleParam.value.installmentAmt.value = calculatedValue
  //   }

  // Parameter Name 일치화
  scheduleParam.value.disbursementAmt.value = Number(scheduleParam.value.applicationAmount.value)
  scheduleParam.value.disbursementDate.value = scheduleParam.value.applicationDate.value
  scheduleParam.value.finalDueDate.value = scheduleParam.value.maturityDate.value

  // [3]. Grace Period 값이 finalInstallmentCnt(대출기간 개월수) 보다 크지 않게
  //   if (Number(scheduleParam.value.gracePrdYear.value * 12) + Number(scheduleParam.value.gracePrdMonth.value) >= finalInstallmentCnt) {
  //     messageBox.alertError('The grace period cannot be longer than the loan period')
  //     return
  //   }

  // Repayment Frequency 값이 1미만일 수 없음
  if (scheduleParam.value.frequencyMm.value < 1) {
    messageBox.alertError('Please enter the Repayment Frequency greater than 1')
    return
  }

  // repayDatePlanCd = Specify Day('01') 일때 repayPlanDay(일자) 필수 입력
  if (scheduleParam.value.repayDatePlanCd.value === '01') {
    scheduleParam.value.repayPlanDay.required = true
  } else {
    scheduleParam.value.repayPlanDay.required = false
  }

  // repayPlanDay값 '' -> null로 변환
  if (commonUtil.isEmpty(scheduleParam.value.repayPlanDay.value)) {
    scheduleParam.value.repayPlanDay.value = null
  }

  // Calendar형식 데이터 빈값으로 넘길경우 'Invalid Date' -> ''로 변경(freeformUtil.checkRequired 검증을 위해서)
  //   if (scheduleParam.value.initialDueDate.value === 'Invalid Date') {
  //     scheduleParam.value.initialDueDate.value = ''
  //   } else if (scheduleParam.value.maturityDate.value === 'Invalid Date') {
  //     scheduleParam.value.maturityDate.value = ''
  //   }

  // 실행 Schedule Service 호출
  if (!freeformUtil.checkRequired(scheduleParam, freeformRefs)) return // 필수값 체크
  if (scheduleParam.value.interestRate.value === 0 || scheduleParam.value.interestRate.value === '0') { // Interest Rate 값은 0이 될수 없음
    messageBox.alertError(i18n.global.t('label.objt.interestRate') + ' ' + i18n.global.t('msg.error.length'))
    return
  }
  const fetchData = () => {
    if (scheduleParam.value.repayProgTpcd.value !== '05') {
      return gridPropsUtil.searchRow('bsLonSrvDbsService', 'LONSRVDBS042', scheduleParam, rowData, rowCount)
    } else {
      const rows = rowData.value.filter(row => row.id !== 'total')
      const combinedParams = {
        rows,
        repayProgTpcd: scheduleParam.value.repayProgTpcd.value,
        branchCode: scheduleParam.value.branchCode.value,
        currencyCode: scheduleParam.value.currencyCode.value,
        interestRate: scheduleParam.value.interestRate.value,
        roundDigitCd: '03',
        disbursementAmt: scheduleParam.value.disbursementAmt.value,
        disbursementDate: scheduleParam.value.disbursementDate.value,
        maxValue: scheduleParam.value.maxValue.value
      }
      return gridPropsUtil.searchRow('bsLonSrvDbsService', 'LONSRVDBS042', combinedParams, rowData, rowCount)
    }
  }

  fetchData().then(() => {
    // rSchdPrincipalAmt 합계 구하기
    const totalSchdPrincipalAmt = rowData.value.reduce((acc, row) => acc + Number(row.rSchdPrincipalAmt), 0)
    // rSchdIntAmt 합계 구하기
    const totalSchdIntAmt = rowData.value.reduce((acc, row) => acc + Number(row.rSchdIntAmt), 0)
    // Days 합계 구하기
    const totalDays = rowData.value.reduce((acc, row) => acc + Number(row.rIntCalcDays), 0)
    // 합계 결과를 total 행에 설정
    const totalRow = {
      id: 'total',
      rScheduleDate: '',
      rSchdPrincipalAmt: totalSchdPrincipalAmt,
      rSchdIntAmt: totalSchdIntAmt,
      rTotalPayment: totalSchdPrincipalAmt + totalSchdIntAmt,
      rIntCalcDays: totalDays
    }
    // rowData.value 배열을 복사하여 새로운 배열을 생성하고, 그 배열에 totalRow 추가
    rowData.value = [...rowData.value, totalRow]

    rowData.value = rowData.value.map((row, index) => {
      return { ...row, seq: index + 1 }
    })
  })
}

const addRow = () => {
  const dayCountCode = 360
  const roundUnit = 1
  const appDate = new Date(scheduleParam.value.applicationDate.value.substring(0, 11))
  appDate.setMonth(appDate.getMonth() + 1)

  const totalRow = rowData.value.find(row => row.id === 'total')
  if (totalRow) {
    // const totalSchdPrincipalAmt = totalRow.rSchdPrincipalAmt
  }
  if (scheduleParam.value.repayProgTpcd.value === '05') {
    const newRow = {
      rScheduleDate: appDate.toISOString().split('T')[0],
      rIntCalcFromDate: '',
      rIntCalcToDate: '',
      rSchdPrincipalAmt: 0,
      rSchdIntAmt: 0,
      rpmtPrincipalAmt: 0,
      repayProgTpcd: scheduleParam.value.repayProgTpcd.value,
      disbursementAmt: Number(scheduleParam.value.applicationAmount.value),
      interestRate: scheduleParam.value.interestRate.value,
      dayCount: dayCountCode,
      disbursementDate: scheduleParam.value.applicationDate.value,
      finalDueDate: scheduleParam.value.maturityDate.value,
      roundUnit,
      // roundFactor: scheduleParam.value.roundFactor.value,
      remainAmountCode: '02'
    }

    // 불균등 새로운 row 추가시 날짜 세팅
    if (commonUtil.isEmpty(scheduleParam.value.maturityDate.value)) {
      messageBox.alertInfo('Please enter the \'Maturity Date\' and proceed')
      return
    } else if (scheduleParam.value.applicationAmount.value === '0') {
      messageBox.alertInfo('Please enter the \'Loan Amount\' and proceed')
      return
    } else if (commonUtil.isEmpty(scheduleParam.value.interestRate.value) ||
                scheduleParam.value.interestRate.value === 0 ||
                scheduleParam.value.interestRate.value === '0') {
      messageBox.alertInfo('Please enter the \'Interest Rate\' and proceed')
      return
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

// Grid Update
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
    if (scheduleParam.value.repayProgTpcd.value === '05') {
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

const planCdChange = (event) => {
  // Specify Day 일때만 일자 입력가능
  if (event === '01') {
    dayDisable.value = false
    scheduleParam.value.initialDueDate.value = ''
  } else if (event === '02') { // '01' = First day, Application Date 값의 다음달 1일로 세팅
    dayDisable.value = true
    // scheduleParam.value.repayPlanDay.value = ''

    // // initialDueDate 값 계산(신청일자의 다음달 1일)
    // const disbursementDate = new Date(scheduleParam.value.applicationDate.value.substring(0, 11))
    // disbursementDate.setDate(1) // 일자를 1일로 설정
    // disbursementDate.setMonth(disbursementDate.getMonth() + 1) // 다음 달로 설정
    // scheduleParam.value.initialDueDate.value = disbursementDate.toISOString().split('T')[0]
  } else if (event === '03') { // '03' = Last Day, 달의 마지막날로 세팅
    dayDisable.value = true
    // scheduleParam.value.repayPlanDay.value = ''

    // // initialDueDate 값 계산(달의 마지막일)
    // const applicationDate = new Date(scheduleParam.value.applicationDate.value.substring(0, 11))
    // const disbursementDate = applicationDate.getDate() === endOfMonth(applicationDate).getDate() ? endOfMonth(addMonths(applicationDate, 1)) : endOfMonth(applicationDate)
    // scheduleParam.value.initialDueDate.value = disbursementDate.toISOString().split('T')[0]
  }
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

const getAthPopupRowData = (event) => {
  formParam.value.authorEmployeeNo.value = ''
  formParam.value.authorizationStatus.value = ''
  formParam.value.authorizationNo.value = ''
  formParam.value.authorizationDate.value = ''
}

const getColPopupRowData = (event) => {
  if (formParam.value.applicationNo.value) {
    collateralListInquiry()
  }
}

const getGuiPopupRowData = (event) => {
  if (!commonUtil.isEmpty(event)) {
    guaranteeListInquiry()
  }
}

const getAtcPopupRowData = (event) => {
  if (formParam.value.applicationNo.value) {
    formParam.value.postAttachNo.value = ''
    attachListInquiry()
  }
}

const getApcPopupRowData = (event) => {
  setApplicationData(event[0])
  setProductCodeData(event[0])
}

// [FUNCTION12] 좌측 패널 초기화 이벤트
const setDisableSide = () => {
  const ment = 'Yon can enter if after the application is completed'
  authorStatus.value = '02'
  collateralStatus.value = '02'
  attachedStatus.value = '02'
  isPopupVisible1.value = true
  isPopupVisible2.value = true
  isPopupVisible3.value = true
  isPopupAddGuarantee.value = true
  authorLineComment.value = ment
  collateralComment.value = ment
  attachComment.value = ment
}

// [FUNCTION13] 결재선 데이터 변경 이벤트
const updateAuthData = () => {
  // 담당자 본인만 수정 가능
  if (formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    isPopupVisible1.value = false
    isPopupVisible2.value = false
    isPopupAddGuarantee.value = false
    isPopupVisible3.value = false
  } else {
    isPopupVisible1.value = true
    isPopupVisible2.value = true
    isPopupAddGuarantee.value = true
    isPopupVisible3.value = true
  }
  // 기등록 데이터 존재
  // 결재가 진행중일땐 수정 불가
  if (authorLineDatas.value.length > 0) {
    authorStatus.value = '01'
    authorLineDatas.value.forEach((data, index) => {
      const list = []
      list.value = data
      if (list.value.status !== 'Progress' && index !== 0) {
        isPopupVisible1.value = true
        isPopupVisible2.value = true
        isPopupAddGuarantee.value = true
        isPopupVisible3.value = true
        authorApproveStatus.value = 'approved'
      }
    })
    // 선신청 필요
  } else if (commonUtil.isEmpty(formParam.value.applicationNo.value)) {
    setDisableSide()
    // 미등록 상태
  } else {
    authorStatus.value = '03'
    authorLineComment.value = 'No Approval Line Data'
  }
}

// [FUNCTION14] 담보 및 보증 데이터 변경 이벤트
const updateColData = () => {
  if (collateralDatas.value.length > 0 || guaranteeDatas.value.length > 0) { // 기등록
    collateralStatus.value = '01'
  } else if (commonUtil.isEmpty(formParam.value.applicationNo.value)) {
    setDisableSide()
  } else {
    collateralStatus.value = '03' // 미등록
    collateralComment.value = 'No Collateral & Guarantee Data'
  }
}

// [FUNCTION15] 첨부 문서 데이터 변경 이벤트
const updateAttachData = () => {
  // 기등록
  if (attachedDatas.value.length > 0) attachedStatus.value = '01'
  // 미신청
  else if (commonUtil.isEmpty(formParam.value.applicationNo.value)) setDisableSide()
  // 미등록
  else {
    attachedStatus.value = '03'
    attachComment.value = 'No Attached Data'
  }
}

// [FUNCTION16] 여신 신청번호 변경 이벤트
const applicationNoChange = (data) => {
// 신청자 === 접속자인 경우에만
  if (formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    updateAuthData()
    updateColData()
    updateAttachData()
  }
}

// [FUNCTION17] 여신신청 정보세팅
const setApplicationData = async (data) => {
  formParam.value.applicationNo.value = data.applicationNo
  formParam.value.contractNo.value = data.contractNo
  formParam.value.applicationDate.value = data.applicationDate
  formParam.value.applicationTpcd.value = data.applicationTpcd
  formParam.value.prgsStatusCode.value = data.prgsStatusCode
  formParam.value.productCode.value = data.productCode
  formParam.value.productName.value = data.productName
  formParam.value.customerNo.value = data.customerNo
  formParam.value.customerName.value = data.customerName
  formParam.value.fundPurposeCode.value = data.fundPurposeCode
  formParam.value.creditLineTpcd.value = data.creditLineTpcd
  formParam.value.intRateTpcd.value = data.intRateTpcd
  formParam.value.spreadRate.value = data.spreadRate
  formParam.value.baseRateCode.value = data.intRateTpcd === '02' ? data.baseRateCode : ''
  formParam.value.baseRateName.value = data.intRateTpcd === '02' ? data.baseRateName : ''
  formParam.value.baseRateApplydt.value = data.intRateTpcd === '02' ? data.baseRateApplydt : ''
  formParam.value.baseRate.value = data.intRateTpcd === '02' ? data.baseRate : ''
  formParam.value.interestRate.value = data.interestRate
  modelValues.value.currency.value = ''
  await nextTick()
  modelValues.value.currency.value = data.currencyCode
  modelValues.value.money.value = data.applicationAmount
  formParam.value.loanPrdTpcd.value = data.loanPrdTpcd
  formParam.value.loanTermYear.value = data.loanTermYear
  formParam.value.loanTermMonth.value = data.loanTermMonth
  formParam.value.maturityDate.value = data.maturityDate
  formParam.value.repayProgTpcd.value = data.repayProgTpcd
  formParam.value.gracePrdYear.value = data.gracePrdYear
  formParam.value.gracePrdMonth.value = data.gracePrdMonth
  formParam.value.amrtPrdMm.value = data.amrtPrdMm
  formParam.value.repaySourceCode.value = data.repaySourceCode
  formParam.value.registBrcd.value = data.registBrcd
  formParam.value.registEmployeeNo.value = data.registEmployeeNo
  formParam.value.registDate.value = data.registDate
  formParam.value.manageBrcd.value = data.manageBrcd
  formParam.value.manageEmployeeNo.value = data.manageEmployeeNo
  formParam.value.manageDate.value = data.manageDate
  formParam.value.rmk.value = data.rmk

  // Branch Name 세팅
  ajaxUtil.getBranchCodeList()
    .then(function (codeData) {
      formParam.value.branchName.value = commonCodeList.branchNameList = codeData.filter(v => v.code === session.sysBranchCode)[0].codeValue
    })

  // Schedule Simulation Tab 값 세팅
  for (const key in data) {
    if (key in scheduleParam.value && data[key] !== null) {
      scheduleParam.value[key].value = data[key]
    }
  }
  lonAmtCurForm.value.currency.value = data.currencyCode
  lonAmtCurForm.value.money.value = data.applicationAmount

  applicationNoChange(data.applicationNo)
  // 좌측 패널 데이터 조회 및 세팅
  authorLineInquiry()
  collateralListInquiry()
  guaranteeListInquiry()
  attachListInquiry()
  // Disable 상태 세팅
  if (formParam.value.transactionMode.value === 'INQUIRY') {
    disableFlag.value = true
    apcDisableFlag.value = false
    fixedFlag.value = true
    loanTermFlag.value = true
    variablaFlag.value = true
    loanMaturityFlag.value = true
    checkBoxDisableFlag.value = true
    repayProgFlag.value = true
    creditLineFlag.value = true
    intRateTypeFlag.value = true
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  }

  // 담당자 본인일때만 UPDATE, DELETE 버튼 활성화
  if (formParam.value.transactionMode.value === 'INQUIRY' && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  } else {
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  }

  // simulation 초기화
  rowData.value = []
}

// Application No 선택시 여신상품 정보 세팅
const setProductCodeData = (data, event) => {
  const prdSearchParam = ref({
    searchType: {
      value: 'PRODUCT_CODE'
    },
    searchKeyword: {
      value: data.productCode
    },
    searchKind: {
      value: 'ProductType'
    },
    fetchSize: {
      value: 100
    },
    maxValue: {
      value: '0'
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL022', prdSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      // Product Code Direct Search로 선택할 경우 여신상품 정보 세팅
      if (event === 'prdDirectSearch') {
        getPrdPopupRowData(data)
      }

      // 신용대출 or 담보대출 여부 체크
      formParam.value.creditClCode.value = data[0].creditClCode
      const creditLoan = '01' // 신용대출
      const colLoan = '02' // 담보대출
      if (formParam.value.creditClCode.value === colLoan) { // 담보대출 일때 true
        checkCollateralFlag.value = true
      } else if (formParam.value.creditClCode.value === creditLoan) {
        checkCollateralFlag.value = false
      }

      prdParam.value = {
        loanMinAmount: {
          value: data[0].loanMinAmount
        },
        loanMaxAmount: {
          value: data[0].loanMaxAmount
        },
        loanDefaultAmount: {
          value: data[0].loanDefaultAmount
        },
        loanTermMonthMin: {
          value: data[0].loanTermMonthMin
        },
        loanTermMonthMax: {
          value: data[0].loanTermMonthMax
        },
        loanTermYearMin: {
          value: data[0].loanTermYearMin
        },
        loanTermYearMax: {
          value: data[0].loanTermYearMax
        },
        intMinRate: {
          value: data[0].intMinRate
        },
        intMaxRate: {
          value: data[0].intMaxRate
        }
      }
    })
}

// [FUNCTION18] 첨부문서 삭제 이벤트
const deleteAttachData = (postAttachNo, referTableNm, originReferNo) => {
  const _confirm = () => {
    // formParam.value.transactionMode.value = 'DELETE'
    const deleteParam = ref({
      transactionMode: {
        value: 'DELETE'
      },
      postAttachNo: {
        value: postAttachNo
      },
      referTableNm: {
        value: referTableNm
      },
      originReferNo: {
        value: originReferNo
      }
    })
    const data = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL019', deleteParam)
    ajaxUtil.ajaxServiceData(data)
      .then(function (response) {
        attachListInquiry()
        // formParam.value.transactionMode.value = 'INQUIRY'
        // updateTrxnMode()
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.delete'), _confirm)
}

// [FUNCTION19_1] 담보 삭제 이벤트
const deleteCollateralData = (collateralNo, pledgeNo) => {
  const _confirm = () => {
    // formParam.value.transactionMode.value = 'DELETE'
    const deleteParam = ref({
      transactionMode: {
        value: 'DELETE'
      },
      collateralNo: {
        value: collateralNo
      },
      pledgeNo: {
        value: pledgeNo
      }
    })
    const data = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG009', deleteParam)
    ajaxUtil.ajaxServiceData(data)
      .then(function (response) {
        collateralListInquiry()
        // formParam.value.transactionMode.value = 'INQUIRY'
        // updateTrxnMode()
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.delete'), _confirm)
}

// [FUNCTION19_2] 보증 삭제 이벤트
const deleteGuaranteeData = (guaranteeNo) => {
  const _confirm = () => {
    // formParam.value.transactionMode.value = 'DELETE'
    const deleteParam = ref({
      transactionMode: {
        value: 'DELETE'
      },
      guaranteeNo: {
        value: guaranteeNo
      },
      applicationNo: {
        value: formParam.value.applicationNo.value
      }
    })
    const data = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG009', deleteParam)
    ajaxUtil.ajaxServiceData(data)
      .then(function (response) {
        guaranteeListInquiry()
        // formParam.value.transactionMode.value = 'INQUIRY'
        // updateTrxnMode()
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.delete'), _confirm)
}

// [FUNCTION20] 여신신청 조회이벤트
const search = (applicationNo) => {
  formParam.value.applicationNo.value = applicationNo
  const data = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL002', formParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (commonUtil.isEmpty(response)) {
        const _alertInfo = () => {
          formParam.value.transactionMode.value = 'NEW'
          updateTrxnMode()
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        freeformUtil.clear(formParam)
        setApplicationData(response)
        setProductCodeData(response)

        if (formParam.value.transactionMode.value === 'NEW') {
          formParam.value.transactionMode.value = 'INQUIRY'
          disableFlag.value = true
          apcDisableFlag.value = false
          fixedFlag.value = true
          loanTermFlag.value = true
          variablaFlag.value = true
          loanMaturityFlag.value = true
          checkBoxDisableFlag.value = true
          repayProgFlag.value = true
          creditLineFlag.value = true
          intRateTypeFlag.value = true
        }
      }
    })
}

const handleMessage = (event) => {
  const [applicationNo, productNo] = event.data.initParams.refNo.split('/')
  search(applicationNo)

  // Product정보 가져오기
  const productCode = ref({
    productCode: {
      value: productNo
    }
  })
  const data = commonUtil.objectToJson(productCode)
  setProductCodeData(data)
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

const changeFlag = (param) => {
  creditLineFlag.value = false
  intRateTypeFlag.value = false
  repayProgFlag.value = false

  if (param.value.creditLineFlag.value) {
    creditLineFlag.value = true
  }

  if (param.value.intRateTypeFlag.value) {
    intRateTypeFlag.value = true
  }

  if (param.value.repayProgFlag.value) {
    repayProgFlag.value = true
  }
  variablaFlag.value = true
}

const baseRateInfo = (param) => {
  formParam.value.baseRateName.value = param
  const data = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL042', formParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (commonUtil.isEmpty(response)) {
        const _alertError = () => {
          disableFlag.value = false
          loanTermFlag.value = false
          repayProgFlag.value = false
          creditLineFlag.value = false
          intRateTypeFlag.value = false
        }
        messageBox.alertError('Apply Date No Data Found.', _alertError)
      } else {
        formParam.value.baseRateApplydt.value = response.applyDate
        formParam.value.baseRate.value = response.baseRate
        formParam.value.interestRate.value = response.baseRate
        formParam.value.baseRateCode.value = response.baseRateCode
      }
    })
}

// Product Code 선택시 값 세팅
const getPrdPopupRowData = (event) => {
  const flagParam = ref({
    creditLineFlag: {
      value: false
    },
    intRateTypeFlag: {
      value: false
    },
    repayProgFlag: {
      value: false
    },
    variablaFlag: {
      value: false
    }
  })
  formParam.value.spreadRate.value = ''
  formParam.value.loanPrdTpcd.value = '01'
  formParam.value.loanTermYear.value = ''
  formParam.value.loanTermMonth.value = ''
  formParam.value.gracePrdYear.value = ''
  formParam.value.gracePrdMonth.value = ''
  formParam.value.productCode.value = event[0].productCode
  formParam.value.productName.value = event[0].productName
  modelValues.value.currency.value = event[0].currencyCode
  modelValues.value.money.value = event[0].loanDefaultAmount
  formParam.value.repayProgTpcd.value = event[0].repayProgTpcd === '06' ? '' : event[0].repayProgTpcd
  formParam.value.intRateTpcd.value = event[0].intRateTpcd
  formParam.value.creditClCode.value = event[0].creditClCode

  const creditLoan = '01' // 신용대출
  const colLoan = '02' // 담보대출
  if (formParam.value.transactionMode.value === 'NEW' && formParam.value.creditClCode.value === colLoan) { // 담보대출 일때 true
    checkCollateralFlag.value = true
  } else if (formParam.value.transactionMode.value === 'NEW' && formParam.value.creditClCode.value === creditLoan) {
    checkCollateralFlag.value = false
  }

  intRatetTypeChange(event[0].intRateTpcd)

  if ((event[0].intRateTpcd !== '01') && (event[0].baseRateCode !== '')) {
    // Apply Date, Base Rate 값 가져오기
    baseRateInfo(event[0].baseRateCode)
  } else {
    formParam.value.baseRateName.value = ''
    formParam.value.baseRateApplydt.value = ''
    formParam.value.baseRate.value = 0
    formParam.value.interestRate.value = 0
  }

  if (event[0].creditLineTpcd === '01' || event[0].creditLineTpcd === '02') {
    formParam.value.creditLineTpcd.value = event[0].creditLineTpcd
    flagParam.value.creditLineFlag.value = true
  } else {
    formParam.value.creditLineTpcd.value = ''
  }

  if (event[0].intRateTpcd === '01' || event[0].intRateTpcd === '02') {
    formParam.value.intRateTpcd.value = event[0].intRateTpcd
    flagParam.value.intRateTypeFlag.value = true
  } else {
    formParam.value.intRateTpcd.value = ''
  }

  if ((event[0].repayProgTpcd !== '' && event[0].repayProgTpcd !== null) && event[0].repayProgTpcd !== '06') {
    flagParam.value.repayProgFlag.value = true
  }
  changeFlag(flagParam)

  prdParam.value.loanMinAmount.value = event[0].loanMinAmount
  prdParam.value.loanMaxAmount.value = event[0].loanMaxAmount
  prdParam.value.loanDefaultAmount.value = event[0].loanDefaultAmount
  prdParam.value.loanTermMonthMin.value = event[0].loanTermMonthMin
  prdParam.value.loanTermMonthMax.value = event[0].loanTermMonthMax
  prdParam.value.loanTermYearMin.value = event[0].loanTermYearMin
  prdParam.value.loanTermYearMax.value = event[0].loanTermYearMax

  prdParam.value.intMinRate.value = event[0].intMinRate
  prdParam.value.intMaxRate.value = event[0].intMaxRate
}

const getPrdDirectSearch = (event) => {
  if (event === '') {
    formParam.value.productName.value = ''
    formParam.value.spreadRate.value = ''
    formParam.value.loanPrdTpcd.value = '01'
    formParam.value.loanTermYear.value = ''
    formParam.value.loanTermMonth.value = ''
    formParam.value.gracePrdYear.value = ''
    formParam.value.gracePrdMonth.value = ''
    modelValues.value.currency.value = session.sysBaseCurrency
    modelValues.value.money.value = ''
    formParam.value.repayProgTpcd.value = ''
    formParam.value.intRateTpcd.value = '01'
    formParam.value.baseRateName.value = ''
    formParam.value.baseRateApplydt.value = ''
    formParam.value.creditLineTpcd.value = '02'
    formParam.value.baseRate.value = 0
    formParam.value.interestRate.value = 0
    creditLineFlag.value = false
    intRateTypeFlag.value = false
    repayProgFlag.value = false
  } else {
    formParam.value.productCode.value = event.productCode
    formParam.value.productName.value = event.productName
    setProductCodeData(event, 'prdDirectSearch') // Product Code 선택 후 여신상품 정보 세팅
  }
}

const getCstDirectSearch = (event) => {
  if (event !== '') {
    formParam.value.customerNo.value = event.customerNo
    formParam.value.customerName.value = event.customerName
  } else {
    formParam.value.customerName.value = ''
  }
}

const getApcDirectSearch = (event) => {
  if (event !== '') {
    // 배열형식으로 재정의
    const data = []
    data[0] = event
    setApplicationData(data[0])
    setProductCodeData(data[0])
  }
}

const authorLineDatasClear = () => {
  authorLineDataFlag.value = false
}

const getCstPopupRowData = (event) => {
  if (event.length === undefined) {
    setApplicantsData(event)
  } else {
    if (event.length > 0) {
      formParam.value.customerNo.value = event[0].customerNo
      formParam.value.customerName.value = event[0].customerName
    }
    setApplicantsData(event[0])
  }
}

const setApplicantsData = async (data) => {
  if (formParam.value.customerNo.value !== applicantsSearchResult.value.customerNo.value) {
    applicantsSearch()
    searchHistoryGrid()
    searchPastDueGrid()
  }
}

const applicantsClick = () => {
  if (formParam.value.customerNo.value !== applicantsSearchResult.value.customerNo.value) {
    applicantsSearch()
    searchHistoryGrid()
    searchPastDueGrid()
  }
}

// 고객 정보 조회
const applicantsSearch = () => {
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL052', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas !== null) {
        // console.log(datas)
        applicantsSearchResult.value.customerNo.value = datas.customerNo
        applicantsSearchResult.value.customerName.value = datas.customerName
        applicantsSearchResult.value.customerType.value = datas.customerTypeCode
        applicantsSearchResult.value.customerDetailType.value = datas.customerDetailTypeCode
        applicantsSearchResult.value.creditRating.value = datas.creditRate
        applicantsSearchResult.value.evaluationDate.value = datas.evaluationDate
        applicantsSearchResult.value.expireDate.value = datas.expireDate
      } else {
        applicantsSearchResult.value.customerNo.value = ''
        applicantsSearchResult.value.customerName.value = ''
        applicantsSearchResult.value.customerType.value = ''
        applicantsSearchResult.value.customerDetailType.value = ''
        applicantsSearchResult.value.creditRating.value = ''
        applicantsSearchResult.value.evaluationDate.value = ''
        applicantsSearchResult.value.expireDate.value = ''
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

// 여신 이력 조회
const searchHistoryGrid = () => {
  historyRowData.value = []
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL062', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(async function (response) {
      for (const index in response) {
        if (response[index].contractNo === null) {
          // isRelevantExpanded.value = false
          return
        } else {
          historyRowData.value = response
          // isRelevantExpanded.value = true
        }
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

// 연체 이력 조회
const searchPastDueGrid = () => {
  pastDueRowData.value = []
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL072', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(async function (response) {
      for (const index in response) {
        if (response[index].contractNo === null) {
          // isRelevantExpanded.value = false
          return
        } else {
          pastDueRowData.value = response
          // isRelevantExpanded.value = true
        }
      }
    }).catch((error) => {
      messageBox.alertAjaxError(error)
    })
}

</script>
