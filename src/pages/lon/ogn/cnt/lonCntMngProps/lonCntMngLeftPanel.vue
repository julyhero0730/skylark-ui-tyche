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
  <lonHlpApv
    :application-No=formParam.applicationNo.value
    v-model="showApvSearch"
    @selected-popup-row-data="getApvPopupRowData">
  </lonHlpApv>
  <lonHlpAth
    :application-No=formParam.applicationNo.value
    :approve-Employee-No=formParam.authorEmployeeNo.value
    :apply-Employee-No=formParam.registEmployeeNo.value
    v-model="showAthSearch"
    @selected-popup-row-data="getAthPopupRowData">
  </lonHlpAth><br><br>
</q-expansion-item>

<!-- 담보 -->
<q-expansion-item
  expand-separator
  icon="signal_wifi_off"
  label="Collateral & Guarantee"
  default-opened
>
  <q-list collaterals>
    <!-- 등록된 담보 정보-->
    <template v-if="collateralStatus === '01'">
      <q-item v-for="(rowData, index) in collateralDatas" :key="index" clickable @click="handleRowClick('col', rowData.pledgeNo)">
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
        <q-item-section side>
        </q-item-section>
      </q-item>

      <!-- 등록된 보증 정보-->
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
                  <q-item-section side>
                  </q-item-section>
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
    @selected-popup-row-data="getGuiPopupRowData"></lonHlpGui>
</q-expansion-item>

<q-expansion-item
  expand-separator
  icon="drafts"
  label="Attached Document"
  default-opened
>
  <q-list documents>
    <template v-if="attachedStatus === '01'">
      <q-item v-for="(rowData, index) in attachedDatas" clickable @click="handleRowClick('atc', rowData.postAttachNo)" :key="index">
        <q-item-section avatar top>
          <q-avatar :icon="rowData.icon" color="grey" text-color="white"></q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ rowData.name }}</q-item-label>
          <q-item-label caption>{{ rowData.desc }}</q-item-label>
        </q-item-section>
        <q-item-section side>
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-item>
        <q-item-section>
          <q-item-label caption>{{ attachComment }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
  <lonHlpAtc :post-Attach-No=formParam.postAttachNo.value :application-No=formParam.applicationNo.value v-model="showAtcSearch" @selected-popup-row-data = "getAtcPopupRowData"></lonHlpAtc>
</q-expansion-item>

</q-list>
</template>

<script setup>
/* =======================================================
    Import Area
  ======================================================= */
import { ref } from 'vue'
import lonHlpAtc from 'src/components/pages/main/hlp/lon/lonHlpAtc.vue'
import lonHlpAth from 'src/components/pages/main/hlp/lon/lonHlpAth.vue'
import lonHlpApv from 'src/components/pages/main/hlp/lon/lonHlpApv.vue'
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
  authorLineComment: {
    default: 'No Approval Line Data'
  },
  collateralComment: {
    default: 'No Collateral & Guarantee Line Data'
  },
  attachComment: {
    default: 'No Attached Data'
  },
  showApvSearch: {
    default: false
  },
  showAthSearch: {
    default: false
  },
  showColSearch: {
    default: false
  },
  showGuiSearch: {
    default: false
  },
  showAtcSearch: {
    default: false
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
  getAtcPopupRowData: {
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
const showApvSearch = ref(props.showApvSearch)
const showAthSearch = ref(props.showAthSearch)
const showColSearch = ref(props.showColSearch)
const showGuiSearch = ref(props.showGuiSearch)
const showAtcSearch = ref(props.showAtcSearch)

/* =======================================================
    Freeform Funtion
======================================================= */

const handleRowClick = (type, param1, param2, param3, param4) => {
  showPopup(type, param1, param2, param3, param4)
}

const showPopup = (type, param1, param2, param3, param4) => {
  switch (type) {
    case 'apv' : showApvSearch.value = true; break
    case 'col' :
      if (!commonUtil.isEmpty(param1)) {
        formParam.value.pledgeNo.value = param1
      } else {
        formParam.value.pledgeNo.value = ''
      }
      showColSearch.value = true; break
    case 'gui' :
      formParam.value.guaranteeNo.value = param1
      showGuiSearch.value = true; break
    case 'atc' :
      if (!commonUtil.isEmpty(param1)) {
        formParam.value.postAttachNo.value = param1
      } else {
        formParam.value.postAttachNo.value = ''
      }
      showAtcSearch.value = true; break
    case 'ath' :
      if (!commonUtil.isEmpty(param1)) {
        formParam.value.authorEmployeeNo.value = param1
      }
      if (!commonUtil.isEmpty(param2)) {
        formParam.value.authorizationStatus.value = param2
      }
      if (!commonUtil.isEmpty(param3)) {
        formParam.value.authorizationNo.value = param3
      }
      if (!commonUtil.isEmpty(param4)) {
        formParam.value.authorizationDate.value = param4
      }
      showAthSearch.value = true; break
  }
}
</script>
