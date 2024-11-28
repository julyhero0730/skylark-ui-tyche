<template>
    <q-dialog allow-focus-outside v-model="model" persistent class="popup table_search_popup opened">
        <q-card class="popup_inner width40" :style=dragablePopupStyle>
            <q-card-section class="popup_header" v-touch-pan.mouse="onDragable">
                <img src="~/assets/images/button-md-icon-help-55-ww.svg" style="margin: 0 12px 0 7px;" />
                <div class="popup_title">{{ $t('label.view.lonHlpAtc') }}</div>
                <q-space />
                <q-btn flat v-close-popup @click="closePopup"><img src="~/assets/images/icon-frm-close.svg" alt="popup close button" ></q-btn>
            </q-card-section>
            <q-card-section>
                <div class="msg_info_form_single_box">
                    <div>
                        <label class="form_label is_required">{{ $t('label.objt.documentTypeCode') }}</label>
                        <CommonSelectBox
                          maxlength="30"
                          :codeList="commonCodeList.attachKindCode"
                          v-model="formParam.attachKindCode.value"
                          :selectChangeFunc="(selectedCode) => {
                            inputPlaceholder = selectedCode === 'LAP999' ? 'Document Name is required.' : ''
                            formParam.attachKindNm.value = selectedCode === 'LAP999' ? '' : lookupValue(commonCodeList.attachKindCode, selectedCode)
                          }"
                          :disable=disableFlag>
                        </CommonSelectBox>
                    </div>
                </div>
                <div class="msg_info_form_single_box">
                    <div>
                        <label>{{ $t('label.objt.documentName') }}</label>
                        <CommonInputBox :hint="inputPlaceholder" maxlength="30" v-model="formParam.attachKindNm.value" :disable=disableFlag style="text-align-last: left;"></CommonInputBox>
                    </div>
                </div>
                <div class="msg_info_form_single_box">
                    <div>
                        <label class="form_label is_required">{{ $t('label.view.fileName') }}</label>
                        <q-file
                            v-model="formParam.attachFile.value"
                            label="Pick files"
                            outlined bg-color="input-grey"
                            :disable=disableFlag
                            counter
                            multiple
                            :counter-label="counterLabelFn"
                            max-files="1"
                        >
                            <template v-slot:prepend>
                              <q-icon name="attach_file" />
                            </template>

                            <template v-slot:after>
                              <q-icon name="download"  @click="downloadFile(formParam.attachFile.value)" />
                            </template>
                        </q-file>
                    </div>
                </div>
                <div class="msg_info_form_single_box">
                    <div>
                        <label class="form_label">{{ $t('label.objt.documentDesc') }}</label>
                        <CommonInputBox class="height20" :disable=disableFlag type="textarea" :max=500 v-model="formParam.rmk.value"></CommonInputBox>
                    </div>
                </div>
                <div class="toBottom" style="padding: 36px 0 0;">
                  <q-btn flat :disable=disableFlag :label="$t('label.view.ok')" class="btn btmBtn width20" style="margin-right:30px" @click="save()"/>
                  <q-btn flat :label="$t('label.view.exit')" class="btn btmBtn width20"  v-close-popup @click="closePopup"/>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style>
.msg_info_form_single_box {
    display:grid;
    gap: 20px 30px;
    grid-template-columns: 1fr;
    padding: 24px 0 0;
}
</style>

<script setup>
import { ajaxUtil, commonUtil, uploadUtil, messageBox } from 'skylark-ui-lib'
import { i18n } from 'boot/i18n'
import { computed, ref, reactive } from 'vue'
// import axios from 'axios'

const applicationNoHlp = ref('')
const postAttachNoHlp = ref('')
const inputPlaceholder = ref('')
const remoteUrl = ref('')
const commonCodeList = reactive({
  attachKindCode: ref([])
})
const disableFlag = ref(false)

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

const showDialog = () => {
  applicationNoHlp.value = props.applicationNo
  postAttachNoHlp.value = props.postAttachNo
  model.value = true
  if (commonUtil.isEmpty(postAttachNoHlp.value)) {
    formParam.value.postAttachNo.value = ''
    disableFlag.value = false
    clear()
  } else {
    formParam.value.postAttachNo.value = props.postAttachNo
    formParam.value.applicationNo.value = props.applicationNo
    disableFlag.value = true
    searchAttachedContent()
  }
}

const props = defineProps({
  applicationNo: {
    type: String
  },
  postAttachNo: {
    type: String
  },
  modelValue: { type: Boolean, required: true }
})

const emit = defineEmits(['update:modelValue', 'selectedPopupRowData'])

const dialogPos = {
  x: 0,
  y: 0
}

const clear = () => {
  formParam.value.attachKindCode.value = commonCodeList.attachKindCode[0].code
  formParam.value.documentName.value = ''
  formParam.value.attachKindNm.value = lookupValue(commonCodeList.attachKindCode, commonCodeList.attachKindCode[0].code)
  formParam.value.attachFile.value = []
  formParam.value.rmk.value = ''
}

// 첨부 문서 내용 조회
const searchAttachedContent = () => {
  const searchParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL032', formParam)
  ajaxUtil.ajaxServiceData(searchParam)
    .then(function (datas) {
      if (datas.length !== 0) {
        formParam.value.attachKindCode.value = datas[0].attachKindCode
        formParam.value.attachFileName.value = datas[0].attachFileName
        formParam.value.attachFileSize.value = datas[0].attachFileSize
        formParam.value.attachKindNm.value = datas[0].attachKindNm
        formParam.value.rmk.value = datas[0].rmk
        remoteUrl.value = '/api' + datas[0].attachUploadPath + datas[0].attachFileName
        formParam.value.attachFile.value = [{
          name: datas[0].attachFileName,
          postAttachNo: datas[0].postAttachNo,
          size: datas[0].attachFileSize,
          attachUploadPath: datas[0].attachUploadPath
        }]
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

// 파일 다운로드 이벤트
const downloadFile = async (fileData) => {
  try {
    if (!commonUtil.isEmpty(fileData[0].postAttachNo)) {
      // 해당 URL에서 파일 데이터를 가져옵니다.
      const response = await fetch('/api' + fileData[0].attachUploadPath + fileData[0].name)
      const data = await response.blob()

      // 브라우저에서 해당 파일로 다운로드합니다.
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileData[0].name) // 다운로드 받게 될 파일명을 설정하세요.
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  } catch (error) {
    messageBox.alertAjaxError(error)
  }
}

const closePopup = () => {
  emit('selectedPopupRowData', '')
  clear()
  model.value = false
}

ajaxUtil.getPrefixCodeList('ATTACH_KIND_CODE', 'LAP')
  .then(function (codeData) {
    commonCodeList.attachKindCode = codeData.attachKindCode
    formParam.value.attachKindCode.value = commonCodeList.attachKindCode[0].code
  })

const counterLabelFn = ({ totalSize, filesNumber, maxFiles }) => {
  return `${filesNumber} files of ${maxFiles} | ${totalSize}`
}

// 입력 내용 저장 이벤트
const save = () => {
  const file = formParam.value.attachFile.value
  const name = file[0].name
  const size = file[0].size

  let prefix = ''
  let extn = ''
  const idx = name.lastIndexOf('.')
  if (idx > 0) {
    prefix = name.substring(0, idx)
    extn = name.substring(idx + 1).toLowerCase()
  } else {
    return name
  }

  const fileName = []
  const tmpName = prefix + '_' + new Date().getTime() + '.' + extn
  fileName.push(tmpName)

  const attachFileData = () => {
    return {
      name: fileName,
      size: file.size,
      attachKindCode: formParam.value.attachKindCode.value
    }
  }

  formParam.value.attachFileData.value = attachFileData()

  const _confirm = () => {
    formParam.value.originReferNo.value = applicationNoHlp.value
    formParam.value.referTableNm.value = 'LON_ORG_APPLICATION'
    formParam.value.attachFileSize.value = size
    formParam.value.attachFileName.value = tmpName
    uploadUtil.filePickerUpload(formParam.value.attachFile.value, fileName)

    const saveParam = commonUtil.inputValueToJson('bsLonOrgAplService', 'LONORGAPL019', formParam)

    ajaxUtil.ajaxServiceCall(saveParam)
      .then((response) => {
        const _alertAjaxSuccess = () => {
          closePopup()
        }
        messageBox.alertAjaxSuccess(response, _alertAjaxSuccess)
      })
      .catch((error) => {
        messageBox.alertAjaxError(error)
      })
  }
  messageBox.confirm(i18n.global.t('msg.info.save'), _confirm)
}

const formParam = ref({
  documentName: {
    value: '',
    required: true
  },
  rmk: {
    value: '',
    required: true
  },
  referTableNm: {
    value: 'LON_ORG_APPLICATION'
  },
  originReferNo: {
    value: applicationNoHlp.value
  },
  attachKindCode: {
    value: '200'
  },
  attachFile: {
    value: [],
    initValue: [],
    required: true,
    description: i18n.global.t('label.view.fileName')
  },
  attachKindNm: {
    value: ''
  },
  attachUploadPath: {
    value: '',
    required: false,
    description: i18n.global.t('label.objt.uploadPath')
  },
  attachFileName: {
    value: '',
    required: false,
    description: i18n.global.t('label.view.fileName')
  },
  attachFileSize: {
    value: 0
  },
  attachFileData: {
    value: '',
    required: true,
    description: i18n.global.t('label.view.fileName')
  },
  applicationNo: {
    value: ''
  },
  postAttachNo: {
    value: ''
  },
  transactionMode: {
    value: 'NEW',
    required: true
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
