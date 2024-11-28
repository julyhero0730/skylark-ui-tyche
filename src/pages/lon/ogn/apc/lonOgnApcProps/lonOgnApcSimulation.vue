<template>
                <div class="scrollable-container height75" style="overflow-x: hidden;">
                    <div class="container height72" style="flex-direction: row; display: flex;">
                        <div class="field-area" style="flex: 0 0 25%; margin-right: 20px;">
                            <div style="margin-bottom: 10px;">
                                <label class="form_label is_required">{{ $t('label.objt.applicationDate') }}</label>
                                <CommonCalendarYMD v-model="scheduleParam.applicationDate.value" :disable="scheduleDisable" style="text-align-last: center; " ></CommonCalendarYMD>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label class="form_label">{{ $t('label.objt.loanTerm') }}</label>
                                <div style="display:flex; align-items: center;">
                                  {{ $t('label.view.year') }}
                                  <CommonInputBox maxlength="30" placeholder="0" v-model="scheduleParam.loanTermYear.value" :disable="yearMonthDisable" style="text-align-last: right; margin: 0px 10px"></CommonInputBox>
                                  <div style="margin: 0 5px 0 10px;">{{ $t('label.view.months') }}</div>
                                  <CommonInputBox maxlength="30" placeholder="0" v-model="scheduleParam.loanTermMonth.value" :disable="yearMonthDisable" style="text-align-last: right;"></CommonInputBox>
                                </div>
                            </div>
                            <div class="test" style="margin-bottom: 10px;">
                                <label class="form_label is_required">{{ $t('label.objt.maturityDate') }}</label>
                                <CommonCalendarYMD v-model="scheduleParam.maturityDate.value" :disable="scheduleDisable" style="text-align-last: center; top:100%;" ></CommonCalendarYMD>
                            </div>
                            <div style="margin-bottom: 10px;">
                              <label class="form_label is_required">{{ $t('label.objt.applicationAmount') }}</label>
                                <div class="double_input_box">
                                    <CommonCurFormatterBox
                                        class="width100"
                                        :modelValues="lonAmtCurForm"
                                        :selectDisabled="scheduleDisable" :inputDisabled="scheduleDisable">
                                    </CommonCurFormatterBox>
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                              <label class="form_label is_required">{{ $t('label.objt.repayProgTpcd') }}</label>
                              <CommonSelectBox :codeList="commonCodeList.repayProgTpcd" v-model="scheduleParam.repayProgTpcd.value" :disable="scheduleDisable"></CommonSelectBox>
                            </div>
                            <div style="margin-bottom: 10px;">
                              <label class="form_label is_required">{{ $t('label.view.repaymentFrequency') }}</label>
                                <div style="display:flex; align-items: center;">
                                  <CommonNumberInput class="width80" maxlength="30" placeholder="0" v-model="scheduleParam.frequencyMm.value" :disable=scheduleDisable ref="gracePrdYear" style="text-align-last: right;"></CommonNumberInput>
                                  <div style="margin-left: 10px;">{{ $t('label.view.months') }}</div>
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label class="form_label is_required">{{ $t('label.view.repayDatePlanMethod') }}</label>
                                <div class="double_day_box">
                                    <CommonSearchSelectBox class="width70" :codeList="commonCodeList.lonRepayDatePlanCode" v-model="scheduleParam.repayDatePlanCd.value" :disable="planDisable" @update:model-value="planCdChange" style="margin-right: 10px;"></CommonSearchSelectBox>
                                    <CommonNumberInput maxlength="30" v-model="scheduleParam.repayPlanDay.value" :disable="dayDisable"></CommonNumberInput>
                                </div>
                            </div>
                            <!-- <div style="margin-bottom: 10px;">
                                <label class="form_label is_required">{{ $t('label.view.initialRepaymentDueDate') }}</label>
                                <CommonCalendarYMD v-model="scheduleParam.initialDueDate.value" :disable="scheduleDisable" style="text-align-last: center; " ></CommonCalendarYMD>
                            </div> -->
                            <div style="margin-bottom: 10px;">
                              <label class="form_label is_required">{{ $t('label.objt.interestRate') }}</label>
                                <div style="display:flex; align-items: center;">
                                  <CommonNumberInput class="width95" maxlength="30" v-model="scheduleParam.interestRate.value" :disable=scheduleDisable ref="interestRate" style="text-align-last: right;"></CommonNumberInput>
                                  &nbsp;<q-icon style="float:right;" name="percent" />
                                </div>
                            </div>
                            <div style="margin-bottom: 10px;">
                              <label class="form_label">{{ $t('label.objt.gracePeriod') }}</label>
                                <div style="display:flex; align-items: center;">
                                  {{ $t('label.view.year') }}
                                  <CommonInputBox maxlength="30" placeholder="0" v-model="scheduleParam.gracePrdYear.value" :disable=yearMonthDisable ref="gracePrdYear" style="text-align-last: right; margin: 0px 10px"></CommonInputBox>
                                  <div style="margin: 0 5px 0 10px;">{{ $t('label.view.months') }}</div>
                                  <CommonInputBox maxlength="30" placeholder="0" v-model="scheduleParam.gracePrdMonth.value" :disable=yearMonthDisable ref="gracePrdMonth" style="text-align-last: right;"></CommonInputBox>
                                </div>
                            </div>
                        </div>
                        <div class="grid-area" style="flex-grow: 1;">
                            <div>
                                <div style="display: flex; padding: 12px 12px 12px 0;">
                                    <q-btn flat class="button" @click="addRow" :disabled="gridBtnDisable || (scheduleParam.repayProgTpcd.value !== '05')"><img src="~/assets/images/btn-btn-ic-plus.svg"/></q-btn>
                                    <q-btn flat class="button" @click="removeRow" :disabled="gridBtnDisable || (scheduleParam.repayProgTpcd.value !== '05')"><img src="~/assets/images/btn-btn-ic-minus.svg"/></q-btn>
                                    <q-btn flat class="button"  @click="undo" :disabled="gridBtnDisable || (scheduleParam.repayProgTpcd.value !== '05')"><img src="~/assets/images/btn-btn-ic-redraw.svg"/></q-btn>
                                    <div style="margin-left: auto;">
                                        <q-btn @click="simulation" style="background-color: #4850b2; color: #ffffff;" :disabled="gridBtnDisable">Simulation Search</q-btn>
                                    </div>
                                </div>
                                <div class="table_scroll_box">
                                    <ag-grid-vue
                                        ref="gridComponent"
                                        class="msg_table ag-theme-balham height55"
                                        :rowData="rowData"
                                        :columnDefs="gridProps.columnDefs(commonCodeList, currencyParam)"
                                        :columnTypes="gridProps.columnTypes"
                                        :defaultColDef="gridProps.defaultColDef"
                                        @grid-ready="gridProps.onGridReady"
                                        rowSelection="single"
                                    ></ag-grid-vue>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: flex-end; padding: 12px;">
                              <q-btn class="btn ok_button" @click="downloadBtn()" :disabled="false">
                                <img :src="btnImage" />
                                {{ 'Simulation Download' }}
                              </q-btn>
                              <frmHlpJrp :pdfData="pdfData" v-model="showPdf" :jasper-type="jasperType" :row-data="filterRowData()"/>
                          </div>
                          </div>
                    </div>
                </div>
</template>
<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { gridProps } from 'src/pages/lon/ogn/apc/lonOgnApcProps/lonOgnApcSimulationGridProps.vue'
import btnImage from 'assets/images/btn-btn-ic-down.svg'
import { messageBox, frmHlpJrp } from 'skylark-ui-lib'
import dayjs from 'dayjs'

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
  lonAmtCurForm: {
  },
  rowData: {
    default: []
  },
  cdDisable: {
    type: Boolean,
    default: true
  },
  gridBtnDisable: {
    type: Boolean,
    default: false
  },
  scheduleDisable: {
    type: Boolean,
    default: false
  },
  planDisable: {
    type: Boolean,
    default: false
  },
  dayDisable: {
    type: Boolean,
    default: false
  },
  yearMonthDisable: {
    type: Boolean,
    default: false
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
  },
  planCdChange: {
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
const scheduleParam = ref(props.scheduleParam)
const formParam = ref(props.formParam)
const lonAmtCurForm = ref(props.lonAmtCurForm)
const showPdf = ref(false)
const jasperType = ref('DataSource')
/* =======================================================
    Freeform Funtion
======================================================= */
const downloadBtn = async () => {
  const rows = props.rowData.filter(row => row.id !== 'total') || []
  scheduleParam.value.installmentCnt.value = rows.length
  for (const idx in rows) {
    // 날짜형식으로 변경하여 Jasper에 넘김
    const scheduleDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
    const intCalcFromDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
    const intCalcToDate = dayjs(rows[idx].rScheduleDate).format('YYYY-MM-DD')
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
      value: scheduleParam.value.applicationAmount.value
    },
    loanPeriodStart: {
      value: scheduleParam.value.applicationDate.value
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

watch(() => scheduleParam.value.applicationAmount.value, (newVal) => {
  pdfData.value.reportParam.loanAmount.value = newVal
})
watch(() => scheduleParam.value.applicationDate.value, (newVal) => {
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

</script>
<style scoped>
.double_day_box {
   position: relative;
   display: flex;
}
.double_input_box {
    display: flex;
    gap: 10px;
}
</style>
