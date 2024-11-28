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
      <lonCntChgLeftPanel
        :formParam="formParam"
        :authorStatus="authorStatus"
        :authorLineDatas="authorLineDatas"
        :authorLineComment="authorLineComment"
        :getApvPopupRowData="getApvPopupRowData"
        :getAthPopupRowData="getAthPopupRowData"
        :collateralStatus="collateralStatus"
        :collateralDatas="collateralDatas"
        :guaranteeDatas="guaranteeDatas"
        :collateralComment="collateralComment"
        :getColPopupRowData="getColPopupRowData"
        :getGuiPopupRowData="getGuiPopupRowData"
        :attachedStatus="attachedStatus"
        :attachedDatas="attachedDatas"
        :attachComment="attachComment"
        :getAtcPopupRowData="getAtcPopupRowData"
        :showApvSearch="showApvSearch"
        :showAthSearch="showAthSearch"
        :showColSearch="showColSearch"
        :showAtcSearch="showAtcSearch"
        :checkCollateralFlag="checkCollateralFlag"
        :authorLineDatasClear="authorLineDatasClear"
        :deleteCollateralData="deleteCollateralData"
        :deleteGuaranteeData="deleteGuaranteeData"
        :deleteAttachData="deleteAttachData"
        :isPopupVisible="isPopupVisible"
      ></lonCntChgLeftPanel>
    </div>
  </div>

  <div class="" style="flex-basis: 75%;">
      <lonCntChgFreeform
        :formParam="formParam"
        :commonCodeList="commonCodeList"
        :searchParam="searchParam"
        :save="save"
        :updateTrxnMode="updateTrxnMode"
        :radioDisableFlag="radioDisableFlag"
        :cdDisable="cdDisable"
        :applicationNoChange="applicationNoChange"
        :cCDisable="cCDisable"
        :contractCurForm="contractCurForm"
        :changeAmtCurForm="changeAmtCurForm"
        :balanceCurForm="balanceCurForm"
        :getApcPopupRowData="getApcPopupRowData"
        :getConPopupRowData="getConPopupRowData"
        :getBirPopupRowData="getBirPopupRowData"
        :getPopupRowData5="getPopupRowData5"
        :getPopupRowData6="getPopupRowData6"
        :getPopupRowData7="getPopupRowData7"
        :getPopupRowData8="getPopupRowData8"
        :showApcSearch="showApcSearch"
        :showConSearch="showConSearch"
        :showBirSearch="showBirSearch"
        :nonTarget="nonTarget"
        :amountFlag="amountFlag"
        :maturityFlag="maturityFlag"
        :rateFlag="rateFlag"
        :baseRateFlag="baseRateFlag"
        :spreadRateFlag="spreadRateFlag"
        :apcTypeDisable="apcTypeDisable"
        :apcDisable="apcDisable"
        :changeApc="changeApc"
        :intRateTypeChange="intRateTypeChange"
      ></lonCntChgFreeform>
        </div>
        </q-page>
  </q-page-container>
<!-- </q-scroll-area> -->
</template>
<script setup>
/*
301070 - Loan Contract Change Application
*/
/* =======================================================
  1. Import Area
======================================================= */
import { reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ajaxUtil, freeformUtil, commonProp, commonUtil, messageBox } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'
import { i18n } from 'boot/i18n'
import { addYears, addMonths, subDays, addDays } from 'date-fns'
import lonCntChgLeftPanel from 'src/pages/lon/ogn/cnt/lonCntChgProps/lonCntChgLeftPanel.vue'
import lonCntChgFreeform from 'src/pages/lon/ogn/cnt/lonCntChgProps/lonCntChgFreeform.vue'

/* =======================================================
  2. Global Variable
======================================================= */

const session = useSessionStore()
const showApvSearch = ref(false)
const showColSearch = ref(false)
const showAtcSearch = ref(false)
const showApcSearch = ref(false)
const showAthSearch = ref(false)
const showConSearch = ref(false)
const showBirSearch = ref(false)
const isPopupVisible = ref(true)
const selectedPopupRowData = ref([])
const authorLineDataFlag = ref(true)
const checkCollateralFlag = ref(false) // 신용대출인지 담보대출인지 check
const authorStatus = ref('02')
const collateralStatus = ref('02')
const attachedStatus = ref('02')
const authorLineDatas = ref([])
const collateralDatas = ref([])
const guaranteeDatas = ref([])
const attachedDatas = ref([])
const applicationNo = ref(null)
const applicationDate = ref(null)
const contractNo = ref(null)
const contractDate = ref(null)
const minMaturityDate = ref(null)
const maxMaturityDate = ref(null)
const interestType = ref(null)
const balanceAmt = ref(null)
const authorLineComment = ref('You can change it after the application is completed')
const collateralComment = ref('You can change it after the application is completed')
const attachComment = ref('You can change it after the application is completed')
// const saveMsg = ref('')
const authorApproveStatus = ref('init')
const nonTarget = ref(false)
const excludeTarget = ref(true)
const disableFlagObj = reactive({
  nonTarget, excludeTarget
})
const cdDisable = ref(true)
const cCDisable = ref(false)
const apcDisable = ref(false)
const amountFlag = ref(true)
const maturityFlag = ref(true)
const rateFlag = ref(true)
const baseRateFlag = ref(true)
const spreadRateFlag = ref(true)
const apcTypeDisable = ref(true)

const freeformRefs = {
  applicationNo,
  applicationDate,
  contractNo,
  contractDate
}

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
const searchParam = ref({
  prgsStatusCode: {
    value: '500',
    required: true
  },
  progressStatus: {
    value: '500',
    required: true
  },
  contractNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.contractNo')
  },
  applicationNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.applicationNo')
  },
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  helpSearchType: {
    value: 'lonHlpApc',
    required: false,
    description: ''
  },
  searchType: {
    value: ''
  },
  searchKeyword: {
    value: ''
  }
})

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
    required: false,
    description: i18n.global.t('label.objt.applicationNo')
  },
  applicationDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.applicationDate')
  },
  prgsStatusCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.progressStatus')
  },
  contractNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.contractNo')
  },
  contractDate: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.contractDate')
  },
  applicationTpcd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.applicationType')
  },
  customerNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.customer')
  },
  customerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.customer')
  },
  productCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.productType')
  },
  productName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.productType')
  },
  creditLineTpcd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.loanMethod')
  },
  currencyCode: {
    value: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.view.contractAmt')
  },
  contractAmount: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.contractAmt')
  },
  changeAmount: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.contractAmt')
  },
  balanceAmount: {
    value: 0,
    initValue: 0,
    required: true,
    description: i18n.global.t('label.view.contractAmt')
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
    description: i18n.global.t('label.veiw.baseRateApplyDate')
  },
  baseRate: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.baseRate')
  },
  spreadRate: {
    value: 0,
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.spread')
  },
  creditClCode: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.creditCollateralLoan')
  },
  collateralDatas: {
    value: []
  },
  guaranteeDatas: {
    value: []
  },
  changeMaturityDate: {
    value: ''
  },
  changeIntRateTpcd: {
    value: ''
  },
  changeSpreadRate: {
    value: ''
  },
  changeBaseRateName: {
    value: ''
  },
  changeBaseRateCode: {
    value: ''
  },
  changeBaseRate: {
    value: ''
  },
  changeBaseRateApplydt: {
    value: ''
  },
  changeInterestRate: {
    value: ''
  },
  fundPurposeCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.fundPurpose')
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
  interest: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.interestRate')
  },
  pastdueSpread: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.pastDueSpread')
  },
  pasrdueMaxRate: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.view.pastDueInt')
  },
  intRateTpcd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.intRateType')
  },
  repayProgTpcd: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.repaymentProgram')
  },
  gracePrdYear: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  gracePrdMonth: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.gracePeriod')
  },
  amrtPrdMm: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.amortizationPeriod')
  },
  rmk: {
    value: ''
  },
  registBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  registBrnm: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  registEmployeeNm: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  registDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.objt.registInfo')
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageBrnm: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageEmployeeNm: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  repaySourceCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.repaymentSource')
  },
  maturityDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.maturityDate')
  },
  guaranteeNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeNo')
  },
  pledgeNo: {
    value: '',
    required: false
  },
  postAttachNo: {
    value: ''
  },
  authorEmployeeNo: {
    value: ''
  },
  authorizationStatus: {
    value: ''
  },
  authorizationNo: {
    value: ''
  },
  authorizationDate: {
    value: ''
  },
  transactionMode: {
    value: 'NEW',
    required: false
  }
})

const contractCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => contractCurForm.value.currency.value, (newVal) => {
  formParam.value.currencyCode.value = newVal
  changeAmtCurForm.value.currency.value = newVal
  balanceCurForm.value.currency.value = newVal
})

watch(() => contractCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.contractAmount.value = Number(newVal.replace(/,/g, ''))
})

const changeAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => changeAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.changeAmount.value = Number(newVal.replace(/,/g, ''))
})

const balanceCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => balanceCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.balanceAmount.value = Number(newVal.replace(/,/g, ''))
})

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
            pledgeStatusCode: data.pledgeStatusCode,
            ccycdPledge: formParam.value.currencyCode.value,
            status: authorApproveStatus.value
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

        // 기존 등록된 담보정보 저장
        formParam.value.collateralDatas.value = datas
      }
      updateColData()
    })
}

// 보증 목록조회
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
        formParam.value.guaranteeDatas.value = datas
      }
      updateColData()
    })
}

const authSaveDatas = ref({
  datas: {
    value: []
  },
  transactionMode: {
    value: formParam.value.transactionMode.value
  },
  applicationNo: {
    value: ''
  }
})

const authorLineInquiry = () => {
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH002', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas.length === 0) {
        authorLineDatas.value = []
      } else {
        const icon = ''
        const color = ''
        const status = ''
        const tmpList = []
        for (const data of datas) {
          const row = {
            icon,
            color,
            status,
            employeeNo: data.employeeNo,
            name: data.employeeName,
            position: data.employeePositionNm,
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

          // NEW일때 담당자만 check아이콘, 나머지는 schedule아이콘
          if (formParam.value.transactionMode.value === 'NEW' && data.sortSeq !== 0) {
            row.icon = 'schedule'
            row.color = 'blue'
            row.status = 'Progress'
          }

          tmpList.push(row)
        }
        authorLineDatas.value = tmpList
        authSaveDatas.value.datas.value = tmpList // 기존 결재선정보 그대로 새로운 계약변경 신청의 결재선으로 저장
      }
      updateAuthData()
    })
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

const updateTrxnMode = (event) => {
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  if (transactionMode === 'NEW') {
    freeformUtil.disableControl(false, disableFlagObj)
    freeformUtil.clear(formParam)
    freeformUtil.clear(contractCurForm)
    attachedDatas.value = []
    authorLineDatas.value = []
    collateralDatas.value = []
    guaranteeDatas.value = []
    isPopupVisible.value = true
    // 좌측패널 내용 초기화
    updateAuthData()
    updateColData()
    updateAttachData()
    contractCurForm.value.currency.value = session.sysBaseCurrency
    formParam.value.registBrcd.value = session.sysBranchCode
    formParam.value.manageBrcd.value = session.sysBranchCode
    // formParam.value.registEmployeeNo.value = session.sysEmployeeNo
    formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
    collateralComment.value = 'You can change it after the application is completed'
    attachComment.value = 'You can change it after the application is completed'

    ajaxUtil.getBranchCodeList()
      .then(function (codeData) {
        if (codeData && Array.isArray(codeData)) {
          const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
          const matchingValue = matchingCode.codeValue
          formParam.value.registBrnm.value = matchingValue
          formParam.value.manageBrnm.value = matchingValue
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
      })

    ajaxUtil.getEmployeeNoList()
      .then(function (codeData) {
        if (codeData && Array.isArray(codeData)) {
          const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
          const matchingValue = matchingCode.codeValue
          formParam.value.registEmployeeNm.value = matchingValue
          formParam.value.manageEmployeeNm.value = matchingValue
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
      })
    amountFlag.value = true
    maturityFlag.value = true
    rateFlag.value = true
    baseRateFlag.value = true
    spreadRateFlag.value = true
    cCDisable.value = false
    apcDisable.value = true
  } else if (transactionMode === 'INQUIRY') {
    freeformUtil.disableControl(true, disableFlagObj)
    amountFlag.value = true
    maturityFlag.value = true
    rateFlag.value = true
    baseRateFlag.value = true
    spreadRateFlag.value = true
    cCDisable.value = true
    apcDisable.value = false
    apcTypeDisable.value = true

    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true

    freeformUtil.clear(formParam)
    freeformUtil.clear(contractCurForm)
    freeformUtil.clear(changeAmtCurForm)
    freeformUtil.clear(balanceCurForm)
    attachedDatas.value = []
    authorLineDatas.value = []
    collateralDatas.value = []
    guaranteeDatas.value = []
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(false, disableFlagObj)
    amountFlag.value = true
    maturityFlag.value = true
    rateFlag.value = true
    baseRateFlag.value = true
    spreadRateFlag.value = true
    cCDisable.value = true
    apcDisable.value = true
    apcTypeDisable.value = true
    changeApc(formParam.value.applicationTpcd.value)
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
    amountFlag.value = true
    maturityFlag.value = true
    rateFlag.value = true
    baseRateFlag.value = true
    spreadRateFlag.value = true
    cCDisable.value = true
    apcDisable.value = true
    apcTypeDisable.value = true
  }

// controllRadioDisable(transactionMode)
}

// const controllRadioDisable = (selectedRTransactionMode) => {
//   if (selectedRTransactionMode === 'NEW') {
//     radioDisableFlag.value.newRadio.value = false
//     radioDisableFlag.value.inquiryRadio.value = false
//     radioDisableFlag.value.updateRadio.value = true
//     radioDisableFlag.value.deleteRadio.value = true
//   } else if (selectedRTransactionMode === 'UPDATE') {
//     if (!commonUtil.isEmpty(searchParam.value.contractNo.value)) {
//       radioDisableFlag.value.updateRadio.value = false
//       radioDisableFlag.value.deleteRadio.value = false
//     } else {
//       formParam.value.transactionMode.value = 'INQUIRY'
//     }
//   }
// }

/* =======================================================
  3. Common Code Adapter
======================================================= */

const commonCodeList = reactive({
  applicationType: ref([]),
  progressStatus: ref([]),
  fundPurpose: ref([]),
  loanMethod: ref([]),

  loanPeriodType: ref([]),
  repaymentProgram: ref([]),
  repaymentSource: ref([]),
  intRateType: ref([]),
  collateralTpcd: ref([]),
  attachKindCode: ref([]),
  countryTypeCode: ref([])
})

ajaxUtil.getCodeList('SHOWROWS, LON_COLLATERAL_TYPE_CODE, LON_APPLICATION_TYPE_CODE, LON_APL_PROGRESS_STCD, LON_INTEREST_RATE_CODE, LON_FUND_PURPOSE_CODE, CREDIT_LINE_TYPE_CODE, LON_PERIOD_TYPE, LON_REPAY_METHOD_CODE, LON_RPMT_SOURCE_CODE')
  .then(function (codeData) {
    commonCodeList.applicationType = codeData.lonApplicationTypeCode.filter(v => v.code !== '01')
    commonCodeList.progressStatus = codeData.lonAplProgressStcd
    commonCodeList.loanMethod = codeData.creditLineTypeCode
    commonCodeList.fundPurpose = codeData.lonFundPurposeCode
    commonCodeList.loanPeriodType = codeData.lonPeriodType
    commonCodeList.repaymentProgram = codeData.lonRepayMethodCode
    commonCodeList.repaymentSource = codeData.lonRpmtSourceCode
    commonCodeList.intRateType = codeData.lonInterestRateCode
    commonCodeList.collateralTpcd = codeData.lonCollateralTypeCode
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

ajaxUtil.getPrefixCodeList('ATTACH_KIND_CODE', 'LAP')
  .then(function (codeData) {
    commonCodeList.attachKindCode = codeData.attachKindCode
  })

ajaxUtil.getBranchCodeList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
      const matchingValue = matchingCode.codeValue
      formParam.value.registBrnm.value = matchingValue
      formParam.value.manageBrnm.value = matchingValue
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

ajaxUtil.getEmployeeNoList()
  .then(function (codeData) {
    if (codeData && Array.isArray(codeData)) {
      const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
      const matchingValue = matchingCode.codeValue
      formParam.value.registEmployeeNm.value = matchingValue
      formParam.value.manageEmployeeNm.value = matchingValue
    }
  })
  .catch(function (error) {
    console.error('Error:', error)
  })

/* =======================================================
  7. Freeform Funtion
======================================================= */
const checkParam = () => {
  if (formParam.value.intRateTpcd.value === '02') {
    formParam.value.baseRateCode.required = true
    formParam.value.baseRateName.required = true
  } else {
    formParam.value.baseRateCode.required = false
    formParam.value.baseRateName.required = false
  }

  if (formParam.value.contractAmount.value === 0) {
    formParam.value.contractAmount.value = ''
  }
}
const save = () => {
  const transactionMode = formParam.value.transactionMode.value
  if (transactionMode === 'INQUIRY') return
  const authResultCode = 'authResultCode'
  const apcNo = 'applicationNo'

  if (transactionMode !== 'DELETE') {
    if (!freeformUtil.checkRequired(formParam, freeformRefs)) return
    checkParam()
    // collateralDatas에서 pledgeStatusCode가 10인 항목이 있는지 확인
    const hasProposed = collateralDatas.value.some(data => data.pledgeStatusCode === '10')

    // 변경 타입에 따른 데이터 검증
    const applicationType = formParam.value.applicationTpcd.value
    const changeAmount = formParam.value.changeAmount.value
    const contractAmount = formParam.value.contractAmount.value
    const maturityDate = formParam.value.maturityDate.value
    const changeMaturityDate = formParam.value.changeMaturityDate.value
    const gracePrdYear = formParam.value.gracePrdYear.value
    const gracePrdMonth = formParam.value.gracePrdMonth.value
    const intRateType = formParam.value.changeIntRateTpcd.value
    const changeSpreadRate = formParam.value.changeSpreadRate.value
    const changeBaseRateCode = formParam.value.changeBaseRateCode.value
    const applicationDate = formParam.value.applicationDate.value
    const contractDate = formParam.value.contractDate.value

    // 데이터 검증
    if (applicationType === '02' && changeAmount < contractAmount) { // 1. 변경타입이 증액일때 기존 금액과 비교
      messageBox.alertError('Change Application Amount is less than Contract Amount')
      return
    } else if (applicationType === '03' && changeAmount > contractAmount) { // 2. 변경타입이 감액일때 기존 금액과 비교
      messageBox.alertError('Change Application Amount is large than Contract Amount')
      return
    } else if (applicationType === '04' && changeMaturityDate < maturityDate) { // 3. 변경타입이 만기연장일때 기존 만기일자와 비교
      messageBox.alertError('Change Maturity Date cannot be before maturityDate')
      return
    } else if (applicationType === '05' && changeMaturityDate > maturityDate) { // 4. 변경타입이 만기축소일때 기존 만기일자와 비교
      messageBox.alertError('Change Maturity Date cannot be later than the maturityDate')
      return
    }

    // 변경 타입에 따른 필수값 체크('02':증액, '03':감액, '04':만기연장, '05':만기축소, '06':이율변경)
    if ((applicationType === '02' || applicationType === '03') && commonUtil.isEmpty(changeAmount)) {
      messageBox.alertError('Change Application Amount is required'); return
    } else if ((applicationType === '04' || applicationType === '05')) {
      if (commonUtil.isEmpty(changeMaturityDate)) {
        messageBox.alertError('Change Maturity Date is required')
        return
      } else if (commonUtil.isEmpty(gracePrdYear) && commonUtil.isEmpty(gracePrdMonth)) {
        formParam.value.gracePrdYear.value = '0'
        formParam.value.gracePrdMonth.value = '0'
      }
    } else if (applicationType === '06') {
      if (commonUtil.isEmpty(intRateType)) {
        messageBox.alertError('Interest Rate Type is required')
        return
      } else if (intRateType === '01') {
        if (commonUtil.isEmpty(changeSpreadRate)) {
          messageBox.alertError('Spread Rate is required')
          return
        }
      } else if (intRateType === '02') {
        if (commonUtil.isEmpty(changeBaseRateCode)) {
          messageBox.alertError('Base Rate Type is required')
          return
        }
      }
      formParam.value.changeInterestRate.value = Number(formParam.value.changeBaseRate.value) + Number(formParam.value.changeSpreadRate.value)
    }

    // 계약변경 신청일자와 기존계약일자 비교
    if (applicationDate < contractDate) {
      messageBox.alertError('Application date is less than Contract date')
      return
    }

    // 대출 상품 정보(Product)의 범위 비교(금액, 기간, 이율 범위)
    const loanMaxAmount = prdParam.value.loanMaxAmount.value
    const loanMinAmount = prdParam.value.loanMinAmount.value
    const intMaxRate = prdParam.value.intMaxRate.value
    const intMinRate = prdParam.value.intMinRate.value
    const changeInterestRate = formParam.value.changeInterestRate.value

    // 증액 or 감액 일때 상품의 대출한도 비교
    if ((applicationType === '02' || applicationType === '03') && (changeAmount < loanMinAmount || changeAmount > loanMaxAmount)) {
      messageBox.alertError('Change Application Amount range is ' + loanMinAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ~ ' + loanMaxAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      return
    }

    if ((applicationType === '04' || applicationType === '05') && (changeMaturityDate > maxMaturityDate.value || changeMaturityDate < minMaturityDate.value)) {
      messageBox.alertError('The Change Maturity Date is ' + minMaturityDate.value + ' ~ ' + maxMaturityDate.value)
      return
    }

    // 이율변경 일때 상품의 이율범위 비교
    if (applicationType === '06' && (changeInterestRate < intMinRate || changeInterestRate > intMaxRate)) {
      messageBox.alertError('The sum of Base Rate and Spread must be between ' + prdParam.value.intMinRate.value + '% ~ ' + prdParam.value.intMaxRate.value + '%')
      return
    }

    // NEW 등록
    if (transactionMode === 'NEW') {
      let saveMsg
      if (hasProposed) {
        saveMsg = 'There are items with the pledge status set to Proposed. Do you want to save?'
      } else {
        saveMsg = i18n.global.t('msg.info.save')
      }
      const _confirm = () => {
      // 신청 테이블 등록 service 호출
        const saveParam = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCHG001', formParam)
        ajaxUtil.ajaxServiceData(saveParam)
          .then(function (response) {
          // 기존 결재선정보 그대로 새로운 계약변경 신청의 결재선으로 저장(승인완료 값은 초기화)
          // 새로 채번된 applicationNo값을 authSaveDatas에 추가
            for (const index in authSaveDatas.value.datas.value) {
              authSaveDatas.value.datas.value[index][apcNo] = response
              authSaveDatas.value.datas.value[index][authResultCode] = ''
            }
            authSaveDatas.value.applicationNo.value = response
            // 담당자는 자동 승인 처리
            authSaveDatas.value.datas.value[0][authResultCode] = '01' // '01': 결재 승인 처리

            // 결재선 등록 service 호출
            const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH009', authSaveDatas)
            ajaxUtil.ajaxServiceData(newSearchParam)
              .then(function (data) {
              // 다음 결재자 To Do List 등록
                const searchData = ref({
                  todoTitle: {
                    value: i18n.global.t('msg.confirm.newLoanApplication', [authSaveDatas.value.applicationNo.value.replace(/-/g, '')])
                  },
                  todoMemo: {
                    value: i18n.global.t('msg.confirm.newLoanApplication', [authSaveDatas.value.applicationNo.value.replace(/-/g, '')])
                  },
                  todoStatusCode: {
                    value: '01'
                  },
                  todoDuedate: {
                    value: dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateType)
                  },
                  referMenuId: {
                    value: '301040'
                  },
                  applicationNo: {
                    value: authSaveDatas.value.applicationNo.value.replace(/-/g, '')
                  },
                  referNo: {
                    value: authSaveDatas.value.applicationNo.value.replace(/-/g, '')
                  },
                  target: {
                    value: 'NEXT'
                  }
                })
                // To Do List service 호출
                const saveParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH039', searchData)
                ajaxUtil.ajaxServiceCall(saveParam)
                  .then((response) => { })
              })
            formParam.value.transactionMode.value = 'INQUIRY'
            searchParam.value.applicationNo.value = response
            formParam.value.applicationNo.value = response

            // 저장 후 결재선 및 담보,보증 수정가능
            if (formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
              isPopupVisible.value = false
            } else {
              isPopupVisible.value = true
            }
            search()
          })
      }
      messageBox.confirm(saveMsg, _confirm)
    } else if (transactionMode === 'UPDATE') {
      const _confirm = () => {
        const saveParam = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCHG003', formParam)
        ajaxUtil.ajaxServiceCall(saveParam)
          .then((response) => {
            messageBox.alertAjaxSuccess(response).onOk(() => {

            })
          })
          .catch((error) => {
            messageBox.alertAjaxError(error).onOk(() => {

            })
          })
      }
      messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
    }
  } else {
    const _confirm = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCHG004', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          messageBox.alertAjaxSuccess(response).onOk(() => {
            if (formParam.value.transactionMode.value === 'DELETE') {
              // formParam.value.transactionMode.value = 'NEW'
              // updateTrxnMode()
            } else {
              search()
            }
          })
        })
        .catch((error) => {
          messageBox.alertAjaxError(error).onOk(() => {

          })
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
  }
}

/* =======================================================
  9. popup
======================================================= */

const getConPopupRowData = (event) => {
  amountFlag.value = true
  maturityFlag.value = true
  rateFlag.value = true
  baseRateFlag.value = true
  spreadRateFlag.value = true
  if (event.length === undefined) {
    searchParam.value.contractNo.value = event.contractNo
    balanceCurForm.value.money.value = event.contractBal
    balanceAmt.value = event.contractBal
    setProductCodeData(event)
  } else {
    searchParam.value.contractNo.value = event[0].contractNo
    balanceCurForm.value.money.value = event[0].contractBal
    balanceAmt.value = Number(event[0].contractBal)
    setProductCodeData(event[0])
  }
  search()
}
const getBirPopupRowData = (event) => {
  formParam.value.changeBaseRateName.value = event[0].baseRateName
  formParam.value.changeBaseRateCode.value = event[0].baseRateCode
  formParam.value.changeBaseRate.value = event[0].baseRate
  formParam.value.changeBaseRateApplydt.value = event[0].applyDate
}

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

const updateAuthData = () => {
  authorStatus.value = '02' // authorStatus초기화 - 기존결재선 정보를 가지고있지만 NEW일땐 출력x
  if (authorLineDatas.value.length > 0 && formParam.value.transactionMode.value !== 'NEW') { // 기등록
    authorStatus.value = '01'

    for (const [index, data] of authorLineDatas.value.entries()) {
      const list = []
      list.value = data
      // 결재 진행중이면 수정 불가
      if (list.value.status !== 'Progress' && index !== 0) {
        isPopupVisible.value = true
        authorApproveStatus.value = 'approved'
        break
      } else { // 결재 진행중이 아니면 담당자만 수정 가능
        if (formParam.value.registEmployeeNo.value === session.sysEmployeeNo && formParam.value.transactionMode.value !== 'NEW') {
          isPopupVisible.value = false
        } else {
          isPopupVisible.value = true
        }
      }
    }
  }
}

const updateColData = () => {
  collateralStatus.value = '02' // collateralStatus초기화 - 기존 담보,보증 정보를 가지고있지만 NEW일땐 출력x
  if ((collateralDatas.value.length > 0 || guaranteeDatas.value.length > 0) && formParam.value.transactionMode.value !== 'NEW') { // 기등록
    collateralStatus.value = '01'
  } else {
    collateralComment.value = 'No Collateral & Guarantee Data'
  }
}

const updateAttachData = () => {
  attachedStatus.value = '02' // attachedStatus초기화 - 기존 첨부서류 정보를 가지고있지만 NEW일땐 출력x
  if (attachedDatas.value.length > 0 && formParam.value.transactionMode.value !== 'NEW') { // 기등록
    attachedStatus.value = '01'
  } else {
    attachComment.value = 'No Attached Data'
  }
}

const getColPopupRowData = (event) => {
  const datas = event.datas
  console.log('----------getColPopupRowData------------')
  console.log(JSON.stringify(datas))
  console.log('----------------------------------------')
  if (formParam.value.applicationNo.value) {
    collateralListInquiry()
  }
}

const getGuiPopupRowData = (event) => {
  const datas = event.datas
  console.log('----------getGuiPopupRowData------------')
  console.log(JSON.stringify(datas))
  console.log('----------------------------------------')
  if (formParam.value.applicationNo.value) {
    guaranteeListInquiry()
  }
}

const getAtcPopupRowData = (event) => {
  const datas = event.datas
  console.log('----------getAtcPopupRowData------------')
  console.log(JSON.stringify(datas))
  console.log('----------------------------------------')
  if (formParam.value.applicationNo.value) {
    formParam.value.postAttachNo.value = ''
    attachListInquiry()
  }
}

const getApcPopupRowData = (event) => {
  if (event.length > 0) {
    event = event[0]
  }

  setProductCodeData(event)
  setApplicationData(event)

  // 담당자 일때만 결재선 및 담보,보증 수정가능
  if (event.registEmployeeNo === session.sysEmployeeNo) {
    isPopupVisible.value = false
  } else {
    isPopupVisible.value = true
  }

  // Contract Balance 값 가져오기
  searchParam.value.searchType.value = 'CONTRACT_NO'
  searchParam.value.helpSearchType.value = 'lonHlpCon'
  searchParam.value.searchKeyword.value = event.contractNo
  searchParam.value.prgsStatusCode.value = ''
  const newSearchParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      balanceCurForm.value.money.value = data[0].contractBal
      balanceAmt.value = data[0].contractBal
    })
}

const applicationNoChange = (data) => {
  if (formParam.value.transactionMode.value === 'INQUIRY') {
    updateAuthData()
    updateColData()
    updateAttachData()
  }
}

const setApplicationData = async (data) => {
  if (formParam.value.transactionMode.value === 'NEW') {
    updateTrxnMode()
  }
  contractCurForm.value.currency.value = ''
  await nextTick()

  for (const key in data) {
    if (key in formParam.value && data[key] !== null) {
      formParam.value[key].value = data[key]
    }
  }

  // 계약변경 화면에서는 '01'(New Loan) 사용안함
  if (formParam.value.applicationTpcd.value === '01') {
    formParam.value.applicationTpcd.value = ''
  }

  contractCurForm.value.money.value = formParam.value.contractAmount.value
  contractCurForm.value.currency.value = formParam.value.currencyCode.value

  if (formParam.value.transactionMode.value === 'NEW') {
    if (formParam.value.contractDate.value === '') {
      formParam.value.contractDate.value = session.sysCurrentBusinessDate
    }
    ajaxUtil.getBranchCodeList()
      .then(function (codeData) {
        if (codeData && Array.isArray(codeData)) {
          const matchingCode = codeData.find(item => item.code === session.sysBranchCode)
          const matchingValue = matchingCode.codeValue
          formParam.value.registBrnm.value = matchingValue
          formParam.value.manageBrnm.value = matchingValue
          formParam.value.registBrcd.value = session.sysBranchCode
          formParam.value.manageBrcd.value = session.sysBranchCode
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
      })

    ajaxUtil.getEmployeeNoList()
      .then(function (codeData) {
        if (codeData && Array.isArray(codeData)) {
          const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
          const matchingValue = matchingCode.codeValue
          formParam.value.registEmployeeNm.value = matchingValue
          formParam.value.manageEmployeeNm.value = matchingValue
          formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
        }
      })
      .catch(function (error) {
        console.error('Error:', error)
      })

    formParam.value.registDate.value = session.sysCurrentBusinessDate
    formParam.value.manageDate.value = session.sysCurrentBusinessDate
  }
  applicationNoChange(formParam.value.applicationNo.value)
  authorLineInquiry()
  collateralListInquiry()
  guaranteeListInquiry()
  attachListInquiry()
  changeApc(formParam.value.applicationTpcd.value)

  if (formParam.value.transactionMode.value === 'INQUIRY' && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  } else {
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  }

  if (formParam.value.transactionMode.value === 'NEW' && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    apcTypeDisable.value = false
  } else {
    apcTypeDisable.value = true
  }
}

const search = () => {
  const data = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCNT012', searchParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response && Object.keys(response).length === 0) {
        const _alertInfo = () => {
          formParam.value.transactionMode.value = 'NEW'
          updateTrxnMode()
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        freeformUtil.clear(formParam)
        setApplicationData(response)
        updateTrxnMode()
      }
    })
}

watch(
  () => [formParam.value.baseRate.value, formParam.value.spreadRate.value],

  () => {
    formParam.value.interest.value = Number(formParam.value.baseRate.value) + Number(formParam.value.spreadRate.value)
  },
  { immediate: true }
)

watch(
  () => [formParam.value.applicationTpcd.value],

  () => {
    // 대출 상품정보(Product)의 만기일자 범위 계산
    if (formParam.value.applicationTpcd.value === '04' || formParam.value.applicationTpcd.value === '05') {
      const minYear = prdParam.value.loanTermYearMin.value
      const minMonth = prdParam.value.loanTermMonthMin.value
      const maxYear = prdParam.value.loanTermYearMax.value
      const maxMonth = prdParam.value.loanTermMonthMax.value

      const contractDate = new Date(formParam.value.contractDate.value)

      let minMaturity = addMonths(addYears(contractDate, minYear), minMonth)
      minMaturity = subDays(minMaturity, 1)
      minMaturityDate.value = dayjs(addDays(minMaturity, 1)).format(commonProp.dateformat.dateType)

      let maxMaturity = addMonths(addYears(contractDate, maxYear), maxMonth)
      maxMaturity = subDays(maxMaturity, 1)
      maxMaturityDate.value = dayjs(addDays(maxMaturity, 1)).format(commonProp.dateformat.dateType)
    }
  }, // minMaturityDate
  { immediate: true }
)

watch(() => formParam.value.changeAmount.value, (newVal) => {
  // 변경신청금액 - 기존계약금액 + 계약잔액
  const result = newVal - formParam.value.contractAmount.value + balanceAmt.value
  if (newVal === 0) {
    balanceCurForm.value.money.value = balanceAmt.value
  } else {
    balanceCurForm.value.money.value = result
  }
})

const setProductCodeData = (event) => {
  const prdSearchParam = ref({
    searchType: {
      value: 'PRODUCT_CODE'
    },
    searchKeyword: {
      value: event.productCode
    },
    searchKind: {
      value: 'ProductType'
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL022', prdSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      interestType.value = data[0].intRateTpcd
      // 신용대출 or 담보대출 여부 체크
      formParam.value.creditClCode.value = data[0].creditClCode
      const creditLoan = '01' // 신용대출
      const colLoan = '02' // 담보대출
      if (formParam.value.creditClCode.value === colLoan) { // 담보대출 일때 true
        checkCollateralFlag.value = true
      } else if (formParam.value.creditClCode.value === creditLoan) {
        checkCollateralFlag.value = false
      }

      data = data[0]
      if (!commonUtil.isEmpty(data)) {
        for (const key in data) {
          if (key in prdParam.value && data[key] !== null) {
            prdParam.value[key].value = data[key]
          }
        }
      }
    })
}

const changeApc = (event) => {
  amountFlag.value = true
  maturityFlag.value = true
  rateFlag.value = true
  baseRateFlag.value = true
  spreadRateFlag.value = true

  changeAmtCurForm.value.money.value = ''
  formParam.value.changeBaseRate.value = ''
  formParam.value.changeBaseRateApplydt.value = ''
  formParam.value.changeBaseRateCode.value = ''
  formParam.value.changeBaseRateName.value = ''
  formParam.value.changeIntRateTpcd.value = ''
  formParam.value.changeMaturityDate.value = ''
  formParam.value.changeSpreadRate.value = ''

  if (formParam.value.transactionMode.value === 'NEW') {
    // '02':증액, '03':감액, '04':만기연장, '05':만기축소, '06':이율변경
    if (event === '02' || event === '03') {
      amountFlag.value = false
    } else if (event === '04' || event === '05') {
      maturityFlag.value = false
    } else if (event === '06') {
      if (interestType.value === '03') { // Product정보의 intRateType이 Optional일 경우만 변경가능
        interestType.value = '01'
        rateFlag.value = false
      } else {
        rateFlag.value = true
        formParam.value.changeIntRateTpcd.value = formParam.value.intRateTpcd.value
        formParam.value.changeBaseRateCode.value = formParam.value.baseRateCode.value
        formParam.value.changeBaseRateName.value = formParam.value.baseRateName.value
        formParam.value.changeBaseRate.value = formParam.value.baseRate.value
        formParam.value.changeBaseRateApplydt.value = formParam.value.baseRateApplydt.value
      }
      spreadRateFlag.value = false
    }
  }
}

const intRateTypeChange = (event) => {
  // '01':Fixed Rate, '02':Variable Rate
  if (event === '01') {
    baseRateFlag.value = true
    formParam.value.changeBaseRateName.value = ''
    formParam.value.changeSpreadRate.value = ''
  }
  if (event === '02') baseRateFlag.value = false
}

const authorLineDatasClear = () => {
  authorLineDataFlag.value = false
}

// 담보 삭제
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

// 보증 삭제
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

// 첨부문서 삭제
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

const rowData = ref([])

const handleMessage = (event) => {
  const contractNo = event.data.initParams.refNo
  if (contractNo.substring(0, 3) === 'LCT') {
    searchParam.value.contractNo.value = contractNo
    search()
  } else {
    formParam.value.transactionMode.value = 'NEW'
    searchParam.value.applicationNo.value = contractNo
    const newSearchParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', searchParam)
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        if (data.length === 0) {
          const _alertInfo = () => {
            rowData.value = []
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
        } else {
          setApplicationData(data[0])
        }
      })
  }
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
</script>
<style scoped>
</style>
