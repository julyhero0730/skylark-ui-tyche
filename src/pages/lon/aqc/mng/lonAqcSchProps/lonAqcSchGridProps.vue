<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonUtil } from 'skylark-ui-lib'
// import { commonUtil } from 'boot/commonUtil'
// import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'
// import commonUtil from 'src/boot/commonUtil'

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
        type: 'centerAligned'
      },
      {
        field: 'customer',
        headerName: i18n.global.t('label.objt.customer'),
        width: 200,
        type: 'leftAligned',
        editable: false
      },
      {
        field: 'creditRate',
        headerName: i18n.global.t('label.view.creditRating'),
        width: 50,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'assetReferNo',
        headerName: i18n.global.t('label.view.disbursementNo'),
        width: 140,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 200,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'aqcBasicTpcd',
        headerName: i18n.global.t('label.view.aqcBasicType'),
        type: 'centerAligned',
        width: 110,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcMethodCode, params.value)
        }
      },
      {
        field: 'aqcTypeCodeFinal',
        headerName: i18n.global.t('label.view.finalClassification'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcTypeCode, params.value)
        }
      },
      {
        field: 'openDate',
        headerName: i18n.global.t('label.objt.openDate'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'maturity',
        headerName: i18n.global.t('label.objt.maturityDate'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'pastdueOccurDate',
        headerName: i18n.global.t('label.view.pastDueDate'),
        width: 120,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'currencyCode',
        headerName: i18n.global.t('label.view.ccy'),
        width: 50,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'assetAmount', //
        headerName: i18n.global.t('label.view.classAmt'),
        width: 100,
        type: 'rightAligned',
        editable: false,
        valueFormatter: (params) => {
          return commonUtil.formatNumber(params.value)
        }
      },
      {
        field: 'requestReserveRate', //
        headerName: i18n.global.t('label.view.allowanceRatio'),
        width: 50,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'rsvCurrencyCode', //
        headerName: i18n.global.t('label.view.rsvCurrencyCode'),
        width: 50,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'requestReserveAmount', //
        headerName: i18n.global.t('label.view.requestReserveAmount'),
        width: 100,
        type: 'rightAligned',
        editable: false,
        valueFormatter: (params) => {
          return commonUtil.formatNumber(params.value)
        }
      },
      {
        field: 'aqcCodeSys', //
        headerName: i18n.global.t('label.view.aqcCodeSys'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcTypeCode, params.value)
        }
      },
      {
        field: 'aqcCodeAdj', //
        headerName: i18n.global.t('label.view.adjustmentAqcType'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcTypeCode, params.value)
        }
      },
      {
        field: 'adjustValidityDate', //
        headerName: i18n.global.t('label.view.validDate'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        filed: 'organizationCode',
        hide: true
      },
      {
        filed: 'serialNo',
        hide: true
      }
    ]
  }
}
export { gridProps }
</script>
