<template>
<q-list>
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
              </q-list>
            </template>
            <!-- case 2. 신청번호 없음(신청 필요) -->
            <template v-else>
              <q-list approvals>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ authorLineComment }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
            <q-btn :disable="isPopupVisible1" align="between" style="margin-top:20px;" class="btn-fixed-width" outline color="primary" @click="showPopup('apv')" label="APPROVAL LINE" icon="add" />
            <lonHlpApv
              :application-No=formParam.applicationNo.value
              :author-line-datas="authorLineDatas"
              :authorLineDatasClear="authorLineDatasClear"
              v-model="showApvSearch"
              @selected-popup-row-data="getApvPopupRowData">
            </lonHlpApv>
            <lonHlpAth
              :application-No=formParam.applicationNo.value
              :approve-Employee-No=formParam.authorEmployeeNo.value
              :apply-Employee-No=formParam.registEmployeeNo.value
              :from-Btn=formParam.fromBtn.value
              v-model="showAthSearch"
              @selected-popup-row-data="getAthPopupRowData">
            </lonHlpAth><br><br>
          </q-expansion-item>

          <!-- Collateral -->
          <!-- (좌측 패널) 담보 -->
          <q-expansion-item
            expand-separator
            icon="signal_wifi_off"
            label="Collateral & Guarantee"
            default-opened
          >
          <!-- case 1-1. 등록된 담보 정보 -->
            <q-list collaterals>
              <template v-if="collateralStatus === '01'">
                <div v-for="(rowData, index) in collateralDatas" :key="index" style="display:flex;">
                  <q-item class="width90" clickable @click="handleRowClick('col', rowData.pledgeNo)">
                    <q-item-section avatar>
                      <q-avatar size="md" :icon="rowData.icon" color="grey" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ rowData.type}} </q-item-label>
                      <q-item-label caption>{{ rowData.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label >{{ rowData.ccycdPledge }}</q-item-label>
                      <q-item-label >{{ rowData.pledgeAmount }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item-section side>
                    <q-btn :disable="isPopupVisible2" @click="deleteCollateralData(rowData.collateralNo, rowData.pledgeNo)" flat round color="grey" icon="delete" size="md" />
                  </q-item-section>
                </div>

                <!-- case 1-2. 등록된 보증 정보-->
                <div v-for="(rowData, index) in guaranteeDatas" :key="index" style="display:flex;">
                  <q-item class="width90" clickable @click="handleRowClick('gui', rowData.guaranteeNo)">
                    <q-item-section avatar>
                      <q-avatar size="md" :icon="rowData.icon" color="grey" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ rowData.type}} </q-item-label>
                      <q-item-label caption>{{ rowData.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label >{{ rowData.currencyCode }}</q-item-label>
                      <q-item-label >{{ rowData.guaranteeAmt }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item-section side>
                    <q-btn :disable="isPopupVisible2" @click="deleteGuaranteeData(rowData.guaranteeNo)" flat round color="grey" icon="delete" size="md" />
                  </q-item-section>
                </div>
              </template>

              <!-- case 2. 담보 or 보증 등록 -->
              <template v-else>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ collateralComment }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list><br>
            <div style="display: flex;">
              <q-btn :disable="isPopupVisible2" align="between" style="margin:0 5px 40px 0;" class="btn-fixed-width" outline color="primary" @click="showPopup('col')" label="COLLATERAL" icon="add" />
              <q-btn :disable="isPopupAddGuarantee" align="between" style="margin-bottom:40px;" class="btn-fixed-width" outline color="primary" @click="showPopup('gui')" label="GUARANTEE" icon="add" />
            </div>
            <lonHlpPlg
              :lon-Pledge-List=collateralDatas
              :lon-Customer-Name=formParam.customerName.value
              :lon-Customer-No=formParam.customerNo.value
              :lon-Application-No=formParam.applicationNo.value
              :lon-Pledge-No=formParam.pledgeNo.value
              :lon-Contract-No="formParam.contractNo.value"
              v-model="showColSearch"
              @selected-popup-row-data="getColPopupRowData">
            </lonHlpPlg>
            <lonHlpgui
              :lon-Guarantee-List=guaranteeDatas
              :lon-Customer-Name=formParam.customerName.value
              :lon-Customer-No=formParam.customerNo.value
              :lon-Application-No=formParam.applicationNo.value
              :lon-Guarantee-No=formParam.guaranteeNo.value
              :lon-Contract-No="formParam.contractNo.value"
              :non-target="nonTarget"
              v-model="showGuiSearch"
              @selected-popup-row-data="getGuiPopupRowData"></lonHlpgui>
          </q-expansion-item>

          <!-- Attached Document -->
          <!-- (좌측 패널) 첨부서류 -->
          <q-expansion-item
            expand-separator
            icon="drafts"
            label="Attached Document"
            default-opened
          >
          <!-- case 1. 등록된 첨부서류 정보 -->
            <q-list documents>
              <template v-if="attachedStatus === '01'">
                <div v-for="(rowData, index) in attachedDatas" :key="index" style="display:flex;">
                  <q-item class="width90" style="padding: 0px, 0px, 0px, 0px;" clickable @click="handleRowClick('atc', rowData.postAttachNo)">
                    <q-item-section avatar top>
                      <q-avatar size="md"  :icon="rowData.icon" color="grey" text-color="white"></q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ rowData.name }}</q-item-label>
                      <q-item-label caption>{{ rowData.desc }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item-section side>
                    <q-btn :disable="isPopupVisible3" @click="deleteAttachData(rowData.postAttachNo, rowData.referTableNm, rowData.originReferNo)" flat round color="grey" icon="delete" size="md" />
                  </q-item-section>
                </div>
              </template>

              <!-- case 2. 첨부서류 등록 -->
              <template v-else>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>{{ attachComment }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
            <br><q-btn :disable="isPopupVisible3" align="between" class="btn-fixed-width" outline color="primary" label="ATTACHED DOCUMENT" @click="showPopup('atc')" icon="add" />
            <lonHlpAtc :post-Attach-No=formParam.postAttachNo.value :application-No=formParam.applicationNo.value v-model="showAtcSearch" @selected-popup-row-data = "getAtcPopupRowData"></lonHlpAtc>
          </q-expansion-item>

        </q-list>
</template>
<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref, watch } from 'vue'
import lonHlpPlg from 'src/components/pages/main/hlp/lon/lonHlpPlg.vue'
import lonHlpAtc from 'src/components/pages/main/hlp/lon/lonHlpAtc.vue'
import lonHlpApv from 'src/components/pages/main/hlp/lon/lonHlpApv.vue'
import lonHlpAth from 'src/components/pages/main/hlp/lon/lonHlpAth.vue'
import lonHlpgui from 'src/components/pages/main/hlp/lon/lonHlpGui.vue'
import { commonUtil, messageBox } from 'skylark-ui-lib'
import { useSessionStore } from 'stores/session'

/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  attachedDatas: {
    default: []
  },
  showApvSearch: {
    type: Boolean,
    default: false
  },
  showAtcSearch: {
    type: Boolean,
    default: false
  },
  showAthSearch: {
    type: Boolean,
    default: false
  },
  showColSearch: {
    type: Boolean,
    default: false
  },
  showGuiSearch: {
    type: Boolean,
    default: false
  },
  authorLineDatas: {
    default: []
  },
  authorStatus: {
    default: '02'
  },
  isPopupVisible1: {
    default: true
  },
  isPopupVisible2: {
    default: true
  },
  isPopupVisible3: {
    default: true
  },
  isPopupAddGuarantee: {
    default: true
  },
  isCalendarOpen: {
    default: false
  },
  checkCollateralFlag: {
    default: false
  },
  authorLineComment: {
    default: 'You can enter if after the application is completed'
  },
  collateralComment: {
    default: 'You can enter if after the application is completed'
  },
  attachComment: {
    default: 'You can enter if after the application is completed'
  },
  attachedStatus: {
    default: '02'
  },
  collateralStatus: {
    default: '02'
  },
  collateralDatas: {
    default: []
  },
  guaranteeDatas: {
    default: []
  },
  guaranteeStatus: {
    default: '02'
  },
  deleteCollateralData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  deleteGuaranteeData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  deleteAttachData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getAtcPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
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
  getColPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getGuiPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  authorLineDatasClear: {
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
const showAtcSearch = ref(props.showAtcSearch)
const showAthSearch = ref(props.showAthSearch)
const showApvSearch = ref(props.showApvSearch)
const showColSearch = ref(props.showColSearch)
const showGuiSearch = ref(props.showGuiSearch)
const checkCollateralFlag = ref(props.checkCollateralFlag)
// const isCalendarOpen = ref(props.isCalendarOpen)
const session = useSessionStore()
const nonTarget = ref(true)
const checkAmtMsg = 'The Collateral & Guarantee amount is less than the loan amount. Do you want to proceed?'
const checkRegMsg = 'Have you finished registering Collateral & Guarantee?'
/* =======================================================
    Freeform Funtion
======================================================= */
watch(props, (newProps) => {
  if (newProps.checkCollateralFlag) {
    checkCollateralFlag.value = true
  } else {
    checkCollateralFlag.value = false
  }
})

// 담보 & 보증 금액 합계와 대출금액 비교
const sumAmount = () => {
  const totalPledgeAmount = ref(0)
  const totalGuaranteeAmt = ref(0)
  for (const item of props.collateralDatas) {
    totalPledgeAmount.value += item.plgAmount
  }

  for (const item of props.guaranteeDatas) {
    totalGuaranteeAmt.value += item.guaAmount
  }
  if (totalPledgeAmount.value + totalGuaranteeAmt.value < formParam.value.applicationAmount.value) {
    const _confirm = () => {
      showApvSearch.value = true
    }
    messageBox.confirm((checkAmtMsg), _confirm)
  } else {
    showApvSearch.value = true
  }
}

const handleRowClick = (type, param1, param2, param3, param4) => {
  showPopup(type, param1, param2, param3, param4)
}

const showPopup = (type, param1, param2, param3, param4) => {
  const trMode = formParam.value.transactionMode.value
  const specific = '01' // Guarantee Type 특정 보증 (하나의 보증만 등록 가능)

  // 아래 팝업만 모든 상황에서 조회 가능
  if (type !== 'col' && type !== 'atc' && type !== 'ath' && type !== 'apv' && type !== 'apc' && type !== 'gui') {
    if (trMode === 'INQUIRY' || trMode === 'DELETE') return
  }
  showApvSearch.value = false
  showColSearch.value = false
  showAtcSearch.value = false
  showAthSearch.value = false
  // 팝업별 파라미터 세팅 및 화면 오픈
  switch (type) {
    case 'apv' :
      if (checkCollateralFlag.value && (props.collateralDatas.length + props.guaranteeDatas.length < 1)) { // 대출의 종류가 담보대출일 경우 담보or보증 등록 후 결재선 등록 가능 (checkCollateralFlag가 담보대출 이면 true)
        messageBox.alertInfo('Please register the Collateral & Guarantee')
        break
      } else {
        if (checkCollateralFlag.value && (props.collateralDatas.length + props.guaranteeDatas.length > 0)) { // 등록된 담보or보증이 존재할 경우 등록이 끝났는지 확인하는 alert창
          const _confirm = () => {
            sumAmount() // 담보&보증금액 합계와 대출금액 비교
          }
          messageBox.confirm((checkRegMsg), _confirm)
        } else {
          showApvSearch.value = true
        }
      }
      break
    case 'col' :
      if (checkCollateralFlag.value === false) {
        messageBox.alertInfo('This loan is a credit loan.')
        return
      }
      formParam.value.pledgeNo.value = !commonUtil.isEmpty(param1) ? param1 : ''
      showColSearch.value = true; break
    case 'gui' :
      if (checkCollateralFlag.value === false) {
        messageBox.alertInfo('This loan is a credit loan.')
        return
      }
      // Guarantee추가 버튼 클릭시 기존 등록된 보증의 Guarantee Type = Specific 이면 추가 등록 불가
      // (Specific Type은 하나의 보증만 등록 가능)
      if (commonUtil.isEmpty(param1)) {
        for (const data of props.guaranteeDatas) {
          if (data.guaranteeTypeCode === specific) {
            messageBox.alertInfo('There is a already \'Specific\' guarantee type')
            return
          }
        }
      }
      formParam.value.guaranteeNo.value = !commonUtil.isEmpty(param1) ? param1 : ''
      showGuiSearch.value = true; break
    case 'atc' :
      formParam.value.postAttachNo.value = !commonUtil.isEmpty(param1) ? param1 : ''
      showAtcSearch.value = true; break
    case 'ath' :
      formParam.value.authorEmployeeNo.value = !commonUtil.isEmpty(param1) ? param1 : ''
      formParam.value.authorizationStatus.value = !commonUtil.isEmpty(param2) ? param2 : ''
      formParam.value.authorizationNo.value = !commonUtil.isEmpty(param3) ? param3 : ''
      formParam.value.authorizationDate.value = !commonUtil.isEmpty(param4) ? param4 : ''
      formParam.value.fromBtn.value = formParam.value.registEmployeeNo.value === session.sysEmployeeNo ? 'apply' : ''
      showAthSearch.value = true; break
  }
  // isCalendarOpen.value = true
}
</script>
