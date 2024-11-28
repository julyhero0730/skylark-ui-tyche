<template>
  <q-expansion-item v-model="isRepaymentGeneral">
    <template v-slot:header>
      <div class="text-center full-width">{{ $t('label.view.repaymentGeneral') }}</div>
    </template>
    <q-card>
      <q-card-section>
        <div class="msg_info_form_quadruple_box">
            <div>
                <label class="form_label is_required">{{ $t('label.view.repaymentNo') }}</label>
                <CommonInputBox v-model="formParam.repaymentNo.value" style="text-align-last: center;" disable></CommonInputBox>
            </div>
            <div>
                <label class="form_label is_required">{{ $t('label.view.transactionDate') }}</label>
                <CommonCalendarYMD v-model="formParam.transactionDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label is_required">{{ $t('label.view.repaymentDate') }}</label>
                <CommonCalendarYMD v-model="formParam.repaymentDate.value"  style="text-align-last: center;" :disable="formParam.transactionMode.value !== 'NEW'"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label is_required">{{ $t('label.view.principalInterest') }}</label>
                <CommonSearchSelectBox :codeList="commonCodeList.lonRepayPrincpleInterestCode" v-model="formParam.repayPrinIntCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
            </div>
        </div>
        <div class="msg_info_form_quadruple_box">
            <div>
                <label class="form_label">{{ $t('label.view.repaymentType') }}</label>
                <CommonSearchSelectBox :codeList="commonCodeList.lonRepaymentCode" v-model="formParam.repayTypeCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.repayScheduleNo') }}</label>
                <div class="relative-container d-flex items-center">
                    <CommonInputBox class="width100" maxlength="10" v-model="formParam.scheduleNo.value" :disable="cdDisable"  style="text-align-last: center;"></CommonInputBox> <!-- :disable="formParam.transactionMode.value !== 'INQUIRY'" -->
                    <q-icon name="search" size="sm" color="black" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple"  @click="showRpmSearchPopup()" />
                    <lonHlpRpm
                      :disbursement-No = formParam.disbursementNo.value
                      :currency-Code = formParam.currencyCode.value
                      v-model="showRpmSearch"
                      @selected-popup-row-data = "getPopupRowData2"
                    ></lonHlpRpm>
                </div>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.scheduleDate') }}</label>
                <CommonCalendarYMD v-model="formParam.scheduleDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.principalAmount') }}</label>
                <div class="double_input_box">
                    <CommonCurFormatterBox
                        :modelValues="modelValues3"
                        class="width100"
                        :selectDisabled="cdDisable"
                        :inputDisabled="cdDisable">
                    </CommonCurFormatterBox>
                </div>
              <!--  <CommonSearchInputBox v-model="formParam.principleAmt.value" style="text-align-last: right;" disable></CommonSearchInputBox>  :disable="prinDisable "-->
            </div>
        </div>
        <div class="msg_info_form_quadruple_box">
            <div>
                <label class="form_label">{{ $t('label.view.interestRepayType') }}</label>
                <CommonSearchSelectBox :codeList="commonCodeList.lonRepayInterestCode" v-model="formParam.interestRepayCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.interestPeriodFrom') }}</label>
                <CommonCalendarYMD v-model="formParam.intCalcFromDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.interestPeriodTo') }}</label>
                <CommonCalendarYMD v-model="formParam.intCalcToDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.interestAmount') }}</label>
                <div class="double_input_box">
                    <CommonCurFormatterBox
                        :modelValues="modelValues4"
                        class="width100"
                        :selectDisabled="cdDisable"
                        :inputDisabled="cdDisable">
                    </CommonCurFormatterBox>
                </div>
              <!--  <CommonSearchInputBox v-model="formParam.intAmt.value" style="text-align-last: right;" disable></CommonSearchInputBox>  :disable="interestDisable "-->
            </div>
        </div>
        <div class="msg_info_form_quadruple_box">
            <div></div>
            <div>
                <label class="form_label">{{ $t('label.view.pastDuePeriodFrom') }}</label>
                <CommonCalendarYMD v-model="formParam.pastdueFrdt.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.pastDuePeriodTo') }}</label>
                <CommonCalendarYMD v-model="formParam.pastdueTodt.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.pastDueInterestAmount') }}</label>
                <div class="double_input_box">
                    <CommonCurFormatterBox
                        :modelValues="modelValues5"
                        class="width100"
                        :selectDisabled="cdDisable"
                        :inputDisabled="cdDisable">
                    </CommonCurFormatterBox>
                </div>
              <!-- <CommonSearchInputBox v-model="formParam.pastDueAmt.value" style="text-align-last: right;" disable></CommonSearchInputBox>  :disable="nonTarget" -->
            </div>
        </div>
        <div class="msg_info_form_quadruple_box">
            <div class="tr_full-row">
                <label class="form_label">{{ $t('label.view.remark') }}</label>
                <CommonSearchInputBox v-model="formParam.rmk.value" :disable="formParam.transactionMode.value !== 'NEW' && formParam.transactionMode.value !== 'UPDATE'"></CommonSearchInputBox>
            </div>
            <div>
                <label class="form_label">{{ $t('label.view.totalRepaymentAmount') }}</label>
                <div class="double_input_box">
                    <CommonCurFormatterBox
                        :modelValues="modelValues6"
                        class="width100"
                        :selectDisabled="cdDisable"
                        :inputDisabled="cdDisable">
                    </CommonCurFormatterBox>
                </div>
              <!--  <CommonSearchInputBox v-model="formParam.schdTotalAmt.value" style="text-align-last: right;" disable></CommonSearchInputBox>  :disable="nonTarget" -->
            </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script setup>
import { ref, watch } from 'vue'
import { messageBox } from 'skylark-ui-lib'
import lonHlpRpm from 'src/components/pages/main/hlp/lon/lonHlpRpm.vue'

const props = defineProps({
  selectedPopupRowData: {
    default: []
  },
  repaymentSearch: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  repaymentSearchParam: {
    default: {}
  },
  formParam: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  modelValues3: {
    default: {}
  },
  modelValues4: {
    default: {}
  },
  modelValues5: {
    default: {}
  },
  modelValues6: {
    default: {}
  },
  isRepaymentGeneral: {
    defualt: false
  },
  cdDisable: {
    default: true
  },
  nonTarget: {
    default: false
  },
  rpmGeneralClear: {
    type: Function,
    /**
     *
     */
    default () { }
  }
})

const selectedPopupRowData = ref(props.selectedPopupRowData)
const repaymentSearchParam = ref(props.repaymentSearchParam)
const formParam = ref(props.formParam)
const modelValues3 = ref(props.modelValues3)
const modelValues4 = ref(props.modelValues4)
const modelValues5 = ref(props.modelValues5)
const modelValues6 = ref(props.modelValues6)
const isRepaymentGeneral = ref(props.isRepaymentGeneral)
const cdDisable = ref(props.cdDisable)
const nonTarget = ref(props.nonTarget)

watch(
  () => ({
    cdDisable: props.cdDisable,
    nonTarget: props.nonTarget
  }),
  (newVal) => {
    cdDisable.value = newVal.cdDisable
    nonTarget.value = newVal.nonTarget
  }
)
watch(() => props.isRepaymentGeneral, newVal => {
  isRepaymentGeneral.value = newVal
})

const showRpmSearch = ref(false)

const showRpmSearchPopup = () => {
  if (formParam.value.transactionMode.value === 'NEW') {
    showRpmSearch.value = true
  } else {
    messageBox.alertError('Schedule Search is only available when it`s NEW.')
  }
}

const getPopupRowData2 = async (event) => {
  // props.rpmGeneralClear()
  // freeform 데이터 맵핑 후 그리드 조회
  selectedPopupRowData.value = event[0]
  // Repayment Principal & Interest Info 탭 Grid를 위한 데이터 세팅
  repaymentSearchParam.value.referSerialNo.value = selectedPopupRowData.value.serialNo
  repaymentSearchParam.value.disbursementNo.value = selectedPopupRowData.value.disbursementNo
  repaymentSearchParam.value.scheduleNo.value = selectedPopupRowData.value.scheduleNo
  repaymentSearchParam.value.repaymentDate.value = formParam.value.repaymentDate.value

  // Repayment General 탭 데이터 세팅
  formParam.value.scheduleNo.value = selectedPopupRowData.value.scheduleNo
  formParam.value.scheduleDate.value = selectedPopupRowData.value.scheduleDate
  formParam.value.referSerialNo.value = selectedPopupRowData.value.serialNo

  modelValues3.value.money.value = selectedPopupRowData.value.schdPrincipalAmt
  modelValues4.value.money.value = selectedPopupRowData.value.schdIntAmt
  modelValues5.value.money.value = selectedPopupRowData.value.pastDueAmt

  props.repaymentSearch()

  // 데이터 조회 후 탭 열기
}
</script>
<style scoped>
.relative-container {
   position: relative;
}
.tr_full-row {
    grid-column-start: span 3;
}
.text-center.full-width {
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
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
