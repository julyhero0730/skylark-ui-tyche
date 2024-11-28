<script>
import { i18n } from 'boot/i18n'
import { gridPropsUtil } from 'skylark-ui-lib'
import { ref } from 'vue'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
  },
  columnTypes: gridPropsUtil.getColumnTypes('left'),
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
        field: 'productCode',
        headerName: i18n.global.t('label.view.code'),
        width: 90,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'productName',
        headerName: i18n.global.t('label.objt.productName'),
        width: 550,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'openDate',
        headerName: i18n.global.t('label.objt.openDate'),
        width: 100,
        type: 'centerAligned',
        editable: false
      },
      {
        field: 'closeDate',
        headerName: i18n.global.t('label.objt.closeDate'),
        width: 100,
        type: 'centerAligned',
        editable: false
      }
    ]
  }
}

export { gridProps }
</script>
