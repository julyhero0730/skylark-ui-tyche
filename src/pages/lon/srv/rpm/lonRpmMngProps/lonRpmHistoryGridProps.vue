<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil, commonProp } from 'skylark-ui-lib'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps4 = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  dataHandler: ref('NEW'),
  onGridReady: (params) => {
    gridProps4.gridApi.value = params.api
    gridProps4.gridColumnApi.value = params.columnApi
    params.api.setPinnedBottomRowData(createFooterData(params.api))
    params.api.addEventListener('firstDataRendered', function () {
      params.api.setPinnedBottomRowData(createFooterData(params.api))
    })
    params.api.addEventListener('modelUpdated', function () {
      params.api.setPinnedBottomRowData(createFooterData(params.api))
    })
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
        valueGetter: (params) => { if (params.node.rowPinned !== 'bottom') { return params.node.rowIndex + 1 } },
        // valueGetter: (params) => {
        //   return params.node.rowIndex + 1
        // },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'repaymentNo',
        headerName: i18n.global.t('label.view.repaymentNo'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.node.rowPinned !== 'bottom') {
            return params.data.repaymentNo
          } else {
            return 'Total'
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'repaymentDate',
        headerName: i18n.global.t('label.objt.repaymentDate'),
        width: 135,
        type: 'centerAligned',
        editable: false,
        valueGetter: (params) => {
          if (params.node.rowPinned !== 'bottom') {
            return dayjs(params.data.repaymentDate).format(commonProp.dateformat.dateType)
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'repayPrinIntCode',
        headerName: i18n.global.t('label.objt.repaymentType'),
        width: 150,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonRepayPrincpleInterestCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 70,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.currencyTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'totalRepayAmt',
        headerName: i18n.global.t('label.objt.totalRepayAmt'),
        width: 150,
        type: 'rightAligned',
        editable: false,
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        onCellValueChanged: (params) => {
          gridProps4.gridApi.value.setPinnedBottomRowData(createFooterData(gridProps4.gridApi.value))
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
          return params.data.repayTypeCode !== null ? params.data.repayTypeCode : '01'
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
        field: 'principleAmt',
        headerName: i18n.global.t('label.objt.principleRepaid'),
        width: 150,
        type: 'rightAligned',
        editable: false,
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        onCellValueChanged: (params) => {
          gridProps4.gridApi.value.setPinnedBottomRowData(createFooterData(gridProps4.gridApi.value))
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'intAmt',
        headerName: i18n.global.t('label.objt.intRepaid'),
        width: 150,
        type: 'rightAligned',
        editable: false,
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        onCellValueChanged: (params) => {
          gridProps4.gridApi.value.setPinnedBottomRowData(createFooterData(gridProps4.gridApi.value))
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastDueAmt',
        headerName: i18n.global.t('label.objt.pastdueRepaid'),
        width: 150,
        type: 'rightAligned',
        editable: false,
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        onCellValueChanged: (params) => {
          gridProps4.gridApi.value.setPinnedBottomRowData(createFooterData(gridProps4.gridApi.value))
        },
        headerComponent: CommonHeaderMark
      }
    ]
  }
}

const createFooterData = (gridApi) => {
  const result = []
  let model
  let visibleRows = []

  if (gridApi) {
    model = gridApi.getModel()
    visibleRows = model.rowsToDisplay
  }
  if (visibleRows.length > 0) {
    const sum = (col) => visibleRows.reduce((total, row) => total + (row.data[col] || 0), 0)
    result.push({
      totalRepayAmt: sum('totalRepayAmt'),
      principleAmt: sum('principleAmt'),
      intAmt: sum('intAmt'),
      pastDueAmt: sum('pastDueAmt')
    })
  }
  return result
}
export { gridProps4, createFooterData }
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
