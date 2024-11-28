<template>
<div class="table_top_button_wrapper">
                <CommonRadioGroup v-model="formParam.transactionMode.value" :useSave="true" :saveFunc="save" :selectFunc="updateTrxnMode" :radioDisableFlag="radioDisableFlag"></CommonRadioGroup>
            </div>
            <div class="scrollable-container height73" >
                <div class="msg_info_form_quadruple_box">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.collateralNo') }}</label>
                        <div class="relative-container d-flex items-center width100" style="display: flex; align-items: center;">
                            <CommonDirectSearchBox maxlength="30" v-model="formParam.collateralNo.value" :disable=showColSearch.value hlpType="lonHlpCol" :searchCode="formParam.collateralNo.value" @directSearchVal="getColDirectSearch"></CommonDirectSearchBox>&nbsp;&nbsp;
                            <CommonInputBox class="width65" maxlength="10" v-model="formParam.collateralTitleName.value" :disable="cdDisable"  style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="showColSearchPopup()" />
                            <lonHlpCol v-model="showColSearch" @selected-popup-row-data = "getPopupRowData"></lonHlpCol>
                        </div>
                    </div>
                    <div class="full-row">
                        <div>
                            <label class="form_label is_required">{{ $t('label.objt.collateralTitle') }}</label>
                            <CommonSearchInputBox v-model="formParam.collateralTitleName.value" :disable="nonTarget"></CommonSearchInputBox>
                        </div>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.collateralType') }}</label>
                        <CommonSearchSelectBox :codeList="commonCodeList.collateralTypeCode" v-model="formParam.collateralTpcd.value" :disable="nonTarget"></CommonSearchSelectBox>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.collateralStatus') }}</label>
                        <q-card class="my-card">
                            <div class="radios-wrapper" >
                                <div class="radio-wrapper" style="margin-right: 30px;">
                                    <q-radio v-model="formParam.collateralStatusCd.value" val="01" :disable="nonTarget"/>
                                    <label class="{{ formParam.collateralStatusCd.value === '01' ? 'active' : '' }} form_label">{{ $t('label.objt.registration') }}</label>
                                </div>
                                <div class="radio-wrapper">
                                    <q-radio v-model="formParam.collateralStatusCd.value" val="05" :disable="nonTarget"/>
                                    <label class="{{ formParam.collateralStatusCd.value === '05' ? 'active' : '' }} form_label">{{ $t('label.objt.release') }}</label>
                                </div>
                            </div>
                        </q-card>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.marketAmount') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                :modelValues="modelValues"
                                class="width100"
                                :selectDisabled="cdDisable" :inputDisabled="nonTarget">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box">
                    <div class="full-row">
                        <label class="form_label is_required">{{ $t('label.view.loanCustomer') }}</label>
                        <div class="horizontal-layout d-flex items-center">
                          <CommonDirectSearchBox maxlength="30" v-model="formParam.customerNo.value" class="width27" :disable="nonTarget" hlpType="frmHlpCst" :searchCode="formParam.customerNo.value" @directSearchVal="getCstDirectSearch"></CommonDirectSearchBox>
                            <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="nonTarget ? null : showCstSearchPopup1()" />
                                <frmHlpCst v-model="showCstSearch1" @selected-popup-row-data = "getPopupRowData1"></frmHlpCst>
                            <CommonInputBox maxlength="3" v-model="formParam.customerName.value" :disable="cdDisable" class="width73" style="margin-left: -20px;"></CommonInputBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.ownerRelation') }}</label>
                        <CommonSearchSelectBox :codeList="commonCodeList.ownerRelationRTypeCode" v-model="formParam.ownerRelationTpcd.value" @update:modelValue="handleChange" :disable="nonTarget"></CommonSearchSelectBox>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box">
                    <div class="full-row">
                        <label class="form_label is_required">{{ $t('label.view.ownerCustomer') }}</label>
                        <div class="horizontal-layout d-flex items-center">
                            <CommonInputBox  v-model="formParam.colOwnerNo.value" class="width27" style="text-align-last: center;" :disable="(formParam.ownerRelationTpcd.value === '01') || nonTarget"></CommonInputBox>
                            <q-icon name="search" size="sm" style="margin:0 20px 0 -40px;" class="help_button_simple" @click="(formParam.ownerRelationTpcd.value === '01') || nonTarget ? null : showCstSearchPopup2()" />
                                <frmHlpCst v-model="showCstSearch2" @selected-popup-row-data = "getPopupRowData2"></frmHlpCst>
                            <CommonInputBox  v-model="formParam.colOwnerName.value" :disable="cdDisable" class="width73" style="margin-left: -20px;"></CommonInputBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.view.registerDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.registerDate.value"  style="text-align-last: center;" :disable="(formParam.collateralStatusCd.value !== '01') || nonTarget"></CommonCalendarYMD>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.appraisalType') }}</label>
                        <CommonSearchSelectBox :codeList="commonCodeList.apprasialTypeCode" v-model="formParam.appraisalTypeCode.value" :disable="nonTarget"></CommonSearchSelectBox>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.view.appraisalInst') }}</label>
                        <CommonSearchInputBox v-model="formParam.appraisalInstitutionNm.value" :disable="(formParam.appraisalTypeCode.value === '01') || nonTarget" :style="{ backgroundColor: ((formParam.appraisalTypeCode.value === '01') || nonTarget) ? '#f9f9f9' : '' }"></CommonSearchInputBox>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.releaseDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.releaseDate.value"  style="text-align-last: center;" :disable="(formParam.collateralStatusCd.value !== '05') || nonTarget"></CommonCalendarYMD>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box">
                    <div>
                        <label class="form_label">{{ $t('label.view.appraisalDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.appraisalDate.value"  style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                    </div>
                    <div>
                        <label class="form_label is_required">{{ $t('label.view.appraisalReview') }}</label>
                        <div class="double_input_box">
                            <CommonCurFormatterBox
                                class="width100"
                                :modelValues="modelValues2"
                                :selectDisabled="nonTarget"
                                :inputDisabled="nonTarget">
                            </CommonCurFormatterBox>
                        </div>
                    </div>
                    <div>
                        <label class="form_label">{{ $t('label.objt.expireDate') }}</label>
                        <CommonCalendarYMD v-model="formParam.expireDate.value"  style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box" style="display: none;">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.registInfo') }}</label>
                        <CommonCalendarYMD v-model="formParam.registDate.value"  style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
                    </div>
                    <div>
                        <label class="form_label is_required"></label>
                        <div class="relative-container d-flex items-center">
                            <CommonInputBox maxlength="10" v-model="formParam.createBranchName.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showBraSearchPopup1()" />
                            <frmHlpBrc v-model="showBraSearch1" @selected-popup-row-data = "getPopupRowData5"></frmHlpBrc>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required"></label>
                        <div class="relative-container d-flex items-center">
                            <CommonInputBox maxlength="10" v-model="formParam.createEmpName.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showEmpSearchPopup1()" />
                            <frmHlpEmp v-model="showEmpSearch1" @selected-popup-row-data = "getPopupRowData3"></frmHlpEmp>
                        </div>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box" style="display: none;">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.manageInfo') }}</label>
                        <CommonCalendarYMD maxlength="100" v-model="formParam.manageDate.value" style="text-align-last: center;" :disable="cdDisable"></CommonCalendarYMD>
                    </div>
                    <div>
                        <label class="form_label is_required"></label>
                        <div class="relative-container d-flex items-center">
                            <CommonInputBox maxlength="10" v-model="formParam.mngBranchName.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showBraSearchPopup2()" />
                            <frmHlpBrc v-model="showBraSearch2" @selected-popup-row-data = "getPopupRowData6"></frmHlpBrc>
                        </div>
                    </div>
                    <div>
                        <label class="form_label is_required"></label>
                        <div class="relative-container d-flex items-center">
                            <CommonInputBox maxlength="10" v-model="formParam.mngEmpName.value" :disable="cdDisable" style="text-align-last: center;"></CommonInputBox>
                            <q-icon name="search" size="sm" style="position:absolute; right:10px; top:50%; transform: translateY(-50%);" class="help_button_simple" @click="cdDisable ? null : showEmpSearchPopup2()" />
                            <frmHlpEmp v-model="showEmpSearch2" @selected-popup-row-data = "getPopupRowData4"></frmHlpEmp>
                        </div>
                    </div>
                </div>
                <div class="msg_info_form_quadruple_box">
                        <div class="all-full-row">
                            <label class="form_label">{{ $t('label.view.remark') }}</label>
                            <q-input v-model="formParam.rmk.value" filled type="textarea" style="background-color: #F9F9F9; border: 1px solid #E5E5E5" :disable="nonTarget"/>
                        </div>
                </div>
                <div class="msg_info_form_quadruple_box" style="margin-top: 10px;">
                    <q-list class="custom-gray text-white rounded-borders all-full-row bordered-items" >
                    <q-expansion-item
                    v-model="isRealEstateExpanded"
                    >
                    <template v-slot:header>
                        <div class="text-center full-width">{{ $t('label.view.realEstate') }}</div>
                    </template>
                    <q-card v-show="formParam.collateralTpcd.value == '100'">
                        <q-card-section>
                            <div class="msg_info_form_triple_box height12">
                                <div>
                                    <label class="form_label">{{ $t('label.objt.collateralDetailType') }}</label>
                                    <CommonSearchSelectBox :codeList="commonCodeList.collateralDetailTypeCode1" v-model="estateParam.collateralDetailCd.value" :disable="nonTarget"></CommonSearchSelectBox>
                                </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.quantity') }}</label>
                                    <div class="relative-container1">
                                        <CommonIncomeInput  v-model="estateParam.quantitySize.value" class="flex-grow width10" :disable="nonTarget"></CommonIncomeInput>
                                        <CommonSearchInputBox  v-model="estateParam.unitName.value" class="flex-grow width10" :disable="nonTarget" style="margin-left: 10px;"></CommonSearchInputBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10" style="margin-top: -10px;">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.country') }}</label>
                                    <div class="horizontal-layout d-flex items-center">
                                        <CommonInputBox maxlength="3" v-model="estateParam.countryCode.value" :disable="nonTarget" class="width27"></CommonInputBox>
                                        <q-icon name="search" size="sm" style="margin:0 20px 0 -40px; z-index: 1000; color: #080808;" class="help_button_simple" @click="nonTarget ? null : showCtySearchPopup1()" />
                                            <frmHlpCty v-model="showCtySearch1" @selected-popup-row-data = "getPopupRowData7"></frmHlpCty>
                                        <CommonInputBox maxlength="3" v-model="estateParam.countryName.value" :disable="cdDisable" class="width72" style="margin-left: -18px;"></CommonInputBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.location') }}</label>
                                    <div class="horizontal-layout d-flex items-center">
                                        <CommonInputBox maxlength="3" v-model="estateParam.locationCode.value" :disable="nonTarget" class="width27"></CommonInputBox>
                                        <q-icon name="search" size="sm" style="margin:0 20px 0 -40px; z-index: 1000; color: #080808;" class="help_button_simple" @click="nonTarget ? null : showLocSearchPopup1()" />
                                            <frmHlpLoc v-model="showLocSearch1" @selected-popup-row-data = "getPopupRowData9"></frmHlpLoc>
                                        <CommonInputBox maxlength="3" v-model="estateParam.locationName.value" :disable="cdDisable" class="width72" style="margin-left: -18px;"></CommonInputBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.address') }}</label>
                                    <CommonSearchInputBox v-model="estateParam.collateralAddr.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.additionalInfo') }}</label>
                                    <CommonSearchInputBox v-model="estateParam.additionalInfo.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                            </div>
                        </q-card-section>
                        </q-card>
                    </q-expansion-item>

                    <q-expansion-item
                    v-model="isVehicleExpanded"
                    >
                    <template v-slot:header>
                        <div class="text-center full-width">{{ $t('label.view.vehicle') }}</div>
                    </template>
                    <q-card v-show="formParam.collateralTpcd.value == '200'">
                        <q-card-section>
                            <div class="msg_info_form_triple_box height10">
                                <div>
                                    <label class="form_label">{{ $t('label.objt.collateralDetailType') }}</label>
                                    <CommonSearchSelectBox :codeList="commonCodeList.collateralDetailTypeCode2" v-model="vehicleParam.collateralDetailCd.value" :disable="nonTarget" ></CommonSearchSelectBox>
                                </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.maker') }}</label>
                                    <CommonSearchInputBox v-model="vehicleParam.makerName.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.licensePlateNo') }}</label>
                                    <CommonSearchInputBox v-model="vehicleParam.licensePlateNo.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height12">
                                <div>
                                    <label class="form_label">{{ $t('label.view.purchaseDate') }}</label>
                                    <CommonCalendarYMD maxlength="100" v-model="vehicleParam.purchaseDate.value" style="text-align-last: center;" :disable="nonTarget"></CommonCalendarYMD>
                                </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.purchasePrice') }}</label>
                                    <div class="double_input_box">
                                        <CommonCurFormatterBox
                                            class="width100"
                                            :modelValues="modelValues3"
                                            :selectDisabled="cdDisable"
                                            :inputDisabled="nonTarget">
                                        </CommonCurFormatterBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10" style="margin-top: -10px;">
                                <div>
                                    <label class="form_label">{{ $t('label.view.productYear') }}</label>
                                    <CommonSearchInputBox maxlength="100" v-model="vehicleParam.productYear.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.model') }}</label>
                                    <CommonSearchInputBox v-model="vehicleParam.modelNm.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.additionalInfo') }}</label>
                                    <CommonSearchInputBox v-model="vehicleParam.additionalInfo.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                            </div>
                        </q-card-section>
                        </q-card>
                    </q-expansion-item>

                    <q-expansion-item
                    v-model="isOthersExpanded"
                    >
                    <template v-slot:header>
                        <div class="text-center full-width">{{ $t('label.view.others') }}</div>
                    </template>
                    <q-card v-show="formParam.collateralTpcd.value == '900'">
                        <q-card-section>
                            <div class="msg_info_form_triple_box height12">
                                <div>
                                    <label class="form_label">{{ $t('label.objt.collateralDetailType') }}</label>
                                    <CommonSearchSelectBox :codeList="commonCodeList.collateralDetailTypeCode9" v-model="othersParam.collateralDetailCd.value" :disable="nonTarget" ></CommonSearchSelectBox>                            </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.quantity') }}</label>
                                    <div class="relative-container1">
                                        <CommonIncomeInput  v-model="othersParam.quantitySize.value" class="flex-grow" :disable="nonTarget"></CommonIncomeInput>
                                        <CommonSearchInputBox  v-model="othersParam.unitName.value" class="flex-grow" :disable="nonTarget" style="margin-left: 10px;"></CommonSearchInputBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10" style="margin-top: -10px;">
                                <div>
                                    <label class="form_label">{{ $t('label.veiw.referenceNo') }}</label>
                                    <CommonSearchInputBox maxlength="100" v-model="othersParam.referenceNo.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                                <div>
                                    <label class="form_label">{{ $t('label.view.issuer') }}</label>
                                    <CommonSearchInputBox v-model="othersParam.issueNm.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.country') }}</label>
                                    <div class="horizontal-layout d-flex items-center">
                                        <CommonInputBox maxlength="3" v-model="othersParam.countryCode.value" :disable="nonTarget" class="width27"></CommonInputBox>
                                        <q-icon name="search" size="sm" style="margin:0 20px 0 -40px; z-index: 1000; color: #080808;" class="help_button_simple" @click="nonTarget ? null : showCtySearchPopup2()" />
                                            <frmHlpCty v-model="showCtySearch2" @selected-popup-row-data = "getPopupRowData8"></frmHlpCty>
                                        <CommonInputBox maxlength="3" v-model="othersParam.countryName.value" :disable="cdDisable" class="width72" style="margin-left: -18px;"></CommonInputBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.location') }}</label>
                                    <div class="horizontal-layout d-flex items-center">
                                        <CommonInputBox maxlength="3" v-model="othersParam.locationCode.value" :disable="nonTarget" class="width27"></CommonInputBox>
                                        <q-icon name="search" size="sm" style="margin:0 20px 0 -40px; z-index: 1000; color: #080808;" class="help_button_simple" @click="nonTarget ? null : showLocSearchPopup2()" />
                                            <frmHlpLoc v-model="showLocSearch2" @selected-popup-row-data = "getPopupRowData10"></frmHlpLoc>
                                        <CommonInputBox maxlength="3" v-model="othersParam.locationName.value" :disable="cdDisable" class="width72" style="margin-left: -18px;"></CommonInputBox>
                                    </div>
                                </div>
                            </div>
                            <div class="msg_info_form_triple_box height10">
                                <div class="full-row">
                                    <label class="form_label">{{ $t('label.view.additionalInfo') }}</label>
                                    <CommonSearchInputBox  v-model="othersParam.additionalInfo.value" :disable="nonTarget"></CommonSearchInputBox>
                                </div>
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
import lonHlpCol from 'src/components/pages/main/hlp/lon/lonHlpCol.vue'
import { frmHlpCst, frmHlpBrc, frmHlpCty, frmHlpLoc, frmHlpEmp } from 'skylark-ui-lib'
/* =======================================================
    Global Variable
  ======================================================= */
const props = defineProps({
  formParam: {
    default: {}
  },
  estateParam: {
    default: {}
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
  modelValues: {
    default: {}
  },
  modelValues2: {
    default: {}
  },
  modelValues3: {
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
  showColSearch: {
    default: false
  },
  showCstSearch1: {
    default: false
  },
  showCstSearch2: {
    default: false
  },
  showBraSearch1: {
    default: false
  },
  showEmpSearch1: {
    default: false
  },
  showBraSearch2: {
    default: false
  },
  showEmpSearch2: {
    default: false
  },
  showCtySearch1: {
    default: false
  },
  showLocSearch1: {
    default: false
  },
  showCtySearch2: {
    default: false
  },
  showLocSearch2: {
    default: false
  },
  isRealEstateExpanded: {
    default: false
  },
  isVehicleExpanded: {
    default: false
  },
  isOthersExpanded: {
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
  handleChange: {
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
  getPopupRowData: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData1: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData2: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData3: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData4: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData5: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData6: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData7: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData8: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData9: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getPopupRowData10: {
    type: Function,
    /**
     *
     */
    default () {
    }
  },
  getColDirectSearch: {
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
  }
})

/* =======================================================
    Freeform Object
  ======================================================= */
const formParam = ref(props.formParam)
const estateParam = ref(props.estateParam)
const vehicleParam = ref(props.vehicleParam)
const othersParam = ref(props.othersParam)

const showColSearch = ref(props.showColSearch)
const showCstSearch1 = ref(props.showCstSearch1)
const showCstSearch2 = ref(props.showCstSearch2)
const showBraSearch1 = ref(props.showBraSearch1)
const showEmpSearch1 = ref(props.showEmpSearch1)
const showBraSearch2 = ref(props.showBraSearch2)
const showEmpSearch2 = ref(props.showEmpSearch2)
const showCtySearch1 = ref(props.showCtySearch1)
const showLocSearch1 = ref(props.showLocSearch1)
const showCtySearch2 = ref(props.showCtySearch2)
const showLocSearch2 = ref(props.showLocSearch2)

const isRealEstateExpanded = ref(props.isRealEstateExpanded)
const isVehicleExpanded = ref(props.isVehicleExpanded)
const isOthersExpanded = ref(props.isOthersExpanded)
/* =======================================================
    Freeform Funtion
======================================================= */

watch(props, (newProps) => {
  if (newProps.isRealEstateExpanded) {
    isRealEstateExpanded.value = newProps.isRealEstateExpanded
  } else {
    isRealEstateExpanded.value = false
  }

  if (newProps.isVehicleExpanded) {
    isVehicleExpanded.value = newProps.isVehicleExpanded
  } else {
    isVehicleExpanded.value = false
  }

  if (newProps.isVehicleExpanded) {
    isOthersExpanded.value = newProps.isOthersExpanded
  } else {
    isOthersExpanded.value = false
  }
})

const showColSearchPopup = () => {
  showColSearch.value = true
}

const showCstSearchPopup1 = () => {
  showCstSearch1.value = true
}

const showCstSearchPopup2 = () => {
  showCstSearch2.value = true
}

const showEmpSearchPopup1 = () => {
  showEmpSearch1.value = true
}

const showEmpSearchPopup2 = () => {
  showEmpSearch2.value = true
}

const showBraSearchPopup1 = () => {
  showBraSearch1.value = true
}

const showBraSearchPopup2 = () => {
  showBraSearch2.value = true
}

const showCtySearchPopup1 = () => {
  showCtySearch1.value = true
}

const showCtySearchPopup2 = () => {
  showCtySearch2.value = true
}

const showLocSearchPopup1 = () => {
  showLocSearch1.value = true
}

const showLocSearchPopup2 = () => {
  showLocSearch2.value = true
}
</script>

<style scoped>
.relative-container1 {
   position: relative;
   display: flex;
}
.relative-container {
   position: relative;
}
.all-full-row {
    grid-column-start: span 3;
}
.full-row {
    grid-column-start: span 2;
}
.radios-wrapper {
  display: flex;
  justify-content: center;
}

.radio-wrapper {
  display: flex;
  align-items: center;
}
.horizontal-layout {
   display: flex; /* Use flex for the inner items */
   justify-content: flex-start;
   gap: 10px;
}
.flex-grow {
  flex-grow: 1;
}
.custom-gray {
  background-color: #4850b2;
}
.bordered-items > .q-expansion-item {
  border: 1px solid rgb(153, 153, 153);
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
