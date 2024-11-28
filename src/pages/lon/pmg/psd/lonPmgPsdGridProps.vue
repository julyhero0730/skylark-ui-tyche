<script>
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'
import { ref } from 'vue'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
  },
  columnTypes: gridPropsUtil.getColumnTypes('left'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  /**
   *
   */
  columnDefs (codeList, currencyCode) {
    return [
      {
        headerName: '#',
        width: 50,
        colId: 0,
        valueGetter: (params) => { return params.node.rowIndex + 1 },
        type: 'centerAligned',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'customerInfo',
        headerName: i18n.global.t('label.view.customer'),
        width: 250,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'left' }
      },
      {
        field: 'disbursementNo',
        headerName: i18n.global.t('label.view.disbursementNo'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 500,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'pastdueOccurDate',
        headerName: i18n.global.t('label.view.pastDueDate'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'days',
        headerName: i18n.global.t('label.view.days'),
        width: 90,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'pastdueTypeName',
        headerName: i18n.global.t('label.view.pastDueType'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 80,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'pastduePrincipal',
        headerName: i18n.global.t('label.view.pastDuePrincipal'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'right' },
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
        }
      },
      {
        field: 'pastdueInterest',
        headerName: i18n.global.t('label.view.pastDueInt'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'right' },
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
        }
      }, {
        field: 'disbursementAmt',
        headerName: i18n.global.t('label.view.disbursementAmt'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'right' },
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
        }
      },
      {
        field: 'disbursementDate',
        headerName: i18n.global.t('label.objt.disbursementDate'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'maturityDate',
        headerName: i18n.global.t('label.objt.maturityDate'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'manageBrcd',
        headerName: i18n.global.t('label.view.branch'),
        width: 95,
        type: 'centerAligned',
        editable: false,
        cellStyle: { textAlign: 'center' }
      }
    ]
  }
}

export { gridProps }
</script>
