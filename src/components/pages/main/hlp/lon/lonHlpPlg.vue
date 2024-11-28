<template>
  <q-page-container>
    <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width70" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.hlpLonPlg') }}</div>
                <!-- <q-btn flat class="popup_close_button" v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn> -->
                <q-space />
                <q-btn flat v-close-popup><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" @click="closePopup"></q-btn>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="scrollable-container height75 width100">
                <q-toolbar style="display:flex; align-items: center; background-color:rgb(232, 232, 240)" class="rounded-borders">
                  <label class="width100" style="font-size: 16px; font-weight: 500; text-align: center;">Collateral Information</label>
                </q-toolbar>
                    <div style="margin-top: 20px;">
                        <label class="form_label">{{ $t('label.view.customer') }}</label>
                        <div style=" display: flex; align-items: center; gap: 6px;">
                            <CommonInputBox maxlength="30" :readonly="true"  v-model="formParam.customerNo.value" @change="resetAll(formParam.customerNo.value)" :disable=disableFlag style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="showPopup('cust')" />
                            <frmHlpCst v-model="showCustomerSearch" @selected-popup-row-data = "getCustPopupRowData"></frmHlpCst>
                            <CommonInputBox class="width47" maxlength="300" :readonly="true"  v-model="formParam.customerName.value" :disable=true></CommonInputBox>
                        </div>
                    </div>
                <div style="display:flex; padding: 16px 0 0;">
                    <div class="width32" style="margin-right:33px">
                        <label class="form_label is_required">{{ $t('label.objt.collateralNo') }}</label>
                        <div style="display: flex;">
                          <CommonInputBox class="width100" :readonly="true" maxlength="30" v-model="formParam.collateralNo.value" :disable=disableFlag style="text-align-last: center;"></CommonInputBox>
                          <q-icon name="search" :disable=disableFlag size="sm" style="margin-left: -34px; margin-top: 8px;" class="help_button_simple" @click="showPopup('col')" />
                          <lonHlpCol
                            :collateral-Status-Cd="'01'"
                            :customer-No=formParam.customerNo.value
                            v-model="showColListSearch"
                            @selected-popup-row-data="getColPopupRowData">
                          </lonHlpCol>
                        </div>
                    </div>
                    <div class="width65">
                      <label class="form_label">{{ $t('label.objt.collateralTitle') }}</label>
                      <CommonInputBox class="width100" :readonly="true" maxlength="300" v-model="formParam.collateralTitleName.value" :disable=true></CommonInputBox>
                    </div>
                </div>
                <div class="msg_info_form_triple_box" style="padding: 16px 0 0;">
                    <div>
                        <label class="form_label">{{ $t('label.objt.collateralType') }}</label>
                        <CommonSelectBox class="width100" :readonly="true" :codeList="commonCodeList.collateralType" v-model="formParam.collateralTpcd.value" :disable="true"></CommonSelectBox>
                    </div>
                    <div style="margin-left: 6px">
                        <label class="form_label">{{ $t('label.objt.collateralDetailType') }}</label>
                        <CommonSelectBox class="width100" :readonly="true" :codeList="commonCodeList.collateralDetailCd" v-model="formParam.collateralDetailCd.value" :disable="true"></CommonSelectBox>
                    </div>
                    <div class="width100" style="align-items: center; gap: 6px;">
                        <label class="form_label">{{ $t('label.objt.managementBranch') }}</label>
                        <div style="display: flex;">
                          <CommonInputBox class="width100"  maxlength="30" v-model="formParam.colManageBrcd.value" :readonly="true"  :disable=true style="text-align-last: center;"></CommonInputBox>
                          <!-- <q-icon name="search" :disable=true  size="sm" style="margin-left: -34px; margin-top: 8px;" class="help_button_simple" @click="showPopup('brch1')" /> -->
                          <frmHlpBrc v-model="showBranch1Search" @selected-popup-row-data = "getBranch1PopupRowData"></frmHlpBrc>
                        </div>
                    </div>
                </div>
                <div style="display:flex; padding: 16px 0 0;">
                    <div class="width32" style="margin-right:33px">
                        <label class="form_label">{{ $t('label.objt.ownerRelationType') }}</label>
                        <CommonSelectBox class="width100" :readonly="true" :codeList="commonCodeList.ownerRelationTpcd" v-model="formParam.ownerRelationTpcd.value" :disable="true" style="text-align-last: center;"></CommonSelectBox>
                    </div>
                    <div class="width58">
                        <label class="form_label">{{ $t('label.objt.collateralOwner') }}</label>
                        <div style=" display: flex; align-items: center; gap: 6px;">
                            <CommonInputBox class="width30" maxlength="30" :readonly="true"  v-model="formParam.colOwnerNo.value" :disable="true" style="text-align-last: center;"></CommonInputBox>
                            <!-- <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="showPopup('cust2')" /> -->
                            <frmHlpCst v-model="showCustomerSearch2" @selected-popup-row-data = "getCustPopupRowData2"></frmHlpCst>
                            <CommonInputBox class="width81" maxlength="300" :readonly="true"  v-model="formParam.colOwnerName.value" :disable=true></CommonInputBox>
                        </div>
                    </div>
                </div>
                <div class="msg_info_form_triple_box" style="padding: 16px 0 0;">
                  <div>
                      <label class="form_label">{{ $t('label.objt.marketAmount') }}</label>
                      <div class="double_input_box">
                        <CommonCurFormatterBox
                            class="width100"
                            :modelValues="modelValues" :selectDisabled="true" :inputDisabled="true">
                        </CommonCurFormatterBox>
                      </div>
                  </div>
                  <div style="margin-left: 6px;" class="width100">
                      <label class="form_label">{{ $t('label.objt.appraisalType') }}</label>
                      <CommonSelectBox class="width100" :readonly="true" :codeList="commonCodeList.appraisalTypeCode" v-model="formParam.appraisalTypeCode.value" :disable="true"></CommonSelectBox>
                  </div>
                  <div>
                      <label class="form_label">{{ $t('label.objt.appraisalAmount') }}</label>
                      <div class="double_input_box">
                        <CommonCurFormatterBox
                            class="width100"
                            :modelValues="modelValues2" :selectDisabled="true" :inputDisabled="true">
                        </CommonCurFormatterBox>
                      </div>
                  </div>
                </div>
                <div class="msg_info_form_triple_box">
                </div>
                <q-toolbar style="display:flex; align-items: center; background-color:rgb(232, 232, 240)" class="rounded-borders">
                  <label class="width100" style="font-size: 16px; font-weight: 500; text-align: center;">Pledge Information</label>
                </q-toolbar>
                <div class="msg_info_form_triple_box" style="padding: 0px 0 0;">
                    <div>
                        <label class="form_label">{{ $t('label.objt.pledgeNo') }}</label>
                        <CommonInputBox ref="pledgeNo" :readonly="true"  maxlength="30" placeholder="Auto Generate" v-model="formParam.pledgeNo.value" :disable=true style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.pledgeStatus') }}</label>
                        <CommonSelectBox ref="pledgeStatusCode" :codeList="commonCodeList.pledgeStatus" v-model="formParam.pledgeStatusCode.value" :disable=true></CommonSelectBox>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.priority') }}</label>
                        <CommonInputBox :readonly="true" ref="priority" maxlength="30" placeholder="Auto Generate" v-model="formParam.priority.value" :disable=true style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeType') }}</label>
                        <CommonSearchSelectBox :codeList="commonCodeList.pledgeTypeListCode" v-model="formParam.pledgeTpcd.value" :disable=disableFlag></CommonSearchSelectBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeDate') }}</label>
                        <CommonCalendarYMD ref="pledgeDate" v-model="formParam.pledgeDate.value" style="text-align-last: center;" :disable=disableFlag></CommonCalendarYMD>
                    </div>
                    <div>
                        <div class="width49" style="display: inline-block;margin-right: 1%;">
                            <div>
                                <label class="form_label">{{ $t('label.objt.expireDate') }}</label>
                                <CommonCalendarYMD ref="expireDate" v-model="formParam.expireDate.value" style="text-align-last: center;" :disable=disableFlag></CommonCalendarYMD>
                            </div>
                        </div>
                        <div class="width49" style="display: inline-block;margin-right: 1%;">
                            <div>
                                <label class="form_label">{{ $t('label.objt.releaseDate') }}</label>
                                <CommonCalendarYMD :readonly="true" ref="releaseDate" v-model="formParam.releaseDate.value" style="text-align-last: center;" :disable=true></CommonCalendarYMD>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.reviewedAmount') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues3" :selectDisabled="true" :inputDisabled="disableFlag">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.applicationNo') }}</label>
                        <CommonInputBox :readonly="true" ref="applicationNo" maxlength="30" v-model="formParam.applicationNo.value" :disable=true style="text-align-last: center;"></CommonInputBox>
                    </div>
                    <div>
                      <label class="form_label">{{ $t('label.objt.contractNo') }}</label>
                      <div style="display: flex;">
                        <CommonInputBox class="width100" :readonly="true" ref="contractNo" maxlength="30" v-model="formParam.contractNo.value" :disable=disableFlag style="text-align-last: center;"></CommonInputBox>
                        <q-icon name="search" :disable=disableFlag size="sm" style="margin-left: -34px; margin-top: 8px;" class="help_button_simple" @click="showPopup('con')" />
                        <lonHlpCon v-model="showContractSearch" @selected-popup-row-data = "getContractPopupRowData"></lonHlpCon>
                      </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.collateralRecogRatio') }}</label>
                        <div style="display:flex; align-items: center;">
                          <CommonInputBox
                            class="width95"
                            v-model="formParam.recognitionRatio.value"
                            :disable=disableFlag
                            style="text-align-last: right;">
                          </CommonInputBox>
                          &nbsp;&nbsp;<q-icon style="float:right;" name="percent" />
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.ourComPriorLien') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues4" :selectDisabled="true" :inputDisabled="disableFlag">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.maxPledgeAmt') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues5" :selectDisabled="true" :inputDisabled="true">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.colValue') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues6" :selectDisabled="true" :inputDisabled="true">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.otherComPriorLien') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues7" :selectDisabled="true" :inputDisabled="disableFlag">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.pledgeAmount') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues8" :selectDisabled="true" :inputDisabled="disableFlag" :error="error" :errorMessage="errorMessage">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.managementBranch') }}</label>
                        <div style="display: flex;">
                          <CommonInputBox class="width100" ref="manageBrcd" maxlength="30" v-model="formParam.manageBrcd.value" :disable=true style="text-align-last: center;"></CommonInputBox>
                          <q-icon name="search" :disable=disableFlag size="sm" style="margin-left: -34px; margin-top: 8px;" class="help_button_simple" @click="showPopup('brch2')" />
                          <frmHlpBrc v-model="showBranch2Search" @selected-popup-row-data = "getBranch2PopupRowData"></frmHlpBrc>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.managementEmployee') }}</label>
                        <div style="display: flex;">
                          <CommonInputBox class="width100" ref="manageEmployeenNo" maxlength="30" v-model="formParam.manageEmployeeNo.value" :disable=true style="text-align-last: center;"></CommonInputBox>
                          <q-icon name="search" :disable=disableFlag size="sm" style="margin-left: -34px; margin-top: 8px;" class="help_button_simple" @click="showPopup('user')" />
                          <frmHlpEmp v-model="showUserSearch" @selected-popup-row-data = "getEmpPopupRowData"></frmHlpEmp>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
            </div>
              <div class="toBottom" style="padding: 24px 0 0; display: flex; justify-content: center;">
                <div style="display: flex; justify-content: space-between; width: fit-content;">
                    <q-btn flat :disable=okBtnFlag :label="$t('label.view.ok')" class="btn btmBtn width100" style="margin-right:30px" @click="save()"/>
                    <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn width100"  v-close-popup @click="closePopup"/>
                </div>
              </div>
            </q-card-section>
        </q-card>
    </q-dialog>
  </q-page-container>
</template>

<script setup>

/* =======================================================
      1. Import Area
  ======================================================= */
import { ajaxUtil, messageBox, freeformUtil, commonUtil, commonProp, frmHlpCst, frmHlpEmp, frmHlpBrc } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive, watch, nextTick } from 'vue'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'
import lonHlpCol from './lonHlpCol.vue'
import lonHlpCon from './lonHlpCon.vue'

/* =======================================================
      2. Global Variable
  ======================================================= */
const session = useSessionStore()
const emit = defineEmits(['update:modelValue', 'selectedPopupRowData', 'close-popup'])
const fetchSizeList = ref([])
const branchTypeList = ref([])
const userKindList = ref({})
const disableFlag = ref(false)
const fixFlag = ref(false)
const showCustomerSearch = ref(false)
const showCustomerSearch2 = ref(false)
const showBranch1Search = ref(false)
const showBranch2Search = ref(false)
const showContractSearch = ref(false)
const showColListSearch = ref(false)
const showUserSearch = ref(false)
const isCalendarOpen = ref(false)
const nowDate = new Date()
const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())
const lonApplicationNoHlp = ref('')
const lonContractNoHlp = ref('')
const lonCustomerNoHlp = ref('')
const lonCustomerNameHlp = ref('')
const lonPledgeListHlp = ref([])
const lonPledgeNoHlp = ref('')
const inquiryFlag = ref(false)
const okBtnFlag = ref(true)
/* Refs */
const pledgeNo = ref(null)
const pledgeStatusCode = ref(null)
const priority = ref(null)
const expireDate = ref(null)
const pledgeDate = ref(null)
const releaseDate = ref(null)
const appraisalAmount = ref(null)
const applicationNo = ref(null)
const contractNo = ref(null)
const recognitionRatio = ref(null)
const ourPriorLien = ref(null)
const maxPledgeAmt = ref(null)
const collateralValue = ref(null)
const othersPriorLien = ref(null)
const pledgeAmount = ref(null)
const manageBranchName = ref(null)
const manageEmployeeName = ref(null)
const pledgeTpcd = ref(null)

const freeformRefs = {
  pledgeNo, pledgeStatusCode, priority, expireDate, pledgeDate, releaseDate, appraisalAmount, applicationNo, contractNo, recognitionRatio, ourPriorLien, maxPledgeAmt, collateralValue, othersPriorLien, pledgeAmount, manageBranchName, manageEmployeeName, pledgeTpcd
}

disableFlag.value = true

const props = defineProps({
  lonApplicationNo: {
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
  lonPledgeNo: {
    type: String
  },
  lonContractNo: {
    type: String
  },
  modelValue: { type: Boolean, required: true }
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
  lonContractNoHlp.value = props.lonContractNo
  lonCustomerNoHlp.value = props.lonCustomerNo
  lonCustomerNameHlp.value = props.lonCustomerName
  lonPledgeListHlp.value = props.lonPledgeList
  lonPledgeNoHlp.value = props.longPledgeNo
  model.value = true
  await nextTick()
  setPropsData()
}

// 팝업 오픈시 데이터로 세팅 (특정 담보설정을 클릭하여 조회한 경우)
const setPropsData = () => {
  formParam.value.applicationNo.value = props.lonApplicationNo
  formParam.value.customerNo.value = props.lonCustomerNo
  formParam.value.customerName.value = props.lonCustomerName
  formParam.value.pledgeNo.value = props.lonPledgeNo
  formParam.value.contractNo.value = props.lonContractNo
  if (commonUtil.isEmpty(props.lonPledgeNo)) {
    formParam.value.manageBrcd.value = session.sysBranchCode
    formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
    setDisable('enable')
    showPopup('col')
  } else {
    inquiryFlag.value = true
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
ajaxUtil.getCodeList('SHOWROWS,USER_KIND')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showRows
    userKindList.value = codeData.userKind
  })

const setDisable = (flag) => {
  if (flag === 'disable') {
    disableFlag.value = true
    fixFlag.value = true
    okBtnFlag.value = true
  } else {
    disableFlag.value = false
    fixFlag.value = false
    okBtnFlag.value = false
  }
}

// 저장 버튼 클릭이벤트 (OK버튼)
const save = () => {
  if (formParam.value.pledgeAmount.value === 0) {
    formParam.value.pledgeAmount.value = ''
  }
  // 검증 1. 설정 금액이 최대 금액을 초과한 경우
  if (error.value) {
    // errorMessage를 alert하고 함수를 종료합니다.
    messageBox.alertInfo(errorMessage)
    return
  }
  // 검증3. 필수 값 입력하지 않은 경우
  if (!freeformUtil.checkRequired(formParam, freeformRefs)) return

  const _confirm = () => {
    // 담보 설정 서비스 호출
    const newSearchParam = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG009', formParam)
    newSearchParam.transactionMode = 'NEW'
    ajaxUtil.ajaxServiceData(newSearchParam)
      .then(function (data) {
        emit('selectedPopupRowData', '')
        model.value = false
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

const lookupValue = (mappings, key) => {
  const _selectedCode = []
  for (const index in mappings) {
    _selectedCode.push(mappings[index])
  }
  const _codeValue = _selectedCode.find(v => v.code === key)
  if (_codeValue === undefined) return key
  else return _codeValue.codeValue
}

/* =======================================================
    3. Common Code Adapter
======================================================= */

const commonCodeList = reactive({
  collateralType: ref([]),
  collateralDetailCd: ref([]),
  ownerRelationTpcd: ref([]),
  pledgeStatus: ref([]),
  appraisalTypeCode: ref([]),
  applicationType: ref([]),
  appraisalType: ref([]),
  pledgeTypeListCode: ref([])
})

const searchAllData = () => {
  const plgSearchParam = ref({
    applicationNo: {
      value: props.lonApplicationNo
    },
    pledgeNo: {
      value: props.lonPledgeNo
    }
  })

  const saveParam = commonUtil.inputValueToJson('bsLonColPlgService', 'LONCOLPLG002', plgSearchParam)
  ajaxUtil.ajaxServiceCall(saveParam)
    .then(async (response) => {
      const data = response.data.result.data
      freeformUtil.clear(modelValues)
      freeformUtil.clear(modelValues2)
      freeformUtil.clear(modelValues3)
      freeformUtil.clear(modelValues4)
      freeformUtil.clear(modelValues5)
      freeformUtil.clear(modelValues6)
      freeformUtil.clear(modelValues7)
      freeformUtil.clear(modelValues8)
      await nextTick()
      setPledgeData(data)
    })
}

ajaxUtil.getCodeList('LON_PLEDGE_STATUS_CODE, LON_COLLATERAL_TYPE_CODE, APPLICATION_TYPE, LON_APPRASIAL_TYPE_CODE, LON_COLLATERAL_DETAIL_TYPE_CODE, LON_OWNER_RELATION_TYPE_CODE, LON_APPRASIAL_TYPE_CODE,LON_PLEDGE_TYPE_CODE')
  .then(function (codeData) {
    commonCodeList.appraisalTypeCode = codeData.lonApprasialTypeCode
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
    commonCodeList.pledgeStatus = codeData.lonPledgeStatusCode
    commonCodeList.collateralType = codeData.lonCollateralTypeCode
    commonCodeList.collateralDetailCd = codeData.lonCollateralDetailTypeCode
    commonCodeList.ownerRelationTpcd = codeData.lonOwnerRelationTypeCode
    commonCodeList.appraisalType = codeData.lonApprasialTypeCode
    commonCodeList.pledgeTypeListCode = codeData.lonPledgeTypeCode
  })

const formParam = ref({
  customerNo: {
    value: props.lonCustomerNo,
    required: false,
    description: ''
  },
  customerName: {
    value: props.lonCustomerName,
    required: false,
    description: ''
  },
  serialNo: {
    value: '',
    required: false,
    description: ''
  },
  collateralNo: {
    value: '',
    required: true,
    description: i18n.global.t('label.objt.collateralNo')
  },
  collateralTitleName: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.collateralTitle')
  },
  collateralTpcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.collateralType')
  },
  collateralDetailCd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.collateralDetailType')
  },
  colManageBrcd: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  colManageBrnm: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.manageInfo')
  },
  ownerRelationTpcd: {
    value: '01',
    initValue: '01',
    required: false,
    description: i18n.global.t('label.view.searchItem')
  },
  colOwnerNo: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.ownerCustomer')
  },
  colOwnerName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.ownerCustomer')
  },
  ccycdMarket: {
    value: '',
    required: false,
    description: ''
  },
  marketAmt: {
    value: 0,
    required: false,
    description: ''
  },
  appraisalTypeCode: {
    value: '01',
    initValue: '01',
    required: false,
    description: i18n.global.t('label.view.appraisalType')
  },
  ccycdAppraisal: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.appraisalReview')
  },
  appraisalAmt: {
    value: 0,
    required: false,
    description: i18n.global.t('label.view.appraisalReview')
  },
  pledgeNo: {
    value: '',
    required: false,
    description: ''
  },
  pledgeStatusCode: {
    value: '10',
    required: false,
    description: ''
  },
  priority: {
    value: '',
    type: Number,
    required: false,
    description: ''
  },
  expireDate: {
    value: '',
    required: false,
    description: ''
  },
  pledgeDate: {
    value: dayjs(today).format(commonProp.dateformat.dateType),
    required: true,
    description: i18n.global.t('label.objt.pledgeDate')
  },
  pledgeProposedDate: {
    value: dayjs(today).format(commonProp.dateformat.dateType),
    required: false
  },
  releaseDate: {
    value: '',
    required: false,
    description: ''
  },
  ccycdReviewed: {
    value: '',
    required: false,
    description: ''
  },
  appraisalAmount: {
    value: 0,
    required: false,
    description: ''
  },
  applicationNo: {
    value: props.lonApplicationNo,
    required: true,
    description: ''
  },
  contractNo: {
    value: props.lonContractNo,
    required: false,
    description: ''
  },
  recognitionRatio: {
    value: 0,
    type: Number,
    required: true,
    description: ''
  },
  ccycdOurPrior: {
    value: '',
    required: false,
    description: ''
  },
  ourPriorLien: {
    value: 0,
    required: false,
    description: ''
  },
  ccycdMaxpledge: {
    value: '',
    required: false,
    description: ''
  },
  maxPledgeAmt: {
    value: 0,
    required: false,
    description: ''
  },
  ccycdColVal: {
    value: '',
    required: false,
    description: ''
  },
  collateralValue: {
    value: 0,
    required: false,
    description: ''
  },
  ccycdOthersPrior: {
    value: '',
    required: false,
    description: ''
  },
  othersPriorLien: {
    value: 0,
    required: false,
    description: ''
  },
  ccycdPledge: {
    value: '',
    required: false,
    description: ''
  },
  pledgeAmount: {
    value: 0,
    required: true,
    description: i18n.global.t('label.objt.pledgeAmount')
  },
  registBrcd: {
    value: session.sysBranchCode
  },
  registEmployeeNo: {
    value: session.sysEmployeeNo
  },
  registDate: {
    value: dayjs(today).format(commonProp.dateformat.dateType)
  },
  manageBrcd: {
    value: session.sysBranchCode,
    required: true,
    description: i18n.global.t('label.objt.manageBrcd')
  },
  manageBranchName: {
    value: lookupValue(branchTypeList.value, session.sysBranchCode),
    required: false,
    description: ''
  },
  manageEmployeeNo: {
    value: session.sysEmployeeNo,
    required: false,
    description: ''
  },
  manageDate: {
    value: dayjs(today).format(commonProp.dateformat.dateType)
  },
  manageEmployeeName: {
    value: session.sysUserName,
    required: false,
    description: ''
  },
  helpSearchType: {
    value: 'lonHlpPlg',
    required: false,
    description: ''
  },
  transactionMode: {
    value: 'NEW',
    required: false,
    description: ''
  },
  pledgeTpcd: {
    value: '01',
    required: true,
    description: ''
  }

})

const modelValues = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues.value.currency.value, (newVal) => {
  formParam.value.ccycdMarket.value = newVal
})

watch(() => modelValues.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.marketAmt.value = Number(newVal.replace(/,/g, ''))
})

const modelValues2 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues2.value.currency.value, (newVal) => {
  formParam.value.ccycdAppraisal.value = newVal
})

watch(() => modelValues2.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.appraisalAmt.value = Number(newVal.replace(/,/g, ''))
})

const modelValues3 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues3.value.currency.value, (newVal) => {
  formParam.value.ccycdReviewed.value = newVal
})

watch(() => modelValues3.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.appraisalAmount.value = Number(newVal.replace(/,/g, ''))
})

const modelValues4 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues4.value.currency.value, (newVal) => {
  formParam.value.ccycdOurPrior.value = newVal
})

watch(() => modelValues4.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.ourPriorLien.value = Number(newVal.replace(/,/g, ''))
})

const modelValues5 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues5.value.currency.value, (newVal) => {
  formParam.value.ccycdMaxpledge.value = newVal
})

watch(() => modelValues5.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.maxPledgeAmt.value = Number(newVal.replace(/,/g, ''))
})

const modelValues6 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues6.value.currency.value, (newVal) => {
  formParam.value.ccycdColVal.value = newVal
})

watch(() => modelValues6.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.collateralValue.value = Number(newVal.replace(/,/g, ''))
})

const modelValues7 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues7.value.currency.value, (newVal) => {
  formParam.value.ccycdOthersPrior.value = newVal
})

watch(() => modelValues7.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.othersPriorLien.value = Number(newVal.replace(/,/g, ''))
})

const modelValues8 = ref({
  currency: {
    value: ''
  },
  money: {
    value: ''
  }
})

watch(() => modelValues8.value.currency.value, (newVal) => {
  formParam.value.ccycdPledge.value = newVal
})

watch(() => modelValues8.value.money.value, (newVal) => {
  newVal = String(newVal)
  formParam.value.pledgeAmount.value = Number(newVal.replace(/,/g, ''))
})

const resetAll = (data) => {
  formClear()
}

const formClear = async () => {
  freeformUtil.clear(formParam)
  freeformUtil.clear(modelValues)
  freeformUtil.clear(modelValues2)
  freeformUtil.clear(modelValues3)
  freeformUtil.clear(modelValues4)
  freeformUtil.clear(modelValues5)
  freeformUtil.clear(modelValues6)
  freeformUtil.clear(modelValues7)
  freeformUtil.clear(modelValues8)
  await nextTick()
  const _chkArr = [
    formParam.value.collateralNo.value,
    formParam.value.collateralTitleName.value,
    formParam.value.collateralTpcd.value,
    formParam.value.collateralDetailCd.value,
    formParam.value.ownerRelationTpcd.value,
    formParam.value.colOwnerNo.value,
    formParam.value.colOwnerName.value,
    modelValues.value.currency.value,
    modelValues.value.money.value,
    formParam.value.appraisalTypeCode.value,
    modelValues2.value.currency.value,
    modelValues2.value.money.value,
    formParam.value.pledgeNo.value,
    formParam.value.pledgeStatusCode.value,
    formParam.value.priority.value,
    formParam.value.expireDate.value,
    formParam.value.pledgeDate.value,
    formParam.value.releaseDate.value,
    modelValues3.value.currency.value,
    modelValues3.value.money.value,
    formParam.value.applicationNo.value,
    formParam.value.contractNo.value,
    formParam.value.recognitionRatio.value,
    modelValues4.value.currency.value,
    modelValues4.value.money.value,
    modelValues5.value.currency.value,
    modelValues5.value.money.value,
    modelValues6.value.currency.value,
    modelValues6.value.money.value,
    modelValues7.value.currency.value,
    modelValues7.value.money.value,
    modelValues8.value.currency.value,
    modelValues8.value.money.value,
    formParam.value.manageBrcd.value,
    formParam.value.manageBranchName.value,
    formParam.value.manageEmployeeNo.value,
    formParam.value.manageEmployeeName.value
  ]
  _chkArr.forEach(check => {
    check = false
  })
}

let isSetPledgeDataRunning = false
// 담보 및 설정 데이터 세팅
const setPledgeData = (collateralData) => {
  // 담보 세팅
  if (collateralData.currencyCode) {
    collateralData.ccycdAppraisal = collateralData.currencyCode
  }
  modelValues.value.currency.value = collateralData.ccycdMarket
  modelValues2.value.currency.value = collateralData.ccycdAppraisal
  modelValues.value.money.value = collateralData.marketAmt
  modelValues2.value.money.value = collateralData.appraisalAmt
  formParam.value.collateralNo.value = collateralData.collateralNo
  formParam.value.collateralTitleName.value = collateralData.collateralTitleName
  formParam.value.collateralTpcd.value = collateralData.collateralTpcd
  formParam.value.collateralDetailCd.value = collateralData.collateralDetailCd
  formParam.value.colManageBrcd.value = collateralData.manageBrcd
  formParam.value.ownerRelationTpcd.value = collateralData.ownerRelationTpcd
  formParam.value.colOwnerNo.value = collateralData.colOwnerNo
  formParam.value.colOwnerName.value = collateralData.colOwnerName
  formParam.value.appraisalTypeCode.value = collateralData.appraisalTypeCode
  formParam.value.applicationNo.value = lonApplicationNoHlp.value
  formParam.value.contractNo.value = lonContractNoHlp.value
  formParam.value.pledgeDate.value = session.sysCurrentBusinessDate
  formParam.value.manageBrcd.value = session.sysBranchCode
  formParam.value.manageEmployeeNo.value = session.sysEmployeeNo
  formParam.value.recognitionRatio.value = 100
  const searchParams = ref({
    collateralNo: {
      value: collateralData.collateralNo
    },
    applicationNo: {
      value: lonApplicationNoHlp.value
    },
    helpSearchType: {
      value: 'lonHlpPlg'
    },
    pledgeNo: {
      value: props.lonPledgeNo
    }
  })
  // 설정 세팅
  const saveParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', searchParams)
  ajaxUtil.ajaxServiceCall(saveParam)
    .then(async (response) => {
      freeformUtil.clear(modelValues3)
      freeformUtil.clear(modelValues4)
      await nextTick()
      const data = response.data.result.data[0]
      if (!commonUtil.isEmpty(data.pledgeNo)) {
        isSetPledgeDataRunning = true
        formParam.value.pledgeNo.value = data.pledgeNo
        formParam.value.pledgeStatusCode.value = data.pledgeStatusCode
        formParam.value.priority.value = data.priority
        formParam.value.expireDate.value = data.expireDate
        if (commonUtil.isEmpty(data.pledgeDate)) formParam.value.pledgeDate.value = dayjs(today).format(commonProp.dateformat.dateType)
        formParam.value.releaseDate.value = data.releaseDate
        formParam.value.contractNo.value = data.contractNo
        formParam.value.recognitionRatio.value = data.recognitionRatio
        modelValues3.value.currency.value = data.ccycdAppraisal
        modelValues3.value.money.value = data.appraisalAmount
        modelValues4.value.currency.value = data.ccycdOurPrior
        modelValues4.value.money.value = commonUtil.isEmpty(data.ourPriorLien) ? 0 : data.ourPriorLien
        modelValues5.value.currency.value = data.ccycdMaxpledge
        modelValues5.value.money.value = data.maxPledgeAmt
        modelValues6.value.currency.value = data.ccycdColVal
        modelValues6.value.money.value = data.collateralValue
        modelValues7.value.currency.value = commonUtil.isEmpty(data.ccycdOthersPrior) ? data.ccycdAppraisal : data.ccycdOthersPrior
        modelValues7.value.money.value = commonUtil.isEmpty(data.othersPriorLien) ? 0 : data.othersPriorLien
        modelValues8.value.currency.value = commonUtil.isEmpty(data.ccycdPledge) ? data.ccycdAppraisal : data.ccycdPledge
        modelValues8.value.money.value = commonUtil.isEmpty(data.pledgeAmount) ? 0 : data.pledgeAmount
        formParam.value.manageBrcd.value = commonUtil.isEmpty(data.manageBrcd) ? session.sysBranchCode : data.manageBrcd
        formParam.value.manageEmployeeNo.value = commonUtil.isEmpty(data.manageEmployeeNo) ? session.sysEmployeeNo : data.manageEmployeeNo
        formParam.value.manageEmployeeName.value = commonUtil.isEmpty(data.manageEmployeeName) ? session.sysUserName : data.manageEmployeeName
        formParam.value.pledgeTpcd.value = data.pledgeTpcd
      } else {
        isSetPledgeDataRunning = false
        formParam.value.pledgeStatusCode.value = '10'
        modelValues3.value.currency.value = collateralData.ccycdAppraisal
        modelValues3.value.money.value = collateralData.appraisalAmt
        modelValues4.value.money.value = data.ourPriorLien
        modelValues4.value.currency.value = collateralData.ccycdAppraisal
        modelValues5.value.currency.value = collateralData.ccycdAppraisal
        modelValues6.value.currency.value = collateralData.ccycdAppraisal
        modelValues7.value.currency.value = collateralData.ccycdAppraisal
        modelValues8.value.currency.value = collateralData.ccycdAppraisal
      }
    })
}

/* =======================================================
    9. popup
======================================================= */
const showPopup = (type) => {
  if (disableFlag.value !== true) {
    showCustomerSearch.value = false
    showColListSearch.value = false
    showContractSearch.value = false
    showBranch1Search.value = false
    showBranch2Search.value = false
    showCustomerSearch2.value = false

    switch (type) {
      case 'cust' : showCustomerSearch.value = true; break
      case 'cust2' : showCustomerSearch2.value = true; break
      case 'brch1' : showBranch1Search.value = true; break
      case 'brch2' : showBranch2Search.value = true; break
      case 'user' : showUserSearch.value = true; break
      case 'col' : showColListSearch.value = true; break
      case 'con' : showContractSearch.value = true; break
    }
    isCalendarOpen.value = true
  }
}

const addFlag = ref('true')
const getColPopupRowData = (event) => {
  // 해당 담보 설정 중, 동일한 신청건이 있는지 조회
  for (const data of lonPledgeListHlp.value) {
    if (data.collateralNo === event[0].collateralNo) {
      addFlag.value = 'false'
      break
    } else {
      addFlag.value = 'true'
    }
  }

  if (addFlag.value !== 'false') {
    formParam.value.collateralValue.value = 0
    formParam.value.recognitionRatio.value = 0
    formParam.value.othersPriorLien.value = 0
    formParam.value.maxPledgeAmt.value = 0
    formParam.value.pledgeAmount.value = 0
    setPledgeData(event[0])
  // 이미 등록된 담보의 경우 재등록 불가능
  } else {
    const _alertInfo = () => {
      emit('selectedPopupRowData', '')
      model.value = false
    }
    messageBox.alertInfo(i18n.global.t('msg.info.pledgedCollateral'), _alertInfo)
  }
}
const getCustPopupRowData = (event) => {
  formParam.value.customerNo.value = event[0].customerNo
  formParam.value.customerName.value = event[0].customerName
  showPopup('col')
}
const getCustPopupRowData2 = (event) => {
  formParam.value.colOwnerNo.value = event[0].customerNo
  formParam.value.colOwnerName.value = event[0].customerName
}
const getBranch1PopupRowData = (event) => {
  formParam.value.colManageBrcd.value = event[0].branchCode
  formParam.value.colManageBrnm.value = event[0].branchName
}
const getBranch2PopupRowData = (event) => {
  formParam.value.manageBrcd.value = event[0].branchCode
  formParam.value.manageBranchName.value = event[0].branchName
}
const getEmpPopupRowData = (event) => {
  formParam.value.manageEmployeeNo.value = event[0].employeeNo
  formParam.value.manageEmployeeName.value = event[0].employeeName
}
const getContractPopupRowData = (event) => {
  formParam.value.contractNo.value = event[0].contractNo
}

// watch({
//   /**
//    *
//    */
//   lonApplicationNo: function (newValue, oldValue) {
//   },
//   /**
//    *
//    */
//   collateralStatus: function (newValue, oldValue) {
//   }
// })

const error = computed(() => Number(formParam.value.pledgeAmount.value) > Number(formParam.value.maxPledgeAmt.value))
const errorMessage = 'Pledge Amount cannot exceed Max Amount.'

watch(
  () => [formParam.value.collateralValue.value, formParam.value.ourPriorLien.value, formParam.value.othersPriorLien.value],

  async () => {
    freeformUtil.clear(modelValues5)
    await nextTick()
    modelValues5.value.money.value = formParam.value.collateralValue.value - (formParam.value.ourPriorLien.value + formParam.value.othersPriorLien.value)
    modelValues5.value.currency.value = modelValues3.value.currency.value
  },
  { immediate: true }
)

watch(() => formParam.value.appraisalAmount.value, async (newValue) => {
  if (isSetPledgeDataRunning) return
  if (formParam.value.recognitionRatio.value !== null) {
    freeformUtil.clear(modelValues6)
    await nextTick()
    modelValues6.value.money.value = newValue * (formParam.value.recognitionRatio.value / 100)
    modelValues6.value.currency.value = modelValues3.value.currency.value
  }
})

watch(() => formParam.value.recognitionRatio.value, async (newValue) => {
  if (isSetPledgeDataRunning) return
  if (formParam.value.appraisalAmount.value !== null) {
    freeformUtil.clear(modelValues6)
    await nextTick()
    modelValues6.value.money.value = formParam.value.appraisalAmount.value * (newValue / 100)
    modelValues6.value.currency.value = modelValues3.value.currency.value
  }
})

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
.double_input_box {
    display: flex;
    gap: 10px;
}

.msg_info_form_triple_box {
    display: grid;
    gap: 20px 30px;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 24px 0 0;
    overflow: hidden;
}
</style>
