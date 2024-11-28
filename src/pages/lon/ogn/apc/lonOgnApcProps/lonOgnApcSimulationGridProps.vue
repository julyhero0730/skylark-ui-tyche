<script>
import { ref } from 'vue'
import { i18n } from 'boot/i18n'
import { gridPropsUtil, commonProp, commonUtil } from 'skylark-ui-lib'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'
// import { ajaxUtil } from 'boot/ajaxUtil'

const gridProps = {
  gridApi: ref(null),
  gridColumnApi: ref(null),
  onGridReady: (params) => {
    gridProps.gridApi.value = params.api
    gridProps.gridColumnApi.value = params.columnApi
  },
  components: {
    inputEditor: InputEditor
  },
  columnTypes: gridPropsUtil.getColumnTypes('centered'),
  defaultColDef: gridPropsUtil.getDefaultColDef(200),

  /**
       *
       */
  columnDefs (codeList, currencyCode) {
    return [
      {
        headerName: '#',
        width: 50,
        colId: 0,
        valueGetter: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행인 경우 빈 문자열 반환
          } else {
            return params.node.rowIndex + 1 // 그 외의 경우에는 행 인덱스 반환
          }
        },
        type: 'centerAligned',
        headerComponent: CommonHeaderMark
      },
      {
        field: 'rScheduleDate',
        headerName: i18n.global.t('label.view.schdDate'),
        width: 100,
        type: 'centerAligned',
        editable: params => params.data.repayProgTpcd === '05',
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return dayjs(params.value).format(commonProp.dateformat.dateType)
          }
        },
        valueFormatter: (params) => {
          return dayjs(params.value).format(commonProp.dateformat.dateType)
        },
        cellEditor: 'inputEditor',
        headerComponent: CommonHeaderMark,
        valueSetter: params => {
          const oldValue = params.oldValue
          let newValue = params.newValue
          const year = newValue.slice(0, 4)
          if (year.length > 4) {
            newValue = year.slice(0, 4) + newValue.slice(4)
          }
          if (oldValue !== newValue) {
            const rScheduleDate = dayjs(newValue).format('YYYY-MM-DD')
            const finalDueDate = dayjs(params.data.finalDueDate).format('YYYY-MM-DD')

            // 만기일보다 큰 날짜를 선택한 경우
            if (dayjs(rScheduleDate).isAfter(finalDueDate)) {
              alert('You cannot select a date later than the final due date.')
              return false
            }
            params.data.rScheduleDate = newValue

            // let diffDays
            // let intCalcFromDate
            // let intCalcToDate
            // if (params.node.rowIndex === 0) { // 첫번째 행일 경우 disbursementDate와의 차이 계산
            //   const disbursementDate = dayjs(params.data.disbursementDate).format('YYYY-MM-DD')
            //   diffDays = dayjs(rScheduleDate).diff(dayjs(disbursementDate), 'day')
            //   intCalcFromDate = disbursementDate
            //   intCalcToDate = rScheduleDate
            // } else { // 두번째 행부터는 이전 행의 scheduleDate와의 차이 계산
            //   const prevScheduleDate = dayjs(params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.rScheduleDate).format('YYYY-MM-DD')
            //   diffDays = dayjs(rScheduleDate).diff(dayjs(prevScheduleDate), 'day')
            //   intCalcFromDate = prevScheduleDate
            //   intCalcToDate = rScheduleDate
            // }
            // params.data.intCalcFromDate = intCalcFromDate
            // params.data.intCalcToDate = intCalcToDate
            // params.data.intCalcDays = diffDays

            let calcValue = params.data.disbursementAmt
            if (params.node.rowIndex > 0) {
              const totalSchdPrincipalAmt = params.api.getRenderedNodes().slice(0, params.node.rowIndex).reduce((sum, rowNode) => sum + (rowNode.data.rSchdPrincipalAmt || 0), 0)
              calcValue -= totalSchdPrincipalAmt
              if (calcValue < 0) {
                alert('The amount you entered is greater than the total repayment amount.')
                params.data.rScheduleDate = oldValue // 날짜를 이전 값으로 복구
                return false
              }
            }

            // const rSchdIntAmt = calcValue * (params.data.interestRate / 100) * diffDays / params.data.dayCount
            // params.data.rSchdIntAmt = rSchdIntAmt
            // params.api.refreshCells({ rowNodes: [params.node], columns: ['rSchdIntAmt'], force: true })
            // params.api.refreshCells({ rowNodes: [params.node], columns: ['intCalcDays'], force: true })
            updateTotalRow()
            return true
          }
          return false
        }
      },
      {
        field: 'rIntCalcFromDate',
        headerName: i18n.global.t('label.view.fromDate'),
        type: 'centerAligned',
        width: 100,
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return dayjs(params.value).format(commonProp.dateformat.dateType)
          }
        },
        valueFormatter: (params) => {
          return dayjs(params.value).format(commonProp.dateformat.dateType)
        }
      },
      {
        field: 'rIntCalcToDate',
        headerName: i18n.global.t('label.view.toDate'),
        type: 'centerAligned',
        width: 100,
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return 'Total' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return dayjs(params.value).format(commonProp.dateformat.dateType)
          }
        },
        valueFormatter: (params) => {
          return dayjs(params.value).format(commonProp.dateformat.dateType)
        }
      },
      {
        field: 'rIntCalcDays',
        headerName: i18n.global.t('label.view.intCalcDays'),
        width: 65,
        type: 'centerAligned',
        editable: false,
        cellRenderer: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return params.data.rIntCalcDays
          } else {
            return params.data.rIntCalcDays
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'rTotalPayment',
        headerName: i18n.global.t('label.view.totalAmt'),
        width: 100,
        cellStyle: { textAlign: 'right' },
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return params.data.rTotalPayment
          } else {
            const rSchdPrincipalAmt = Number(params.data.rSchdPrincipalAmt) || 0
            const rSchdIntAmt = Number(params.data.rSchdIntAmt) || 0
            return rSchdPrincipalAmt + rSchdIntAmt
          }
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'rSchdPrincipalAmt',
        headerName: i18n.global.t('label.view.principal'),
        width: 100,
        cellStyle: { textAlign: 'right' },
        editable: params => params.data.repayProgTpcd === '05',
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark,
        valueSetter: params => {
          const oldValue = params.oldValue
          const newValue = params.newValue
          if (oldValue !== newValue) {
            params.data.rSchdPrincipalAmt = newValue
            // const rScheduleDate = dayjs(params.data.rScheduleDate).format('YYYY-MM-DD')

            // let diffDays
            // if (params.node.rowIndex === 0) { // 첫번째 행일 경우 disbursementDate와의 차이 계산
            //   const disbursementDate = dayjs(params.data.disbursementDate).format('YYYY-MM-DD')
            //   diffDays = dayjs(rScheduleDate).diff(dayjs(disbursementDate), 'day')
            // } else { // 두번째 행부터는 이전 행의 scheduleDate와의 차이 계산
            //   const prevScheduleDate = dayjs(params.api.getDisplayedRowAtIndex(params.node.rowIndex - 1).data.rScheduleDate).format('YYYY-MM-DD')
            //   diffDays = dayjs(rScheduleDate).diff(dayjs(prevScheduleDate), 'day')
            // }
            // let totalSchdPrincipalAmt = 0
            // let calcValue = params.data.disbursementAmt
            // if (params.node.rowIndex > 0) {
            //   totalSchdPrincipalAmt = params.api.getRenderedNodes().slice(0, params.node.rowIndex).reduce((sum, rowNode) => sum + (rowNode.data.rSchdPrincipalAmt || 0), 0)
            //   calcValue -= totalSchdPrincipalAmt
            // }

            // 'total' 행과 현재 행을 제외하고 모든 행의 `rSchdPrincipalAmt` 값을 합산
            let totalIncludingNewValue = params.api.getRenderedNodes().reduce((sum, rowNode) => {
              // 'total' 행과 현재 행을 제외
              if (!(rowNode.data.id === 'total' || rowNode.data.value === 'TOTAL') && rowNode !== params.node) {
                return sum + (rowNode.data.rSchdPrincipalAmt || 0)
              }
              return sum
            }, 0)

            // 사용자가 새롭게 입력한 값 추가
            totalIncludingNewValue += newValue
            if (totalIncludingNewValue > params.data.disbursementAmt) {
              alert('The amount you entered is greater than the total repayment amount.')
              params.data.rSchdPrincipalAmt = oldValue
              return false
            }
            // const rSchdIntAmt = calcValue * (params.data.interestRate / 100) * diffDays / params.data.dayCount
            // params.data.rSchdIntAmt = rSchdIntAmt
            // params.api.refreshCells({ rowNodes: [params.node], columns: ['rSchdIntAmt'], force: true })
            // params.api.forEachNode((rowNode, index) => {
            //   if (rowNode.data.repayProgTpcd === '05') {
            //     if (index === 0) {
            //       rowNode.data.rIntCalcPrinciple = rowNode.data.disbursementAmt
            //     } else {
            //       let sumOfPreviousSchdPrincipalAmt = 0
            //       for (let i = 0; i < index; i++) {
            //         sumOfPreviousSchdPrincipalAmt += params.api.getDisplayedRowAtIndex(i).data.rSchdPrincipalAmt
            //       }
            //       rowNode.data.rIntCalcPrinciple = rowNode.data.disbursementAmt - sumOfPreviousSchdPrincipalAmt
            //     }
            //   }
            //   params.api.refreshCells({ rowNodes: [rowNode], columns: ['rIntCalcPrinciple'], force: true })
            // })
            updateTotalRow()
            return true
          }
          return false
        }
      },
      {
        field: 'rSchdIntAmt',
        headerName: i18n.global.t('label.view.interest'),
        width: 100,
        cellStyle: { textAlign: 'right' },
        editable: false,
        valueGetter: (params) => {
          return params.data.rSchdIntAmt
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'rIntCalcPrinciple',
        headerName: i18n.global.t('label.view.relatedPrinciple'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        editable: false,
        valueGetter: (params) => {
          if (params.data.id === 'total' || params.value === 'TOTAL') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            const currentRow = params.data
            if (currentRow.repayProgTpcd === '05') {
              if (params.node.rowIndex === 0) {
                // 첫 행일 경우 disbursementAmt 값을 반환합니다.
                currentRow.rIntCalcPrinciple = currentRow.disbursementAmt
              } else {
                // 첫 행이 아닐 경우 이전 행들의 schdPrincipalAmt의 합을 disbursementAmt에서 빼줍니다.
                let sumOfPreviousSchdPrincipalAmt = 0
                for (let i = 0; i < params.node.rowIndex; i++) {
                  sumOfPreviousSchdPrincipalAmt += params.api.getDisplayedRowAtIndex(i).data.rSchdPrincipalAmt
                }
                currentRow.rIntCalcPrinciple = currentRow.disbursementAmt - sumOfPreviousSchdPrincipalAmt
              }
            }
            return currentRow.rIntCalcPrinciple
            // return params.data.rIntCalcPrinciple
          }
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark
        // valueGetter: (params) => {
        //   return params.data.rIntCalcPrinciple
        // },
        // valueFormatter: (params) => {
        //   const roundFactorUsed = false
        //   return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        // },
        // cellEditor: 'agNumberCellEditor',
        // cellEditorParams: (params) => {
        //   const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
        //   const inputParam = {
        //     precision: precisionVal
        //   }
        //   return inputParam
        // }
      },
      {
        field: 'remainedAmount',
        headerName: i18n.global.t('label.view.remainedAmount'),
        width: 130,
        cellStyle: { textAlign: 'right' },
        editable: false,
        hide: true,
        valueGetter: (params) => {
          const rSchdPrincipalAmt = Number(params.data.rSchdPrincipalAmt) || 0
          const rpmtPrincipalAmt = Number(params.data.rpmtPrincipalAmt) || 0
          const resultData = rSchdPrincipalAmt - rpmtPrincipalAmt
          return (params.data.id === 'total' || params.value === 'TOTAL') ? '' : resultData
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'remainedInt',
        headerName: i18n.global.t('label.view.remainedInt'),
        cellStyle: { textAlign: 'right' },
        width: 120,
        editable: false,
        hide: true,
        valueGetter: (params) => {
          const rSchdIntAmt = Number(params.data.rSchdIntAmt) || 0
          const rpmtIntAmt = Number(params.data.rpmtIntAmt) || 0
          const resultData = rSchdIntAmt - rpmtIntAmt
          return (params.data.id === 'total' || params.value === 'TOTAL') ? '' : resultData
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: (params) => {
          const precisionVal = commonUtil.setPrecision(currencyCode, codeList.brcCurrencyCodeList)
          const inputParam = {
            precision: precisionVal
          }
          return inputParam
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'repayProgTpcd',
        headerName: i18n.global.t('label.view.remainedInt'),
        type: 'centerAligned',
        width: 200,
        hide: true,
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.valueFormatted
          }
        }
      },
      {
        field: 'disbursementNo',
        headerName: i18n.global.t('label.view.remainedInt'),
        type: 'centerAligned',
        width: 200,
        hide: true,
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.valueFormatted
          }
        }
      },
      {
        field: 'pastdueYn',
        headerName: i18n.global.t('label.view.remainedInt'),
        type: 'centerAligned',
        width: 200,
        hide: true,
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.valueFormatted
          }
        }
      },
      {
        field: 'rpmtPrincipalAmt',
        headerName: i18n.global.t('label.view.paidPrincipal'),
        type: 'centerAligned',
        width: 100,
        hide: true,
        // valueFormatter: (params) => {
        //   return new Intl.NumberFormat().format(params.value)
        // },
        valueGetter: (params) => {
          if (params.data.rpmtPrincipalAmt === '' || params.data.rpmtPrincipalAmt === null) {
            params.data.rpmtPrincipalAmt = 0
          }
          return params.data.rpmtPrincipalAmt
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.valueFormatted
          }
        },
        headerComponent: CommonHeaderMark
      },
      {
        field: 'rpmtIntAmt',
        headerName: i18n.global.t('label.view.paidInterest'),
        type: 'centerAligned',
        width: 100,
        hide: true,
        valueGetter: (params) => {
          if (params.data.rpmtIntAmt === '' || params.data.rpmtIntAmt === null) {
            params.data.rpmtIntAmt = 0
          }
          return params.data.rpmtIntAmt
        },
        valueFormatter: (params) => {
          const roundFactorUsed = false
          return commonUtil.balanceFormatter(params, currencyCode, codeList.brcCurrencyCodeList, roundFactorUsed)
        },
        // valueFormatter: (params) => {
        //   return new Intl.NumberFormat().format(params.value)
        // },
        cellRenderer: (params) => {
          if (params.data.id === 'total') {
            return '' // 합계 행에서는 빈 문자열을 반환합니다.
          } else {
            return params.valueFormatted
          }
        },
        headerComponent: CommonHeaderMark
      }
    ]
  }
}
export { gridProps }

const updateTotalRow = () => {
  // 라운딩 이후 잘린 값을 저장할 변수
  // const totalRoundOff = 0

  // 모든 행에 대해 순회
  for (let i = 0; i < gridProps.gridApi.value.getDisplayedRowCount(); i++) {
    const node = gridProps.gridApi.value.getDisplayedRowAtIndex(i)
    const data = node.data
    // 합계 행일 경우 건너뛰기
    if (data.id === 'total') {
      continue
    }
    // 라운딩 처리
    if (data.roundFactor === 'D') {
      data.rSchdIntAmt = Math.floor(Math.abs(Number(data.rSchdIntAmt) / Number(data.roundUnit))) * Number(data.roundUnit)
    } else if (data.roundFactor === 'R') {
      data.rSchdIntAmt = Math.round(Math.abs(Number(data.rSchdIntAmt) / Number(data.roundUnit))) * Number(data.roundUnit)
    } else if (data.roundFactor === 'U') {
      data.rSchdIntAmt = Math.ceil(Math.abs(Number(data.rSchdIntAmt) / Number(data.roundUnit))) * Number(data.roundUnit)
    } else {
      // roundFactor 값이 D, R, U 중 하나가 아닌 경우, 원래의 값 그대로 사용
      data.rSchdIntAmt = Number(data.rSchdIntAmt)
    }
  }

  // 모든 행의 rSchdPrincipalAmt 합계 계산
  const totalSchdPrincipalAmt = gridProps.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.rSchdPrincipalAmt || 0)
    } else {
      return sum
    }
  }, 0)

  // 모든 행의 rSchdIntAmt 합계 계산
  const totalSchdIntAmt = gridProps.gridApi.value.getModel().rowsToDisplay.reduce((sum, node) => {
    if (node.data.id !== 'total') {
      return sum + (node.data.rSchdIntAmt || 0)
    } else {
      return sum
    }
  }, 0)

  // 합계 행 찾기 (id나 다른 식별자를 사용)
  const totalRowNode = gridProps.gridApi.value.getModel().rowsToDisplay.find(node => node.data.id === 'total')
  if (totalRowNode) {
    // 합계 행이 이미 있는 경우: 합계 업데이트
    totalRowNode.data.rSchdPrincipalAmt = totalSchdPrincipalAmt
    totalRowNode.data.rSchdIntAmt = totalSchdIntAmt
  } else {
    // 합계 행이 없는 경우: 합계 행 추가
    const newRow = {
      id: 'total',
      rSchdPrincipalAmt: totalSchdPrincipalAmt,
      rSchdIntAmt: totalSchdIntAmt
      // 다른 열의 합계도 여기에 추가
    }
    gridProps.gridApi.value.updateRowData({ add: [newRow] })
  }

  // 그리드 갱신
  gridProps.gridApi.value.refreshCells()
}

/**
     *
     */
function InputEditor () {}

/**
     *
     */
InputEditor.prototype.init = function (params) {
  this.eInput = document.createElement('input')
  this.eInput.value = params.value
}

/**
     *
     */
InputEditor.prototype.getGui = function () {
  return this.eInput
}

/**
     *
     */
InputEditor.prototype.getValue = function () {
  return this.eInput.value
}
</script>
