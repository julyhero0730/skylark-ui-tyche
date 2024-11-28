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
  /**
   *
   */
  columnDefs (codeList) {
    return [
      {
        headerName: '#',
        width: 45,
        colId: 0,
        valueGetter: (params) => { return params.node.rowIndex + 1 },
        type: 'centerAligned',
        pinned: 'left',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'applicationNo',
        headerName: i18n.global.t('label.objt.applicationNo'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        pinned: 'left',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 400,
        editable: false,
        pinned: 'left',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'customerInfo',
        headerName: i18n.global.t('label.view.customer'),
        width: 190,
        // type: 'centerAligned',
        editable: false,
        pinned: 'left',
        valueGetter: params => `[${params.data.customerNo}] ${params.data.customerName}`,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'applicationDate',
        headerName: i18n.global.t('label.objt.applicationDate'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'applicationTpcd',
        headerName: i18n.global.t('label.objt.applicationType'),
        width: 120,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.applicationType, params.value)
        },
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'prgsStatusCode',
        headerName: i18n.global.t('label.objt.progressStatus'),
        width: 160,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.progressStatus, params.value)
        },
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.objt.currency'),
        width: 75,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'applicationAmount',
        headerName: i18n.global.t('label.objt.amount'),
        width: 120,
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
        headerComponent: CommonHeaderMark
      },
      {
        field: 'contractNo',
        headerName: i18n.global.t('label.objt.contractNo'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'fundPurposeCode',
        headerName: i18n.global.t('label.objt.fundPurpose'),
        width: 150,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.fundPurpose, params.value)
        },
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'decision',
        headerName: i18n.global.t('label.objt.decision'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'manageBrcd',
        headerName: i18n.global.t('label.objt.managementBranch'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.branchTypeCode, params.value)
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'manageEmployeeNo',
        headerName: i18n.global.t('label.objt.employee'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.employeeTypeCode, params.value)
        },
        headerComponent: CommonHeaderMark
      }
    ]
  }
}
export { gridProps }
</script>
