<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonProp, commonUtil } from 'skylark-ui-lib'
import dayjs from 'dayjs'

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
        field: 'collateralNo',
        headerName: i18n.global.t('label.objt.collateralNo'),
        width: 130,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'collateralTpcd',
        headerName: i18n.global.t('label.objt.collateralType'),
        width: 150,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.collateralTypeCode, params.value)
        },
        editable: false
      },
      {
        field: 'collateralDetailCd',
        headerName: i18n.global.t('label.objt.collateralDetailType'),
        width: 230,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.collateralDetailTypeCode, params.value)
        },
        editable: false
      },
      {
        field: 'customerNo',
        headerName: i18n.global.t('label.objt.borrowerNo'),
        width: 130,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'customerName',
        headerName: i18n.global.t('label.objt.name'),
        width: 250,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'ownerRelationTpcd',
        headerName: i18n.global.t('label.objt.ownerRelation'),
        width: 150,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.ownerRelationRTypeCode, params.value)
        },
        editable: false
      },
      {
        field: 'registerDate',
        headerName: i18n.global.t('label.view.register'),
        type: 'centerAligned',
        width: 100,
        cellRenderer: (params) => {
          return dayjs(params.value).format(commonProp.dateformat.dateType)
        }
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'appraisalAmt',
        headerName: i18n.global.t('label.objt.appraisalAmount'),
        width: 200,
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
        field: 'pledgeNo',
        headerName: i18n.global.t('label.objt.pledgeNo'),
        width: 130,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'pledgeDate',
        headerName: i18n.global.t('label.objt.pledgeDate'),
        type: 'centerAligned',
        width: 100,
        cellRenderer: (params) => {
          return dayjs(params.value).format(commonProp.dateformat.dateType)
        }
      },
      {
        field: 'ccycdPledge',
        headerName: i18n.global.t('label.view.ccy'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'pledgeAmount',
        headerName: i18n.global.t('label.objt.pledgeAmount'),
        width: 200,
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
        field: 'branchName',
        headerName: i18n.global.t('label.view.manageBranch'),
        width: 200,
        type: 'centerAligned',
        editable: false
      }
    ]
  }
}
export { gridProps }
</script>
