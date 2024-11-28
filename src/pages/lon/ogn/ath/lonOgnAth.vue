<template>
  <q-header class="header_page_title">
      <div class="title_wrapper">
          <page-title></page-title>
      </div>
  </q-header>
  <q-page-container>
    <q-page class="double_table_container" style="margin: 0px 30px; display: flex; min-height: 1px;">
    <div class="table_container containerWidth25">
    <div class="q-pa-md height80">
      <lonOgnAthLeftPannel
        :form-param="formParam"
        :show-col-search="showColSearch"
        :show-atc-search="showAtcSearch"
        :show-ath-search="showAthSearch"
        :show-apc-search="showApcSearch"
        :show-ato-search="showAtoSearch"
        :is-calendar-open="isCalendarOpen"
        :author-line-comment="authorLineComment"
        :collateral-comment="collateralComment"
        :attach-comment="attachComment"
        :author-line-datas="authorLineDatas"
        :collateral-datas="collateralDatas"
        :guarantee-datas="guaranteeDatas"
        :attached-datas="attachedDatas"
        :author-status="authorStatus"
        :collateral-status="collateralStatus"
        :attached-status="attachedStatus"
        :get-ath-popup-row-data="getAthPopupRowData"
        :get-col-popup-row-data="getColPopupRowData"
        :applicationNo="applicationNo"
        :customer-name="customerName"
        :product-name="productName"
        :loanTerm-year="loanTermYear"
        :loanTerm-month="loanTermMonth"
        :base-rate-code="baseRateCode"
        :spread-rate="spreadRate"
        :grace-prd-year="gracePrdYear"
        :grace-prd-month="gracePrdMonth"
        :amrt-prdMm="amrtPrdMm"
        :regist-date="registDate"
        :contract-no="contractNo"
        :maturity-date="maturityDate"
      ></lonOgnAthLeftPannel>
    </div>
  </div>

  <div class="" style="flex-basis: 75%;">
    <LonOgnAthFreeform
      :form-param="formParam"
      :is-calendar-open="isCalendarOpen"
      :approve="approve"
      :get-apc-popup-row-data="getApcPopupRowData"
      :get-ato-popup-row-data="getAtoPopupRowData"
      :get-ath-popup-row-data="getAthPopupRowData"
      :get-cst-popup-row-data="getCstPopupRowData"
      :update-trxnMode="updateTrxnMode"
      :radio-disable-flag="radioDisableFlag"
      :is-approver-flag="isApproverFlag"
      :session="session"
      :common-code-list="commonCodeList"
      :application-no-change="applicationNoChange"
      :loan-maturity-flag="loanMaturityFlag"
      :variabla-flag="variablaFlag"
      :loan-term-flag="loanTermFlag"
      :show-col-search="showColSearch"
      :show-atc-search="showAtcSearch"
      :show-ath-search="showAthSearch"
      :show-apc-search="showApcSearch"
      :show-ato-search="showAtoSearch"
      :show-cst-search="showCstSearch"
      :model-values="modelValues"
      :applicants-search-result="applicantsSearchResult"
      :history-row-data="historyRowData"
      :past-due-row-data="pastDueRowData"
    ></LonOgnAthFreeform>
      </div>
     </q-page>
    </q-page-container>
</template>
<script setup>

/*
301040 - Loan Authorizaition Management
*/
/* =======================================================
  1. Import Area
======================================================= */
import { reactive, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ajaxUtil, freeformUtil, commonProp, commonUtil, messageBox } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'
import { i18n } from 'boot/i18n'
import lonOgnAthLeftPannel from 'src/pages/lon/ogn/ath/lonOgnAthProps/lonOgnAthLeftPannel.vue'
import LonOgnAthFreeform from './lonOgnAthProps/lonOgnAthFreeform.vue'

/* =======================================================
  2. Global Variable
======================================================= */
const isCalendarOpen = ref(false)
const session = useSessionStore()
const showColSearch = ref(false)
const showAtcSearch = ref(false)
const showApcSearch = ref(false)
const showAthSearch = ref(false)
const showAtoSearch = ref(false)
const showCstSearch = ref(false)
const fromDate = session.sysCurrentBusinessDate
const isPopupVisible1 = ref(true)
const isPopupVisible2 = ref(true)
const isPopupVisible3 = ref(true)
const authorStatus = ref('02')
const collateralStatus = ref('02')
const attachedStatus = ref('02')
const authorLineDatas = ref([])
const collateralDatas = ref([])
const guaranteeDatas = ref([])
const attachedDatas = ref([])
const branchTypeList = ref([])
const applicationNo = ref(null)
const customerName = ref(null)
const productName = ref(null)
const loanTermYear = ref(null)
const loanTermMonth = ref(null)
const baseRateCode = ref(null)
const spreadRate = ref(null)
const gracePrdYear = ref(null)
const gracePrdMonth = ref(null)
const amrtPrdMm = ref(null)
const registDate = ref(null)
const contractNo = ref(null)
const maturityDate = ref(null)
const authorLineComment = ref('Yon can enter if after the application is completed')
const collateralComment = ref('Yon can enter if after the application is completed')
const attachComment = ref('Yon can enter if after the application is completed')
const authorApproveStatus = ref('init')
const loanTermFlag = ref(true)
const loanMaturityFlag = ref(true)
const variablaFlag = ref(true)
const isApproverFlag = ref(true)
const langCode = session.sysLangCd

// 코드값으로 코드내용찾기
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

// 지점 조회
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
        // messageBox.alertInfo(i18n.global.t('msg.nodata.found')).onOk(() => {})
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
  guaranteeNo: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.guaranteeNo')
  },
  applicationDate: {
    value: dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateTimeType),
    initValue: dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateTimeType),
    required: true,
    description: i18n.global.t('label.objt.applicationDate')
  },
  productCode: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.product')
  },
  productName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.product')
  },
  intRateTpcd: {
    value: '02',
    initValue: '02',
    required: true,
    description: i18n.global.t('label.objt.intRateTpcd')
  },
  fundPurposeCode: {
    value: '00001',
    initValue: '00001',
    required: false,
    description: i18n.global.t('label.objt.fundPurposeCode')
  },
  currencyCode: {
    value: '',
    initValue: '',
    required: true,
    description: 'Loan Amount CCY'
  },
  applicationAmount: {
    initValue: '0',
    type: Number,
    required: true,
    description: i18n.global.t('label.objt.applicationAmount')
  },
  creditLineTpcd: {
    value: '02',
    initValue: '02',
    required: true,
    description: i18n.global.t('label.objt.creditLineTpcd')
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
    value: 0,
    initValue: 0,
    type: Number
  },
  baseRateName: {
    value: '',
    initValue: ''
  },
  spreadRate: {
    value: 0,
    initValue: 0,
    type: Number
  },
  interestRate: {
    value: '',
    initValue: '',
    type: Number,
    required: false,
    description: i18n.global.t('label.objt.interestRate')
  },
  repayProgTpcd: {
    value: '02',
    initValue: '02',
    required: false,
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
  registBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true,
    description: i18n.global.t('label.objt.registBrcd')
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true
  },
  registDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateTimeType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateTimeType),
    required: true
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: true
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    initValue: session.sysEmployeeNo,
    required: true
  },
  manageDate: {
    value: dayjs(fromDate).format(commonProp.dateformat.dateTimeType),
    initValue: dayjs(fromDate).format(commonProp.dateformat.dateTimeType),
    required: true
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
  authResultCode: {
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
  approvalLineStaff: {
    value: ''
  },
  conditionList: {
    value: []
  },
  approverOpinions: {
    value: ''
  },
  sortSeq: {
    value: ''
  },
  employeeNo: {
    value: ''
  },
  finalApproverYn: {
    value: ''
  },
  rmk: {
    value: ''
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

const modelValues = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
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

watch(() => modelValues.value.currency.value, (newVal) => {
  formParam.value.currencyCode.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.applicationAmount.value = Number(newVal.replace(/,/g, ''))
})

// 첨부문서 조회
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

// 담보 조회
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

// 보증 목록 조회
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

// 결재선 조회
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
            authResultCode: data.authResultCode,
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
    value: false,
    type: Boolean
  },
  deleteRadio: {
    value: false,
    type: Boolean
  }
})

const updateTrxnMode = (event) => {
  const approveUser = formParam.value.approvalLineStaff.value
  const prevMode = formParam.value.transactionMode.value
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event
  // 신규모드 입력시, 여신 신청 번호로 내용 조회 가능 (결재로 조회 불가능)
  if (transactionMode === 'NEW' && prevMode !== event && event !== undefined) {
    setApproverFlag()
    if (isApproverFlag.value) search(formParam.value.applicationNo.value)
  // 조회모드 입력시, 여신 결재 번호로 내용 조회 가능
  } else if (transactionMode === 'INQUIRY' && prevMode !== event && event !== undefined) {
    setApproverFlag()
    search(formParam.value.applicationNo.value)
  // 접속자가 결재자여야 수정 가능
  } else if (transactionMode === 'UPDATE') {
    formParam.value.transactionMode.value = approveUser !== session.sysUserName ? 'INQUIRY' : 'UPDATE'
    setApproverFlag()
  // 접속자가 결재자여야 삭제 가능
  } else if (transactionMode === 'DELETE') formParam.value.transactionMode.value = approveUser !== session.sysUserName ? 'INQUIRY' : 'DELETE'
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
  authorizationStatus: ref([]),
  customerTypeCode: ref([]),
  customerDetailTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})
ajaxUtil.getCodeList('SHOWROWS, LON_APPROVAL_RESULT_CODE, LON_COLLATERAL_TYPE_CODE, LON_APPLICATION_TYPE_CODE, LON_APL_PROGRESS_STCD, LON_INTEREST_RATE_CODE, LON_FUND_PURPOSE_CODE, CREDIT_LINE_TYPE_CODE, LON_PERIOD_TYPE, LON_REPAY_METHOD_CODE, LON_RPMT_SOURCE_CODE, CUSTOMER_TYPE_CODE, CUSTOMER_DETAIL_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.applicationTpcd = codeData.lonApplicationTypeCode
    commonCodeList.prgsStatusCode = codeData.lonAplProgressStcd
    commonCodeList.creditLineTpcd = codeData.creditLineTypeCode
    commonCodeList.fundPurposeCode = codeData.lonFundPurposeCode
    commonCodeList.loanPrdTpcd = codeData.lonPeriodType
    commonCodeList.repayProgTpcd = codeData.lonRepayMethodCode
    commonCodeList.repaySourceCode = codeData.lonRpmtSourceCode
    commonCodeList.intRateType = codeData.lonInterestRateCode
    commonCodeList.collateralTpcd = codeData.lonCollateralTypeCode
    commonCodeList.authorizationStatus = codeData.lonApprovalResultCode
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

// To Do List 생성 이벤트
const makeTodoList = (msg, referMenu, target) => {
  const searchData = ref({
    todoTitle: { value: msg },
    todoMemo: { value: msg },
    todoStatusCode: { value: '01' },
    todoDuedate: { value: dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateType) },
    referMenuId: { value: referMenu },
    target: { value: target },
    finalApproverYn: { value: formParam.value.finalApproverYn.value },
    applicationNo: { value: formParam.value.applicationNo.value },
    referNo: { value: formParam.value.applicationNo.value }
  })
  const saveParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH039', searchData)
  ajaxUtil.ajaxServiceCall(saveParam)
    .then((response) => { })
}

/* =======================================================
  7. Freeform Funtion
======================================================= */
// 내용 입력 후 승인 버튼 클릭 이벤트
const approve = () => {
  if (isApproverFlag.value !== false || commonUtil.isEmpty(formParam.value.authResultCode.value)) {
    // messageBox.alertError(i18n.global.t('msg.info.noChanageData')).onOk(() => {
    // })
    messageBox.alertError(i18n.global.t('msg.info.noChanageData'))
    return
  }
  const _confirm = () => {
    const tmpAuthResult = formParam.value.authResultCode.value
    // 날짜 포맷팅
    formParam.value.authorizationDate.value = dayjs(formParam.value.authorizationDate.value).format(commonProp.dateformat.dateType)
    formParam.value.approverOpinions.value = commonUtil.isEmpty(formParam.value.approverOpinions.value) ? '' : formParam.value.approverOpinions.value
    formParam.value.sortSeq.value = commonUtil.isEmpty(formParam.value.sortSeq.value) ? '' : formParam.value.sortSeq.value
    // 결재 처리
    const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH019', formParam)
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (response) {
        // 1. 여신 신청 결재 내역에 Insert [수정중]
        // * 여신신청, 계약변경신청 최종승인 후 refMenuId 301060으로 기안자 TODO에 등록
        // 2. 결재 내용에 따라 To do List 생성
        // 2-1) 승인인 경우, 다음 결재자 또는 신청자에게 생성
        if (tmpAuthResult === '01') {
          if (formParam.value.finalApproverYn.value === 'Y') makeTodoList(i18n.global.t('msg.confirm.newLoanContract', [formParam.value.applicationNo.value]), '301060', 'INCHARGE')
          else makeTodoList(i18n.global.t('msg.confirm.todoApprove', [formParam.value.applicationNo.value]), '301040', 'NEXT')
        // 2-2) 조건부 승인인 경우, 신청자에게 생성
        } else if (tmpAuthResult === '02') {
          makeTodoList(i18n.global.t('msg.confirm.todoConApproved', [formParam.value.applicationNo.value]), '301020', 'INCHARGE')
        // 2-3) 거절인 경우, 신청자에게 생성
        } else if (tmpAuthResult === '03') {
          makeTodoList(i18n.global.t('msg.confirm.todoRejected', [formParam.value.applicationNo.value]), '301020', 'INCHARGE')
        }
        search(response)
      })
      .catch((error) => {
        // messageBox.alertAjaxError(error).onOk(() => { })
        messageBox.alertAjaxError(error)
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

/* =======================================================
  9. popup
======================================================= */

const getAthPopupRowData = (event) => {
  formParam.value.approvalLineStaff.value = session.sysUserName
  formParam.value.employeeNo.value = event._value.approveEmployeeNo.value
  formParam.value.authorizationDate.value = event._value.authorizationDate.value
  formParam.value.authResultCode.value = event._value.authorizationStatus.value
  formParam.value.conditionList.value = event._value.conditionList.value.value
  formParam.value.sortSeq.value = event._value.sortSeq.value
  formParam.value.approverOpinions.value = event._value.approverOpinions.value
  formParam.value.finalApproverYn.value = event._value.finalApproverYn.value
  formParam.value.authorizationNo.value = event._value.authorizationNo.value
}
const getAtoPopupRowData = (event) => {
  if (event.length === undefined) {
    setApplicationData(event)
  } else {
    setApplicationData(event[0])
  }
}
const getColPopupRowData = (event) => {
  if (formParam.value.applicationNo.value) collateralListInquiry()
}
const getApcPopupRowData = (event) => {
  if (event.length === undefined) {
    setApplicationData(event)
  } else {
    setApplicationData(event[0])
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
// 좌측 사이드 데이터 초기화
const setDisableSide = () => {
  const ment = 'Yon can enter if after the application is completed'
  authorStatus.value = '02'
  collateralStatus.value = '02'
  attachedStatus.value = '02'
  isPopupVisible1.value = true
  isPopupVisible2.value = true
  isPopupVisible3.value = true
  authorLineComment.value = ment
  collateralComment.value = ment
  attachComment.value = ment
}

// 좌측 결재 데이터 변경
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
  } else if (commonUtil.isEmpty(formParam.value.applicationNo.value)) { // 선등록 필요
    setDisableSide()
  } else {
    authorStatus.value = '03' // 미등록
    authorLineComment.value = 'No Attached Data'
  }
}

// 좌측 담보 데이터 변경
const updateColData = () => {
  isPopupVisible2.value = false
  if (collateralDatas.value.length > 0 || guaranteeDatas.value.length > 0) { // 기등록
    collateralStatus.value = '01'
  } else if (commonUtil.isEmpty(formParam.value.applicationNo.value)) {
    setDisableSide()
  } else {
    collateralStatus.value = '03' // 미등록
    collateralComment.value = 'No Collateral Data'
  }
}

// 좌측 첨부문서 데이터 변경
const updateAttachData = () => {
  isPopupVisible3.value = false
  if (attachedDatas.value.length > 0) { // 기등록
    attachedStatus.value = '01'
  } else if (commonUtil.isEmpty(formParam.value.applicationNo.value)) {
    setDisableSide()
  } else {
    attachedStatus.value = '03' // 미등록
    attachComment.value = 'No Attached Data'
  }
}

// 신청번호 변경 이벤트
const applicationNoChange = (data) => {
  updateAuthData()
  updateColData()
  updateAttachData()
}

// 신청 및 결재 데이터 세팅
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
  formParam.value.creditLineTpcd.value = data.creditLineTpcd
  formParam.value.spreadRate.value = data.spreadRate
  formParam.value.intRateTpcd.value = data.intRateTpcd
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
  formParam.value.approvalLineStaff.value = data.employeeName
  formParam.value.authorizationNo.value = data.authorizationNo
  formParam.value.authorizationDate.value = data.authorizationDate
  formParam.value.authResultCode.value = !commonUtil.isEmpty(data.authResultCode) ? data.authResultCode : ''
  applicationNoChange(data.applicationNo)
  authorLineInquiry()
  collateralListInquiry()
  guaranteeListInquiry()
  attachListInquiry()
  setApproverFlag()
}

// 접속 대상, 결재자 여부 확인
const setApproverFlag = () => {
  const data = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH032', formParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (!commonUtil.isEmpty(response)) {
        const trMode = formParam.value.transactionMode.value
        formParam.value.finalApproverYn.value = response.finalApproverNo === session.sysEmployeeNo ? 'Y' : ''
        // 접속자 === 최종결재자
        if (session.sysEmployeeNo === response.finalEmployeeNo) {
          if (trMode === 'NEW' || trMode === 'UPDATE') isApproverFlag.value = false
          else isApproverFlag.value = true
          // 접속자 === 직전결재자 && 최종결재자가 아직 결재하지 않음
        } else if ((session.sysEmployeeNo === response.prevEmployeeNo) && commonUtil.isEmpty(response.finalAuthResultCode)) {
          if (trMode === 'UPDATE' || trMode === 'DELETE') isApproverFlag.value = false
          else isApproverFlag.value = true
        } else isApproverFlag.value = true
      }
    })
}

// 신청 또는 결재로 조회 가능
const search = (ref) => {
  if (!commonUtil.isEmpty(ref)) {
    const prefix = ref.substring(0, 3)
    let service = ''
    let method = ''
    if (prefix === 'LAP') {
      formParam.value.applicationNo.value = ref
      service = 'bsLonOrgAplService'
      method = 'LONORGAPL002'
    } else if (prefix === 'LAU') {
      formParam.value.authorizationNo.value = ref
      service = 'bsLonOrgAthService'
      method = 'LONORGATH042'
      formParam.value.maxValue.value = '0'
      formParam.value.fetchSize.value = 100
    }
    const data = commonUtil.inputValueToJson(service, method, formParam)
    ajaxUtil.ajaxServiceData(data)
      .then(function (response) {
        if (commonUtil.isEmpty(response)) {
          const _alertInfo = () => {
            formParam.value.transactionMode.value = 'NEW'
            updateTrxnMode()
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
        } else {
          formParam.value.transactionMode.value = prefix === 'LAP' ? 'NEW' : 'INQUIRY'
          updateTrxnMode()
          freeformUtil.clear(formParam)
          if (prefix === 'LAP') setApplicationData(response)
          else if (prefix === 'LAU') setApplicationData(response[0])
        }
      })
  }
}

const handleMessage = (event) => {
  const receivedData = event.data.initParams.refNo
  search(receivedData)
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
.double_input_box {
    display: flex;
    gap: 10px;
    width: 100%;
}

.double_input_box > * {
    flex: 1;
}
</style>
