<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
    params.api.addEventListener('modelUpdated', function () {
      params.api.setPinnedBottomRowData(createFooterData(params.api))
    })
  },
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  getRowStyle: (params) => {
    if (params.node.rowPinned === 'bottom') {
      return {
        fontWeight: 'bold',
        backgroundColor: 'white'
      }
    }
    return null
  },
  /**
   *
   */
  columnDefs (codeList) {
    return [
      {
        headerName: '#',
        width: 50,
        colId: 0,
        valueGetter: (params) => { if (params.node.rowPinned !== 'bottom') { return params.node.rowIndex + 1 } },
        type: 'centerAligned'
      },
      {
        field: 'customerName',
        headerName: i18n.global.t('label.view.loanCustomer'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'contractNo',
        headerName: i18n.global.t('label.objt.loanContract'),
        width: 250,
        editable: false
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.loanProduct'),
        width: 300,
        editable: false
      },
      {
        field: 'guaranteeStatusNm',
        headerName: i18n.global.t('label.objt.guaranteeStatus'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 100,
        editable: false
      },
      {
        field: 'guaranteeAmt',
        headerName: i18n.global.t('label.objt.guaranteeAmount'),
        width: 200,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          if (params.data && params.data.currencyCode) {
            const roundFactorUsed = false
            return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
          }
        },
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        cellRenderer: (params) => {
          const roundFactorUsed = false
          return params.value ? commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed) : ''
        }
      },
      {
        field: 'contractAmount',
        headerName: i18n.global.t('label.objt.contractAmt'),
        width: 200,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          if (params.data && params.data.currencyCode) {
            const roundFactorUsed = false
            return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
          }
        },
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        cellRenderer: (params) => {
          const roundFactorUsed = false
          return params.value ? commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed) : ''
        }
      },
      {
        field: 'contractDate',
        headerName: i18n.global.t('label.objt.contractDate'),
        width: 150,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.progressStatus, params.value)
        },
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'maturityDate',
        headerName: i18n.global.t('label.objt.maturityDate'),
        width: 150,
        type: 'centerAligned',
        editable: false
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
      guaranteeAmount: sum('guaranteeAmount'),
      contractAmount: sum('contractAmount')
    })
  }
  return result
}
export { gridProps, createFooterData }
// export { gridProps }
</script>
