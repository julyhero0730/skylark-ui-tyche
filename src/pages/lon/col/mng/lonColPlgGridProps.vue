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
        field: 'pledgeNo',
        headerName: i18n.global.t('label.objt.pledgeNo'),
        width: 130,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'pledgeDate',
        headerName: i18n.global.t('label.objt.pledgeDate'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'priority',
        headerName: i18n.global.t('label.objt.priority'),
        width: 90,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'ccycdPledge',
        headerName: i18n.global.t('label.view.ccy'),
        width: 70,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
        editable: false
      },
      {
        field: 'pledgeAmount',
        headerName: i18n.global.t('label.objt.pledgeAmount'),
        width: 150,
        type: 'rightAligned',
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, params.data.ccycdPledge, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(params.data.ccycdPledge, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        editable: false
      },
      {
        field: 'applicationNo',
        headerName: i18n.global.t('label.objt.applicationNo'),
        width: 130,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'contractNo',
        headerName: i18n.global.t('label.objt.contractNo'),
        width: 130,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 70,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
        editable: false
      },
      {
        field: 'contractAmount',
        headerName: i18n.global.t('label.view.contractAmt'),
        width: 150,
        type: 'rightAligned',
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
        editable: false
      },
      {
        field: 'maxValue',
        hide: true
      }
    ]
  }
}

export { gridProps }
</script>
