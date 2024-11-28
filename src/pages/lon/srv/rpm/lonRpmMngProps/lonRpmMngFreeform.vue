<template>
  <div class="msg_info_form_quadruple_box">
      <div>
          <label class="form_label is_required">{{ $t('label.view.disbursementNo') }}</label>
          <div class="relative-container d-flex items-center">
            <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.disbursementNo.value" hlpType="lonHlpDbs" :searchCode="formParam.disbursementNo.value" :disable="formParam.transactionMode.value === 'UPDATE' || formParam.transactionMode.value === 'DELETE'" @directSearchVal="getDirectsearchData"></CommonDirectSearchBox>
              <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="(formParam.transactionMode.value !== 'UPDATE' && formParam.transactionMode.value !== 'DELETE') && showDbsSearchPopup()" />
              <lonHlpDbs v-model="showDbsSearch" @selected-popup-row-data = "getSearchPopupData"></lonHlpDbs>
          </div>
      </div>
      <div class="full-row">
          <label class="form_label">{{ $t('label.view.customer') }}</label>
          <div class="horizontal-layout d-flex items-center">
              <CommonInputBox class="width30" maxlength="3" v-model="formParam.customerNo.value" :disable="cdDisable"></CommonInputBox>
              <CommonInputBox maxlength="3" v-model="formParam.customerName.value" :disable="cdDisable" class="w_100 width69"></CommonInputBox>
          </div>
      </div>
      <div>
          <label class="form_label">{{ $t('label.objt.repaymentProgram') }}</label>
          <CommonSearchSelectBox :codeList="props.commonCodeList.lonRepayMethodCode" v-model="formParam.repayProgTpcd.value" :disable="cdDisable"></CommonSearchSelectBox>
      </div>
  </div>
  <div class="msg_info_form_quadruple_box">
      <div>
          <label class="form_label">{{ $t('label.veiw.disbursementDate') }}</label>
          <CommonCalendarYMD v-model="formParam.disbursementDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
      </div>
      <div>
          <label class="form_label">{{ $t('label.objt.maturityDate') }}</label>
          <CommonCalendarYMD v-model="formParam.maturityDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
      </div>
      <div>
          <label class="form_label">{{ $t('label.view.disbursementAmount') }}</label>
          <div class="double_input_box">
              <CommonCurFormatterBox
                  :modelValues="modelValues"
                  class="width100"
                  :selectDisabled="cdDisable" :inputDisabled="cdDisable">
              </CommonCurFormatterBox>
          </div>
      </div>
      <div>
          <label class="form_label">{{ $t('label.view.disburseOutstanding') }}</label>
          <div class="double_input_box">
              <CommonCurFormatterBox
                  :modelValues="modelValues2"
                  class="width100"
                  :selectDisabled="cdDisable" :inputDisabled="cdDisable">
              </CommonCurFormatterBox>
          </div>
      </div>
  </div>
  <div class="msg_info_form_quadruple_box">
      <div>
          <label class="form_label">{{ $t('label.view.lastRepayDate') }}</label>
          <CommonCalendarYMD v-model="formParam.lastRepayDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
      </div>
      <div>
          <label class="form_label">{{ $t('label.view.lastInterestCharGed') }}</label>
          <CommonCalendarYMD v-model="formParam.lastIntChrgPrd.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
      </div>
      <div>
          <label class="form_label">{{ $t('label.view.nextRepaySchDate') }}</label>
          <CommonCalendarYMD v-model="formParam.nextSchdDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
      </div>
      <div>
          <label class="form_label">{{ $t('label.view.nextInterestSchDate') }}</label>
          <CommonCalendarYMD v-model="formParam.nextSchdIntDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
      </div>
  </div>
</template>
<script setup>
import { nextTick, ref, watch } from 'vue'
import { i18n } from 'boot/i18n'
import { ajaxUtil, commonUtil, messageBox } from 'skylark-ui-lib'
import lonHlpDbs from 'src/components/pages/main/hlp/lon/lonHlpDbs.vue'

const props = defineProps({
  formParam: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  selectedPopupRowData: {
    default: []
  },
  modelValues: {
    default: {}
  },
  modelValues2: {
    default: {}
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
  cdDisable: {
    default: true
  },
  formParamClear: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  rowDataClear: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  modelValuesClear: {
    type: Function,
    /**
     *
     */
    default () { }
  },
  repaymentHistory: {
    type: Function,
    /**
     *
     */
    default () { }
  }
})

const showDbsSearch = ref(false)
const formParam = ref(props.formParam)
const cdDisable = ref(props.cdDisable)
const selectedPopupRowData = ref(props.selectedPopupRowData)
const modelValues = ref(props.modelValues)
const modelValues2 = ref(props.modelValues2)
const modelValues3 = ref(props.modelValues3)
const modelValues4 = ref(props.modelValues4)
const modelValues5 = ref(props.modelValues5)
const modelValues6 = ref(props.modelValues6)
const disbursementNo = ref('')

const showDbsSearchPopup = () => {
  showDbsSearch.value = true
}

const getDirectsearchData = async (event) => {
  if (event !== '') {
    selectedPopupRowData.value = event
    getPopupRowData(selectedPopupRowData.value)
  } else {
    props.formParamClear()
    props.rowDataClear()
    props.modelValuesClear()
  }
}

const getSearchPopupData = async (event) => {
  selectedPopupRowData.value = event[0]
  getPopupRowData(selectedPopupRowData.value)
}

const getPopupRowData = async (event) => {
  props.formParamClear()
  props.rowDataClear()
  props.modelValuesClear()

  const fields = [
    'creditLineTpcd', 'disbursementNo', 'customerNo', 'customerName', 'productCode',
    'repayProgTpcd', 'disbursementDate', 'maturityDate', 'lastRepayDate', 'lastIntChrgPrd',
    'nextSchdDate', 'nextSchdIntDate', 'scheduleYn', 'registEmployeeNo', 'manageEmployeeNo'
  ]
  fields.forEach(field => {
    formParam.value[field].value = event[field]
  })

  // transactionMode 가 변경 되었을때 기본값을 적용 해주기위헤 실행번호를 따로 저장
  originalValue.value.disbursementNo.value = formParam.value.disbursementNo.value

  props.repaymentHistory()

  await nextTick()

  modelValues.value.currency.value = event.currencyCode
  modelValues.value.money.value = event.disbursementAmt
  modelValues2.value.currency.value = event.currencyCode
  modelValues2.value.money.value = event.disburseBalance

  modelValues3.value.currency.value = event.currencyCode
  modelValues4.value.currency.value = event.currencyCode
  modelValues5.value.currency.value = event.currencyCode
  modelValues6.value.currency.value = event.currencyCode
}

const directSearchParam = ref({
  searchType: {
    value: 'DIRECT_SEARCH',
    initValue: '',
    required: false
  },
  helpSearchType: {
    value: 'lonHlpDbs',
    initValue: '',
    required: false
  },
  searchKeyword: {
    value: '',
    initValue: '',
    required: false
  },
  fetchSize: {
    value: 100
  },
  maxValue: {
    value: '0'
  },
  searchKind: {
    value: ''
  }
})

const originalValue = ref({
  disbursementNo: {
    value: ''
  }
})

watch(() => formParam.value.transactionMode.value, (newVal, oldVal) => {
  if ((newVal === 'NEW' || newVal === 'INQUIRY') && oldVal !== 'NEW' && !commonUtil.isEmpty(disbursementNo.value)) {
    directSearchParam.value.searchKeyword.value = originalValue.value.disbursementNo.value
    const newSearchParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', directSearchParam)
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        if (data.length === 0) {
          messageBox.alertInfo(i18n.global.t('msg.serchKeyword.nodata'))
        } else {
          getDirectsearchData(data[0])
        }
      })
  }
})

watch(() => formParam.value.disbursementNo.value, (newVal) => {
  if (!commonUtil.isEmpty(newVal)) {
    disbursementNo.value = newVal
  }
})

</script>
<style scoped>
.relative-container {
   position: relative;
}
.horizontal-layout {
   display: flex; /* Use flex for the inner items */
   justify-content: flex-start;
   gap: 10px;
}
.full-row {
    grid-column-start: span 2;
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
