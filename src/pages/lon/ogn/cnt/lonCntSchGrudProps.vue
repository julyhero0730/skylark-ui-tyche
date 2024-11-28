<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonProp, commonUtil } from 'skylark-ui-lib'
import dayjs from 'dayjs'
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
        field: 'contractNo',
        headerName: i18n.global.t('label.objt.contractNo'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        pinned: 'left',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 400,
        type: 'centerAligned',
        pinned: 'left',
        editable: false
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
        field: 'applicationTpcd',
        headerName: i18n.global.t('label.objt.applicationTpcd'),
        width: 150,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.applicationTpcd, params.value)
        }
      },
      // {
      //   field: 'customerName',
      //   headerName: i18n.global.t('label.view.customer'),
      //   width: 120,
      //   type: 'centerAligned',
      //   editable: false
      // },
      {
        field: 'creditLineTpnm',
        headerName: i18n.global.t('label.objt.loanMethod'),
        width: 100,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'contractDate',
        headerName: i18n.global.t('label.objt.contractDate'),
        width: 100,
        type: 'centerAligned',
        cellRenderer: (params) => {
          return dayjs(params.value).format(commonProp.dateformat.dateType)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 50,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.countryTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'contractAmount',
        headerName: i18n.global.t('label.view.contractAmt'),
        type: 'rightAligned',
        width: 120,
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
        field: 'contractBal',
        headerName: i18n.global.t('label.objt.contractBal'),
        type: 'rightAligned',
        width: 110,
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
        field: 'maturityDate',
        headerName: i18n.global.t('label.objt.maturityDate'),
        width: 100,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'intTypeName',
        headerName: i18n.global.t('label.view.intType'),
        width: 100,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'baseRateName',
        headerName: i18n.global.t('label.objt.variableType'),
        width: 100,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'spreadInterestRate',
        headerName: i18n.global.t('label.objt.spreadInterestRate'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'manageBrcd',
        headerName: i18n.global.t('label.view.branch'),
        type: 'centerAligned',
        width: 85,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.branchTypeCode, params.value)
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'manageEmployeeNo',
        headerName: i18n.global.t('label.objt.employee'),
        width: 130,
        type: 'centerAligned',
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.employeeTypeCode, params.value)
        },
        editable: false,
        headerComponent: CommonHeaderMark
      }
    ]
  }
}
export { gridProps }
</script>
