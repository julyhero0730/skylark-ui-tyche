<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps2 = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps2.gridApi.value = params.api
    gridProps2.gridColumnApi.value = params.columnApi
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

  columnDefs (codeList) {
    return [
      {
        headerName: '#',
        width: 50,
        colId: 0,
        valueGetter: (params) => { if (params.node.rowPinned !== 'bottom') { return params.node.rowIndex + 1 } },
        pinned: 'left',
        type: 'centerAligned',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'disbursementNo',
        headerName: i18n.global.t('label.view.disbursementNo'),
        width: 120,
        type: 'centerAligned',
        pinned: 'left',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 250,
        pinned: 'left',
        editable: false
      },
      {
        field: 'pastdueStatus',
        headerName: i18n.global.t('label.view.pastDueStatus'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastdueOccurDate',
        headerName: i18n.global.t('label.view.pastDueDate'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'pastdueDays',
        headerName: i18n.global.t('label.view.pastdueDays'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 50,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'disbursementAmt',
        headerName: i18n.global.t('label.view.disbursementAmount'),
        width: 150,
        type: 'rightAligned',
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, params.data.currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.currencyCode, codeList.currencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'recoveryDate',
        headerName: i18n.global.t('label.view.recoveredDate'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      }
    ]
  }
}

export { gridProps2 }
</script>
