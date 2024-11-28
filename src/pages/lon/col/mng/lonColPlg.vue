<template>
  <top-search-pane
      v-model="searchParam"
      :paneObject="topSearchPaneObject"
      :useSearch="true"
      :searchFunc="search"
      :useClear="true"
      :clearFunc="clear"
      @showSearchPopup="showSearchPopup"
    ></top-search-pane>
    <lonHlpCol :collateral-Status-Cd=searchParam.collateralStatusCd.value v-model="showColSearch" @selected-popup-row-data = "getPopupRowData"></lonHlpCol>

    <q-page-container>
        <q-page class="double_table_container" style=" margin: 0px 30px; min-height: 1px;">
          <div class="table_container">
            <lonColPlgGrid
              :search-param="searchParam"
              :common-code-list="commonCodeList"
              :next-search="nextSearch"
              :all-search="allSearch"
              :on-selection-changed="onSelectionChanged"
              :row-data="rowData"
              :row-counts="rowCounts"
            ></lonColPlgGrid>
          </div>
          <div class="table_container_2">
            <lonColPlgFreeform
              :formParam="formParam"
              :searchParam="searchParam"
              :showColSearch1="showColSearch1"
              :showCstSearch="showCstSearch"
              :showApcSearch="showApcSearch"
              :showConSearch="showConSearch"
              :showBraSearch1="showBraSearch1"
              :showEmpSearch1="showEmpSearch1"
              :showEmpSearch2="showEmpSearch2"
              :showBraSearch2="showBraSearch2"
              :radioDisableFlag="radioDisableFlag"
              :cdDisable="cdDisable"
              :commonCodeList="commonCodeList"
              :nonTarget="nonTarget"
              :modelValues="modelValues"
              :modelValues2="modelValues2"
              :error="error"
              :errorMessage="errorMessage"
              :modelValues3="modelValues3"
              :modelValues4="modelValues4"
              :modelValues5="modelValues5"
              :modelValues6="modelValues6"
              :save="save"
              :updateTrxnMode="updateTrxnMode"
              :getPopupRowData1="getPopupRowData1"
              :getPopupRowData2="getPopupRowData2"
              :getPopupRowData3="getPopupRowData3"
              :getPopupRowData4="getPopupRowData4"
              :getPopupRowData5="getPopupRowData5"
              :getPopupRowData6="getPopupRowData6"
              :getPopupRowData7="getPopupRowData7"
              :getPopupRowData8="getPopupRowData8"
              :selectedPopupRowData="selectedPopupRowData"
              :rowData:="rowData"
            ></lonColPlgFreeform>
          </div>
        </q-page>
    </q-page-container>
</template>
<script setup>
/*
    303030 - Pledge Management

    Index.
    1. Import Area
    2. Global Variable
    3. Common Code Adapter
    4. Grid Props
    5. Grid Function
    6. Freeform Object
    7. Freeform Funtion
    8. Business Function
    9. popup
    10. TabKey event
    11. Loading Module
*/

/* =======================================================
    1. Import Area
======================================================= */
import { reactive, ref, watch, nextTick, computed } from 'vue'
import { i18n } from 'boot/i18n'
import { commonUtil, ajaxUtil, messageBox, freeformUtil, gridPropsUtil } from 'skylark-ui-lib'
import { gridProps } from 'src/pages/lon/col/mng/lonColPlgGridProps.vue'
import { useSessionStore } from 'stores/session'
import lonHlpCol from 'src/components/pages/main/hlp/lon/lonHlpCol.vue'
import lonColPlgGrid from 'src/pages/lon/col/mng/lonColPlgProps/lonColPlgGrid.vue'
import lonColPlgFreeform from 'src/pages/lon/col/mng/lonColPlgProps/lonColPlgFreeform.vue'
/* =======================================================
    2. Global Variable
======================================================= */
// 전역변수 선언
const session = useSessionStore()
const rowData = ref([])
const rowCounts = ref([])
rowCounts.value = ref(0)
const cdDisable = ref(true)

/* =======================================================
    3. Common Code Adapter
======================================================= */
// Code List 선언 및 Code Data 맵핑
const commonCodeList = reactive({
  fetchSizeList: ref([]),
  pledgeStatusListCode: ref([]),
  countryTypeCode: ref([]),
  brcCurrencyCodeList: ref([])
})

ajaxUtil.getCurrencyCodeForBranch()
  .then(function (codeData) {
    commonCodeList.brcCurrencyCodeList = codeData
  })

ajaxUtil.getCodeList('SHOWROWS,LON_PLEDGE_STATUS_CODE,LON_PLEDGE_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.pledgeStatusListCode = codeData.lonPledgeStatusCode
    commonCodeList.fetchSizeList.value = codeData.showrows
    commonCodeList.pledgeTypeListCode = codeData.lonPledgeTypeCode
  })

ajaxUtil.getCurrencyCode()
  .then(function (codeData) {
    commonCodeList.countryTypeCode = codeData
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
    4. Grid Props
======================================================= */
const searchParam = ref({
  collateralNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralNo')
  },
  collateralTitleName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  collateralStatusCd: {
    value: '01',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  progressStatus: {
    value: '000',
    required: false,
    description: i18n.global.t('label.objt.progressStatus')
  },
  searchKeyword: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  fetchSize: {
    value: 100,
    required: false,
    description: i18n.global.t('label.view.showRows')
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  helpSearchType: {
    value: 'lonHlpCol',
    required: false,
    description: ''
  }
})

/* =======================================================
    5. Grid Function
======================================================= */
const clear = () => {
  searchParam.value.searchKeyword.value = ''
  searchParam.value.fetchSize.value = 100
  searchParam.value.maxValue.value = 0
  rowCounts.value = 0
  rowData.value = []
  formParam.value.transactionMode.value = 'NEW'
  updateTrxnMode()
}

const search = () => {
  if (!freeformUtil.checkRequired(searchParam, freeformRefs)) return
  if (formParam.value.transactionMode.value === 'UPDATE') {
    formParam.value.transactionMode.value = 'UPDATE'
  } else if (formParam.value.transactionMode.value === 'NEW') {
    updateTrxnMode()
  }
  const newSearchParam = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG022', searchParam)

  return new Promise((resolve, reject) => {
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        if (data.length === 0) {
          const _alertInfoNodata = () => {
            rowData.value = []
            rowCounts.value = 0
          }
          messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoNodata)
        } else {
          rowData.value = []
          rowCounts.value = 0
          rowData.value = data
          rowCounts.value = data.length
        }
        resolve(rowData.value)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

const nextSearch = () => {
  gridPropsUtil.nextSearchRow(gridProps.gridApi.value, 'bsLonColPlgService', 'LONCOLPLG022', searchParam, rowCounts)
}

const allSearch = () => {
  gridPropsUtil.allSearchRow(gridProps.gridApi.value, 'bsLonColPlgService', 'LONCOLPLG022', searchParam, rowCounts)
}

/* =======================================================
    6. Freeform Object
======================================================= */
// Freeform Dom 접근을 위한 Refs 객체 선언
const configId = ref(null)
const configObjectType = ref(null)
const configDesc = ref(null)
const usedYn = ref(null)
const freeformRefs = {
  configId, configObjectType, configDesc, usedYn
}
// Freeform Disable 기능을 위한 객체 선언
const nonTarget = ref(false)
const excludeTarget = ref(true)
const disableFlagObj = reactive({
  nonTarget, excludeTarget
})

const radioDisableFlag = ref({
  newRadio: {
    value: false,
    type: Boolean
  },
  inquiryRadio: {
    value: true,
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

const formParam = ref({
  pledgeNo: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.pledgeNo')
  },
  pledgeStatusCode: {
    value: '10',
    initValue: '10',
    required: true,
    description: i18n.global.t('label.objt.pledgeStatus')
  },
  pledgeTpcd: {
    value: '01',
    initValue: '01',
    required: true,
    description: i18n.global.t('label.objt.pledgeType')
  },
  collateralNo: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.collateralNo')
  },
  collateralTitleName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.collateralNo')
  },
  customerNo: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.loanCustomer')
  },
  customerName: {
    value: '',
    initValue: '',
    required: true,
    description: i18n.global.t('label.view.loanCustomer')
  },
  priority: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.priority')
  },
  pledgeDate: {
    value: session.sysCurrentBusinessDate,
    initValue: session.sysCurrentBusinessDate,
    required: true,
    description: i18n.global.t('label.objt.pledgeDate')
  },
  //   pledgeProposedDate: {
  //     value: session.sysCurrentBusinessDate,
  //     initValue: session.sysCurrentBusinessDate,
  //     required: true,
  //     description: i18n.global.t('label.objt.pledgeDate')
  //   },
  expireDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.expireDate')
  },
  releaseDate: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.releaseDate')
  },
  applicationNo: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.applicationNo')
  },
  contractNo: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.contractNo')
  },
  ccycdAppraisal: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.objt.reviewedAmount')
  },
  appraisalAmount: {
    value: '0',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.reviewedAmount')
  },
  ccycdPledge: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.objt.pledgeAmount')
  },
  pledgeAmount: {
    value: '0',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.pledgeAmount')
  },
  recognitionRatio: {
    value: 100,
    initValue: 100,
    required: true,
    description: i18n.global.t('label.objt.collateralRecogRatio')
  },
  ccycdOurPrior: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.objt.ourComPriorLien')
  },
  ourPriorLien: {
    value: '0',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.ourComPriorLien')
  },
  ccycdColVal: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.objt.colValue')
  },
  collateralValue: {
    value: '0',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.colValue')
  },
  ccycdOthersPrior: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.objt.otherComPriorLen')
  },
  othersPriorLien: {
    value: '0',
    initValue: '',
    required: false,
    description: i18n.global.t('label.objt.otherComPriorLen')
  },
  ccycdMaxpledge: {
    value: session.sysBaseCurrency,
    initValue: session.sysBaseCurrency,
    required: true,
    description: i18n.global.t('label.objt.maxPledgeAMT')
  },
  maxPledgeAmt: {
    value: '0',
    initValue: '',
    required: true,
    description: i18n.global.t('label.objt.maxPledgeAMT')
  },
  rmk: {
    value: '',
    initValue: '',
    required: false,
    description: i18n.global.t('label.view.remark')
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
  createDatetime: {
    value: new Date(),
    initValue: new Date(),
    required: false,
    description: i18n.global.t('label.objt.createDate')
  },
  createUserId: {
    value: session.sysUserId,
    initValue: session.sysUserId,
    required: false,
    description: i18n.global.t('label.objt.createUser')
  },
  updateDatetime: {
    value: new Date(),
    initValue: new Date(),
    required: false,
    description: i18n.global.t('label.objt.updateDate')
  },
  updateUserId: {
    value: session.sysUserId,
    initValue: session.sysUserId,
    required: false,
    description: i18n.global.t('label.objt.updateUser')
  },
  transactionMode: {
    value: 'NEW',
    required: true
  }
})

const modelValues = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues.value.currency.value, (newVal) => {
  formParam.value.ccycdAppraisal.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.appraisalAmount.value = Number(newVal.replace(/,/g, ''))
})

const modelValues2 = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues2.value.currency.value, (newVal) => {
  formParam.value.ccycdPledge.value = newVal
})

watch(() => modelValues2.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.pledgeAmount.value = Number(newVal.replace(/,/g, ''))
})

const modelValues3 = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues3.value.currency.value, (newVal) => {
  formParam.value.ccycdOurPrior.value = newVal
})

watch(() => modelValues3.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.ourPriorLien.value = Number(newVal.replace(/,/g, ''))
})

const modelValues4 = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues4.value.currency.value, (newVal) => {
  formParam.value.ccycdColVal.value = newVal
})

watch(() => modelValues4.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.collateralValue.value = Number(newVal.replace(/,/g, ''))
})

const modelValues5 = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues5.value.currency.value, (newVal) => {
  formParam.value.ccycdOthersPrior.value = newVal
})

watch(() => modelValues5.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.othersPriorLien.value = Number(newVal.replace(/,/g, ''))
})

const modelValues6 = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => modelValues6.value.currency.value, (newVal) => {
  formParam.value.ccycdMaxpledge.value = newVal
})

watch(() => modelValues6.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.maxPledgeAmt.value = Number(newVal.replace(/,/g, ''))
})
/* =======================================================
   7. Freeform Funtion
======================================================= */
const showColSearch = ref(false)
const showColSearch1 = ref(false)
const showCstSearch = ref(false)
const showBraSearch1 = ref(false)
const showBraSearch2 = ref(false)
const showEmpSearch1 = ref(false)
const showEmpSearch2 = ref(false)
const selectedPopupRowData = ref([])
const checkParam = () => {
  if (formParam.value.pledgeStatusCode.value === '10') {
    formParam.value.applicationNo.required = true
    formParam.value.contractNo.required = false
  } else if (formParam.value.pledgeStatusCode.value === '20') {
    formParam.value.contractNo.required = true
    formParam.value.applicationNo.required = false
  }
}

const save = () => {
  checkParam()
  if (error.value) {
    // errorMessage를 alert하고 함수를 종료합니다.
    messageBox.alertInfo(errorMessage)
    return
  }
  if (formParam.value.appraisalAmount.value === 0) {
    formParam.value.appraisalAmount.value = ''
  }
  if (formParam.value.pledgeAmount.value === 0) {
    formParam.value.pledgeAmount.value = ''
  }
  if (formParam.value.recognitionRatio.value === 0) {
    formParam.value.recognitionRatio.value = ''
  }
  if (formParam.value.collateralValue.value === 0) {
    formParam.value.collateralValue.value = ''
  }

  if (!freeformUtil.checkRequired(formParam, freeformRefs)) return
  const _confirm = () => {
    if (formParam.value.transactionMode.value === 'NEW') {
      const saveParam = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG019', formParam)
      ajaxUtil.ajaxServiceData(saveParam)
        .then(function (response) {
          if (!response) {
            const _alertInfoNodata = () => {
              formParam.value = []
            }
            messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfoNodata)
          } else {
            formParam.value.pledgeNo.value = response
            formParam.value.transactionMode.value = 'INQUIRY'
            const targetPledgeNo = formParam.value.pledgeNo.value
            search().then(rows => {
              const selectedRow = rows.find(row => row.pledgeNo === targetPledgeNo)
              if (selectedRow) {
                gridProps.gridApi.value.forEachNode(node => {
                  if (node.data.pledgeNo === selectedRow.pledgeNo) {
                    node.setSelected(true)
                    onSelectionChanged({ source: 'rowClicked' })
                  }
                })
              }
            })
          }
        })
    } else if (formParam.value.transactionMode.value === 'UPDATE' || formParam.value.transactionMode.value === 'DELETE') {
      const saveParam = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG009', formParam)
      ajaxUtil.ajaxServiceCall(saveParam)
        .then((response) => {
          const _alertAjaxSuccess = () => {
            if (formParam.value.transactionMode.value === 'DELETE') {
              formParam.value.transactionMode.value = 'NEW'
              search()
            } else {
              console.log(response)
              const targetPledgeNo = formParam.value.pledgeNo.value
              search().then(rows => {
                const selectedRow = rows.find(row => row.pledgeNo === targetPledgeNo)
                if (selectedRow) {
                  gridProps.gridApi.value.forEachNode(node => {
                    if (node.data.pledgeNo === selectedRow.pledgeNo) {
                      node.setSelected(true)
                      onSelectionChanged({ source: 'rowClicked' })
                    }
                  })
                } else {
                  const highestPledgedRow = rows.reduce((prev, current) =>
                    (prev.pledgeNo > current.pledgeNo) ? prev : current)
                  console.log(highestPledgedRow.pledgeNo)
                  gridProps.gridApi.value.forEachNode((node) => {
                    console.log(node.data.pledgeNo)
                    if (node.data.pledgeNo === highestPledgedRow.pledgeNo) {
                      node.setSelected(true)
                      onSelectionChanged({ source: 'rowClicked' })
                    }
                  })
                }
              })
            }
          }
          messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
        })
        .catch((error) => {
          messageBox.alertAjaxError(error)
        })
    }
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

const onSelectionChanged = async (values) => {
  if (values.source === 'rowClicked') {
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    freeformUtil.clear(modelValues4)
    freeformUtil.clear(modelValues5)
    freeformUtil.clear(modelValues6)
    formParam.value.transactionMode.value = 'INQUIRY'
    updateTrxnMode()
    await nextTick()
    const selectedRows = gridProps.gridApi.value.getSelectedRows()
    freeformUtil.selectedRowDataToFreeformData(selectedRows[0], formParam.value)
    modelValues.value.currency.value = formParam.value.ccycdAppraisal.value
    modelValues.value.money.value = formParam.value.appraisalAmount.value
    modelValues2.value.currency.value = formParam.value.ccycdPledge.value
    modelValues2.value.money.value = formParam.value.pledgeAmount.value
    modelValues3.value.currency.value = formParam.value.ccycdOurPrior.value
    modelValues3.value.money.value = formParam.value.ourPriorLien.value
    modelValues4.value.currency.value = formParam.value.ccycdColVal.value
    modelValues4.value.money.value = formParam.value.collateralValue.value
    modelValues5.value.currency.value = formParam.value.ccycdOthersPrior.value
    modelValues5.value.money.value = formParam.value.othersPriorLien.value
    modelValues6.value.currency.value = formParam.value.ccycdMaxpledge.value
    modelValues6.value.money.value = formParam.value.maxPledgeAmt.value
  }
}

const getPopupRowData = (event) => {
  selectedPopupRowData.value = event[0]
  searchParam.value.collateralNo.value = selectedPopupRowData.value.collateralNo
  searchParam.value.collateralTitleName.value = selectedPopupRowData.value.collateralTitleName
  search()
}

const getPopupRowData1 = async (event) => {
  freeformUtil.clear(modelValues)
  freeformUtil.clear(modelValues2)
  freeformUtil.clear(modelValues3)
  freeformUtil.clear(modelValues4)
  freeformUtil.clear(modelValues5)
  freeformUtil.clear(modelValues6)
  await nextTick()
  selectedPopupRowData.value = event[0]
  formParam.value.collateralNo.value = selectedPopupRowData.value.collateralNo
  formParam.value.collateralTitleName.value = selectedPopupRowData.value.collateralTitleName
  formParam.value.customerNo.value = selectedPopupRowData.value.customerNo
  formParam.value.customerName.value = selectedPopupRowData.value.customerName
  modelValues.value.currency.value = selectedPopupRowData.value.currencyCode
  modelValues2.value.currency.value = selectedPopupRowData.value.currencyCode
  modelValues4.value.currency.value = selectedPopupRowData.value.currencyCode
  modelValues5.value.currency.value = selectedPopupRowData.value.currencyCode
  modelValues6.value.currency.value = selectedPopupRowData.value.currencyCode
  modelValues.value.money.value = selectedPopupRowData.value.appraisalAmt
  const data = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG032', formParam)
  ajaxUtil.ajaxServiceData(data)
    .then(function (response) {
      if (response && Object.keys(response).length === 0) {
        modelValues3.value.money.value = 0
      } else {
        for (const key in response) {
          if (key in formParam.value && response[key] !== null) {
            formParam.value[key].value = response[key]
          }
        }
        modelValues3.value.currency.value = modelValues.value.currency.value
        modelValues3.value.money.value = formParam.value.ourPriorLien.value
      }
    })
}

const getPopupRowData2 = (event) => {
  selectedPopupRowData.value = event[0]
  formParam.value.customerNo.value = selectedPopupRowData.value.customerNo
  formParam.value.customerName.value = selectedPopupRowData.value.customerName
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

const executeSequentially = async () => {
  const newSearchParam = commonUtil.inputValueToJson('bsLonColMngService', 'LONCOLMNG002', searchParam)
  const response1 = await ajaxUtil.ajaxServiceData(newSearchParam)
  if (response1 && Object.keys(response1).length === 0) {
    freeformUtil.clear(formParam)
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    freeformUtil.clear(modelValues4)
    freeformUtil.clear(modelValues5)
    freeformUtil.clear(modelValues6)
  } else {
    freeformUtil.clear(formParam)
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    freeformUtil.clear(modelValues4)
    freeformUtil.clear(modelValues5)
    freeformUtil.clear(modelValues6)
    await nextTick()
    const fieldMapping = {
      collateralNo: 'collateralNo',
      collateralTitleName: 'collateralTitleName',
      customerNo: 'customerNo',
      customerName: 'customerName',
      appraisalAmt: 'appraisalAmount',
      currencyCode: 'ccycdAppraisal'
    }
    for (const responseField in fieldMapping) {
      if (responseField in response1 && response1[responseField] !== null) {
        const formField = fieldMapping[responseField]
        formParam.value[formField].value = response1[responseField]
      }
    }
    modelValues.value.currency.value = formParam.value.ccycdAppraisal.value
    modelValues.value.money.value = formParam.value.appraisalAmount.value
  }

  const data = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG032', formParam)
  const response2 = await ajaxUtil.ajaxServiceData(data)

  if (response2 && Object.keys(response2).length === 0) {
    modelValues3.value.money.value = 0
  } else {
    for (const key in response2) {
      if (key in formParam.value && response2[key] !== null) {
        formParam.value[key].value = response2[key]
      }
    }
    modelValues2.value.currency.value = formParam.value.ccycdAppraisal.value
    modelValues2.value.money.value = formParam.value.pledgeAmount.value
    modelValues3.value.currency.value = formParam.value.ccycdAppraisal.value
    modelValues3.value.money.value = formParam.value.ourPriorLien.value
    modelValues4.value.currency.value = formParam.value.ccycdAppraisal.value
    modelValues5.value.currency.value = formParam.value.ccycdAppraisal.value
    modelValues5.value.money.value = formParam.value.othersPriorLien.value
  }
}

const updateTrxnMode = (event) => {
  const transactionMode = (event === undefined) ? formParam.value.transactionMode.value : event

  if (transactionMode === 'NEW') {
    freeformUtil.disableControl(false, disableFlagObj)
    freeformUtil.clear(modelValues)
    freeformUtil.clear(modelValues2)
    freeformUtil.clear(modelValues3)
    freeformUtil.clear(modelValues4)
    freeformUtil.clear(modelValues5)
    freeformUtil.clear(modelValues6)
    gridProps.gridApi.value.deselectAll()
    formParam.value.pledgeStatusCode.value = '10'
    formParam.value.pledgeDate.value = session.sysCurrentBusinessDate
    // formParam.value.pledgeProposedDate.value = session.sysCurrentBusinessDate
    formParam.value.registDate.value = session.sysCurrentBusinessDate
    formParam.value.manageDate.value = session.sysCurrentBusinessDate
    formParam.value.recognitionRatio.value = 100
    modelValues.value.currency.value = session.sysBaseCurrency
    modelValues2.value.currency.value = session.sysBaseCurrency
    modelValues3.value.currency.value = session.sysBaseCurrency
    modelValues4.value.currency.value = session.sysBaseCurrency
    modelValues5.value.currency.value = session.sysBaseCurrency
    modelValues6.value.currency.value = session.sysBaseCurrency
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
    executeSequentially()
  } else if (transactionMode === 'INQUIRY') {
    freeformUtil.disableControl(true, disableFlagObj)
  } else if (transactionMode === 'UPDATE') {
    freeformUtil.disableControl(false, disableFlagObj)
  } else if (transactionMode === 'DELETE') {
    freeformUtil.disableControl(true, disableFlagObj)
  }
  controllRadioDisable(transactionMode)
}

const controllRadioDisable = (selectedRTransactionMode) => {
  if (selectedRTransactionMode === 'NEW') {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = true
    radioDisableFlag.value.updateRadio.value = true
    radioDisableFlag.value.deleteRadio.value = true
  } else {
    radioDisableFlag.value.newRadio.value = false
    radioDisableFlag.value.inquiryRadio.value = false
    radioDisableFlag.value.updateRadio.value = false
    radioDisableFlag.value.deleteRadio.value = false
  }
}
const error = computed(() => Number(formParam.value.pledgeAmount.value) > Number(formParam.value.maxPledgeAmt.value))
const errorMessage = 'Pledge Amount cannot exceed Max Amount.'

watch(
  () => [formParam.value.collateralValue.value, formParam.value.ourPriorLien.value, formParam.value.othersPriorLien.value],

  async () => {
    if (formParam.value.transactionMode.value !== 'INQUIRY') {
      freeformUtil.clear(modelValues6)
      await nextTick()
      modelValues6.value.money.value = formParam.value.collateralValue.value - (formParam.value.ourPriorLien.value + formParam.value.othersPriorLien.value)
      modelValues6.value.currency.value = modelValues.value.currency.value
    }
  },
  { immediate: true }
)

watch(() => formParam.value.appraisalAmount.value, async (newValue) => {
  if (formParam.value.transactionMode.value !== 'INQUIRY') {
    if (formParam.value.recognitionRatio.value !== null) {
      freeformUtil.clear(modelValues4)
      await nextTick()
      modelValues4.value.money.value = newValue * (formParam.value.recognitionRatio.value / 100)
      modelValues4.value.currency.value = modelValues.value.currency.value
    }
  }
})

watch(() => formParam.value.recognitionRatio.value, async (newValue) => {
  if (formParam.value.transactionMode.value !== 'INQUIRY') {
    if (formParam.value.appraisalAmount.value !== null) {
      freeformUtil.clear(modelValues4)
      await nextTick()
      modelValues4.value.money.value = formParam.value.appraisalAmount.value * (newValue / 100)
      modelValues4.value.currency.value = modelValues.value.currency.value
    }
  }
})

const showSearchPopup = (param) => {
  if (param === 'collateralNo') {
    showColSearch.value = true
  }
}

const topSearchPaneObject = ref([
  {
    type: 'label',
    label: i18n.global.t('label.objt.collateralNo')
  },
  {
    type: 'popup',
    model: 'collateralNo'
  },
  {
    type: 'input',
    model: 'collateralTitleName',
    css: 'width: 150px;'
  }
])

</script>
