<template >
    <q-list>
      <!-- Rrepayment Schedule Info -->
      <template v-if="tab === 'repaymentSchedule'">
        <div style="margin-bottom: 10px;">
            <label class="form_label is_required">{{ $t('label.view.disbursementNo') }}</label>
            <CommonInputBox maxlength="10" v-model="formParam.disbursementNo.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
        </div>
        <div style="margin-bottom: 10px;">
            <label class="form_label is_required">{{ $t('label.view.disbursementAmount') }}</label>
            <div class="double_input_box">
                <CommonCurFormatterBox
                    clss="width100"
                    :modelValues="modelValues3" :selectDisabled="cdDisable" :inputDisabled="cdDisable">
                </CommonCurFormatterBox>
            </div>
        </div>
        <div style="margin-bottom: 10px;">
            <label class="form_label">{{ $t('label.view.disburseOutstanding') }}</label>
            <div class="double_input_box">
                <CommonCurFormatterBox
                    clss="width100"
                    :modelValues="modelValues4" :selectDisabled="cdDisable" :inputDisabled="cdDisable" >
                </CommonCurFormatterBox>
            </div>
        </div>
        <div style="margin-bottom: 10px;">
            <label class="form_label is_required">{{ $t('label.veiw.disbursementDate') }}</label>
            <CommonCalendarYMD v-model="formParam.disbursementDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
        </div>
        <div style="margin-bottom: 50px;">
            <label class="form_label is_required">{{ $t('label.objt.maturityDate') }}</label>
            <CommonCalendarYMD v-model="formParam.maturityDate.value" :disable="cdDisable" style="text-align-last: center;"></CommonCalendarYMD>
        </div>
      </template>
      <!-- Approval Line -->
      <!-- (좌측 패널) 결재선 -->
      <q-expansion-item
        expand-separator
        icon="perm_identity"
        label="Approval Line"
        default-opened
      >
        <!-- case 1. 기등록된 결재선이 존재 -->
        <template v-if="authorStatus === '01'">
          <q-list approvals>
            <q-item v-for="(rowData, index) in authorLineDatas"
              clickable
              @click="handleRowClick('ath', rowData.employeeNo, rowData.authorizationStatus, rowData.authorizationNo, rowData.authorizationDate)"
              :key="index">
              <q-item-section avatar>
                <q-avatar size="md" :icon="rowData.icon" :color="rowData.color" text-color="white"></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ rowData.name }}</q-item-label>
                <q-item-label caption>{{ rowData.position }}</q-item-label>
              </q-item-section>
              <q-item-section side v-if="rowData.sortSeq === 0">
                <q-badge color="grey" label="In Charge" />
                {{ rowData.status }}
              </q-item-section>

              <q-item-section side v-if="rowData.sortSeq !== 0">
                <q-badge v-if="rowData.finalApproverYn === 'Y'" color="grey" label="Final Approver" />
                {{ rowData.status }}
              </q-item-section>
            </q-item>
          </q-list><br>
        </template>
        <!-- case 2. 신청번호 없음(신청 필요) -->
        <template v-else>
          <q-list approvals>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ authorLineComment }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list><br>
        </template>
        <q-btn :disable="isAppvPopupVisible"  align="between" style="margin-bottom:40px;" class="btn-fixed-width" outline color="primary" @click="handleRowClick('apv')" label="Approval Line" icon="add" />
        <lonHlpApv
          :application-No=formParam.disbursementNo.value
          :author-line-datas="authorLineDatas"
          :authorLineDatasClear="authorLineDatasClear"
          v-model="showApvSearch"
          @selected-popup-row-data="getApvPopupRowData">
        </lonHlpApv>
        <lonHlpAth
          :application-No=formParam.disbursementNo.value
          :approve-Employee-No=formParam.authorEmployeeNo.value
          :apply-Employee-No=formParam.registEmployeeNo.value
          :from-Btn=formParam.fromBtn.value
          v-model="showAthSearch"
          @selected-popup-row-data="getAthPopupRowData">
         </lonHlpAth>
      </q-expansion-item><br>
      <q-list bordered separator>
        <q-item tag="label" v-ripple @click="showPopup('settle')" :disable="isPopupVisible">
            <q-item-section side top>
              <q-checkbox v-model="settleCheck" disable/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ $t('label.objt.settlement') }}</q-item-label>
            </q-item-section>
        </q-item>
        <lonHlpSet
        :lon-disbursement-amt=formParam.disbursementAmt.value
        :lon-currency-code=formParam.currencyCode.value
        :lon-transaction-date=formParam.transactionDate.value
        :lon-disbursement-no=formParam.disbursementNo.value
        :lon-customer-no=formParam.customerNo.value
        :lon-transaction-mode=formParam.transactionMode.value
        :lon-transaction-status-cd=formParam.transactionStatusCd.value
        :search="search"
        v-model="showSettleSearch" ></lonHlpSet>
      </q-list>
      <q-list bordered separator>
        <q-item tag="label" v-ripple @click="handleRowClick('receipt')" >
          <q-item-section side top>
            <q-checkbox v-model="receiptCheck" disable/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('label.objt.receipt') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-list>
  </template>

<script setup>

/* =======================================================
      Import Area
    ======================================================= */
import { ref, watch } from 'vue'
import lonHlpSet from 'src/components/pages/main/hlp/lon/lonHlpSet.vue'
import { commonUtil, messageBox } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'
import lonHlpApv from 'src/components/pages/main/hlp/lon/lonHlpApv.vue'
import lonHlpAth from 'src/components/pages/main/hlp/lon/lonHlpAth.vue'
import { i18n } from 'boot/i18n'
/* =======================================================
      Global Variable
    ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  modelValues3: {
    default: {}
  },
  modelValues4: {
    default: {}
  },
  getApvPopupRowData: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  getAthPopupRowData: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  showSettleSearch: {
    type: Boolean,
    default: false
  },
  showReceiptSearch: {
    type: Boolean,
    default: false
  },
  showApvSearch: {
    type: Boolean,
    default: false
  },
  showAthSearch: {
    type: Boolean,
    default: false
  },
  isAppvPopupVisible: {
    default: true
  },
  authorLineDatas: {
    default: []
  },
  authorStatus: {
    default: '02'
  },
  authorLineComment: {
    default: 'Yon can enter if after the settlement is completed'
  },
  tab: {
    type: String,
    default: 'disbursement'
  },
  authorLineDatasClear: {
    type: Function,
    /**
       *
       */
    default () {
    }
  },
  isPopupVisible: {
    type: Boolean,
    default: false
  },
  search: {
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
const cdDisable = ref(true)
const settleCheck = ref(props.isSettleCheck)
const receiptCheck = ref(false)
const authorLineDatas = ref(props.authorLineDatas)
const showSettleSearch = ref(props.showSettleSearch)
const showReceiptSearch = ref(props.showReceiptSearch)
const showApvSearch = ref(props.showApvSearch)
const showAthSearch = ref(props.showAthSearch)
const session = useSessionStore()

/* =======================================================
      Freeform Funtion
  ======================================================= */

const handleRowClick = (type, param1, param2, param3, param4) => {
  showPopup(type, param1, param2, param3, param4)
}
const search = () => {
  props.search()
}
const showPopup = (type, param1, param2, param3, param4) => {
  const trMode = formParam.value.transactionMode.value
  console.log('showPopup, type : ' + type + ', trMode : ' + trMode)

  // 아래 팝업만 모든 상황에서 조회 가능
  /*
    if (type !== 'settle' && type !== 'receipt') {
      if (trMode === 'INQUIRY' || trMode === 'DELETE') return
    }
    */

  showSettleSearch.value = false
  showReceiptSearch.value = false
  showApvSearch.value = false
  showAthSearch.value = false

  // 팝업별 파라미터 세팅 및 화면 오픈
  switch (type) {
    case 'settle' :
      showSettleSearch.value = true; break
    case 'receipt' :
      showReceiptSearch.value = true; break
    case 'apv' :
      showApvSearch.value = true; break
    case 'ath' :
      formParam.value.authorEmployeeNo.value = !commonUtil.isEmpty(param1) ? param1 : ''
      formParam.value.authorizationStatus.value = !commonUtil.isEmpty(param2) ? param2 : ''
      formParam.value.authorizationNo.value = !commonUtil.isEmpty(param3) ? param3 : ''
      formParam.value.authorizationDate.value = !commonUtil.isEmpty(param4) ? param4 : ''
      // 팝업을 오픈한 사용자에 따라 다르게 입력 ( 신청자, 결재자, 그 외 )
      if (formParam.value.registEmployeeNo.value === session.sysEmployeeNo) formParam.value.fromBtn.value = 'apply'
      else if (formParam.value.authorEmployeeNo.value === session.sysEmployeeNo) formParam.value.fromBtn.value = 'Modify'
      else formParam.value.fromBtn.value = ''
      showAthSearch.value = true; break
  }

  if ((formParam.value.scheduleYn.value === null || formParam.value.scheduleYn.value === 'N') ||
  (formParam.value.settlementYn.value === 'Y' || formParam.value.settlementYn.value === 'N' || formParam.value.settlementYn.value !== 'S')) {
    switch (type) {
      case 'apv' :
        messageBox.alertInfo(i18n.global.t('msg.info.settlementYnFlag'))
        showApvSearch.value = false; break
      case 'ath' :
        messageBox.alertInfo(i18n.global.t('msg.info.settlementYnFlag'))
        showAthSearch.value = false; break
    }
  }
}

watch(props, (newProps) => {
  if (newProps.authorLineDatas !== authorLineDatas.value) {
    authorLineDatas.value = newProps.authorLineDatas
  }
})

watch(() => formParam.value.settlementNo.value, (newVal) => {
  if (commonUtil.isEmpty(newVal)) {
    // settleCheck.value = false
  } else {
    // settleCheck.value = true
  }
})

watch(() => formParam.value.settlementYn.value, (newVal) => {
  if (commonUtil.isEmpty(newVal) || newVal === 'N') {
    settleCheck.value = false
  } else {
    settleCheck.value = true
  }
})

//   gridProps.gridApi.value.redrawRows()
</script>
  <style scoped>
  .my-card1 {
    display: flex;
    align-items: center;
    background-color: #4850b2;
  }
  .custom-radio {
      margin-right: 0;
  }
  .form_label1 {
    color: white;
  }
  .radio-wrapper1 {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
  }
  /* .new_container의 간격 설정 */
  .double_input_box {
      display: flex;
      gap: 10px;
      width: 100%;
  }

  .double_input_box > * {
      flex: 1;
  }
  </style>
