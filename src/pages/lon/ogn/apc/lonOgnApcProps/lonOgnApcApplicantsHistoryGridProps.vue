<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
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
        field: 'contractNo',
        headerName: i18n.global.t('label.objt.contractNo'),
        width: 120,
        type: 'centerAligned',
        pinned: 'left',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 270,
        pinned: 'left',
        editable: false
      },
      {
        field: 'contractDate',
        headerName: i18n.global.t('label.objt.contractDate'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'maturityDate',
        headerName: i18n.global.t('label.objt.maturityDate'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'spreadRate',
        headerName: i18n.global.t('label.view.rate'),
        width: 100,
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
        field: 'contractAmount',
        headerName: i18n.global.t('label.objt.contractAmt'),
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
        field: 'outstanding',
        headerName: i18n.global.t('label.view.outstandingPrincipal'),
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
      }
    ]
  }
}

export { gridProps }
</script>
