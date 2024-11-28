<template>
    <q-dialog v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.hlpLonApv') }}</div>
                <q-space />
                <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-card-section style="padding:3px">
              <div>
                <div class="width48" style="float: left;">
                    <div class="modal_form table_search_modal">
                        <div class="search_condition_wrapper">
                            <div class="domain_search_wrapper width100">
                                <div class="width40">
                                    <label class="searchLabel">{{ $t('label.view.branch') }}</label>
                                    <CommonSelectBox :codeList="branchTypeList" v-model="searchParam.branchCode.value"></CommonSelectBox>
                                </div>
                                <div class="width59">
                                    <label class="searchLabel">{{ $t('label.objt.employeeName') }}</label>
                                    <div style="display:flex;">
                                        <CommonInputBox class="width85" maxlength="100" style="margin-right:10px" v-model="searchParam.searchKeyword.value"></CommonInputBox>
                                        <q-btn class="btn" style="font-size:12px;" @click="employeeSearch"  icon="search" size="md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="display:flex;">
                            <div class="table_scroll_box width100" style="margin-top:1vh">
                                <ag-grid-vue
                                    class="msg_table ag-theme-balham height43"
                                    :columnDefs="columnDefs"
                                    :rowData="employeeRowData"
                                    :stopEditingWhenCellsLoseFocus="false"
                                    rowSelection="single"
                                    @grid-ready="onGridReady1"
                                    @rowClicked="onRowClicked"
                                ></ag-grid-vue>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="width50" style="float: right;">
                    <div class="modal_form table_search_modal">
                        <div class="search_condition_wrapper">
                            <div class="width100">
                                <label class="searchLabel">{{ $t('label.objt.myAuthLine') }}</label>
                                <CommonSelectBox :disable="myAuthDisable" :selectChangeFunc="authLineChange" :codeList="myAuthList" v-model="formParam.myAuthListNo.value"></CommonSelectBox>
                            </div>
                        </div>
                        <div class="table_scroll_box" style="margin-top:1vh">
                            <ag-grid-vue
                                class="msg_table ag-theme-balham height35"
                                :columnDefs="apvColumnDefs"
                                :beforeMount="beforeMount"
                                :rowData="authorizationRowData"
                                :context="context"
                                :stopEditingWhenCellsLoseFocus="false"
                                :rowDragManaged="true"
                                :suppressMoveWhenRowDragging="true"
                                rowSelection="single"
                                :onRowDragEnd="onRowDragEnd"
                                @grid-ready="onGridReady2"
                            ></ag-grid-vue>
                            <div style="margin-top:10px;">
                                <label class="searchLabel">{{ $t('label.objt.myAuthLineNm') }}</label>
                                <div style="display:flex;">
                                    <CommonInputBox class="width80" :disable="myAuthDisable" maxlength="100" v-model="formParam.myAuthListNm.value"></CommonInputBox>
                                    <q-btn :disable="myAuthDisable" flat :label="$t('label.view.save')" class="btn confirm_button width18" @click="myAuthListSave()" style="margin-left:10px;"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
              <div class="toRight height60">
                  <q-btn @click="addAuthLine" :disable="disableFlg"  class="btn" icon="last_page" />
              </div>
              <div class="toBottom">
                  <q-btn flat :label="$t('label.view.ok')" :disable="disableFlg" class="btn btmBtn width10" style="margin-right:30px" @click="save()"/>
                  <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn width10"  v-close-popup @click="closePopup"/>
              </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style>
.toRight {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.toBottom {
margin-top: 30px;
display: flex;
justify-content: center;
}
.fade-leave-active {
transition: opacity 0.5s;
}
.fade-leave-to {
opacity: 0;
}
</style>

<script setup>
/**
301020 화면, 결재선 입력 팝업

[FUNCTION01] 나의 결재선 변경 이벤트
[FUNCTION02] 나의 결재선 저장 이벤트
[FUNCTION03] 결재선 저장 이벤트 (OK 버튼)
[FUNCTION04] 나의 결재선 조회 이벤트
[FUNCTION05] 결재선 상세내용 조회 이벤트
[FUNCTION06] 좌측 그리드 선택 이벤트 (선택된 직원정보를 ADD 버튼 클릭시 넘김)
[FUNCTION07] 직원 조회 이벤트
[FUNCTION08] 결재선 추가 이벤트
[FUNCTION09] 결재선 삭제 이벤트
*/

/* =======================================================
    1. Import Area
======================================================= */
import { ajaxUtil, commonUtil, messageBox, gridPropsUtil, freeformUtil, commonProp } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { useSessionStore } from 'stores/session'
import deleteBtnRenderer from './deleteBtnRenderer.vue'
import dayjs from 'dayjs'
import CommonHeaderMark from 'src/components/common/CommonHeaderMark.vue'
/* =======================================================
    2. Global Variable
======================================================= */
const session = useSessionStore()
const emit = defineEmits(['update:modelValue', 'selectedPopupRowData', 'close-popup'])
const employeeRowData = ref([])
const authorizationRowData = ref([])
const context = ref([])
const rowData = ref([])
const fetchSizeList = ref([])
const branchTypeList = ref([])
const myAuthList = ref([])
const userKindList = ref({})
const lonApprovalResultCode = ref({})
const gridApi1 = ref(null)
const gridApi2 = ref(null)
const gridColumnApi1 = ref(null)
const gridColumnApi2 = ref(null)
const clickedEmployee = ref(null)
const applicationNoHlp = ref('')
const myAuthDisable = ref(false)
const nowDate = new Date()
const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())
const disableFlg = ref(false)

const props = defineProps({
  applicationNo: {
    type: String
  },
  authorLineDatas: {
    default: []
  },
  authorLineDatasClear: {
    type: Function,
    /**
   *
   */
    default () {
    }
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

const showDialog = () => {
  applicationNoHlp.value = props.applicationNo
  model.value = true
  employeeSearch()
  if (!commonUtil.isEmpty(props.applicationNo)) searchAuthLine()
}

const closePopup = () => {
  freeformUtil.clear(formParam)
  employeeRowData.value = []
  authorizationRowData.value = []
  gridApi1.value.setRowData(employeeRowData.value)
}

/* =======================================================
    3. Common Code Adapter
======================================================= */
ajaxUtil.getCodeList('SHOWROWS,USER_KIND,LON_APPROVAL_RESULT_CODE')
  .then(function (codeData) {
    fetchSizeList.value = codeData.showRows
    userKindList.value = codeData.userKind
    lonApprovalResultCode.value = codeData.lonApprovalResultCode
  })

const brListSearch = () => {
  const brSearchParam = ref({
    searchType: {
      value: 'BRANCH_CODE'
    },
    searchKeyword: {
      value: ''
    },
    fetchSize: {
      value: 100
    },
    maxValue: {
      value: '0'
    },
    helpSearchType: {
      value: 'FrmHlpBrc'
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsFrmHlpCmmService', 'FRMHLPCMM002', brSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        const _alertInfo = () => {
          rowData.value = []
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        const branchCodeList = []
        branchCodeList.push({
          code: '', codeValue: i18n.global.t('label.view.all')
        })
        const _branchCode = data

        for (const index in _branchCode) {
          const row = {
            code: _branchCode[index].branchCode,
            decode: _branchCode[index].branchName,
            codeValue: _branchCode[index].branchName,
            codeName: _branchCode[index].branchName,
            fullCodeName: _branchCode[index].branchName
          }
          branchCodeList.push(row)
        }
        branchTypeList.value = branchCodeList
      }
    })
}

// [FUNCTION01] 나의 결재선 변경 이벤트
const authLineChange = (event) => {
  if (!commonUtil.isEmpty(event)) {
    const searchData = ref({
      myAuthLineNo: {
        value: event
      },
      employeeNo: {
        value: session.sysEmployeeNo
      },
      searchType: {
        value: 'detail'
      }
    })
    const saveParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH022', searchData)
    ajaxUtil.ajaxServiceCall(saveParam)
      .then((response) => {
        const result = response.data.result.data
        if (result.length === 0) {
          authorizationRowData.value = []
        } else {
          result.forEach((data, index) => {
            const list = []
            list.value = data
            const authorContent = data.employeeName + ' ' + data.positionTitleNm + ' (' + lookupValue(branchTypeList.value, data.branchCode) + ') '
            list.value.authorContent = authorContent
            list.value.employeeNo = data.approverEmpNo
          })
          formParam.value.myAuthListNo.value = event
          authorizationRowData.value = response.data.result.data
        }
      })
  }
}

// [FUNCTION02] 나의 결재선 저장 이벤트
const myAuthListSave = () => {
  // Authorization Line Nmae 공백 입력 x
  if (commonUtil.isEmpty(formParam.value.myAuthListNm.value)) {
    messageBox.alertInfo('Please enter a Authorization Line Name')
    return
  }

  const rowCount = gridApi2.value.getDisplayedRowCount()
  const saveDatas = ref({
    myAuthListNm: {
      value: formParam.value.myAuthListNm.value
    },
    employeeNo: {
      value: session.sysEmployeeNo
    },
    datas: {
      value: []
    },
    transactionMode: {
      value: 'NEW'
    }
  })

  gridApi2.value.forEachNode(function (node) {
    node.data.sortSeq = node.rowIndex + 1
    node.data.approverEmpNo = node.data.employeeNo
    node.data.myAuthListNm = formParam.value.myAuthListNm.value
    if (node.data.sortSeq === rowCount) node.data.finalApproverYn = 'Y'
    saveDatas.value.datas.value.push(node.data)
  })

  if (rowCount === 0) {
    messageBox.alertError(i18n.global.t('msg.info.noChanageData'))
  } else {
    console.log(saveDatas)
    const _confirm = () => {
      const saveParam1 = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH029', saveDatas)
      ajaxUtil.ajaxServiceCall(saveParam1)
        .then((response) => {
          const _alertAjaxSuccess = () => {
            searchMyAuthLine()
            formParam.value.myAuthListNm.value = ''
          }
          messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
  }
}

// [FUNCTION03] 결재선 저장 이벤트 (OK 버튼)
const save = () => {
  let rowCount = 0
  let totalCount = 0
  gridApi2.value.forEachNode(function (node) {
    if (node.data.transactionMode !== 'D') rowCount++
    totalCount++
  })

  const saveDatas = ref({
    datas: {
      value: []
    },
    transactionMode: {
      value: formParam.value.transactionMode.value
    },
    applicationNo: {
      value: props.applicationNo
    }
  })

  if (rowCount === 0 && totalCount === 0) {
    messageBox.alertError(i18n.global.t('msg.info.noChanageData'))
  } else {
    const _confirm = () => {
      // 신청자 데이터 자동 0번으로 세팅
      const userData = ({
        transactionMode: '',
        applicationNo: applicationNoHlp.value,
        authorizationDate: dayjs(today).format(commonProp.dateformat.dateType),
        employeeNo: session.sysEmployeeNo,
        authResultCode: '01',
        finalApproverYn: '',
        sortSeq: 0
      })
      if (props.authorLineDatas.length === 0) userData.transactionMode = 'C'
      if (rowCount !== 0) {
        saveDatas.value.datas.value.push(userData)
      } else {
        // 모든 결재라인 삭제한 상태일때 담당자 본인 결재 정보 제거
        // 새로운 결재라인 추가 하면 본인의 결재정보 표시
        props.authorLineDatasClear()
      }

      // 사용자 입력 그리드 데이터 세팅
      let seqStart = 1 // 신청자 : 0번, 1번부터 시작
      gridApi2.value.forEachNode(function (node) {
        node.data.applicationNo = applicationNoHlp.value
        if (node.data.transactionMode !== 'D') {
          node.data.sortSeq = seqStart
          seqStart++
        }
        if (node.data.sortSeq === rowCount) {
          if (commonUtil.isEmpty(node.data.transactionMode)) node.data.transactionMode = 'U'
          node.data.finalApproverYn = 'Y'
        } else {
          if (commonUtil.isEmpty(node.data.transactionMode)) node.data.transactionMode = 'U'
          node.data.finalApproverYn = ''
        }
        saveDatas.value.datas.value.push(node.data)
      })
      // 신규 결재선 등록 서비스 호출
      const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH009', saveDatas)
      ajaxUtil.ajaxServiceData(newSearchParam)
        .then(function (data) {
          const prefix = props.applicationNo.replace(/-/g, '').substring(0, 3)
          employeeRowData.value = data
          if (formParam.value.transactionMode.value === 'NEW' || formParam.value.transactionMode.value === 'UPDATE') {
            console.log('차기 결재자 TODO 등록')
            if (prefix === 'LAP') {
              makeTodoList(i18n.global.t('msg.confirm.todoApprove', [props.applicationNo.replace(/-/g, '')]), '301040', 'NEXT')
            } else if (prefix === 'LDS') {
              makeTodoList(i18n.global.t('msg.confirm.todoApprove', [props.applicationNo.replace(/-/g, '')]), '302020', 'NEXT')
            }
            console.log('차기 결재자 TODO 등록')
            if (prefix === 'LAP') {
              makeTodoList(i18n.global.t('msg.confirm.todoApprove', [props.applicationNo.replace(/-/g, '')]), '301040', 'NEXT')
            } else if (prefix === 'LDS') {
              makeTodoList(i18n.global.t('msg.confirm.todoApprove', [props.applicationNo.replace(/-/g, '')]), '302020', 'NEXT')
            }
          }
          authorizationRowData.value = []
          emit('selectedPopupRowData', saveDatas.value.datas)
          model.value = false
        })
    }
    messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
  }
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
    transactionMode: { value: formParam.value.transactionMode.value },
    applicationNo: { value: applicationNoHlp.value },
    referNo: { value: applicationNoHlp.value }
  })
  const saveParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH039', searchData)
  ajaxUtil.ajaxServiceCall(saveParam)
    .then((response) => { })
}

// [FUNCTION04] 나의 결재선 조회 이벤트
const searchMyAuthLine = (newAuthNo) => {
  myAuthDisable.value = false
  const authSearchParam = ref({
    employeeNo: {
      value: session.sysEmployeeNo
    },
    searchType: {
      value: 'info'
    }
  })
  myAuthList.value.splice(0, myAuthList.value.length)
  const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH022', authSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (datas) {
      if (datas.length !== 0) {
        datas.forEach((data, index) => {
          const list = { code: data.myAuthLineNo, codeValue: data.myAuthLineName }
          myAuthList.value.push(list)
        })
      }
    })
}

// [FUNCTION05] 결재선 상세내용 조회 이벤트
const searchAuthLine = () => {
  const authSearchParam = ref({
    applicationNo: {
      value: props.applicationNo
    }
  })
  const newSearchParam = commonUtil.inputValueToJson('bsLonOrgAthService', 'LONORGATH002', authSearchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (datas) {
      if (datas.length !== 0) {
        formParam.value.transactionMode.value = 'UPDATE'
        gridApi2.value.setRowData([], { suppressAnimationFrame: true }) // 초기화
        let approveCount = 0

        for (const index in datas) {
          const employeeNo = datas[index].employeeNo
          const employeeName = datas[index].employeeName
          const employeePosition = datas[index].employeePositionNm
          const branchCode = datas[index].branchCode
          const addEmployee = employeeName + ' ' + employeePosition + ' (' + lookupValue(branchTypeList.value, branchCode) + ') '
          const row = {
            transactionMode: '',
            myAuthLineNo: '',
            employeePosition,
            employeeNo,
            employeeName,
            branchCode,
            sortSeq: datas[index].sortSeq,
            authorContent: addEmployee,
            authResultCode: datas[index].authResultCode,
            approverEmpNo: '',
            finalApproverYn: datas[index].finalApproverYn,
            myAuthListNm: '',
            organizationCode: datas[index].organizationCode
          }
          if (row.sortSeq !== 0) {
            gridApi2.value.applyTransaction({ add: [row], addIndex: 'last' })
            if (!commonUtil.isEmpty(row.authResultCode)) approveCount++
          }
        }

        gridApi2.value.ensureIndexVisible(0)
        myAuthDisable.value = true
        if (approveCount === 0) disableFlg.value = false
        else disableFlg.value = true
      } else {
      // 기등록된 결재선이 없는 경우, 나의 결재선을 조회
        searchMyAuthLine()
      }
    })
}

// [FUNCTION06] 좌측 그리드 선택 이벤트 (선택된 직원정보를 ADD 버튼 클릭시 넘김)
const onRowClicked = () => {
  const selectedRows = gridApi1.value.getSelectedNodes()
  if (selectedRows.length !== 0) {
    clickedEmployee.value = selectedRows[0].data
  }
}

// [FUNCTION07] 직원 조회 이벤트
const employeeSearch = () => {
  const newSearchParam = commonUtil.inputValueToJson('bsLonHlpCmmService', 'LONHLPCMM002', searchParam)
  ajaxUtil.ajaxServiceData(newSearchParam)
    .then(function (data) {
      if (data.length === 0) {
        const _alertInfo = () => {
          employeeRowData.value = []
        }
        messageBox.alertInfo(i18n.global.t('msg.nodata.found'), _alertInfo)
      } else {
        employeeRowData.value = data
      }
    })
}

const lookupValue = (mappings, key) => {
  const _selectedCode = []
  for (const index in mappings) {
    _selectedCode.push(mappings[index])
  }
  const _codeValue = _selectedCode.find(v => v.code === key)
  if (_codeValue === undefined) {
    return key
  } else {
    return _codeValue.codeValue
  }
}

// [FUNCTION08] 결재선 추가 이벤트
const addAuthLine = () => {
  const rowCount = gridApi2.value.getDisplayedRowCount()
  const employeeNo = clickedEmployee.value.employeeNo
  const employeeName = clickedEmployee.value.employeeName
  const employeePosition = clickedEmployee.value.positionTitleNm
  const branchCode = clickedEmployee.value.branchCode
  const addEmployee = employeeName + ' ' + employeePosition + ' (' + lookupValue(branchTypeList.value, branchCode) + ') '
  const row = {
    transactionMode: 'C',
    myAuthLineNo: '',
    employeePosition,
    employeeNo: clickedEmployee.value.employeeNo,
    employeeName,
    branchCode,
    sortSeq: '',
    authorContent: addEmployee,
    authResultCode: '',
    approverEmpNo: '',
    finalApproverYn: '',
    myAuthListNm: '',
    organizationCode: session.sysOrganizationCode
  }
  if (rowCount > 0) {
    let addFlag = 0
    let selfFlag = false
    let alreadyFlag = false
    gridApi2.value.forEachNode(function (node) {
      const rowData = node.data
      const rowKey = rowData.employeeNo

      // 본인 및 이미 명단에 있는 인물은 등록 불가
      if (rowKey === employeeNo) alreadyFlag = true
      else if (session.sysEmployeeNo === employeeNo) selfFlag = true
      else addFlag++
    })
    if (rowCount === addFlag) {
      gridApi2.value.applyTransaction({ add: [row], addIndex: 'last' })
      gridApi2.value.ensureIndexVisible(0)
    }
    // 기존에 선택된 나의 결재선 초기화 (변경되었으므로)
    if (!commonUtil.isEmpty(formParam.value.myAuthListNo.value)) {
      formParam.value.myAuthListNo.value = ''
      formParam.value.myAuthListNm.value = ''
    }
    if (selfFlag) messageBox.alertError(i18n.global.t('msg.valid.inChargeAdd'))
    if (alreadyFlag) messageBox.alertError(i18n.global.t('msg.valid.dataExist'))
  } else {
    if (employeeNo !== session.sysEmployeeNo) {
      gridApi2.value.applyTransaction({ add: [row], addIndex: 'last' })
      gridApi2.value.ensureIndexVisible(0)
    }
  }
}
brListSearch()
searchMyAuthLine()

/* =======================================================
    4. Grid Props
======================================================= */
const onGridReady1 = (params) => {
  gridApi1.value = params.api
  gridColumnApi1.value = params.columnApi
}

const onGridReady2 = (params) => {
  gridApi2.value = params.api
  gridColumnApi2.value = params.columnApi
}

const beforeMount = () => {
  authorizationRowData.value = this.createRowData()
  context.value = { componentParent: this }
}

const onRowDragEnd = () => {
  const tmpRowData = []

  gridApi2.value.forEachNode(function (node) {
    tmpRowData.push(node.data)
  })

  tmpRowData.forEach((row, index) => {
    row['#'] = index + 1
    if (formParam.value.transactionMode.value === 'UPDATE' && row['#'] !== row.sortSeq && commonUtil.isEmpty(row.transactionMode)) {
      row.transactionMode = 'U'
    }
    myAuthDisable.value = true
  })

  gridApi2.value.setRowData(tmpRowData)
}

// [FUNCTION09] 결재선 삭제 이벤트
const invokeParentMethod = (data) => {
  let rowCountMinusFlag = 0
  if (disableFlg.value !== true) {
    gridApi2.value.forEachNode(node => {
      if (node.data === data) {
        const foundRowNode = node
        // 신규로 추가했던 로우 or 나의 결재선에서 선택 -> 삭제
        if (foundRowNode.data.transactionMode === 'C' || foundRowNode.data.transactionMode === undefined) {
          gridApi2.value.applyTransaction({ remove: [data] })
          gridApi2.value.ensureIndexVisible(0)
          if (foundRowNode.data.transactionMode === undefined) formParam.value.myAuthListNo.value = ''
        } else if (foundRowNode.data.transactionMode === undefined || commonUtil.isEmpty(foundRowNode.data.transactionMode)) {
          rowCountMinusFlag = 1
          foundRowNode.setDataValue('transactionMode', 'D')
          foundRowNode.setData(foundRowNode.data)
        }
        return false
      }
      const rowCount = gridApi2.value.getDisplayedRowCount() - rowCountMinusFlag
      gridApi2.value.forEachNode(function (node) {
        if (node.data.sortSeq === rowCount) node.data.finalApproverYn = 'Y'
      })
    })
    if (!commonUtil.isEmpty(formParam.value.myAuthListNo.value)) myAuthDisable.value = true
  } else messageBox.alertError(i18n.global.t('msg.error.notChangeableData'))
}

const searchParam = ref({
  branchCode: {
    field: 'branchCode',
    value: lookupValue(branchTypeList.value, session.sysBranchCode),
    required: false
  },
  searchKeyword: {
    value: '',
    required: false
  },
  fetchSize: {
    value: 100,
    required: false
  },
  maxValue: {
    value: '0',
    required: false,
    description: ''
  },
  helpSearchType: {
    value: 'lonHlpApv',
    required: false,
    description: ''
  },
  helpSearchDetailType: {
    value: '',
    required: false,
    description: ''
  },
  selectedMyAuthLine: {
    value: '',
    required: false,
    description: ''
  }
})

const formParam = ref({
  myAuthListNo: {
    value: '',
    required: false,
    description: ''
  },
  myAuthListNm: {
    value: '',
    required: false,
    description: ''
  },
  transactionMode: {
    value: 'NEW'
  },
  finalApproverYn: {
    value: ''
  },
  applicationNo: {
    value: ''
  }
})

const columnDefs = [
  {
    field: 'employeeNo',
    hide: true
  },
  {
    headerName: '#',
    width: 50,
    valueGetter: (params) => { return params.node.rowIndex + 1 }
  },
  {
    field: 'sortSeq',
    hide: true,
    valueGetter: (params) => { return params.node.rowIndex + 1 }
  },
  {
    field: 'employeeNo',
    headerName: i18n.global.t('label.view.userId'),
    width: 300,
    editable: false,
    hide: true
  },
  {
    field: 'employeeName',
    headerName: i18n.global.t('label.objt.employeeName'),
    width: 150,
    editable: false
  },
  {
    field: 'positionTitleNm',
    headerName: i18n.global.t('label.objt.positionTitleNm'),
    width: 160,
    editable: false
  },
  {
    field: 'branchCode',
    headerName: i18n.global.t('label.view.branch'),
    width: 140,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(branchTypeList.value, params.value)
    },
    editable: false
  },
  {
    field: 'organizationCode',
    hide: true
  }
]

const apvColumnDefs = [
  {
    field: 'sortSeq',
    hide: true
  },
  {
    field: 'approverEmpNo',
    hide: true
  },
  {
    field: 'employeeNo',
    hide: true
  },
  {
    field: 'employeeName',
    hide: true
  },
  {
    field: 'employeePositionNm',
    hide: true
  },
  {
    field: 'branchCode',
    hide: true
  },
  {
    headerName: '',
    width: 40,
    colId: 0,
    rowDrag: true,
    valueGetter: (params) => { return params.node.rowIndex + 1 }
  },
  {
    headerName: 'Mode',
    width: 60,
    field: 'transactionMode',
    headerComponent: CommonHeaderMark
  },
  {
    headerName: '#',
    width: 40,
    valueGetter: (params) => { return params.node.rowIndex + 1 },
    headerComponent: CommonHeaderMark
  },
  {
    field: 'authorContent',
    headerName: i18n.global.t('label.objt.authLine'),
    width: 200,
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'authResultCode',
    headerName: i18n.global.t('label.objt.progressStatus'),
    width: 130,
    valueFormatter: (params) => {
      return gridPropsUtil.lookupValue(lonApprovalResultCode.value, params.value)
    },
    editable: false,
    headerComponent: CommonHeaderMark
  },
  {
    field: 'remove',
    headerName: i18n.global.t('label.view.remove'),
    width: 80,
    editable: false,
    cellRenderer: deleteBtnRenderer,
    cellRendererParams: {
      invokeParentMethod,
      /**
     *
     */
      isButtonEnabled: function (params) {
        const rowData = params.data
        if (rowData.finalApproverYn === '' || rowData.finalApproverYn === undefined) return true
        else return false
      }
    },
    colId: 'params',
    headerComponent: CommonHeaderMark
  }
]

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
