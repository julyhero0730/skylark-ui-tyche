<template>
    <div class="table_top_button_wrapper">
                    <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
                </div>
                <div class="scrollable-container height73">
                    <div class="msg_info_form_quadruple_box">
                        <div>
                            <label class="form_label is_required">{{ $t('label.objt.guaranteeNo') }}</label>
                            <div class="relative-container d-flex items-center">
                              <template v-if="formParam.transactionMode.value !== 'INQUIRY'">
                                <CommonDirectSearchBox class="width100" maxlength="30" placeholder="Auto Generate" v-model="formParam.guaranteeNo.value" :disable=disableFlag ref="guaranteeNo" hlpType="lonHlpGua" :searchCode="formParam.guaranteeNo.value" @directSearchVal="getGuaDirectSearch" ></CommonDirectSearchBox>&nbsp;&nbsp;
                              </template>
                              <template v-if="formParam.transactionMode.value === 'INQUIRY'">
                                <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.guaranteeNo.value" :disable=disableFlag ref="guaranteeNo" hlpType="lonHlpGua" :searchCode="formParam.guaranteeNo.value" @directSearchVal="getGuaDirectSearch" ></CommonDirectSearchBox>&nbsp;&nbsp;
                              </template>
                                <q-icon name="search" size="sm" style="position:absolute; right:10px; transform: translateY(-5%);" class="help_button_simple" @click="showGuaSearchPopup()" />
                                <lonHlpGua v-model="showGuaSearch" @selected-popup-row-data = "getGuaPopupRowData"></lonHlpGua>
                            </div>
                        </div>
                        <div class="full-row">
                          <div>
                            <label class="form_label is_required">{{ $t('label.objt.transactionStatus') }}</label>
                            <q-card class="my-card">
                                <div class="radios-wrapper" >
                                    <div class="radio-wrapper" style="margin-right: 30px;">
                                        <q-radio v-model="formParam.transactionStatusCd.value" val="01" :disable="nonTarget"/>
                                        <label class="form_label" style="margin-bottom: 0;">{{ $t('label.objt.guaranteeRegistration') }}</label>
                                    </div>
                                    <div class="radio-wrapper" style="margin-right: 30px;">
                                        <q-radio v-model="formParam.transactionStatusCd.value" val="02" :disable="nonTarget"/>
                                        <label class="form_label" style="margin-bottom: 0;">{{ $t('label.objt.guaranteeContract') }}</label>
                                    </div>
                                    <div class="radio-wrapper">
                                      <q-radio v-model="formParam.transactionStatusCd.value" val="05" :disable="nonTarget"/>
                                      <label class="form_label" style="margin-bottom: 0;">{{ $t('label.objt.guaranteeRelease') }}</label>
                                    </div>
                                </div>
                            </q-card>
                        </div>
                        </div>
                    </div>
                    <div class="msg_info_form_quadruple_box">
                        <div>
                            <label class="form_label is_required">{{ $t('label.objt.guaranteeType') }}</label>
                            <CommonSearchSelectBox :codeList="commonCodeList.guaranteeStatusCode" v-model="formParam.guaranteeTypeCode.value" :disable="nonTarget"></CommonSearchSelectBox>
                        </div>
                        <div>
                            <label class="form_label">{{ $t('label.view.registerDate') }}</label>
                            <CommonCalendarYMD v-model="formParam.registerDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'register')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                        </div>
                        <div>
                            <label class="form_label">{{ $t('label.objt.contractDate') }}</label>
                            <CommonCalendarYMD v-model="formParam.contractDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'contract')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                        </div>
                    </div>
                    <div class="msg_info_form_quadruple_box">
                      <div></div>
                      <div>
                            <label class="form_label">{{ $t('label.objt.releaseDate') }}</label>
                            <CommonCalendarYMD v-model="formParam.releaseDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'release')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                        </div>
                        <div>
                          <label class="form_label is_required">{{ $t('label.objt.expireDate') }}</label>
                          <CommonCalendarYMD v-model="formParam.expireDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'expire')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                      </div>
                    </div>
                    <div class="msg_info_form_quadruple_box">
                        <div class="full-row">
                            <label class="form_label is_required">{{ $t('label.objt.guarantor') }}</label>
                            <div class="horizontal-layout d-flex items-center">
                                <CommonDirectSearchBox class="width26" maxlength="30" v-model="formParam.guarantorNo.value" :disable="nonTarget" hlpType="frmHlpCst" :searchCode="formParam.guarantorNo.value" @directSearchVal="getGurDirectSearch"></commonDirectSearchBox>
                                <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="nonTarget ? null : showGuarantorPopup()" />
                                <frmHlpCst v-model="showGuarantorSearch" @selected-popup-row-data = "getPopupGuaRowData"></frmHlpCst>
                                <CommonInputBox maxlength="30" v-model="formParam.guarantorName.value" :disable="cdDisable" class="w_100 width74" style="margin-left: -20px;"></CommonInputBox>
                            </div>
                        </div>
                        <div>
                          <div>
                            <div style=" display: flex;">
                              <label class="form_label width30" style="margin-right: 20px;">{{ $t('label.objt.creditScore') }}</label>
                              <label class="form_label width75">{{ $t('label.objt.evaluationDate') }}</label>
                            </div>
                              <div style=" display: flex;">
                                <CommonInputBox class="width30" maxlength="10" v-model="formParam.creditRating.value" :disable="nonTarget" style="margin-right: 20px;"></CommonInputBox>
                                <CommonCalendarYMD class="width65" v-model="formParam.creditEvltDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'creditEvlt')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                              </div>
                          </div>
                        </div>
                    </div>
                    <div class="msg_info_form_quadruple_box">
                        <div class="full-row">
                            <label class="form_label is_required">{{ $t('label.view.loanCustomer') }}</label>
                            <div class="horizontal-layout d-flex items-center">
                                <CommonDirectSearchBox class="width26" maxlength="30" v-model="formParam.customerNo.value" :disable="nonTarget" hlpType="frmHlpCst" :searchCode="formParam.customerNo.value" @directSearchVal="getCstDirectSearch"></commonDirectSearchBox>
                                <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="nonTarget ? null : showCstSearchPopup()" />
                                <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getPopupCstRowData"></frmHlpCst>
                                <CommonInputBox  v-model="formParam.customerName.value" :disable="cdDisable" class="w_100 width74" style="margin-left: -20px;"></CommonInputBox>
                            </div>
                        </div>
                        <div>
                            <label class="form_label is_required">{{ $t('label.objt.relationCustomer') }}</label>
                            <CommonSearchInputBox v-model="formParam.borrowerRelation.value" :disable="nonTarget"></CommonSearchInputBox>
                        </div>
                    </div>

                    <div class="msg_info_form_quadruple_box" style="margin-top: 10px;">
                        <q-list class="qlist-box text-white rounded-borders all-full-row bordered-items">
                        <q-expansion-item
                        v-model="isGuarantorExpanded"
                        :label="$t('label.view.guarantorInfo')"
                        >
                        <template v-slot:header>
                            <div class="text-center full-width">{{ $t('label.view.guarantorInfo') }}</div>
                        </template>
                        <q-card>
                            <q-card-section style="margin-bottom: 0px;">
                                <div class="msg_info_form_quadruple_box">
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.guarantorHouseType') }}</label>
                                        <CommonSearchSelectBox :codeList="commonCodeList.houseTypeCode" v-model="formParam.houseTypeCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
                                    </div>
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.houseOccupancyType') }}</label>
                                        <CommonSearchSelectBox :codeList="commonCodeList.houseOcpncyCode" v-model="formParam.houseOcpncyCode.value" :disable="nonTarget" ></CommonSearchSelectBox>
                                    </div>
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.socialStatus') }}</label>
                                        <div class="horizontal-layout d-flex items-center">
                                            <CommonInputBox class="width100" maxlength="30" v-model="formParam.socialStatus.value" :disable="nonTarget"></CommonInputBox>
                                        </div>
                                    </div>
                                </div>
                                <div class="msg_info_form_quadruple_box">
                                  <div>
                                    <label class="form_label">{{ $t('label.objt.occupationType') }}</label>
                                    <CommonSearchSelectBox :codeList="commonCodeList.ocuptTypeCode" v-model="formParam.ocuptTypeCode.value" :disable="nonTarget"></CommonSearchSelectBox>
                                  </div>
                                  <div class="full-row">
                                      <label class="form_label">{{ $t('label.objt.occupationDetail') }}</label>
                                      <div class="horizontal-layout d-flex items-center">
                                          <CommonInputBox class="width100" maxlength="30" v-model="formParam.occupationDetail.value" :disable="nonTarget"></CommonInputBox>
                                      </div>
                                  </div>
                                </div>
                                <div class="msg_info_form_quadruple_box">
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.guarantorRevenueIncome') }}</label>
                                        <div class="double_input_box">
                                            <CommonCurFormatterBox
                                              class="width100"
                                              :modelValues="revenueCurForm"
                                              :selectDisabled="nonTarget" :inputDisabled="nonTarget">
                                            </CommonCurFormatterBox>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.netWorth') }}</label>
                                        <div class="double_input_box">
                                            <CommonCurFormatterBox
                                              class="width100"
                                              :modelValues="networthCurForm"
                                              :selectDisabled="nonTarget" :inputDisabled="nonTarget">
                                            </CommonCurFormatterBox>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.incomeTax') }}</label>
                                        <div class="double_input_box">
                                            <CommonCurFormatterBox
                                              class="width100"
                                              :modelValues="incometaxCurForm"
                                              :selectDisabled="nonTarget" :inputDisabled="nonTarget">
                                            </CommonCurFormatterBox>
                                        </div>
                                    </div>
                                    </div>
                                    <div class="msg_info_form_quadruple_box">
                                    <div>
                                        <label class="form_label">{{ $t('label.objt.financialAsset') }}</label>
                                        <div class="double_input_box">
                                            <CommonCurFormatterBox
                                              class="width100"
                                              :modelValues="financialCurForm"
                                              :selectDisabled="nonTarget" :inputDisabled="nonTarget">
                                            </CommonCurFormatterBox>
                                        </div>
                                    </div>
                                    <div></div>
                                    <div>
                                        <label class="form_label is_required">{{ $t('label.objt.managementBranch') }}</label>
                                        <CommonSearchSelectBox :codeList="commonCodeList.branchNameList" v-model="formParam.manageBrcd.value" :disable="nonTarget"></CommonSearchSelectBox>
                                    </div>
                                </div>
                                <div class="msg_info_form_quadruple_box">
                                        <div class="all-full-row">
                                            <label class="form_label">{{ $t('label.view.remark') }}</label>
                                            <q-input v-model="formParam.rmk.value" filled type="textarea" style="background-color: #F9F9F9; border: 1px solid #E5E5E5" :disable="nonTarget"/>
                                        </div>
                                </div>

                            </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <q-expansion-item
                          v-model="isRelevantExpanded"
                          :label="$t('label.view.relevantGuarantees')"
                          style="text-align:center;"
                          >
                          <q-card>
                          <q-card-section>
                              <div id="formDetlGrid" class="table_scroll_box width100">
                                  <ag-grid-vue
                                      class="msg_table ag-theme-balham height30"
                                      :getRowStyle="gridProps.getRowStyle"
                                      :columnDefs="gridProps.columnDefs(commonCodeList)"
                                      :columnTypes="gridProps.columnTypes"
                                      :rowData="rowData"
                                      :defaultColDef="gridProps.defaultColDef"
                                      :pinnedBottomRowData="gridProps.pinnedBottomRowData"
                                      rowSelection="single"
                                      @grid-ready="gridProps.onGridReady"
                                  ></ag-grid-vue>
                              </div>

                </q-card-section>
                </q-card>
                        </q-expansion-item>

                        </q-list>
                    </div>
                </div>
    </template>
<script setup>
/* =======================================================
        Import Area
      ======================================================= */
import { ref, watch } from 'vue'
import { gridProps } from 'src/pages/lon/col/gua/lonColGuaGridProps.vue'
import { AgGridVue } from 'ag-grid-vue3'
import lonHlpGua from 'src/components/pages/main/hlp/lon/lonHlpGua.vue'
import { frmHlpCst } from 'skylark-ui-lib'

/* =======================================================
        Global Variable
      ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  rowData: {
    default: []
  },
  vehicleParam: {
    default: {}
  },
  othersParam: {
    default: {}
  },
  radioDisableFlag: {
    default: {}
  },
  revenueCurForm: {
    default: {}
  },
  networthCurForm: {
    default: {}
  },
  incometaxCurForm: {
    default: {}
  },
  financialCurForm: {
    default: {}
  },
  commonCodeList: {
    default: []
  },
  cdDisable: {
    default: true
  },
  nonTarget: {
    default: false
  },
  disableFlag: {
    default: false
  },
  showGuaSearch: {
    default: false
  },
  showGuarantorSearch: {
    default: false
  },
  showCstSearch: {
    default: false
  },
  isGuarantorExpanded: {
    default: false
  },
  isRelevantExpanded: {
    default: false
  },
  save: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  updateTrxnMode: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  getGuaPopupRowData: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  getPopupGuaRowData: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  getPopupCstRowData: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  getGurDirectSearch: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  getCstDirectSearch: {
    type: Function,
    /**
         *
         */
    default () {
    }
  },
  getGuaDirectSearch: {
    type: Function,
    /**
         *
         */
    default () {
    }
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
const showGuaSearch = ref(props.showGuaSearch)
const showGuarantorSearch = ref(props.showGuarantorSearch)
const showCstSearch = ref(props.showCstSearch)

const isGuarantorExpanded = ref(props.isGuarantorExpanded)
const isRelevantExpanded = ref(props.isRelevantExpanded)

/* =======================================================
        Freeform Funtion
    ======================================================= */
const isGuarantorOld = ref(false)
const isRelevantOld = ref(false)
watch(props, (newProps) => {
  if (newProps.isGuarantorExpanded !== isGuarantorOld.value) {
    isGuarantorExpanded.value = newProps.isGuarantorExpanded
    isGuarantorOld.value = isGuarantorExpanded.value
  }

  if (newProps.isRelevantExpanded !== isRelevantOld.value) {
    isRelevantExpanded.value = newProps.isRelevantExpanded
    isRelevantOld.value = isRelevantExpanded.value
  }
})

const showGuaSearchPopup = () => {
  if (formParam.value.transactionMode.value === 'INQUIRY') {
    showGuaSearch.value = true
  } else {
    showGuaSearch.value = false
  }
}

const showGuarantorPopup = () => {
  showGuarantorSearch.value = true
}

const showCstSearchPopup = () => {
  showCstSearch.value = true
}

const checkExpireDate = (newValue, str) => {
  if (newValue === 'Invalid Date') {
    switch (str) {
      case 'expire' : formParam.value.expireDate.value = ''
        break
      case 'register' : formParam.value.registerDate.value = ''
        break
      case 'contract' : formParam.value.contractDate.value = ''
        break
      case 'release' : formParam.value.releaseDate.value = ''
        break
      case 'creditEvlt' : formParam.value.creditEvltDate.value = ''
        break
    }
  }
}

</script>

    <style scoped>
    .qlist-box {
      background-color: #4850b2;
    }
    .bordered-items > .q-expansion-item {
      border: 1px solid rgb(153, 153, 153);
    }
    .text-center.full-width {
        text-align: center;
        line-height: 50px;
    }
    .double_input_box {
        display: flex;
        gap: 10px;
    }
    .triple-box {
      display: grid;
      gap: 20px 30px;
      padding: 10px 0 0;
      overflow: visible;
  }
  .all-full-row {
    grid-column-start: span 3;
  }
    </style>
