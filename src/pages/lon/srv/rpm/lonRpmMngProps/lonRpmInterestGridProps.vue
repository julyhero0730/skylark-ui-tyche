<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil, commonProp } from 'skylark-ui-lib'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps2 = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  dataHandler: ref('INQUIRY'),
  onGridReady: (params) => {
    gridProps2.gridApi.value = params.api
    gridProps2.gridColumnApi.value = params.columnApi
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
    return [{
      headerName: '#',
      width: 40,
      colId: 0,
      valueGetter: (params) => {
        if (params.data.id === 'total') {
          return '' // 합계 행인 경우 빈 문자열 반환
        } else {
          return params.node.rowIndex + 1 // 그 외의 경우에는 행 인덱스 반환
        }
      },
      type: 'centerAligned',
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
      width: 120,
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
      field: 'interestRepayCode',
      headerName: i18n.global.t('label.view.interestPaymentType'),
      width: 150,
      type: 'centerAligned',
      editable: false,
      valueGetter: (params) => {
        if (params.data.id === 'total' || params.value === 'TOTAL') {
          return '' // 합계 행에서는 빈 문자열을 반환합니다.
        } else {
          return params.data.interestRepayCode !== null ? params.data.interestRepayCode : '01'
        }
      },
      valueFormatter: (params) => {
        return gridPropsUtil.lookupValue(codeList.lonRepayInterestCode, params.value)
      },
      valueParser: (params) => {
        return gridPropsUtil.lookupValue(codeList.lonRepayInterestCode, params.value)
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: gridPropsUtil.cellEditorParams(codeList.lonRepayInterestCode),
      headerComponent: CommonHeaderMark
    },
    {
      field: 'intCalcPrinciple',
      headerName: i18n.global.t('label.view.relatedPrincipal'),
      width: 150,
      cellStyle: { textAlign: 'right' },
      valueGetter: (params) => {
        if (params.data.id === 'total' || params.value === 'TOTAL') {
          return '' // 합계 행에서는 빈 문자열을 반환합니다.
        } else {
          return params.data.intCalcPrinciple
        }
      },
      valueFormatter: (params) => {
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
      field: 'intCalcFromDate',
      headerName: i18n.global.t('label.view.fromDate'),
      width: 120,
      type: 'centerAligned',
      editable: false,
      headerComponent: CommonHeaderMark
    },
    {
      field: 'intCalcToDate',
      headerName: i18n.global.t('label.view.toDate'),
      width: 120,
      type: 'centerAligned',
      editable: false,
      headerComponent: CommonHeaderMark
    },
    {
      field: 'intCalcDays',
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
      field: 'intCalcRate',
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
      field: 'schdIntAmt',
      headerName: i18n.global.t('label.view.scheduleInt'),
      width: 150,
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => {
        if (params.data.schdIntAmt === undefined || params.data.schdIntAmt === null || params.data.schdIntAmt === '') {
          params.data.schdIntAmt = 0
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
      field: 'previousInt',
      headerName: i18n.global.t('label.view.prevlouslyInt'),
      width: 150,
      cellStyle: { textAlign: 'right' },
      editable: false,
      valueFormatter: (params) => {
        if (params.data.previousInt === undefined || params.data.previousInt === null || params.data.previousInt === '') {
          params.data.previousInt = 0
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
      field: 'paidInt',
      headerName: i18n.global.t('label.view.repayInt'),
      width: 150,
      cellStyle: { textAlign: 'right' },
      cellEditor: 'agNumberCellEditor',
      cellEditorParams: (params) => {
        const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
        const inputParam = {
          precision: precisionVal
        }
        return inputParam
      },
      valueFormatter: (params) => {
        if (params.data.paidInt === undefined || params.data.paidInt === null || params.data.paidInt === '') {
          params.data.paidInt = 0
        }
        const roundFactorUsed = false
        return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
      },
      onCellValueChanged: params => {
        params.data.remainingInt = Number(params.data.schdIntAmt) - Number(params.data.paidInt) - Number(params.data.previousInt)
        params.api.refreshCells({ rowNodes: [params.node], columns: ['remainingInt'], force: true })
        updateTotalRow()
      },
      editable: (params) => (gridProps2.dataHandler.value === 'NEW') && Number(params.data.schdIntAmt) - Number(params.data.previousInt) !== 0,
      headerComponent: CommonHeaderMark,
      headerComponentParams: { isRequired: true }
    },
    {
      field: 'remainingInt',
      headerName: i18n.global.t('label.view.remainedInt'),
      width: 150,
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) => {
        if (params.data.remainingInt === undefined || params.data.remainingInt === null || params.data.remainingInt === '') {
          params.data.remainingInt = 0
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
  // 모든 행의 schdPrincipalAmt 합계 계산
  const totalSchdIntAmt = gridProps2.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.schdIntAmt || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 previousPrincipal 합계 계산
  const totalPreviousInt = gridProps2.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.previousInt || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 previousPrincipal 합계 계산
  const totalPaidInt = gridProps2.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.paidInt || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 previousPrincipal 합계 계산
  const totalRemainingInt = gridProps2.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.remainingInt || 0)
    } else {
      return sum
    }
  }, 0)

  // 합계 행 찾기 (id나 다른 식별자를 사용)
  const totalRowNode = gridProps2.gridApi.value.getModel().rowsToDisplay.find(node => node.data.id === 'total')

  if (totalRowNode) {
    // 합계 행이 이미 있는 경우: 합계 업데이트
    totalRowNode.data.schdIntAmt = Number(totalSchdIntAmt)
    totalRowNode.data.previousInt = Number(totalPreviousInt)
    totalRowNode.data.paidInt = Number(totalPaidInt)
    totalRowNode.data.remainingInt = Number(totalRemainingInt)
  } else {
    // 합계 행이 없는 경우: 합계 행 추가
    const newRow = {
      id: 'total',
      scheduleDate: '',
      interestRepayCode: '',
      intCalcPrinciple: '',
      intCalcFromDate: '',
      intCalcToDate: '',
      intCalcDays: '',
      intCalcRate: '',
      schdIntAmt: totalSchdIntAmt,
      previousInt: totalPreviousInt,
      paidInt: totalPaidInt,
      remainingInt: totalRemainingInt
    }
    gridProps2.gridApi.value.updateRowData({ add: [newRow] })
  }

  // 그리드 갱신
  gridProps2.gridApi.value.refreshCells()
}

export { gridProps2 }
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
