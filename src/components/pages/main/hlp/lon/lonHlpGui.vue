<template>
  <q-page-container>
    <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width70" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.lonHlpGui') }}</div>
                <q-space />
                <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="scrollable-container">
                <q-toolbar style="display:flex; align-items: center; background-color:rgb(232, 232, 240)" class="rounded-borders">
                  <label class="width100" style="font-size: 16px; font-weight: 500; text-align: center;">Guarantee Information</label>
                </q-toolbar>
                <div class="msg_info_form_quadruple_box" style="display:flex;">
                      <div class="width23">
                          <label class="form_label is_required">{{ $t('label.objt.guaranteeNo') }}</label>
                          <div class="relative-container d-flex items-center" style="display: flex;">
                              <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.guaranteeNo.value" :disable=nonTarget ref="guaranteeNo" hlpType="lonHlpGua" :searchCode="formParam.guaranteeNo.value"></CommonDirectSearchBox>&nbsp;&nbsp;
                              <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="showPopup('gua')" />
                              <lonHlpGua
                              v-model="showGuaSearch"
                              @selected-popup-row-data = "getGuaPopupRowData"
                              :customer-no="formParam.customerNo.value"
                              :customer-name="formParam.customerName.value"
                              search-criteria="LOAN_CUSTOMER">
                            </lonHlpGua>
                          </div>
                      </div>
                      <div class="full-row" style="flex-grow: 2;">
                        <div>
                          <label class="form_label is_required">{{ $t('label.objt.transactionStatus') }}</label>
                          <q-card class="my-card">
                              <div class="radios-wrapper" style="display: flex; justify-content: space-between; margin: 0 50px 0 50px;">
                                  <div class="radio-wrapper" style="margin-right: 30px; display: flex; align-items: center;">
                                      <q-radio v-model="formParam.transactionStatusCd.value" val="01" :disable="nonTarget"/>
                                      <label class="form_label" style="margin-bottom: 0;">{{ $t('label.objt.registration') }}</label>
                                  </div>
                                  <div class="radio-wrapper" style="margin-right: 30px; display: flex; align-items: center;">
                                      <q-radio v-model="formParam.transactionStatusCd.value" val="02" :disable="nonTarget"/>
                                      <label class="form_label" style="margin-bottom: 0;">{{ $t('label.view.contract') }}</label>
                                  </div>
                                  <div class="radio-wrapper" style="display: flex; align-items: center;">
                                    <q-radio v-model="formParam.transactionStatusCd.value" val="05" :disable="nonTarget"/>
                                    <label class="form_label" style="margin-bottom: 0;">{{ $t('label.objt.release') }}</label>
                                  </div>
                              </div>
                          </q-card>
                      </div>
                      </div>
                      <div class="width23">
                          <label class="form_label">{{ $t('label.view.registerDate') }}</label>
                          <CommonCalendarYMD v-model="formParam.registerDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'register')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                      </div>
                  </div>
                  <div class="msg_info_form_quadruple_box">
                      <div>
                          <label class="form_label is_required">{{ $t('label.objt.guaranteeType') }}</label>
                          <CommonSearchSelectBox :codeList="commonCodeList.guaranteeStatusCode" v-model="formParam.guaranteeTypeCode.value" :disable="nonTarget"></CommonSearchSelectBox>
                      </div>

                      <div>
                          <label class="form_label">{{ $t('label.objt.contractDate') }}</label>
                          <CommonCalendarYMD v-model="formParam.contractDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'contract')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                      </div>
                      <div>
                        <label class="form_label is_required">{{ $t('label.objt.expireDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.expireDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'expire')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.releaseDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.releaseDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'release')" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                    </div>
                  </div>
                  <div class="msg_info_form_triple_box" style="display: flex">
                    <div class="width70" style="flex-grow: 2;">
                          <label class="form_label is_required">{{ $t('label.objt.guarantor') }}</label>
                          <div class="horizontal-layout d-flex items-center" style="display: flex;">
                              <CommonDirectSearchBox class="width20" maxlength="30" v-model="formParam.guarantorNo.value" :disable="nonTarget" hlpType="frmHlpCst" :searchCode="formParam.guarantorNo.value" @directSearchVal="getGurDirectSearch"></commonDirectSearchBox>
                              <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="nonTarget ? null : showPopup('guarantor')" />
                              <frmHlpCst v-model="showGuarantorSearch" @selected-popup-row-data = "getGuarantorPopup"></frmHlpCst>
                              <CommonInputBox maxlength="30" v-model="formParam.guarantorName.value" :disable="true" class="w_100 width77" style="margin-left: -10px;"></CommonInputBox>
                          </div>
                      </div>
                      <div>
                        <div>
                          <div style=" display: flex;">
                            <label class="form_label width30" style="margin-right: 10px;">{{ $t('label.objt.creditScore') }}</label>
                            <label class="form_label width70">{{ $t('label.objt.evaluationDate') }}</label>
                          </div>
                            <div style=" display: flex;">
                              <CommonInputBox maxlength="10" v-model="formParam.creditRating.value" :disable="nonTarget" style="margin-right: 20px; width: 30%"></CommonInputBox>
                              <CommonCalendarYMD v-model="formParam.creditEvltDate.value" @update:model-value="newValue => checkExpireDate(newValue, 'creditEvlt')" style="text-align-last: center; width: 75%;" :disable="nonTarget"></CommonCalendarYMD>
                            </div>
                        </div>
                      </div>
                  </div>
                  <div class="msg_info_form_triple_box" style="display: flex">
                    <div class="width70" style="flex-grow: 2;">
                      <label class="form_label is_required">{{ $t('label.view.loanCustomer') }}</label>
                          <div class="horizontal-layout d-flex items-center" style="display: flex;">
                              <CommonDirectSearchBox class="width20" maxlength="30" v-model="formParam.customerNo.value" :disable="nonTarget" hlpType="frmHlpCst" :searchCode="formParam.customerNo.value"></commonDirectSearchBox>
                              <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="nonTarget ? null : showPopup('cst')" />
                              <frmHlpCst v-model="showCstSearch" @selected-popup-row-data = "getCstPopupRowData"></frmHlpCst>
                              <CommonInputBox  v-model="formParam.customerName.value" :disable="true" class="w_100 width77" style="margin-left: -10px;"></CommonInputBox>
                          </div>
                    </div>
                    <div class="width27" style="margin-right: 2px;">
                        <label class="form_label is_required">{{ $t('label.objt.relationCustomer') }}</label>
                        <CommonSearchInputBox v-model="formParam.borrowerRelation.value" :disable="nonTarget"></CommonSearchInputBox>
                    </div>
                  </div>
                  <div class="msg_info_form_quadruple_box" style="display: flex">
                      <div class="full-row width25">
                        <div>
                          <label class="form_label is_required">{{ $t('label.objt.applicationNo') }}</label>
                          <div class="relative-container d-flex items-center" style="display: flex;">
                              <CommonDirectSearchBox class="width100" maxlength="30" v-model="formParam.applicationNo.value" :disable=true ref="applicationNo" hlpType="lonHlpApc" :searchCode="formParam.applicationNo.value"></CommonDirectSearchBox>&nbsp;&nbsp;
                              <!-- <q-icon name="search" size="sm" style="margin:0 20px 0 -30px; width: 0%;" class="help_button_simple" @click="showApcSearchPopup()" /> -->
                              <!-- <LonHlpApc v-model="showApcSearch" @selected-popup-row-data = "getPopupRowData"></lonHlpApc> -->
                          </div>
                      </div>
                      </div>
                    <div class="width35">
                      <label class="form_label">{{ $t('label.objt.guaranteeAmount') }}</label>
                      <div class="double_input_box">
                        <CommonCurFormatterBox
                            class="width100"
                            :modelValues="guaranteeAmtCurForm" :selectDisabled="amtFlag" :inputDisabled="amtFlag">
                        </CommonCurFormatterBox>
                      </div>
                  </div>
                  <div class="full-row" style="flex-grow: 2;">
                      <label class="form_label">{{ $t('label.objt.totalGuaranteeAmt') }}</label>
                      <div class="width71" style="display: flex; align-items: center;">
                        <CommonCurFormatterBox
                            class="width100"
                            :modelValues="guaranteeTotalAmtCurForm" :selectDisabled="nonTarget" :inputDisabled="nonTarget">
                        </CommonCurFormatterBox>
                        <div style="font-size: 20px; margin: 0 10px 0 10px; text-align: center"> / </div>
                        <CommonInputBox class="width30" v-model="formParam.cnt.value" :disable="nonTarget"></CommonInputBox>
                      </div>
                  </div>
                  </div>
                <div class="msg_info_form_triple_box">
                </div>
                <q-toolbar style="display:flex; align-items: center; background-color:rgb(232, 232, 240)" class="rounded-borders">
                  <label class="width100" style="font-size: 16px; font-weight: 500; text-align: center;">Guarantor Information</label>
                </q-toolbar>
                <div class="msg_info_form_triple_box">
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
                              <div class="msg_info_form_triple_box">
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
                                      <label class="form_label">{{ $t('label.objt.guarantorRevenue') }}</label>
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
                                  </div>
                              <div class="msg_info_form_triple_box" style="display: flex;">
                                      <div class="all-full-row" style="flex-grow: 1;">
                                          <label class="form_label">{{ $t('label.view.remark') }}</label>
                                          <q-input v-model="formParam.rmk.value" filled type="textarea" style="background-color: #F9F9F9; border: 1px solid #E5E5E5" :disable="nonTarget"/>
                                      </div>
                              </div>
              <div class="toBottom" style="padding: 24px 0 0; display: flex; justify-content: center;">
                <div style="display: flex; justify-content: space-between; width: fit-content;">
                    <q-btn flat :disable=okBtnFlag :label="$t('label.view.ok')" class="btn btmBtn width100" style="margin-right:30px" @click="save()"/>
                    <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn width100"  v-close-popup @click="closePopup"/>
                </div>
              </div>
              </div>
            </q-card-section>
        </q-card>
    </q-dialog>
  </q-page-container>
</template>

<style>
</style>

<script setup>

/* =======================================================
      1. Import Area
  ======================================================= */
import { ajaxUtil, messageBox, freeformUtil, commonUtil, frmHlpCst } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive, watch, nextTick } from 'vue'
import { useSessionStore } from 'stores/session'
import lonHlpGua from 'src/components/pages/main/hlp/lon/lonHlpGua.vue'

/* =======================================================
      2. Global Variable
  ======================================================= */
const session = useSessionStore()
const emit = defineEmits(['update:modelValue', 'selectedPopupRowData', 'close-popup'])
const showGuaSearch = ref(false)
const showCstSearch = ref(false)
const showGuarantorSearch = ref(false)
const lonApplicationNoHlp = ref('')
const lonCustomerNoHlp = ref('')
const lonCustomerNameHlp = ref('')
const lonGuaranteeListHlp = ref([])
const lonGuaranteeNoHlp = ref('')
const okBtnFlag = ref(true)

const props = defineProps({
  lonApplicationNo: {
    type: String
  },
  lonContractNo: {
    type: String
  },
  lonCustomerNo: {
    type: String
  },
  lonCustomerName: {
    type: String
  },
  lonPledgeList: {
    type: Array
  },
  lonGuaranteeList: {
    type: Array
  },
  lonGuaranteeNo: {
    type: String
  },
  nonTarget: {
    type: Boolean,
    default: true
  },
  modelValue: { type: Boolean, required: true }
})

const nonTarget = ref(props.nonTarget)
const amtFlag = ref(false)

watch(props, (newVal) => {
  if (newVal.nonTarget) {
    nonTarget.value = true
  } else {
    nonTarget.value = false
  }
})

const model = computed({
  /**
   *
   */
  get () {
    if (props.modelValue) {
      showDialog()
    }
    return props.modelValue
  },
  /**
   *
   */
  set (newValue) {
    emit('update:modelValue', newValue)
  }
})

const dialogPos = {
  x: 0,
  y: 0
}

const showDialog = async () => {
  lonApplicationNoHlp.value = props.lonApplicationNo
  lonCustomerNoHlp.value = props.lonCustomerNo
  lonCustomerNameHlp.value = props.lonCustomerName
  lonGuaranteeListHlp.value = props.lonGuaranteeList
  lonGuaranteeNoHlp.value = props.lonGuaranteeNo
  model.value = true
  await nextTick()
  setPropsData()
}

// 팝업 오픈시 데이터 세팅
const setPropsData = () => {
  formParam.value.applicationNo.value = props.lonApplicationNo
  formParam.value.contractNo.value = props.lonContractNo
  formParam.value.customerNo.value = props.lonCustomerNo
  formParam.value.customerName.value = props.lonCustomerName
  formParam.value.guaranteeNo.value = props.lonGuaranteeNo
  if (commonUtil.isEmpty(props.lonGuaranteeNo)) {
    formParam.value.manageBrcd.value = session.sysBranchCode
    setDisable('enable')
    showPopup('gua')
  } else {
    setDisable('disable')
    searchAllData()
  }
}

const closePopup = () => {
  resetAll()
}

/* =======================================================
      3. Common Code Adapter
  ======================================================= */
// ajaxUtil.getCodeList('SHOWROWS,USER_KIND')
//   .then(function (codeData) {
//     fetchSizeList.value = codeData.showRows
//     userKindList.value = codeData.userKind
//   })

const setDisable = (flag) => {
  if (flag === 'disable') {
    okBtnFlag.value = true
  } else {
    okBtnFlag.value = false
  }
}

const save = () => {
  if (!freeformUtil.checkRequired(formParam)) return
  const _confirm = () => {
    const newSearchParam = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG009', formParam)
    newSearchParam.transactionMode = 'NEW'
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        emit('selectedPopupRowData', formParam.value.guaranteeNo.value)
        model.value = false
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

/* =======================================================
    3. Common Code Adapter
======================================================= */

const commonCodeList = reactive({
  guaranteeStatusCode: ref([]),
  houseTypeCode: ref([]),
  houseOcpncyCode: ref([]),
  ocuptTypeCode: ref([])
})

const searchAllData = () => {
  const guaSearchParam = ref({
    applicationNo: {
      value: props.lonApplicationNo
    },
    guaranteeNo: {
      value: props.lonGuaranteeNo
    },
    detailAmount: {
      value: 'true'
    }
  })
  const saveParam = commonUtil.inputValueToJson('bsLonColGuaService', 'LONCOLGUA0023', guaSearchParam)
  ajaxUtil.ajaxServiceCall(saveParam)
    .then(async (response) => {
      amtFlag.value = true
      const data = response.data.result.data
      freeformUtil.clear(revenueCurForm)
      freeformUtil.clear(networthCurForm)
      freeformUtil.clear(incometaxCurForm)
      freeformUtil.clear(incometaxCurForm)
      await nextTick()
      setGuaData(data[0])
    })
}

ajaxUtil.getCodeList('LON_GUARANTEE_TYPE_CODE, FRM_HOUSE_TYPE_CODE, HOUSE_OCPN_TYPE_CODE, OCCUPATION_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.guaranteeStatusCode = codeData.lonGuaranteeTypeCode
    commonCodeList.houseTypeCode = codeData.frmHouseTypeCode
    commonCodeList.houseOcpncyCode = codeData.houseOcpnTypeCode
    commonCodeList.ocuptTypeCode = codeData.occupationTypeCode
  })

const formParam = ref({
  guaranteeNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guaranteeNo')
  },
  applicationNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.applicationNo')
  },
  transactionStatusCd: {
    value: '01',
    initValue: '01',
    required: true,
    description: i18n.global.t('label.objt.transactionStatus')
  },
  expireDate: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.expireDate')
  },
  guaranteeTypeCode: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guaranteeType')
  },
  registerDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.registerDate')
  },
  contractNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.contractNo')
  },
  contractDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.contractDate')
  },
  releaseDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.releaseDate')
  },
  manageBrcd: {
    value: session.sysBranchCode,
    initValue: session.sysBranchCode,
    required: false,
    description: i18n.global.t('label.objt.managementBranch')
  },
  guarantorNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guarantor')
  },
  guarantorName: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.guarantor')
  },
  guaranteeAmt: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeAmount')
  },
  totalGuaranteeAmt: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeTotalAmt')
  },
  cnt: {
    value: '0',
    required: false,
    description: i18n.global.t('label.objt.guaranteeCnt')
  },
  creditRating: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.creditScore')
  },
  creditEvltDate: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.evaluationDate')
  },
  borrowerRelation: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.relationCustomer')
  },
  customerNo: {
    value: '',
    required: true
  },
  customerName: {
    value: '',
    required: true
  },
  rmk: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.remark')
  },
  ocuptTypeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.occupationType')
  },
  houseTypeCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guarantorHouseType')
  },
  houseOcpncyCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.houseOccupancyType')
  },
  socialStatus: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.socialStatus')
  },
  occupationDetail: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.occupationDetail')
  },
  revenueAmt: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.guarantorRevenueIncome')
  },
  netWorth: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.netWorth')
  },
  incomeTax: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.incomeTax')
  },
  financialAsset: {
    value: 0,
    initValue: 0,
    required: false,
    description: i18n.global.t('label.objt.financialAsset')
  },
  currencyCode: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.currencyCode')
  },
  currencyCodeGua: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.currencyCodeGua')
  },
  guaranteeAmtCount: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.guaranteeCnt')
  },
  pledgeNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.pledgeNo')
  },
  transactionMode: {
    value: 'NEW',
    required: true
  }
})

const revenueCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => revenueCurForm.value.currency.value, (newVal) => {
  formParam.value.currencyCodeGua.value = newVal
  networthCurForm.value.currency.value = newVal
  incometaxCurForm.value.currency.value = newVal
  financialCurForm.value.currency.value = newVal
})

watch(() => revenueCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.revenueAmt.value = Number(newVal.replace(/,/g, ''))
})

const networthCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => networthCurForm.value.currency.value, (newVal) => {
  revenueCurForm.value.currency.value = newVal
})

watch(() => networthCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.netWorth.value = Number(newVal.replace(/,/g, ''))
})

const incometaxCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => incometaxCurForm.value.currency.value, (newVal) => {
  revenueCurForm.value.currency.value = newVal
})

watch(() => incometaxCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.incomeTax.value = Number(newVal.replace(/,/g, ''))
})

const financialCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => financialCurForm.value.currency.value, (newVal) => {
  revenueCurForm.value.currency.value = newVal
})

watch(() => financialCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.financialAsset.value = Number(newVal.replace(/,/g, ''))
})

const guaranteeAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => guaranteeAmtCurForm.value.currency.value, (newVal) => {
  guaranteeAmtCurForm.value.currency.value = newVal
  formParam.value.currencyCode.value = newVal
})

watch(() => guaranteeAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.guaranteeAmt.value = Number(newVal.replace(/,/g, ''))
})

const guaranteeTotalAmtCurForm = ref({
  currency: {
    value: ''
  },
  money: {
    value: '0'
  }
})

watch(() => guaranteeTotalAmtCurForm.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.totalGuaranteeAmt.value = Number(newVal.replace(/,/g, ''))
})

const resetAll = (data) => {
  formClear()
}

const formClear = async () => {
  freeformUtil.clear(formParam)
  freeformUtil.clear(revenueCurForm)
  freeformUtil.clear(networthCurForm)
  freeformUtil.clear(incometaxCurForm)
  freeformUtil.clear(financialCurForm)
  freeformUtil.clear(guaranteeAmtCurForm)
  freeformUtil.clear(guaranteeTotalAmtCurForm)
  amtFlag.value = false
}

// let isSetPledgeDataRunning = false
// 보증 데이터 세팅
const setGuaData = (guaranteeData) => {
  nonTarget.value = false

  if (!commonUtil.isEmpty(guaranteeData.guaranteeNo)) {
    for (const key in guaranteeData) {
      if (key in formParam.value && guaranteeData[key] !== null) {
        formParam.value[key].value = guaranteeData[key]
      }
    }
    revenueCurForm.value.currency.value = formParam.value.currencyCodeGua.value
    revenueCurForm.value.money.value = formParam.value.revenueAmt.value
    networthCurForm.value.money.value = formParam.value.netWorth.value
    incometaxCurForm.value.money.value = formParam.value.incomeTax.value
    financialCurForm.value.money.value = formParam.value.financialAsset.value
    guaranteeAmtCurForm.value.currency.value = formParam.value.currencyCode.value
    guaranteeAmtCurForm.value.money.value = formParam.value.guaranteeAmt.value
    guaranteeTotalAmtCurForm.value.currency.value = formParam.value.currencyCode.value
    guaranteeTotalAmtCurForm.value.money.value = formParam.value.totalGuaranteeAmt.value

    nonTarget.value = true
  }
}

/* =======================================================
    9. popup
======================================================= */
const showPopup = (type) => {
  showGuaSearch.value = false
  showGuarantorSearch.value = false
  showCstSearch.value = false

  switch (type) {
    case 'gua' : showGuaSearch.value = true; break
    case 'guarantor' : showGuarantorSearch.value = true; break
    case 'cst' : showCstSearch.value = true; break
  }
}

const getGuarantorPopup = (event) => {

}

const getCstPopupRowData = (event) => {

}

const getGuaPopupRowData = (event) => {
  const addFlag = ref('true')
  const specific = '01' // Guarantee Type 특정 보증 (하나의 보증만 등록 가능)

  // 선택한 Row의 CustomerNo와 차주의 CustomerNo가 일치 하는지 체크
  // (다른 차주의 보증은 등록 불가 하도록)
  if (event[0].customerNo !== formParam.value.customerNo.value) {
    messageBox.alertError('Borrower is not the same')
    return
  }
  // 기존의 보증이 하나라도 등록 되어있으면 Guarantee Type = specific인 보증은 등록 불가
  if (lonGuaranteeListHlp.value.length > 0 && event[0].guaranteeTypeCode === specific) {
    messageBox.alertInfo('Guarantee type \'specific\' cannot be registered')
    return
  }

  // Guarantee Type 값이 specific이고, 다른 대출의 보증으로 이미 사용중인 보증이라면 등록불가
  if ((!commonUtil.isEmpty(event[0].cnt) || event[0].cnt > 0) && event[0].guaranteeTypeCode === specific) {
    messageBox.alertInfo('Guarantee type is \'specific\' and is already in use')
    return
  }

  // 해당 보증 설정 중, 동일한 신청건이 있는지 조회
  for (const data of lonGuaranteeListHlp.value) {
    if (data.guaranteeNo === event[0].guaranteeNo) {
      addFlag.value = 'false'
      break
    } else {
      addFlag.value = 'true'
    }
  }

  if (addFlag.value === 'true') {
    setGuaData(event[0])
  // 이미 등록된 보증의 경우 재등록 불가능
  } else {
    const _alertInfo = () => {
      emit('selectedPopupRowData', '')
      model.value = false
    }
    messageBox.alertInfo(i18n.global.t('msg.info.pledgedCollateral'), _alertInfo)
  }
}

const getGurDirectSearch = (event) => {
  if (event !== '') {
    formParam.value.guarantorName.value = event.customerName
  } else {
    formParam.value.guarantorName.value = ''
  }
}

const onDragable = (evt) => {
  dialogPos.x = dialogPos.x + evt.delta.x
  dialogPos.y = dialogPos.y + evt.delta.y
}

const dragablePopupStyle = computed(() => {
  return {
    transform: `translate(${dialogPos.x}px, ${dialogPos.y}px)`
  }
})

</script>
<style scoped>

.msg_info_form_triple_box {
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: hidden;
}

</style>
