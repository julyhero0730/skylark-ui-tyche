<template>
  <q-list>
        <!-- 결재선 -->
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Approval Line"
          default-opened
        >
          <!-- 기등록된 결재선이 존재 -->
          <template v-if="authorStatus === '01'">
            <q-list approvals>
              <q-item v-for="(rowData, index) in authorLineDatas"
                clickable
                @click="handleRowClick('ath', rowData.employeeNo, rowData.authResultCode, rowData.authorizationNo, rowData.authorizationDate)"
                :key="index">
                <q-item-section avatar>
                  <q-avatar size="md" :icon="rowData.icon" :color="rowData.color" text-color="white"></q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ rowData.name }}</q-item-label>
                  <q-item-label caption>{{ rowData.position }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="rowData.sortSeq === 0">
                  <q-badge color="grey" label="Applicant" />
                  {{ rowData.status }}
                </q-item-section>

                <q-item-section side v-if="rowData.sortSeq !== 0">
                  <q-badge v-if="rowData.finalApproverYn === 'Y'" color="grey" label="Final Approver" />
                  {{ rowData.status }}
                </q-item-section>
              </q-item>
            </q-list>
          </template>
          <!-- 신청번호 없음(신청 필요) -->
          <template v-else>
            <q-list approvals>
              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ authorLineComment }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </template>
          <lonHlpAth
            :application-No=formParam.applicationNo.value
            :approve-Employee-No=formParam.authorEmployeeNo.value
            :apply-Employee-No=formParam.registEmployeeNo.value
            :from-Btn=formParam.fromBtn.value
            v-model="showAthSearch"
            @selected-popup-row-data="getAthPopupRowData">
          </lonHlpAth><br>
        </q-expansion-item>

        <!-- 담보 & 보증-->
        <q-expansion-item
          expand-separator
          icon="signal_wifi_off"
          label="Collateral & Guarantee"
          default-opened
        >
          <q-list collaterals>
            <!-- 담보 목록 -->
            <template v-if="collateralStatus === '01'">
              <div v-for="(rowData, index) in collateralDatas" :key="index" style="display:flex;">
                <q-item class="width100" clickable @click="handleRowClick('col', rowData.pledgeNo)">
                  <q-item-section avatar>
                    <q-avatar size="md" :icon="rowData.icon" color="grey" text-color="white"></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ rowData.type}}</q-item-label>
                    <q-item-label caption>{{ rowData.name }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                      <q-item-label >{{ rowData.ccycdPledge }}</q-item-label>
                      <q-item-label >{{ rowData.pledgeAmount }}
                      </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <!-- 보증 목록-->
              <div v-for="(rowData, index) in guaranteeDatas" :key="index" style="display:flex;">
                  <q-item class="width100" clickable @click="handleRowClick('gui', rowData.guaranteeNo)">
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
                </div>
            </template>
            <template v-else>
              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ collateralComment }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list><br>
          <lonHlpPlg
            :lon-Pledge-List=collateralDatas
            :lon-Customer-Name=formParam.customerName.value
            :lon-Customer-No=formParam.customerNo.value
            :lon-Application-No=formParam.applicationNo.value
            :lon-Pledge-No=formParam.pledgeNo.value
            v-model="showColSearch"
            @selected-popup-row-data="getColPopupRowData">
          </lonHlpPlg>
          <lonHlpGui
            :lon-guarantee-no="formParam.guaranteeNo.value"
            :lon-Application-No=formParam.applicationNo.value
            :lon-Customer-No=formParam.customerNo.value
            :lon-Customer-Name=formParam.customerName.value
            v-model="showGuiSearch"
            @selected-popup-row-data="getGuiPopupRowData">
          </lonHlpGui>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="drafts"
          label="Attached Document"
          default-opened
        >
          <q-list documents>
            <template v-if="attachedStatus === '01'">
              <div v-for="(rowData, index) in attachedDatas" :key="index" style="display:flex;">
                <q-item class="width100" style="padding: 0px, 0px, 0px, 0px;" clickable @click="handleRowClick('atc', rowData.postAttachNo)">
                  <q-item-section avatar top>
                    <q-avatar size="md" :icon="rowData.icon" color="grey" text-color="white"></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ rowData.name }}</q-item-label>
                    <q-item-label caption>{{ rowData.desc }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </template>
            <template v-else>
              <q-item>
                <q-item-section>
                  <q-item-label caption>{{ attachComment }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-expansion-item>

      </q-list>
</template>

<script setup>
/* =======================================================
  1. Import Area
======================================================= */
import { ref } from 'vue'
import lonHlpAth from 'src/components/pages/main/hlp/lon/lonHlpAth.vue'
import lonHlpPlg from 'src/components/pages/main/hlp/lon/lonHlpPlg.vue'
import lonHlpGui from 'src/components/pages/main/hlp/lon/lonHlpGui.vue'
import { commonUtil } from 'skylark-ui-lib'

/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  showColSearch: {
    type: Boolean,
    default: false
  },
  showGuiSearch: {
    type: Boolean,
    default: false
  },
  showAtcSearch: {
    type: Boolean,
    default: false
  },
  showApcSearch: {
    type: Boolean,
    default: false
  },
  showAthSearch: {
    type: Boolean,
    default: false
  },
  showAtoSearch: {
    type: Boolean,
    default: false
  },
  isCalendarOpen: {
    type: Boolean,
    default: false
  },
  authorLineComment: {
    default: 'Yon can enter if after the application is completed'
  },
  collateralComment: {
    default: 'Yon can enter if after the application is completed'
  },
  attachComment: {
    default: 'Yon can enter if after the application is completed'
  },
  authorLineDatas: {
    default: []
  },
  collateralDatas: {
    default: []
  },
  guaranteeDatas: {
    default: []
  },
  attachedDatas: {
    default: []
  },
  authorStatus: {
    default: '02'
  },
  collateralStatus: {
    default: '02'
  },
  attachedStatus: {
    default: '02'
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
  }

})
/* =======================================================
    Freeform Object
  ======================================================= */
const formParam = ref(props.formParam)
const showColSearch = ref(props.showColSearch)
const showGuiSearch = ref(props.showGuiSearch)
const showAtcSearch = ref(props.showColSearch)
const showApcSearch = ref(props.showAthSearch)
const showAthSearch = ref(props.showColSearch)
const showAtoSearch = ref(props.showColSearch)
const isCalendarOpen = ref(props.isCalendarOpen)

/* =======================================================
    Freeform Funtion
======================================================= */

// 기존 내용 조회 팝업
const handleRowClick = (type, param1, param2, param3, param4) => {
  showPopup(type, param1, param2, param3, param4)
}

const showPopup = (type, param1, param2, param3, param4, fromBtn) => {
  showColSearch.value = false
  showAtcSearch.value = false
  showApcSearch.value = false
  showAthSearch.value = false
  showAtoSearch.value = false

  switch (type) {
    case 'col' :
      if (!commonUtil.isEmpty(param1)) formParam.value.pledgeNo.value = param1
      else formParam.value.pledgeNo.value = ''
      showColSearch.value = true; break
    case 'gui' :
      if (!commonUtil.isEmpty(param1)) formParam.value.guaranteeNo.value = param1
      showGuiSearch.value = true; break
    case 'atc' :
      if (!commonUtil.isEmpty(param1)) formParam.value.postAttachNo.value = param1
      else formParam.value.postAttachNo.value = ''
      showAtcSearch.value = true; break
    case 'apc' :
      if (formParam.value.transactionMode.value !== 'NEW') return
      showApcSearch.value = true; break
    case 'ath' :
      formParam.value.authorEmployeeNo.value = !commonUtil.isEmpty(param1) ? param1 : formParam.value.authorEmployeeNo.value
      formParam.value.authResultCode.value = !commonUtil.isEmpty(param2) ? param2.value : formParam.value.authResultCode.value
      formParam.value.authorizationNo.value = !commonUtil.isEmpty(param3) ? param3 : formParam.value.authorizationNo.value
      formParam.value.authorizationDate.value = !commonUtil.isEmpty(param4) ? param4.value : formParam.value.authorizationDate.value
      formParam.value.fromBtn.value = !commonUtil.isEmpty(fromBtn) ? fromBtn : ''
      showAthSearch.value = true
      break
    case 'ato' :
      if (formParam.value.transactionMode.value === 'NEW') return
      showAtoSearch.value = true; break
  }
  isCalendarOpen.value = true
}

</script>
