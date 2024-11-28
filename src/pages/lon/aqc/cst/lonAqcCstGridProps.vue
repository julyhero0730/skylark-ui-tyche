<script>
import { i18n } from 'boot/i18n'
import { gridPropsUtil } from 'skylark-ui-lib'
import { ref } from 'vue'
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
        valueGetter: (params) => { return params.node.rowIndex + 1 },
        type: 'centerAligned',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'baseDate',
        hide: true
      },
      {
        field: 'customerNo',
        headerName: i18n.global.t('label.objt.customerNo'),
        width: 110,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'customerName',
        headerName: i18n.global.t('label.objt.customerName'),
        width: 130,
        suppressSizeToFit: true,
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'customerTypeCode',
        headerName: i18n.global.t('label.objt.customerTypeCode'),
        width: 130,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.customerTypeCode, params.value)
        }
      },
      {
        field: 'customerDetailTypeCode',
        headerName: i18n.global.t('label.view.customerDetailType'),
        width: 140,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.customerDetailTypeCode, params.value)
        }
      },
      {
        field: 'aqcTypeCodeFinal',
        headerName: i18n.global.t('label.objt.aqcTypeFinal'),
        width: 120,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcTypeCode, params.value)
        }
      },
      {
        field: 'pastdueDate',
        headerName: i18n.global.t('label.objt.pastdueDate'),
        width: 110,
        type: 'centerAligned',
        suppressSizeToFit: true,
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'creditRate',
        headerName: i18n.global.t('label.view.creditRating'),
        width: 100,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonCreditRating, params.value)
        }
      },
      {
        field: 'aqcTypeCodeSys',
        headerName: i18n.global.t('label.objt.aqcTypeSys'),
        width: 140,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcTypeCode, params.value)
        }
      },
      {
        field: 'aqcTypeCodeAdj',
        headerName: i18n.global.t('label.objt.aqcTypeAdj'),
        width: 140,
        type: 'centerAligned',
        editable: false,
        valueFormatter: (params) => {
          return gridPropsUtil.lookupValue(codeList.lonAqcTypeCode, params.value)
        }
      }
    ]
  }
}

export { gridProps }
</script>
