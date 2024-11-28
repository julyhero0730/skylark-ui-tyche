<script>
import { i18n } from 'boot/i18n'
import { gridPropsUtil } from 'skylark-ui-lib'
import { ref } from 'vue'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'

const gridProps2 = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps2.gridApi.value = params.api
    gridProps2.gridColumnApi.value = params.columnApi
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
        field: 'transactionType',
        headerName: i18n.global.t('label.view.transactionType'),
        width: 170,
        type: 'centerAligned',
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
        field: 'evaluationDate',
        headerName: i18n.global.t('label.objt.evaluationDate'),
        width: 170,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'expireDate',
        headerName: i18n.global.t('label.objt.expireDate'),
        width: 170,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      },
      {
        field: 'releaseDate',
        headerName: i18n.global.t('label.objt.releaseDate'),
        width: 170,
        type: 'centerAligned',
        editable: false,
        headerComponent: CommonHeaderMark
      }
    ]
  }
}

export { gridProps2 }
</script>
