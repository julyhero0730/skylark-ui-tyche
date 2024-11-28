<template>
  <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
      <q-card class="popup_inner width35" :style=dragablePopupStyle>
          <q-card-section flat bordered>
              <div class="msg_info_form_single_box">
                  <div style="display:flex;">
                    <div class="width55" style="margin-right:10px;">
                        <label class="form_label">{{ $t('label.objt.conditionTycd') }}</label>
                        <CommonSelectBox
                          maxlength="30"
                          :disable="disableFlag"
                          :codeList="commonCodeList.conditionType"
                          v-model="formParam.conditionTycd.value">
                        </CommonSelectBox>
                    </div>
                    <div class="width43">
                        <label class="form_label">{{ $t('label.objt.dueDate') }}</label>
                        <CommonCalendarYMD :disable="disableFlag" style="text-align-last: center;" v-model="formParam.dueDate.value" ></CommonCalendarYMD>
                    </div>
                  </div>
              </div>
              <div class="msg_info_form_single_box">
                  <label class="form_label">{{ $t('label.objt.conditionDetail') }}</label>
                  <CommonInputBox class="height10" type="textarea" :disable="disableFlag" :max=500 v-model="formParam.conditionDetail.value"></CommonInputBox>
              </div>
          </q-card-section>
          <q-separator style="margin-top:15px" inset />
          <q-card-section flat bordered style="margin-top:-20px;">
              <div class="msg_info_form_box">
                <div>
                  <label class="form_label">{{ $t('label.objt.performed') }}</label>
                  <q-radio :disable="approveFlag" v-model="formParam.performedYn.value" val="Y" label="Yes"/>
                  <q-radio :disable="approveFlag" v-model="formParam.performedYn.value" val="N" label="No" />
                </div>
                <div>
                  <label class="form_label">{{ $t('label.objt.performedDate') }}</label>
                  <CommonCalendarYMD :disable="approveFlag" style="text-align-last: center;" v-model="formParam.performedDate.value" ></CommonCalendarYMD>
                </div>
              </div>
              <div class="msg_info_form_single_box">
                  <label class="form_label">{{ $t('label.objt.performedResults') }}</label>
                  <CommonInputBox class="height10" :disable="approveFlag" type="textarea" :max=500 v-model="formParam.performedResults.value"></CommonInputBox>
              </div>
              <div class="toBottom" style="padding: 24px 0 0; display:flex;justify-content: center; align-items: center;">
                <q-btn flat :disable="okBtnFlag" :label="$t('label.view.ok')" class="btn btmBtn width18" style="margin-right:30px;" @click="save()"/>
                <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn width18" v-close-popup @click="closePopup"/>
              </div>
          </q-card-section>
      </q-card>
  </q-dialog>
</template>
<script setup>
/* =======================================================
    1. Import Area
======================================================= */
import { commonUtil, ajaxUtil, commonProp, freeformUtil, messageBox } from 'skylark-ui-lib'
import { computed, ref, reactive } from 'vue'
import { useSessionStore } from 'stores/session'
import dayjs from 'dayjs'

const emit = defineEmits(['update:modelValue', 'selectedPopupRowData'])
const disableFlag = ref(false)
const approveFlag = ref(false)
const okBtnFlag = ref(false)
const employeeNoHlp = ref('')
const applyEmployeeNoHlp = ref('')
const modifyFlag = ref(false)
const session = useSessionStore()
const isDateRequired = ref(false)

const props = defineProps({
  employeeNo: {
    type: String
  },
  applyEmployeeNo: {
    type: String
  },
  enterType: {
    type: String
  },
  datas: {
    type: Array
  },
  fromBtn: {
    type: String
  },
  modelValue: { type: Boolean, required: true }
})

const model = computed({
  get () {
    if (props.modelValue) {
      showDialog()
    }
    return props.modelValue
  },
  set (newValue) {
    emit('update:modelValue', newValue)
  }
})

const dialogPos = {
  x: 0,
  y: 0
}

const showDialog = () => {
  model.value = true
  employeeNoHlp.value = props.employeeNo
  applyEmployeeNoHlp.value = props.applyEmployeeNo
  // 추가 버튼으로 들어온 경우
  if (props.enterType === 'plus') {
    formParam.value.conditionTycd.value = commonCodeList.conditionType[0].code
    formParam.value.dueDate.value = dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateTimeType)
    formParam.value.performedYn.value = 'N'
    formParam.value.serialNo.value = ''
    modifyFlag.value = false
  } else {
    modifyFlag.value = true
    freeformUtil.selectedRowDataToFreeformData(props.datas[0], formParam.value)
  }
  getEmployeeType()
}

// 접속자 확인 후 Flag 세팅
const getEmployeeType = () => {
  formParam.value.performedDate.value = ''
  // 접속자가 결재자인 경우
  if (session.sysEmployeeNo === employeeNoHlp.value) {
    if (formParam.value.performedYn.value === 'Y') {
      disableFlag.value = true
      okBtnFlag.value = true
    } else {
      okBtnFlag.value = false
      disableFlag.value = false
    }
    approveFlag.value = true
  // 접속자가 신청자인 경우
  } else if (session.sysEmployeeNo === applyEmployeeNoHlp.value && props.fromBtn === 'apply') {
    approveFlag.value = false
    disableFlag.value = true
    okBtnFlag.value = false
    formParam.value.performedDate.value = dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateTimeType)
    isDateRequired.value = true
  // 그 외
  } else {
    approveFlag.value = true
    disableFlag.value = true
    okBtnFlag.value = true
  }
}

const closePopup = () => {
  freeformUtil.clear(formParam)
}

const commonCodeList = reactive({
  conditionType: ref([])
})

ajaxUtil.getCodeList('LON_APPROVAL_CONDITION_CD')
  .then(function (codeData) {
    commonCodeList.conditionType = codeData.lonApprovalConditionCd
    formParam.value.conditionTycd.value = commonCodeList.conditionType[0].code
  })

const formParam = ref({
  serialNo: {
    value: '',
    required: true
  },
  conditionTycd: {
    value: '',
    required: true
  },
  dueDate: {
    value: dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateTimeType),
    required: true
  },
  conditionDetail: {
    value: '',
    required: false
  },
  performedYn: {
    value: 'N',
    required: false
  },
  performedDate: {
    value: '',
    required: false
  },
  performedResults: {
    value: '',
    required: false
  }
})

const save = () => {
  // 신청자가 조건을 업데이트 한 경우
  if (props.applyEmployeeNo === session.sysEmployeeNo) {
    if (commonUtil.isEmpty(formParam.value.performedDate.value)) {
      messageBox.alertError('Performed Date is required')
      return
    } else if (commonUtil.isEmpty(formParam.value.performedResults.value)) {
      messageBox.alertError('Performed Results is required')
      return
    }
    formParam.value.performedDate.value = dayjs(formParam.value.performedDate.value).format('YYYY-MM-DD')
  }
  // 결재자가 조건을 입력한 경우
  if (props.employeeNo === session.sysEmployeeNo) {
    if (commonUtil.isEmpty(formParam.value.dueDate.value)) {
      messageBox.alertError('Due Date is required')
      return
    } else if (commonUtil.isEmpty(formParam.value.conditionDetail.value)) {
      messageBox.alertError('Condition Detail is required')
      return
    }
    formParam.value.dueDate.value = dayjs(formParam.value.dueDate.value).format('YYYY-MM-DD')
  }
  emit('selectedPopupRowData', formParam)
  model.value = false
  closePopup()
}

const dragablePopupStyle = computed(() => {
  return {
    transform: `translate(${dialogPos.x}px, ${dialogPos.y}px)`
  }
})
</script>
<style scoped>
.msg_info_form_single_box {
    margin-top: 20px;
}
</style>
