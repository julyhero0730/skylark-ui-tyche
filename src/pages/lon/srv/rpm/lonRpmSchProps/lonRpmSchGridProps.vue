<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  // groupUseEntireRow: true,
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
  },
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  // rowGroupPanelShow: null,
  // autoGroupColumnDef: {
  //   headerName: ''
  // },
  /**
   *
   */
  columnDefs (codeList) {
    return [
      {
        headerName: '#',
        width: 50,
        colId: 0,
        type: 'centerAligned',
        valueGetter: (params) => {
          return params.node.rowIndex + 1
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'repaymentNo',
        headerName: i18n.global.t('label.view.repaymentNo'),
        width: 140,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'disbursementNo',
        headerName: i18n.global.t('label.view.disbursementNo'),
        width: 160,
        // hide: true,
        type: 'centerAligned',
        // editable: false,
        // rowGroup: true,
        sortable: true
      },
      {
        field: 'customerInfo',
        headerName: i18n.global.t('label.view.customer'),
        width: 250,
        // hide: true,
        type: 'leftAligned',
        editable: false,
        // rowGroup: true,
        // sortable: true,
        valueGetter: params => `[${params.data.customerNo}] ${params.data.customerName}`
      },
      {
        field: 'repaymentDate',
        headerName: i18n.global.t('label.objt.repaymentDate'),
        width: 148,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'repayPrinIntCode',
        headerName: i18n.global.t('label.objt.repaymentType'),
        width: 200,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonRepayPrincpleInterestCode, params.value)
        },
        editable: false
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 75,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.currencyTypeCode, params.value)
        },
        editable: false
      },
      {
        field: 'totalRepayAmt',
        headerName: i18n.global.t('label.objt.totalRepayAmt'),
        width: 155,
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
        }
      },
      {
        field: 'principleAmt',
        headerName: i18n.global.t('label.objt.principleRepaid'),
        width: 155,
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
        }
      },
      {
        field: 'intAmt',
        headerName: i18n.global.t('label.objt.intRepaid'),
        width: 155,
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
        }
      },
      {
        field: 'pastDueAmt',
        headerName: i18n.global.t('label.objt.pastdueRepaid'),
        width: 155,
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
        }
      }
    ]
  }
}
export { gridProps }
</script>
