<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil, commonProp } from 'skylark-ui-lib'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps3 = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  dataHandler: ref('NEW'),
  onGridReady: (params) => {
    gridProps3.gridApi.value = params.api
    gridProps3.gridColumnApi.value = params.columnApi
  },
  components: {
    inputEditor: InputEditor
  },
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  /**
   *
   */
  columnDefs (codeList, currencyCode) {
    return [
      {
        headerName: '#',
        width: 40,
        colId: 0,
        type: 'centerAligned',
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.node.rowIndex + 1
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'serialNo',
        headerName: i18n.global.t('label.view.serialNo'),
        width: 120,
        type: 'centerAligned',
        hide: true
      },
      {
        field: 'referSerialNo',
        headerName: i18n.global.t('label.view.serialNo'),
        width: 120,
        type: 'centerAligned',
        hide: true
      },
      {
        field: 'scheduleDate',
        headerName: i18n.global.t('label.view.scheduleDate'),
        width: 115,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return 'Total' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return dayjs(params.data.scheduleDate).format(commonProp.dateformat.dateType)
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastDueTypeCode',
        headerName: i18n.global.t('label.view.pastDueType'),
        width: 130,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.data.pastDueTypeCode
          }
        },
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonPastdueTypeCode, params.value)
        },
        valueParser: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonPastdueTypeCode, params.value)
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'relatedPrincipalPastdue',
        headerName: i18n.global.t('label.view.relatedPrincipal'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.data.relatedPrincipalPastdue
          }
        },
        valueFormatter: (params) => {
          if (params.data.relatedPrincipalPastdue === undefined || params.data.relatedPrincipalPastdue === null || params.data.relatedPrincipalPastdue === '') {
            params.data.relatedPrincipalPastdue = 0
          }
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastdueFrdt',
        headerName: i18n.global.t('label.view.fromDate'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return dayjs(params.data.pastdueFrdt).format(commonProp.dateformat.dateType)
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastdueTodt',
        headerName: i18n.global.t('label.view.toDate'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return dayjs(params.data.pastdueTodt).format(commonProp.dateformat.dateType)
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastdueDays',
        headerName: i18n.global.t('label.view.intCalcDays'),
        width: 70,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastdueRate',
        headerName: i18n.global.t('label.view.rate'),
        width: 85,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'accruedPastdue',
        headerName: i18n.global.t('label.view.accruedPastDue'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'collectFlag',
        headerName: i18n.global.t('label.view.collectionFlag'),
        width: 110,
        type: 'centerAligned',
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.data.collectFlag
          }
        },
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonRepayPastdueFlag, params.value)
        },
        valueParser: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonRepayPastdueFlag, params.value)
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: gridPropsUtil.cellEditorParams(codeList.lonRepayPastdueFlag),
        editable: () => (gridProps3.dataHandler.value === 'NEW'),
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastDueAmt',
        headerName: i18n.global.t('label.view.pastDueAmt'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.data.pastDueAmt
          }
        },
        valueFormatter: (params) => {
          if (params.data.pastDueAmt === undefined || params.data.pastDueAmt === null || params.data.pastDueAmt === '') {
            params.data.pastDueAmt = 0
          }
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'paidPastdue',
        headerName: i18n.global.t('label.view.paidPastDue'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          if (params.data.paidPastdue === undefined || params.data.paidPastdue === null || params.data.paidPastdue === '') {
            params.data.paidPastdue = 0
          }
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        onCellValueChanged: params => {
          params.data.remainingPastdue = Number(params.data.pastDueAmt) - Number(params.data.paidPastdue) - Number(params.data.previousPastdue)
          params.api.refreshCells({ rowNodes: [params.node], columns: ['remainingPastdue'], force: true })
          updateTotalRow()
        },
        editable: (params) => (gridProps3.dataHandler.value === 'NEW') && Number(params.data.pastDueAmt) - Number(params.data.previousPastdue) !== 0,
        headerComponent: CommonHeaderMark,
        headerComponentParams: { isRequired: true }
      },
      {
        field: 'previousPastdue',
        headerName: i18n.global.t('label.view.previousPastDue'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.data.previousPastdue
          }
        },
        valueFormatter: (params) => {
          if (params.data.previousPastdue === undefined || params.data.previousPastdue === null || params.data.previousPastdue === '') {
            params.data.previousPastdue = 0
          }
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'remainingPastdue',
        headerName: i18n.global.t('label.view.rernniningPastDue'),
        width: 140,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          if (params.data.remainingPastdue === undefined || params.data.remainingPastdue === null || params.data.remainingPastdue === '') {
            params.data.remainingPastdue = 0
          }
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        editable: false,
        headerComponent: CommonHeaderMark
      }
    ]
  }
}

const updateTotalRow = () => {
  // 모든 행의 pastdueDays 합계 계산
  const totalDays = gridProps3.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.pastdueDays || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 accruedPastdue 합계 계산
  const totalAccruedPastdue = gridProps3.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.accruedPastdue || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 paidPastdue 합계 계산
  const totalPaidPastdue = gridProps3.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.paidPastdue || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 remainingPastdue 합계 계산
  const totalRemainingPastdue = gridProps3.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.remainingPastdue || 0)
    } else {
      return sum
    }
  }, 0)

  // 합계 행 찾기 (id나 다른 식별자를 사용)
  const totalRowNode = gridProps3.gridApi.value.getModel().rowsToDisplay.find(node => node.data.id === 'total')

  if (totalRowNode) {
    // 합계 행이 이미 있는 경우: 합계 업데이트
    totalRowNode.data.pastdueDays = Number(totalDays)
    totalRowNode.data.accruedPastdue = Number(totalAccruedPastdue)
    totalRowNode.data.paidPastdue = Number(totalPaidPastdue)
    totalRowNode.data.remainingPastdue = Number(totalRemainingPastdue)
  } else {
    // 합계 행이 없는 경우: 합계 행 추가
    const newRow = {
      id: 'total',
      scheduleDate: '',
      pastdueTypeCode: '',
      relatedPrincipalPastdue: '',
      pastdueFrdt: '',
      pastdueTodt: '',
      pastdueDays: totalDays,
      pastdueRate: '',
      accruedPastdue: totalAccruedPastdue,
      collectFlag: '',
      pastDueAmt: '',
      paidPastdue: totalPaidPastdue,
      previousPastdue: '',
      remainingPastdue: ''
      // remainingPastdue: totalRemainingPastdue
    }
    gridProps3.gridApi.value.updateRowData({ add: [newRow] })
  }

  // 그리드 갱신
  gridProps3.gridApi.value.refreshCells()
}

export { gridProps3 }
/**
 *
 */
function InputEditor () {}

/**
 *
 */
InputEditor.prototype.init = function (params) {
  this.eInput = document.createElement('input')
  this.eInput.value = params.value
}

/**
 *
 */
InputEditor.prototype.getGui = function () {
  return this.eInput
}

/**
 *
 */
InputEditor.prototype.getValue = function () {
  return this.eInput.value
}
</script>
