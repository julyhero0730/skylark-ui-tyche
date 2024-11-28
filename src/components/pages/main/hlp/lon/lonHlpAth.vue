<template>
  <q-page-container>
    <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened" :no-click-outside="true" :no-escape-key="true">
        <q-card class="popup_inner width50" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
              <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
              <div class="popup_title">{{ $t('label.view.lonHlpAth') }}</div>
              <q-space />
              <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-card-section>
                <div class="msg_info_form_box" style="padding:0px;">
                  <div>
                      <label class="form_label">{{ $t('label.objt.authorizationNo') }}</label>
                      <CommonInputBox :disable=true v-model="formParam.authorizationNo.value" style="text-align-last: center;"></CommonInputBox>
                  </div>
                  <div>
                      <label class="form_label">{{ $t('label.objt.approvalLineStaff') }}</label>
                      <CommonInputBox :disable=true v-model="formParam.approveEmployeeNo.value" style="text-align-last: center;"></CommonInputBox>
                  </div>
                  <div>
                      <label class="form_label is_required">{{ $t('label.objt.authorizationDate') }}</label>
                      <CommonCalendarYMD :disable=disableFlag v-model="formParam.authorizationDate.value" style="text-align-last: center;"></CommonCalendarYMD>
                  </div>
                  <div class="full-row">
                    <label class="form_label is_required">{{ $t('label.objt.authorizationStatus') }}</label>
                    <CommonSearchSelectBox :selectChangeFunc="authStatusChange()" :disable=disableFlag :codeList="commonCodeList.authorizationStatus" v-model="formParam.authorizationStatus.value" ></CommonSearchSelectBox>
                  </div>
                </div>
                <div class="msg_info_form_single_box">
                    <div>
                        <label class="form_label">{{ $t('label.objt.recommendation') }}</label>
                        <CommonInputBox class="height10" :disable=disableFlag  type="textarea" :max=500 v-model="formParam.approverOpinions.value"></CommonInputBox>
                    </div>
                </div>
                <div class="table_scroll_box" style="margin-top:15px;">
                  <div style="display:flow-root;">
                    <label class="form_label">{{ $t('label.objt.approvalCondition') }}</label>
                    <div style="float:right; margin-top:-35px;">
                      <q-btn :disable=btnFlag @click="plusAuthorizationData()" flat round color="grey" icon="add" size="md" />&nbsp;
                      <q-btn :disable=btnFlag @click="minusAuthorizationData()" flat round color="grey" icon="remove" size="md" />&nbsp;&nbsp;&nbsp;
                    </div>
                  </div>
                  <ag-grid-vue
                    class="msg_table ag-theme-balham height20"
                    :columnDefs="columnDefs"
                    :beforeMount="beforeMount"
                    :rowData="rowData"
                    :columnTypes="columnTypes"
                    :context="context"
                    rowSelection="single"
                    :onRowDragEnd="onRowDragEnd"
                    @grid-ready="onGridReady"
                    @rowDoubleClicked="onRowDoubleClicked"
                  ></ag-grid-vue>
                </div>
                <div class="msg_info_form_box">
                  <div>
                    <label class="form_label">{{ $t('label.objt.performed') }}</label>
                    <q-radio :disable="approveFlag" v-model="formParam.performedYn.value" @update:model-value="selectPerformChange" val="Y" label="Yes"/>
                    <q-radio :disable="approveFlag" v-model="formParam.performedYn.value" @update:model-value="selectPerformChange" val="N" label="No" />
                  </div>
                  <div>
                    <label class="form_label">{{ $t('label.objt.performedDate') }}</label>
                    <CommonCalendarYMD :disable="approveFlag" style="text-align-last: center;" v-model="formParam.performedDate.value" ></CommonCalendarYMD>
                  </div>
                </div>
                <div class="msg_info_form_single_box">
                  <label class="form_label">{{ $t('label.objt.performedResults') }}</label>
                  <CommonInputBox class="height10" :disable="approveFlag" type="textarea" :max=500 v-model="formParam.performedResults.value"></CommonInputBox>
                </div><br><br>
              <div class="toBottom" style="display:flex;justify-content: center; align-items: center;">
                  <q-btn flat :disable=okBtnFlag :label="$t('label.view.ok')" class="btn btmBtn width10" style="margin-right:30px;" @click="save()"/>
                  <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn width10" v-close-popup @click="closePopup"/>
              </div>
            </q-card-section>
            <lonHlpAthDetail
              :employee-No=props.approveEmployeeNo
              :apply-Employee-No=props.applyEmployeeNo
              :enter-Type=formParam.enterType.value
              :datas=selectedRowData
              :from-Btn=props.fromBtn
              v-model="showDetailSearch"
              @selected-popup-row-data="getDetailPopupRowData">
            </lonHlpAthDetail>
        </q-card>
    </q-dialog>
  </q-page-container>
</template>

<script setup>
/**

  301040 화면, 결재 팝업
  lonHlpAthDetail 팝업을 통해 조건부 결재 내용 입력 및 수정

  [FUNCTION01] 결재 상태 변경 이벤트
  [FUNCTION02] 조건부 승인 내용 추가 이벤트
  [FUNCTION03] 조건부 승인 내용 삭제 이벤트
  [FUNCTION04] 결재 상태 조회
  [FUNCTION05] 조건부승인 그리드 더블클릭, 상세 조회 팝업 호출
  [FUNCTION06] 조건부 승인 목록 조회
  [FUNCTION07] 결재 내용 저장 이벤트 (OK버튼)
  [FUNCTION08] 신청자 수행여부 Y 변경 이벤트
*/

/* =======================================================
    1. Import Area
======================================================= */
import { commonUtil, messageBox, ajaxUtil, commonProp, gridPropsUtil } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { ref, computed, reactive, watch } from 'vue'
import { useSessionStore } from 'stores/session'
import lonHlpAthDetail from 'src/components/pages/main/hlp/lon/lonHlpAthDetail.vue'
import { AgGridVue } from 'ag-grid-vue3'
import dayjs from 'dayjs'

const disableFlag = ref(true)
const approveFlag = ref(true)
const btnFlag = ref(true)
const okBtnFlag = ref(false)
const session = useSessionStore()
const showDetailSearch = ref(false)
const gridApi = ref(null)
const gridColumnApi = ref(null)
const context = ref([])
const rowData = ref([])
const isCalendarOpen = ref(false)
const selectedRowData = ref([])
const emit = defineEmits(['update:modelValue', 'selectedPopupRowData', 'close-popup'])

const props = defineProps({
  applicationNo: { type: String },
  approveEmployeeNo: { type: String },
  applyEmployeeNo: { type: String },
  fromBtn: { type: String },
  sortSeq: { type: String },
  modelValue: { type: Boolean, required: true },
  approve: { type: Function, default () {} }
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

const showDialog = () => {
  model.value = true
  if (!commonUtil.isEmpty(props.applicationNo) && !commonUtil.isEmpty(props.approveEmployeeNo)) {
    formParam.value.applicationNo.value = props.applicationNo
    formParam.value.approveEmployeeNo.value = props.approveEmployeeNo
  }
  // 결재자가 결재버튼으로 들어온 경우
  if (session.sysEmployeeNo === props.approveEmployeeNo && props.fromBtn === 'Modify') {
    console.log('팝업오픈, 결재자')
    disableFlag.value = false
    okBtnFlag.value = false
    btnFlag.value = false
    approveFlag.value = true
  // 신청자가 신청화면에서 들어온 경우 (02:조건부 승인)
  } else if (session.sysEmployeeNo === props.applyEmployeeNo && formParam.value.authorizationStatus.value === '02' && props.fromBtn === 'apply') {
    console.log('팝업오픈, 신청자 (조건부승인)')
    okBtnFlag.value = false
    disableFlag.value = true
    btnFlag.value = true
    approveFlag.value = false
  // 그 외 내용 확인만 가능
  } else {
    console.log('기타 (확인만 가능)')
    okBtnFlag.value = true
    disableFlag.value = true
    btnFlag.value = true
    approveFlag.value = true
  }
  searchAuthCondition()
}

const clear = () => {
  formParam.value.authorizationStatus.value = ''
  formParam.value.applicationNo.value = ''
  formParam.value.authorizationNo.value = ''
  formParam.value.productName.value = ''
  formParam.value.approveEmployeeNo.value = ''
  formParam.value.authorizationDate.value = ''
  formParam.value.approverOpinions.value = ''
  rowData.value = []
}
const closePopup = () => {
  clear()
}

/* =======================================================
    3. Common Code Adapter
======================================================= */

const commonCodeList = reactive({
  applicationType: ref([]),
  authorizationStatus: ref([]),
  conditionType: ref([])
})

ajaxUtil.getCodeList('SHOWROWS, LON_APPLICATION_TYPE_CODE,LON_APPROVAL_RESULT_CODE,LON_APPROVAL_CONDITION_CD')
  .then(function (codeData) {
    commonCodeList.applicationType = codeData.lonApplicationTypeCode
    commonCodeList.authorizationStatus = codeData.lonApprovalResultCode
    commonCodeList.conditionType = codeData.lonApprovalConditionCd
  })

const beforeMount = () => {
  rowData.value = this.createRowData()
  context.value = { componentParent: this }
}

const onRowDragEnd = () => {
  const tmpRowData = []
  gridApi.value.forEachNode(function (node) {
    tmpRowData.push(node.data)
  })
  tmpRowData.forEach((row, index) => {
    row['#'] = index + 1
  })
  gridApi.value.setRowData(tmpRowData)
}

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

// [FUNCTION01] 결재 상태 변경 이벤트
const authStatusChange = () => {
  const status = formParam.value.authorizationStatus.value
  // Conditional Approved 인 경우에만 + - 버튼 활성화
  if (status === '02') btnFlag.value = false
  else btnFlag.value = true
}

// [FUNCTION02] 조건부 승인 내용 추가 이벤트
const plusAuthorizationData = () => {
  formParam.value.enterType.value = 'plus'
  showDetailSearch.value = true
  isCalendarOpen.value = true
}

// [FUNCTION03] 조건부 승인 내용 삭제 이벤트
const minusAuthorizationData = () => {
  const _confirm = () => {
    const selectedNodes = gridApi.value.getSelectedNodes()
    if (selectedNodes.length > 0) {
      if (!commonUtil.isEmpty(selectedNodes[0].data.transactionMode)) {
        gridApi.value.applyTransaction({
          update: selectedNodes.map(function (row) {
            row.data.transactionMode = 'D'
            return row
          })
        })
      } else {
        selectedNodes.forEach(node => {
          gridApi.value.applyTransaction({ remove: [node.data] })
        })
      }
    }
  }
  messageBox.confirm(i18n.global.t('msg.info.delete'), _confirm)
}

// [FUNCTION04] 결재 상태 조회
const searchAuthCondition = (applyFlag) => {
  const searchParam = ref({
    applicationNo: {
      value: props.applicationNo
    },
    employeeNo: {
      value: props.approveEmployeeNo
    },
    searchType: {
      value: 'info'
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH012', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (datas) {
      if (datas.length !== 0) {
        formParam.value.applicationType.value = datas[0].applicationTpcd
        formParam.value.authorizationNo.value = datas[0].authorizationNo
        formParam.value.productName.value = datas[0].productName
        formParam.value.approveEmployeeNo.value = datas[0].employeeNo
        formParam.value.authorizationDate.value = datas[0].authorizationDate
        formParam.value.authorizationStatus.value = datas[0].authResultCode
        formParam.value.approverOpinions.value = datas[0].approverOpinions
        formParam.value.finalApproverYn.value = datas[0].finalApproverYn
        formParam.value.performedYn.value = datas[0].performedYn
        formParam.value.performedDate.value = datas[0].performedDate
        formParam.value.performedResults.value = datas[0].performedResults
        searchAuthConditionList(applyFlag)
      }
    })
}

// [FUNCTION05] 조건부승인 그리드 더블클릭, 상세 조회 팝업 호출
const onRowDoubleClicked = () => {
  formParam.value.enterType.value = ''
  const selectedNodes = gridApi.value.getSelectedNodes()
  if (selectedNodes.length !== 0) {
    selectedRowData.value = selectedNodes.map(node => node.data)
    showDetailSearch.value = true
    isCalendarOpen.value = true
  }
}

// [FUNCTION06] 조건부 승인 목록 조회
const searchAuthConditionList = (applyFlag) => {
  const searchParam = ref({
    applicationNo: {
      value: props.applicationNo
    },
    employeeNo: {
      value: props.approveEmployeeNo
    },
    searchType: {
      value: 'detail'
    }
  })

  const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH012', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (datas) {
      const authorizationNo = ref('')
      if (datas.length !== 0) {
        gridApi.value.setRowData([])
        datas.forEach((data, index) => {
          authorizationNo.value = data.authorizationNo
          const row = {
            serialNo: data.serialNo,
            applicationNo: data.applicationNo,
            approveEmployeeNo: data.employeeNo,
            authorizationNo: data.authorizationNo,
            conditionTycd: data.conditionTycd,
            dueDate: data.dueDate,
            conditionDetail: data.conditionDetail,
            performedYn: data.performedYn,
            performedDate: data.performedDate,
            transactionMode: '',
            performedResults: data.performedResults
          }
          gridApi.value.applyTransaction({ add: [row], addIndex: 'last' })
        })
      } else if (props.fromBtn === 'Modify') {
        formParam.value.authorizationDate.value = dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateTimeType)
        formParam.value.authorizationStatus.value = commonCodeList.authorizationStatus[0].code
      }
    })
}

const save = () => {
  const authType = formParam.value.applicationNo.value.substring(0, 3)
  const saveDatas = ref({
    datas: {
      value: []
    },
    authorizationNo: {
      value: formParam.value.authorizationNo.value
    },
    authorizationDate: {
      value: formParam.value.authorizationDate.value
    },
    authResultCode: {
      value: formParam.value.authorizationStatus.value
    },
    approverOpinions: {
      value: formParam.value.approverOpinions.value
    },
    performedYn: {
      value: formParam.value.performedYn.value
    },
    performedDate: {
      value: formParam.value.performedDate.value
    },
    performedResults: {
      value: formParam.value.performedResults.value
    },
    applicationNo: {
      value: formParam.value.applicationNo.value
    },
    employeeNo: {
      value: formParam.value.approveEmployeeNo.value
    },
    sortSeq: {
      value: 0
    },
    formParam: {
      value: []
    },
    transactionMode: {
      value: ''
    }
  })
  // 결재 검증 1. 결재일이 오늘 이후 날짜인 경우
  const authDate = new Date(formParam.value.authorizationDate.value)
  if (authDate > new Date(session.sysCurrentBusinessDate)) {
    messageBox.alertInfo(i18n.global.t('error.rule.beforeBussDate', [i18n.global.t('label.objt.authorizationDate')]))
    return
  }
  const _confirm = () => {
    gridApi.value.forEachNode(node => {
      saveDatas.value.datas.value.push(node.data)
    })
    /**
     * CASE 1.
     * : 조건부 결재내용 확인 후, 신청자가 내용을 수정하여 OK 한 경우
     * 1) 조건부 결재내용 Update
     * 2) 결재자에게 TO-DO 메시지 송신 (조건부 결재가 모두 완료된 경우)
    **/
    if (props.fromBtn === 'apply' && formParam.value.authorizationStatus.value === '02') {
      // 1) 조건부 결재 테이블 데이터 수정
      saveDatas.value.transactionMode.value = 'RESULT_UPDATE'
      const menu = ref('')
      if (formParam.value.performedYn.value === 'Y') saveDatas.value.formParam.value = formParam.value
      if (authType === 'LAP') {
        menu.value = '301040'
      } else if (authType === 'LDS') {
        menu.value = '302020'
      }
      const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH019', saveDatas)
      ajaxUtil.ajaxServiceData(newSearchParam)
        .then(function (datas) {
          if (formParam.value.performedYn.value === 'Y') {
            makeTodoList(i18n.global.t('msg.confirm.todoApprove', [formParam.value.applicationNo.value]), menu.value, 'NEXT')
          }
          // 조건부 결재 리스트 재조회
          searchAuthCondition('apply')
        })
    } else {
      /**
       * CASE 2.
       * : 여신 신규 신청시, 결재자가 결재한 경우
       * 1) 결재내용을 가지고 여신 신청 결재화면으로 돌아감 (결재화면에서 조작)
      **/
      if (authType === 'LAP') {
        saveDatas.value.transactionMode.value = 'NEW'
        formParam.value.conditionList.value = saveDatas.value.datas
        emit('selectedPopupRowData', formParam)
        model.value = false
        // 결재 내용을 바로 호출하게 팝업 실행 추후 실행부분처럼 수정 필요
        props.approve()
      /**
       * CASE 3.
       * : 여신 실행, 결재자가 결재한 경우
       * 1) 팝업화면에서 바로 OK -> 승인으로 이어짐
      **/
      } else if (authType === 'LDS') {
        if (commonUtil.isEmpty(formParam.value.authorizationNo.value)) {
          formParam.value.transactionMode.value = 'NEW'
        } else {
          formParam.value.transactionMode.value = 'UPDATE'
        }
        // 날짜 포맷팅
        formParam.value.authorizationDate.value = dayjs(formParam.value.authorizationDate.value).format(commonProp.dateformat.dateType)
        // 결재 서비스 호출
        const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH019', formParam)
        ajaxUtil.ajaxServiceData(newSearchParam)
          .then(function (response) {
            console.log('결재 내용 업데이트 완료, To-do 진행')
            /**
             * [TO DO] 결재 내용에 따라 To do List 생성
             * 1) 승인 (01)인 경우, 다음 결재자 또는 신청자에게 생성
             *    1-1) 최종 결재자 승인 -> 일계 처리 반영 (lonDbsMng로 돌아가서 실행)
             *    1-2) 다음 결재자에게 생성
             * 2) 조건부승인 (02) 인 경우, 신청자에게 생성
             * 3) 거절 (03) 인 경우, 신청자에게 생성
            **/
            switch (formParam.value.authorizationStatus.value) {
              case '01' :
                if (formParam.value.finalApproverYn.value !== 'Y') makeTodoList(i18n.global.t('msg.confirm.todoApprove', [formParam.value.applicationNo.value]), '302020', 'NEXT'); break
              case '02' :
                makeTodoList(i18n.global.t('msg.confirm.todoConApproved', [formParam.value.applicationNo.value]), '302020', 'INCHARGE'); break
              case '03' :
                makeTodoList(i18n.global.t('msg.confirm.todoRejected', [formParam.value.applicationNo.value]), '302020', 'INCHARGE'); break
            }
            emit('selectedPopupRowData', formParam)
            model.value = false
          })
          .catch((error) => {
            messageBox.alertAjaxError(error)
          })
      }
    }
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

// To Do List 생성 이벤트
const makeTodoList = (msg, referMenu, target) => {
  const searchData = ref({
    todoTitle: { value: msg },
    todoMemo: { value: msg },
    todoStatusCode: { value: '01' },
    todoDuedate: { value: dayjs(session.sysCurrentBusinessDate).format(commonProp.dateformat.dateType) },
    referMenuId: { value: referMenu },
    target: { value: target },
    finalApproverYn: { value: formParam.value.finalApproverYn.value },
    applicationNo: { value: formParam.value.applicationNo.value },
    referNo: { value: formParam.value.applicationNo.value }
  })
  const saveParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH039', searchData)
  ajaxUtil.ajaxServiceCall(saveParam)
    .then((response) => { })
}

const formParam = ref({
  applicationNo: {
    value: props.applicationNo,
    required: true
  },
  applicationType: {
    value: ''
  },
  authorizationNo: {
    value: ''
  },
  productType: {
    value: ''
  },
  productName: {
    value: ''
  },
  approveEmployeeNo: {
    value: props.approveEmployeeNo
  },
  authorizationDate: {
    value: ''
  },
  authorizationStatus: {
    value: ''
  },
  approverOpinions: {
    value: '',
    required: false,
    description: ''
  },
  sortSeq: {
    value: ''
  },
  enterType: {
    value: ''
  },
  finalApproverYn: {
    value: ''
  },
  conditionList: {
    value: []
  },
  performedYn: {
    value: 'N'
  },
  performedDate: {
    value: ''
  },
  performedResults: {
    value: ''
  },
  transactionMode: {
    value: ''
  }
})

const columnTypes = {
  centerAligned: {
    cellClass: 'centered'
  }
}

const columnDefs = [
  {
    headerName: '#',
    width: 50,
    valueGetter: (params) => { return params.node.rowIndex + 1 }
  },
  {
    field: 'transactionMode',
    headerName: '',
    width: 50
  },
  {
    field: 'serialNo',
    hide: true
  },
  {
    field: 'conditionTycd',
    headerName: i18n.global.t('label.objt.conditionTycd'),
    width: 150,
    editable: false,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(commonCodeList.conditionType, params.value)
    }
  },
  {
    field: 'dueDate',
    headerName: i18n.global.t('label.objt.dueDate'),
    type: 'centerAligned',
    width: 100
  },
  {
    field: 'conditionDetail',
    headerName: i18n.global.t('label.objt.conditionDetail'),
    width: 380
  },
  {
    field: 'performedYn',
    headerName: i18n.global.t('label.objt.performed'),
    type: 'centerAligned',
    width: 100
  }
]

// [FUNCTION08] 신청자 수행여부 Y 변경 이벤트
const selectPerformChange = (event) => {
  if (event === 'Y' && commonUtil.isEmpty(formParam.value.performedDate.value)) formParam.value.performedDate.value = session.sysCurrentBusinessDate
}

const getDetailPopupRowData = (event) => {
  const data = event.value
  formParam.value.enterType.value = ''
  if (!commonUtil.isEmpty(data)) {
    // 결재자가 입력한 조건부 승인 신규 데이터
    if (commonUtil.isEmpty(data.serialNo.value)) {
      const dueDate = new Date(data.dueDate.value).toISOString().split('T')[0]
      const row = {
        applicationNo: formParam.value.applicationNo.value,
        approveEmployeeNo: formParam.value.approveEmployeeNo.value,
        authorizationNo: formParam.value.authorizationNo.value,
        conditionTycd: data.conditionTycd.value,
        dueDate,
        conditionDetail: data.conditionDetail.value,
        performedYn: data.performedYn.value,
        performedDate: data.performedDate.value,
        performedResults: data.performedResults.value,
        transactionMode: 'C'
      }
      gridApi.value.applyTransaction({ add: [row], addIndex: 'last' })
    // 신청자가 업데이트한 조건부 승인 데이터
    } else {
      const rowData = gridApi.value.getModel().rowsToDisplay
      let maxDate = ''
      const targetRows = rowData.filter(function (row) {
        return row.data.serialNo === data.serialNo.value
      })
      gridApi.value.applyTransaction({
        update: targetRows.map(function (row) {
          row.data.conditionTycd = data.conditionTycd.value
          row.data.dueDate = new Date(data.dueDate.value).toISOString().split('T')[0]
          row.data.conditionDetail = data.conditionDetail.value
          row.data.performedYn = data.performedYn.value
          row.data.performedDate = data.performedDate.value
          row.data.performedResults = data.performedResults.value
          row.data.transactionMode = 'U'
          const thisDate = row.data.performedDate
          if (maxDate === '' || new Date(maxDate) < thisDate) maxDate = thisDate
          return row
        })
      })
      const nFlag = ref(false)
      // N 갯수 체크
      gridApi.value.forEachNode(node => {
        if (node.data.performedYn === 'N') nFlag.value = true
      })
      // 모두 수행 완료인 경우
      if (!nFlag.value) {
        formParam.value.performedYn.value = 'Y'
        formParam.value.performedDate.value = maxDate
      } else {
        formParam.value.performedYn.value = 'N'
        formParam.value.performedDate.value = ''
      }
    }
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

watch(() => formParam.value.performedYn.value, (newVal, oldVal) => {
  if (oldVal !== newVal && props.fromBtn === 'apply' && formParam.value.authorizationStatus.value === '02') {
    if (newVal === 'Y') {
      okBtnFlag.value = false
    } else if (newVal === 'N') {
      okBtnFlag.value = true
    }
  }
})
</script>
<style scoped>
.msg_info_form_single_box {
    margin-top: 20px;
}
</style>
