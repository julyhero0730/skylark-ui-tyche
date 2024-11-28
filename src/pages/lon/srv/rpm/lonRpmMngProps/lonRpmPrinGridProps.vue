<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil, commonProp } from 'skylark-ui-lib'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  dataHandler: ref('NEW'),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
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
        field: 'repayTypeCode',
        headerName: i18n.global.t('label.view.repaymentType'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.data.repayTypeCode !== null ? params.data.repayTypeCode : '01'
          }
        },
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonRepaymentCode, params.value)
        },
        valueParser: (params) => {
          return gridPropsUtil.lookupKey(codeList.lonRepaymentCode, params.newValue)
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: gridPropsUtil.cellEditorParams(codeList.lonRepaymentCode),
        headerComponent: CommonHeaderMark
      },
      {
        field: 'schdPrincipalAmt',
        headerName: i18n.global.t('label.view.scheduleAmount'),
        width: 170,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          if (params.data.schdPrincipalAmt === undefined || params.data.schdPrincipalAmt === null || params.data.schdPrincipalAmt === '') {
            params.data.schdPrincipalAmt = 0
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
        field: 'previousPrincipal',
        headerName: i18n.global.t('label.view.previouslyRepaidAmt'),
        width: 170,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          if (params.data.previousPrincipal === undefined || params.data.previousPrincipal === null || params.data.previousPrincipal === '') {
            params.data.previousPrincipal = 0
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
        field: 'paidPrincipal',
        headerName: i18n.global.t('label.view.repaymentAmount'),
        width: 170,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          if (params.data.paidPrincipal === undefined || params.data.paidPrincipal === null || params.data.paidPrincipal === '') {
            params.data.paidPrincipal = 0
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
          params.data.remainingPrincipal = Number(params.data.schdPrincipalAmt) - Number(params.data.previousPrincipal) - Number(params.data.paidPrincipal)
          params.api.refreshCells({ rowNodes: [params.node], columns: ['remainingPrincipal'], force: true })
          updateTotalRow()
        },
        editable: (params) => {
          return gridProps.dataHandler.value === 'NEW'
        },
        headerComponent: CommonHeaderMark,
        headerComponentParams: { isRequired: true }
      },
      {
        field: 'remainingPrincipal',
        headerName: i18n.global.t('label.view.remainedAmount'),
        width: 170,
        cellStyle: { textAlign: 'right' },
        valueFormatter: (params) => {
          if (params.data.remainingPrincipal === undefined || params.data.remainingPrincipal === null || params.data.remainingPrincipal === '') {
            params.data.remainingPrincipal = 0
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
  const totalSchdPrincipalAmt = gridProps.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.schdPrincipalAmt || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 previousPrincipal 합계 계산
  const totalPreviousPrincipal = gridProps.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.previousPrincipal || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 previousPrincipal 합계 계산
  const totalPaidPrincipal = gridProps.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.paidPrincipal || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 previousPrincipal 합계 계산
  const totalRemainingPrincipal = gridProps.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.remainingPrincipal || 0)
    } else {
      return sum
    }
  }, 0)

  // 합계 행 찾기 (id나 다른 식별자를 사용)
  const totalRowNode = gridProps.gridApi.value.getModel().rowsToDisplay.find(node => node.data.id === 'total')

  if (totalRowNode) {
    // 합계 행이 이미 있는 경우: 합계 업데이트
    totalRowNode.data.schdPrincipalAmt = totalSchdPrincipalAmt
    totalRowNode.data.previousPrincipal = totalPreviousPrincipal
    totalRowNode.data.paidPrincipal = totalPaidPrincipal
    totalRowNode.data.remainingPrincipal = totalRemainingPrincipal
  } else {
    // 합계 행이 없는 경우: 합계 행 추가
    const newRow = {
      id: 'total',
      scheduleDate: '',
      repaymentType: '',
      schdPrincipalAmt: totalSchdPrincipalAmt,
      previousPrincipal: totalPreviousPrincipal,
      paidPrincipal: totalPaidPrincipal,
      remainingPrincipal: totalRemainingPrincipal
    }
    gridProps.gridApi.value.updateRowData({ add: [newRow] })
  }

  // 그리드 갱신
  gridProps.gridApi.value.refreshCells()
}
export { gridProps }
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
