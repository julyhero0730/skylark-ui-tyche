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
  },
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  /**
   *
   */
  columnDefs (codeList) {
    return [
      {
        headerName: '#',
        width: 50,
        colId: 0,
        valueGetter: (params) => { return params.node.rowIndex + 1 },
        type: 'centerAligned'
      },
      {
        field: 'guaranteeNo',
        headerName: i18n.global.t('label.view.guaranteeNo'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'transactionStatusNm',
        headerName: i18n.global.t('label.view.status'),
        width: 120,
        editable: false
      },
      {
        field: 'guarantorName',
        headerName: i18n.global.t('label.objt.guarantorName'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'borrower',
        headerName: i18n.global.t('label.objt.borrower'),
        width: 150,
        editable: false
      },
      {
        field: 'borrowerRelation',
        headerName: i18n.global.t('label.objt.relationCustomer'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'guaranteeTypeNm',
        headerName: i18n.global.t('label.objt.guaranteeType'),
        width: 150,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.applicationType, params.value)
        },
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'registerDate',
        headerName: i18n.global.t('label.view.registerDate'),
        width: 150,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.progressStatus, params.value)
        },
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'contractDate',
        headerName: i18n.global.t('label.objt.contractDate'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'releaseDate',
        headerName: i18n.global.t('label.objt.releaseDate'),
        width: 150,
        type: 'rightAligned',
        editable: false
      },
      {
        field: 'expireDate',
        headerName: i18n.global.t('label.objt.expireDate'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'guaranteeAmt',
        headerName: i18n.global.t('label.view.guaranteeAmt'),
        width: 200,
        type: 'centerAligned',
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
        field: 'applicationNo',
        headerName: i18n.global.t('label.objt.applicationNo'),
        width: 150,
        type: 'rightAligned',
        editable: false
      },
      {
        field: 'applicationAmount',
        headerName: i18n.global.t('label.view.applAmt'),
        width: 200,
        type: 'centerAligned',
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
        field: 'contractNo',
        headerName: i18n.global.t('label.view.contractNo'),
        width: 150,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'contractAmount',
        headerName: i18n.global.t('label.objt.contractAmt'),
        width: 200,
        type: 'centerAligned',
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
        field: 'manageBrcd',
        headerName: i18n.global.t('label.objt.manageBranch'),
        width: 150,
        type: 'centerAligned',
        editable: false
      }
    ]
  }
}
export { gridProps }
</script>
