<template>
  <div class="table_top_button_wrapper" style="margin-bottom: 10px;">
                    <CommonRadioGroup v-model="scheduleParam.transactionMode.value" :useSave="true" :saveFunc="repaysave" :selectFunc="updateTrxnMode2" :radioDisableFlag="radioDisableFlag1"></CommonRadioGroup>
                </div>
                <div class="scrollable-container height67" style="overflow-x: hidden;">
                    <div class="_container">
                        <div class="field-area">
                            <div style="margin-bottom: 10px;">
                                <label class="form_label is_required">{{ $t('label.view.repayScheduleNo') }}</label>
                                <CommonInputBox v-model="scheduleParam.scheduleNo.value" :disable="cdDisable" style="text-align-last: center; "></CommonInputBox>
                            </div>
                            <!-- <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.scheduleDate') }}</label>
                                <CommonCalendarYMD v-model="scheduleParam.scheduleRegistDate.value" :disable="nonTarget1" style="text-align-last: center; "></CommonCalendarYMD>
                            </div> -->
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.objt.repaymentProgram') }}</label>
                                <CommonSelectBox :codeList="commonCodeList.lonRepayMethodCode" v-model="formParam.repayProgTpcd.value" :disable="cdDisable" ></CommonSelectBox>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.repaymentFrequency') }}</label>
                                <div style="display: flex; align-items: center; position: relative; padding-right:60px;">
                                    <CommonNumberInput class="width100" maxlength="30" placeholder="0" v-model="scheduleParam.frequencyMm.value" :disable="planDisable1"></CommonNumberInput>
                                    <label class="form_label" style="position: absolute; right: 0;">{{ $t('label.view.months') }}</label>
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.installRoundingDigitType') }}</label>
                                <CommonSearchSelectBox :codeList="commonCodeList.lonRoundDigitCode" v-model="scheduleParam.roundDigitCd.value" :disable="nonTarget1" ></CommonSearchSelectBox>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.repayDatePlanMethod') }}</label>
                                <div class="relative-container1">
                                    <CommonSearchSelectBox class="width64" :codeList="commonCodeList.lonRepayDatePlanCode" v-model="scheduleParam.repayDatePlanCd.value" :disable="planDisable1" style="margin-right: 12px;"></CommonSearchSelectBox>
                                    <CommonNumberInput class="width32" maxlength="30" v-model="scheduleParam.repayPlanDay.value" :disable="dayDisable"></CommonNumberInput>
                                </div>
                            </div>
                            <!-- <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.initialRepaymentDueDate') }}</label>
                                <CommonCalendarYMD v-model="scheduleParam.initialDueDate.value" :disable="planDisable1" style="text-align-last: center; " ></CommonCalendarYMD>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.finalRepaymentDueDate') }}</label>
                                <CommonCalendarYMD v-model="scheduleParam.finalDueDate.value" :disable="nonTarget1" style="text-align-last: center; "></CommonCalendarYMD>
                            </div> -->
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.remainingAmountMethod') }}</label>
                                <CommonSearchSelectBox :codeList="commonCodeList.lonRemainAmountCode" v-model="scheduleParam.remainAmountCode.value" :disable="nonTarget1" ></CommonSearchSelectBox>
                            </div>
                            <!-- <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.view.installmentCount') }}</label>
                                <CommonNumberInput v-model="scheduleParam.installmentCnt.value" :disable="cdDisable" style="text-align-last: center;"></CommonNumberInput>
                            </div> -->
                            <div style="margin-bottom: 10px;">
                                <label class="form_label" style="margin-right: 10px;">{{ $t('label.view.installmentRepaymentAmount') }}</label>
                                <div class="double_input_box">
                                    <CommonCurFormatterBox
                                        :modelValues="modelValues"
                                        class="width100"
                                        :selectDisabled="cdDisable" :inputDisabled="planDisable">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                        </div>
                        <div class="grid-area">
                            <div>
                                <div style="display: flex;">
                                    <q-btn flat class="button" @click="addRow" :disabled="nonTarget1 || (formParam.repayProgTpcd.value !== '05')"><img src="~/assets/images/btn-btn-ic-plus.svg"/></q-btn>
                                    <q-btn flat class="button" @click="removeRow" :disabled="nonTarget1 || (formParam.repayProgTpcd.value !== '05')"><img src="~/assets/images/btn-btn-ic-minus.svg"/></q-btn>
                                    <q-btn flat class="button"  @click="undo" :disabled="nonTarget1 || (formParam.repayProgTpcd.value !== '05')"><img src="~/assets/images/btn-btn-ic-redraw.svg"/></q-btn>
                                    <div style="margin-left: auto; margin-right: 30px;">
                                        <q-btn @click="simulation" style="background-color: #4850b2; color: #ffffff;" :disabled="nonTarget1">Simulation Search</q-btn>
                                    </div>
                                </div>
                                <div class="table_scroll_box width100">
                                    <ag-grid-vue
                                        ref="gridComponent"
                                        class="msg_table ag-theme-balham width98 height50"
                                        :rowData="rowData"
                                        :columnDefs="gridProps.columnDefs(commonCodeList, currencyParam)"
                                        :columnTypes="gridProps.columnTypes"
                                        :defaultColDef="gridProps.defaultColDef"
                                        @grid-ready="gridProps.onGridReady"
                                        rowSelection="single"
                                    ></ag-grid-vue>
                                </div>
                            </div>
                            <div style="float:right; margin-right:30px">
                              <q-btn class="btn ok_button" @click="downloadBtn()" :disabled="false">
                                <img :src="btnImage" />
                                {{ 'Simulation Download' }}
                              </q-btn>
                              <frmHlpJrp :pdfData="pdfData" v-model="showPdf" :jasper-type="jasperType" :row-data="filterRowData()"/>
                          </div>
                        </div>
                    </div>
                </div>
</template>frmHlpJrp
<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/srv/dbs/lonDbsMngGridProps.vue'
import { messageBox, frmHlpJrp } from 'skylark-ui-lib'
import dayjs from 'dayjs'
import btnImage from 'assets/images/btn-btn-ic-down.svg'
/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  commonCodeList: {
    default: []
  },
  formParam: {
    default: {}
  },
  scheduleParam: {
    default: {}
  },
  radioDisableFlag1: {
    default: {}
  },
  modelValues: {
  },
  rowData: {
    default: []
  },
  cdDisable: {
    type: Boolean,
    default: true
  },
  nonTarget1: {
    type: Boolean,
    default: false
  },
  planDisable: {
    type: Boolean,
    default: false
  },
  planDisable1: {
    type: Boolean,
    default: false
  },
  dayDisable: {
    type: Boolean,
    default: true
  },
  gridComponent: {
    default: null
  },
  currencyParam: {
    type: String,
    default: ''
  },
  repaysave: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  updateTrxnMode2: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  addRow: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  removeRow: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  undo: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  simulation: {
    type: Function,
    /**
     *
     */
    default () {
    }
  }
})
/* =======================================================
    Freeform Object
  ======================================================= */
const formParam = ref(props.formParam)
const scheduleParam = ref(props.scheduleParam)
const currencyParam = ref(props.modelValues.currency.value)
const showPdf = ref(false)
const jasperType = ref('DataSource')

/* =======================================================
    Freeform Funtion
======================================================= */
watch(
  () => ({
    formParam: props.formParam,
    scheduleParam: props.scheduleParam,
    currencyParam: props.modelValues.currency.value
  }),
  (newVal) => {
    formParam.value = newVal.formParam
    scheduleParam.value = newVal.scheduleParam
    currencyParam.value = newVal.currencyParam
  }
)

watch(props, (newProps) => {
  if (newProps.modelValues.currency.value) {
    currencyParam.value = newProps.modelValues.currency.value
  }
})

const downloadBtn = async () => {
  const rows = props.rowData.filter(row => row.id !== 'total') || []
  scheduleParam.value.installmentCnt.value = rows.length
  for (const idx in rows) {
    // 날짜형식으로 변경하여 Jasper에 넘김
    const scheduleDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
    const intCalcFromDate = dayjs(rows[idx].rIntCalcFromDate).format('YYYY-MM-DD')
    const intCalcToDate = dayjs(rows[idx].rIntCalcToDate).format('YYYY-MM-DD')

    rows[idx].scheduleDate = scheduleDate
    rows[idx].intCalcFromDate = intCalcFromDate
    rows[idx].intCalcToDate = intCalcToDate
  }
  if (rows.length === 0) {
    messageBox.alertError('Please simulation search first')
    return
  }
  showPdf.value = true
}

const filterRowData = () => {
  const filterData = props.rowData.filter(row => row.id !== 'total')
  return filterData
}

const templateName = 'Simulation_Test' // 사용 할 템플릿
const pkValue = ''
const pdfData = ref({
  showPdf,
  templateName,
  pkValue,
  reportParam: {
    branchName: {
      value: formParam.value.branchName.value
    },
    customerNo: {
      value: formParam.value.customerNo.value
    },
    customerName: {
      value: formParam.value.customerName.value
    },
    productName: {
      value: formParam.value.productName.value
    },
    currencyCode: {
      value: formParam.value.currencyCode.value
    },
    loanAmount: {
      value: scheduleParam.value.disbursementAmt.value
    },
    loanPeriodStart: {
      value: scheduleParam.value.disbursementDate.value
    },
    loanPeriodEnd: {
      value: scheduleParam.value.maturityDate.value
    },
    interestRate: {
      value: scheduleParam.value.interestRate.value
    },
    repaymentType: {
      value: scheduleParam.value.repayProgTpcd.value
    },
    repaymentCount: {
      value: scheduleParam.value.installmentCnt.value
    }
  }
})

watch(() => scheduleParam.value.disbursementAmt.value, (newVal) => {
  pdfData.value.reportParam.loanAmount.value = String(newVal)
})
watch(() => scheduleParam.value.disbursementDate.value, (newVal) => {
  pdfData.value.reportParam.loanPeriodStart.value = newVal
})
watch(() => scheduleParam.value.maturityDate.value, (newVal) => {
  pdfData.value.reportParam.loanPeriodEnd.value = newVal
})
watch(() => scheduleParam.value.interestRate.value, (newVal) => {
  pdfData.value.reportParam.interestRate.value = Number(newVal)
})
watch(() => scheduleParam.value.repayProgTpcd.value, (newVal) => {
  pdfData.value.reportParam.repaymentType.value = newVal
})
watch(() => scheduleParam.value.installmentCnt.value, (newVal) => {
  pdfData.value.reportParam.repaymentCount.value = Number(newVal)
})

// watch(() )
</script>
<style scoped>
.relative-container1 {
   position: relative;
   display: flex;
}
._container {
    display: flex;
    justify-content: space-between;
}
/* .field-area {
    flex: 1;
    margin-right: 20px;
}
.grid-area {
    flex: 2;
} */
.field-area {
    flex: 0 0 25%;
    margin-right: 20px;
}
.grid-area {
    flex: 0 0 75%;
}
.double_input_box {
    display: flex;
    gap: 10px;
    width: 100%;
}

.double_input_box > * {
    flex: 1;
}
</style>
