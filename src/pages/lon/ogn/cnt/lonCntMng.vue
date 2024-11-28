<template>
    <q-header class="header_page_title">
        <div class="title_wrapper">
            <page-title></page-title>
        </div>
    </q-header>
    <q-page-container>
    <q-page class="double_table_container" style="margin: 0px 30px; display: flex;">
    <div class="table_container containerWidth25" style="overflow: auto;">
      <div class="q-pa-md height80" style="overflow: auto;">
        <lonCntMngLeftPanel
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
        ></lonCntMngLeftPanel>
      </div>
    </div>

    <div class="" style="flex-basis: 75%;">
        <lonCntMngFreeform
          :formParam="formParam"
          :commonCodeList="commonCodeList"
          :searchParam="searchParam"
          :save="save"
          :updateTrxnMode="updateTrxnMode"
          :radioDisableFlag="radioDisableFlag"
          :cdDisable="cdDisable"
          :applicationNoChange="applicationNoChange"
          :cCDisable="cCDisable"
          :modelValues="modelValues"
          :getApcPopupRowData="getApcPopupRowData"
          :getConPopupRowData="getConPopupRowData"
          :getBirPopupRowData="getBirPopupRowData"
          :getPopupRowData5="getPopupRowData5"
          :getPopupRowData6="getPopupRowData6"
          :getPopupRowData7="getPopupRowData7"
          :getPopupRowData8="getPopupRowData8"
          :getCstPopupRowData="getCstPopupRowData"
          :showApcSearch="showApcSearch"
          :showConSearch="showConSearch"
          :showBirSearch="showBirSearch"
          :showBraSearch1="showBraSearch1"
          :showEmpSearch1="showEmpSearch1"
          :showBraSearch2="showBraSearch2"
          :showEmpSearch2="showEmpSearch2"
          :showCstsearch="showCstSearch"
          :nonTarget="nonTarget"
          :applicants-search-result="applicantsSearchResult"
          :history-row-data="historyRowData"
          :past-due-row-data="pastDueRowData"
        ></lonCntMngFreeform>
          </div>
          </q-page>
    </q-page-container>
  <!-- </q-scroll-area> -->
</template>
<script setup>
/*
301060 - Loan Contract Management
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
import lonCntMngLeftPanel from 'src/pages/lon/ogn/cnt/lonCntMngProps/lonCntMngLeftPanel.vue'
import lonCntMngFreeform from 'src/pages/lon/ogn/cnt/lonCntMngProps/lonCntMngFreeform.vue'

/* =======================================================
    2. Global Variable
======================================================= */

const session = useSessionStore()
const fromDate = session.sysCurrentBusinessDate
const showApvSearch = ref(false)
const showColSearch = ref(false)
const showAtcSearch = ref(false)
const showApcSearch = ref(false)
const showAthSearch = ref(false)
const showConSearch = ref(false)
const showBirSearch = ref(false)
const showBraSearch1 = ref(false)
const showBraSearch2 = ref(false)
const showEmpSearch1 = ref(false)
const showEmpSearch2 = ref(false)
const showCstSearch = ref(false)
const selectedPopupRowData = ref([])
const isPopupVisible1 = ref(true)
const isPopupVisible2 = ref(true)
const isPopupVisible3 = ref(false)
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
const authorLineComment = ref('No Approval Line Data')
const collateralComment = ref('No Collateral & Guarantee Line Data')
const attachComment = ref('No Attached Data')
const authorApproveStatus = ref('init')
const nonTarget = ref(false)
const excludeTarget = ref(true)
const disableFlagObj = reactive({
  nonTarget, excludeTarget
})
const cdDisable = ref(true)
const cCDisable = ref(false)
const langCode = session.sysLangCd

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
    value: '300',
    required: true
  },
  progressStatus: {
    value: '300',
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
  }
})

const formParam = ref({
  applicationNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.applicationNo')
  },
  applicationDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.applicationDate')
  },
  prgsStatusCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.progressStatus')
  },
  contractNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.contractNo')
  },
  contractDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.objt.contractDate')
  },
  applicationTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.applicationType')
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
  creditLineTpcd: {
    value: '',
    required: false,
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
    initValue: 0,
    required: true,
    description: i18n.global.t('label.objt.spread')
  },
  fundPurposeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.fundPurpose')
  },
  loanPrdTpcd: {
    value: '',
    required: true,
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
    value: 0,
    initValue: 0,
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
    required: false,
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
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  registBrnm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  registEmployeeNm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  registDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.objt.registInfo')
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageBrnm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageEmployeeNm: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  manageDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.objt.manageInfo')
  },
  repaySourceCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.repaymentSource')
  },
  maturityDate: {
    value: '',
    required: false,
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

const modelValues = ref({
  currency: {
    value: ''
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
  formParam.value.contractAmount.value = Number(newVal.replace(/,/g, ''))
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
            ccycdPledge: data.ccycdPledge,
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
            currencyCode: data.currencyCode,
            guaranteeTypeCode: data.guaranteeTypeCode
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
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
    freeformUtil.disableControl(false, disableFlagObj)
    freeformUtil.clear(formParam)
    freeformUtil.clear(modelValues)
    attachedDatas.value = []
    authorLineDatas.value = []
    collateralDatas.value = []
    guaranteeDatas.value = []
    // 좌측패널 내용 초기화
    updateAuthData()
    updateColData()
    updateAttachData()
    modelValues.value.currency.value = session.sysBaseCurrency
    formParam.value.registBrcd.value = session.sysBranchCode
    formParam.value.manageBrcd.value = session.sysBranchCode

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
    cCDisable.value = false
  } else if (transactionMode === 'INQUIRY') {
    freeformUtil.disableControl(true, disableFlagObj)
    cCDisable.value = true

    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true

    freeformUtil.clear(formParam)
    freeformUtil.clear(modelValues)
    attachedDatas.value = []
    authorLineDatas.value = []
    collateralDatas.value = []
    guaranteeDatas.value = []
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(false, disableFlagObj)
    cCDisable.value = true
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
    cCDisable.value = true
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
  countryTypeCode: ref([]),
  customerTypeCode: ref([]),
  customerDetailTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

ajaxUtil.getCodeList('SHOWROWS, LON_COLLATERAL_TYPE_CODE, LON_APPLICATION_TYPE_CODE, LON_APL_PROGRESS_STCD, LON_INTEREST_RATE_CODE, LON_FUND_PURPOSE_CODE, CREDIT_LINE_TYPE_CODE, LON_PERIOD_TYPE, LON_REPAY_METHOD_CODE, LON_RPMT_SOURCE_CODE, CUSTOMER_TYPE_CODE, CUSTOMER_DETAIL_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
    commonCodeList.progressStatus = codeData.lonAplProgressStcd
    commonCodeList.loanMethod = codeData.creditLineTypeCode
    commonCodeList.fundPurpose = codeData.lonFundPurposeCode
    commonCodeList.loanPeriodType = codeData.lonPeriodType
    commonCodeList.repaymentProgram = codeData.lonRepayMethodCode
    commonCodeList.repaymentSource = codeData.lonRpmtSourceCode
    commonCodeList.intRateType = codeData.lonInterestRateCode
    commonCodeList.collateralTpcd = codeData.lonCollateralTypeCode
    commonCodeList.customerTypeCode = codeData.customerTypeCode
    commonCodeList.customerDetailTypeCode = codeData.customerDetailTypeCode
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
  })

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
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
  if (formParam.value.registEmployeeNo.value !== session.sysEmployeeNo) {
    messageBox.alertInfo(i18n.global.t('msg.info.managerCheck'))
    return
  }
  if (formParam.value.transactionMode.value === 'NEW') {
    checkParam()
    if (!freeformUtil.checkRequired(formParam, freeformRefs)) return
    formParam.value.prgsStatusCode.value = '500'
    // collateralDatas에서 pledgeStatusCode가 10인 항목이 있는지 확인
    const hasProposed = collateralDatas.value.some(data => data.pledgeStatusCode === '10')
    if (hasProposed) {
      const _confirm = () => {
        const saveParam = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCNT019', formParam)
        ajaxUtil.ajaxServiceData(saveParam)
          .then(function (response) {
            if (!response) {
              messageBox.alertInfo(i18n.global.t('msg.nodata.found')).onOk(() => {
                formParam.value = []
              })
            } else {
              searchParam.value.contractNo.value = response
              search()
            }
          })
      }
      messageBox.confirm('There are items with the pledge status set to Proposed. Do you want to save?', _confirm)
    } else {
      const _confirm = () => {
        const saveParam = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCNT019', formParam)
        ajaxUtil.ajaxServiceData(saveParam)
          .then(function (response) {
            if (!response) {
              messageBox.alertInfo(i18n.global.t('msg.nodata.found')).onOk(() => {
                formParam.value = []
              })
            } else {
              searchParam.value.contractNo.value = response
              search()
            }
          })
      }
      messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
    }
  } else {
    const _confirm = () => {
      const saveParam = commonUtil.inputValueToJson('bsLonOrgCntService', 'LONORGCNT009', formParam)
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
  if (event.length === undefined) {
    searchParam.value.contractNo.value = event.contractNo
  } else {
    searchParam.value.contractNo.value = event[0].contractNo
  }
  search()
}
const getBirPopupRowData = (event) => {
  formParam.value.baseRateName.value = event[0].baseRateName
  formParam.value.baseRateCode.value = event[0].baseRateCode
  formParam.value.baseRate.value = event[0].baseRate
  formParam.value.baseRateApplydt.value = event[0].applyDate
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
  isPopupVisible1.value = false
  if (authorLineDatas.value.length > 0) { // 기등록
    authorStatus.value = '01'
    authorLineDatas.value.forEach((data, index) => {
      const list = []
      list.value = data
      if (list.value.status !== 'Progress' && index !== 0) {
        isPopupVisible1.value = true
        authorApproveStatus.value = 'approved'
      }
    })
  }
}

const updateColData = () => {
  isPopupVisible2.value = false
  if (collateralDatas.value.length > 0 || guaranteeDatas.value.length > 0) { // 기등록
    collateralStatus.value = '01'
  }
}

const updateAttachData = () => {
  isPopupVisible3.value = false
  if (attachedDatas.value.length > 0) { // 기등록
    attachedStatus.value = '01'
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

const prgsStatusCode100Message = '"Please complete the approval process first."'
const prgsStatusCode200Message = '"Authorization is in progress. Please continue with the approval process."'
const prgsStatusCode210Message = '"Your application is conditionally approved. You cannot proceed with the contract yet."'
const prgsStatusCode900Message = '"Your application has been declined. Please review the details and try again."'
const alreadyRegContractMessage = '"The contract registration has already been completed."'
const getApcPopupRowData = (event) => {
  if (event.length === undefined) { // Direct Search로 Application검색 했을경우
    switch (event.prgsStatusCode) {
      case '000': // Application Status
        messageBox.alertInfo(prgsStatusCode100Message)
        break
      case '200': // Authorization In Progress
        messageBox.alertInfo(prgsStatusCode200Message)
        break
      case '210': // Conditional Approved
        messageBox.alertInfo(prgsStatusCode210Message)
        break
      case '300':
        if (event.contractNo) {
          messageBox.alertInfo(alreadyRegContractMessage)
        } else {
          setApplicationData(event)
        }
        break
      case '500': // Contract Completed
        if (event.contractNo) {
          messageBox.alertInfo(alreadyRegContractMessage)
        } else {
          setApplicationData(event)
        }
        break
      case '900': // Declined
        messageBox.alertInfo(prgsStatusCode900Message)
        break
    }
  } else { // Apc 팝업창에서 Application 선택했을 경우
    switch (event[0].prgsStatusCode) {
      case '000': // Application Status
        messageBox.alertInfo(prgsStatusCode100Message)
        break
      case '200': // Authorization In Progress
        messageBox.alertInfo(prgsStatusCode200Message)
        break
      case '210': // Conditional Approved
        messageBox.alertInfo(prgsStatusCode210Message)
        break
      case '300':
        if (event[0].contractNo) {
          messageBox.alertInfo(alreadyRegContractMessage)
        } else {
          setApplicationData(event[0])
        }
        break
      case '500': // Contract Completed
        if (event[0].contractNo) {
          messageBox.alertInfo(alreadyRegContractMessage)
        } else {
          setApplicationData(event[0])
        }
        break
      case '900': // Declined
        messageBox.alertInfo(prgsStatusCode900Message)
        break
    }
  }
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

const applicationNoChange = (data) => {
  updateAuthData()
  updateColData()
  updateAttachData()
}

const setApplicationData = async (data) => {
  if (formParam.value.transactionMode.value === 'NEW') {
    updateTrxnMode()
  }
  modelValues.value.currency.value = ''
  await nextTick()

  for (const key in data) {
    if (key in formParam.value && data[key] !== null) {
      formParam.value[key].value = data[key]
    }
  }
  modelValues.value.money.value = formParam.value.contractAmount.value
  modelValues.value.currency.value = formParam.value.currencyCode.value
  if (formParam.value.transactionMode.value === 'NEW') {
    if (formParam.value.contractDate.value === '') {
      formParam.value.contractDate.value = session.sysCurrentBusinessDate
    }
    modelValues.value.money.value = data.applicationAmount
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

    // ajaxUtil.getEmployeeNoList()
    //   .then(function (codeData) {
    //     if (codeData && Array.isArray(codeData)) {
    //       const matchingCode = codeData.find(item => item.code === session.sysEmployeeNo)
    //       const matchingValue = matchingCode.codeValue
    //       formParam.value.registEmployeeNm.value = matchingValue
    //       formParam.value.manageEmployeeNm.value = matchingValue
    //       formParam.value.registEmployeeNo.value = session.sysEmployeeNo
    //       formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
    //     }
    //   })
    //   .catch(function (error) {
    //     console.error('Error:', error)
    //   })

    formParam.value.registDate.value = session.sysCurrentBusinessDate
    formParam.value.manageDate.value = session.sysCurrentBusinessDate
  }
  applicationNoChange(formParam.value.applicationNo.value)
  authorLineInquiry()
  collateralListInquiry()
  guaranteeListInquiry()
  attachListInquiry()

  if (!commonUtil.isEmpty(formParam.value.contractNo.value) && formParam.value.registEmployeeNo.value === session.sysEmployeeNo) {
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
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
        formParam.value.transactionMode.value = 'INQUIRY'
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
  () => formParam.value.intRateTpcd.value,
  (newValue) => {
    if (newValue === '01') {
      formParam.value.baseRate.value = ''
      formParam.value.baseRateName.value = ''
      formParam.value.baseRateCode.value = ''
      formParam.value.baseRateApplydt.value = ''
    }
  },
  { immediate: true }
)

watch(
  () => [formParam.value.contractDate.value, formParam.value.loanPrdTpcd.value],

  () => {
    if (formParam.value.loanPrdTpcd.value === '01') {
      const contractDate = new Date(formParam.value.contractDate.value)
      let yearTerm = 0
      if (formParam.value.loanTermYear.value !== null && formParam.value.loanTermYear.value !== '') {
        yearTerm = parseInt(formParam.value.loanTermYear.value)
      }

      let monthTerm = 0
      if (formParam.value.loanTermMonth.value !== null && formParam.value.loanTermMonth.value !== '') {
        monthTerm = parseInt(formParam.value.loanTermMonth.value)
      }

      let maturityDate = addMonths(addYears(contractDate, yearTerm), monthTerm)
      maturityDate = subDays(maturityDate, 1)
      formParam.value.maturityDate.value = dayjs(addDays(maturityDate, 1)).format(commonProp.dateformat.dateType)
    }
  },
  { immediate: true }
)
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

const setApplicantsData = async (data) => {
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
<style scoped>
</style>
