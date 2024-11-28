<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  groupUseEntireRow: true,
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
  },
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),
  rowGroupPanelShow: null,
  /**
   *
   */
  columnDefs (codeList) {
    return [
      {
        field: 'applicationNo',
        headerName: i18n.global.t('label.objt.applicationNo'),
        width: 150,
        hide: true,
        type: 'centerAligned',
        editable: false,
        rowGroup: true,
        sortable: true
      },
      {
        field: 'authorizationNo',
        headerName: i18n.global.t('label.objt.authorizationNo'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'employeeNo',
        hide: true
      },
      {
        field: 'employeeName',
        headerName: i18n.global.t('label.objt.authLine'),
        width: 130,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'authorizationDate',
        headerName: i18n.global.t('label.objt.authorizationDate'),
        width: 140,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'authResultCode',
        headerName: i18n.global.t('label.objt.authorizationStatus'),
        width: 140,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.authorizationStatus, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 400,
        // rowGroup: true,
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'prgsStatusCode',
        headerName: i18n.global.t('label.objt.progressStatus'),
        width: 170,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.progressStatus, params.value)
        },
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'customerInfo',
        headerName: i18n.global.t('label.view.customer'),
        width: 190,
        // type: 'centerAligned',
        editable: false,
        valueGetter: params => `[${params.data.customerNo}] ${params.data.customerName}`,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.objt.currency'),
        width: 75,
        type: 'centerAligned',
        valueFormatter: (params) => {
          console.log(params.value)
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
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
        field: 'registBrcd',
        headerName: i18n.global.t('label.view.branch'),
        width: 110,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.branchTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      }
    ]
  }
}
export { gridProps }
</script>
