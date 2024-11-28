<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="header">
            <q-toolbar>
                <div class="card_brand">
                  <q-img src="~/assets/images/imb_b_03.png" alt="shinhan logo" />
                </div>
                <div class="search_box">
                  <q-input outlined borderless dense v-model="searchMenuId"
                    input-class="search_input text-left" style="margin-left:10px;
                    border-radius:8px;
                    background-color: #fff;
                    color: #4A4C5B;
                    font-size: 14px;
                    font-weight: 500;
                    width:250px;" maxlength="6" @keyup.enter="viewMenuPage(searchMenuId)" @update:model-value="makeSearchMenu" placeholder="Search"  >
                    <button type="button" class="total_search_button">
                      <img src="~/assets/images/search.svg" alt="search button"/>
                      <!-- <img src="..~/assets/images/btn-btn-ic-search-blue.svg" alt="search button"/> blueMode-->
                    </button>
                  </q-input>
                  <q-list v-show=showing bordered style="margin-left:10px; border-radius:8px; font-size:16px; line-height: 2.2em; padding:10px 0;
                   width: 250px; max-width: 250px; max-height: 300px; color: #888; position: absolute; background-color: white; overflow: auto;" ref="searchMenuList">
                    <q-item
                    v-for="(item, index) in menuThreeList"
                    :key="index"
                    :tabindex="index"
                    dense
                    clickable
                    @click="viewMenuPage(item.menuId)"
                    >
                    <q-item-section>{{ item.text }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>

                  <q-space ></q-space>
                  <q-btn-dropdown stretch flat round dense style="color:black">
                    <template v-slot:label>
                        <div class="row items-center no-wrap">
                          <img src="~/assets/images/icon-frm-user.svg" alt="user icon" />
                          <!-- <img src="~~/assets/images/icon-frm-user_blue.svg" alt="user icon" /> blueMode-->
                            <div class="text-center">
                            &nbsp;{{ userName }}
                            </div>
                        </div>
                      </template>
                      <q-item class="box_header">
                        <q-item-section class="box_header_title">{{ $t('label.view.myMenu') }}</q-item-section>
                        <q-item-section avatar  class="setting_button" clickable v-close-popup tabindex="0" @click="showChangeMyInfoDialog()">
                          <img src="~/assets/images/icon-setting.svg" alt="setting button" />
                        </q-item-section>
                      </q-item>
                      <q-list class="box_body" >
                        <q-item class="logout_button" clickable v-close-popup tabindex="0" @click="logOut()">
                            <q-item-section avatar>
                              <img src="~/assets/images/icon-logout.svg" alt="setting button" />
                            </q-item-section>
                            <q-item-section>{{ $t('label.objt.logout') }}</q-item-section>
                        </q-item>
                        <q-item class="password_button" clickable v-close-popup tabindex="0" @click="showChangePasswordDialog()">
                            <q-item-section avatar>
                              <img src="~/assets/images/icon-password.svg" alt="setting button" />
                            </q-item-section>
                            <q-item-section>{{ $t('label.view.changePassword') }}</q-item-section>
                        </q-item>

                    </q-list>
                </q-btn-dropdown>
                <q-separator color="blue-grey-3" dark vertical inset style="margin:20px 10px;height: 24px;"/>
                <q-btn flat round dense @click="captureScreen()">
                  <img src="~/assets/images/photo_camera_FILL0_wght300_GRAD0_opsz24.svg" alt="star button" />
                </q-btn>
                <q-separator color="blue-grey-3" dark vertical inset style="margin:20px 10px;height: 24px;"/>
                <q-btn flat round dense @click="showMyMenuDialog()">
                  <img src="~/assets/images/icon-frm-favorite-grey.svg" alt="star button" />
                </q-btn>
                <q-separator color="blue-grey-3" dark vertical inset style="margin:20px 10px;height: 24px;"/>
                <q-btn class="menu_button" flat round dense @click="showAllMenuDialog()">
                  <!-- <img src="..~/assets/images/icon-frm-mymenu_blue.svg" alt="menu button" /> blueMode-->
                  <img src="~/assets/images/icon-frm-mymenu_gray.svg" alt="menu button" />
                  <AllMenuInfo v-model="showAllMenu" :linkFunc="viewMenuPage"></AllMenuInfo>
                </q-btn>
            </q-toolbar>
        </q-header>
      <!-- 사이드바 영역 -->
        <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        @mouseover="miniState = false, logoShowFlag = true"
        @mouseout="miniState = true, logoShowFlag = false"
        mini-to-overlay
        :mini-width="42"
        :width="380"
        :breakpoint="500"
        class="navbar"
        :dark=true
        style="background-color: #53526d;"
        >
        <!-- style="background-color: #383369;" blueMode-->
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <template v-for="{ text, children, index} in menuTree" :key="index">
              <q-expansion-item v-if="children !== ''"
                header-class="navbar_level1"
                :content-inset-level="0.1"
                icon="mail"
                :label=text
                group="level1Group"
                expand-icon-class="navbar_level1_expand_color"
                >
                <q-expansion-item
                v-for="{ text, children, childrenIndex} in children"
                header-class="navbar_level2"
                :key="childrenIndex"
                :inset-level="0.3"
                :content-inset-level="0.5"
                switch-toggle-side
                dense-toggle
                :label=text
                group="level2Group">
                <q-item
                v-for="{ menuId, text, thirdChildrenIndex} in children"
                :key="thirdChildrenIndex"
                dense
                clickable
                no-wrap
                @click="viewMenuPage(menuId)"
                class="navbar_level3"
                >
                <q-item-section>-&nbsp;{{ text }}</q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-expansion-item>
            </template>
          </q-list>
        </q-scroll-area>
        <q-img v-show=logoShowFlag style="max-height: 50px;">
          <div class="absolute-bottom bg-transparent nav_footer">
              <img src="~/assets/images/skylark-logo-sd.png" class="nav_footer_logo" alt="skylark logo">
              <div class="nav_footer_info">
              <p>(C)2023 All Rights Reserved</p>
              <p>IMB System Made with by skylark</p>
            </div>
          </div>
        </q-img>
      </q-drawer>
      <q-page-container>
        <!-- 탭 화면영역 -->
        <div style="max-width: 100% ;width:100%;text-align: center;" @mouseover="doMouseOverTab">
          <q-tabs
          :no-caps="true"
          v-model="obj.menuTab"
          :key="reRenderKey"
          align="left"
          inline-label
          outside-arrows
          mobile-arrows
          dense
          :shrink=false
          indicator-color="transparent"
          active-color="deep-purple-10"
          active-bg-color="blue-grey-1"
          style="width:100%; height: 40px;background-color: #d4d6e1;color:#4a4c5b;"
            >
            <!-- style="width:100%; padding:0 40px; height: 40px;background-color: #5156be;color:#c1c4d4;" blueMode-->
            <template v-for="{ index, menuId, menuName } in tabMenuList" :key="index">
                <q-tab :name="menuId" :label="menuName" style="border-radius: 10px 10px 0 0;">
                    <q-btn icon="close" flat round dense @click="closeMenu(menuId)" size="sm" style="margin-left:3px;"/>
                </q-tab>
            </template>
            <q-btn v-show=closeAllTab flat round dense  @click="closeAllMenu()" style="margin-left:6px;">
              <img src="~/assets/images/btn-tab_all_close-grey.svg" alt="menu button" />
            </q-btn>
          </q-tabs>
          <template v-for="{ index, menuId, src } in tabMenuList" :key="index">
              <iframe v-show="obj.menuTab === menuId" :src="src" :name="'iframe_' + menuId" :id="'iframe_' + menuId" class="height85" style="width:95vw;min-height: max-content; background-color: #f4f5f8; padding-left: 42px;" frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0" @load="onLoadMenuTab(menuId)"></iframe>
              <!-- <iframe v-show="menuTab === menuId" :src="src" :name="'iframe_' + menuId" :id="'iframe_' + menuId" style="width:95vw;height: 85vh;min-height: max-content; background-color: #f2f3f8;" frameborder="0" vspace="0" hspace="0" marginwidth="0" marginheight="0"></iframe> blueMode-->
          </template>
        </div>
        <footer class="absolute-bottom bg-transparent page_footer">(C)2023 All Rights Reserved IMB System Made with by skylark</footer>
      </q-page-container>
    </q-layout>
    <PasswordChange v-model="showChangePassword"></PasswordChange>
    <ChangeMyInfo v-model="showChangeMyInfo"></ChangeMyInfo>
</template>

<script setup>
import { ajaxUtil, commonProp, messageBox, commonUtil } from 'boot/bootFrm'
// import { ajaxUtil } from 'boot/ajaxUtil'
// import { commonProp } from 'boot/commonProp'
// import { messageBox } from 'boot/messageBox'
import { i18n } from 'boot/i18n'
import { reactive, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from 'stores/session'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import { ChangeMyInfo, PasswordChange, AllMenuInfo } from 'skylark-ui-lib'

const drawer = ref(false)
const miniState = ref(true)
const logoShowFlag = ref(false)

const session = useSessionStore()
const router = useRouter()
const { locale } = useI18n()

const searchMenuId = ref('')
const userName = session.sysUserName
const showChangePassword = ref(false)
const showChangeMyInfo = ref(false)
const showAllMenu = ref(false)
const showMyMenu = ref(false)
const tabMenuList = ref([])
const obj = reactive({ menuTab: '' })
const showing = ref(false)
const closeAllTab = ref(false)
const reRenderKey = ref(0)

if (session.sysLangCd === 'EN') {
  locale.value = 'en-US'
} else if (session.sysLangCd === 'ZH') {
  locale.value = 'zh-CN'
} else if (session.sysLangCd === 'KO') {
  locale.value = 'ko-KR'
} else {
  locale.value = session.sysLangCd
}

const menuList = JSON.parse(session.menuList)
const menuThreeList = ref([])
const wholeMenuThreeList = ref([])
const getMenuTree = () => {
  const menuOne = []
  const menuTwo = []
  const menuThree = []
  for (const index in menuList) {
    if (menuList[index].setupMenuLevel === '1') {
      menuOne.push(menuList[index])
    } else if (menuList[index].setupMenuLevel === '2') {
      menuTwo.push(menuList[index])
    } else if (menuList[index].setupMenuLevel === '3') {
      menuThree.push(menuList[index])
      wholeMenuThreeList.value.push(menuList[index])
    }
  }
  for (const index in menuTwo) {
    const menuDetail = menuThree.filter(v => v.parentid === menuTwo[index].id)
    menuTwo[index].children = menuDetail
  }
  for (const index in menuOne) {
    const menuDetail = menuTwo.filter(v => v.parentid === menuOne[index].id)
    menuOne[index].children = menuDetail
  }
  return menuOne
}
// const logOutFunc = () => {
//   const userParam = {
//     sysUserId: session.sysUserId,
//     sysGuestLoginFlag: session.sysGuestLoginFlag,
//     sysIpAddr: session.sysIpAddr,
//     sysOrganizationCode: session.sysOrganizationCode
//   }
//   ajaxUtil.ajaxCall(commonProp.logOutUrl, userParam)
//     .then((response) => {
//       session.removeSession()
//       router.push({ name: 'LogIn' })
//     })
//     .catch((error) => {
//       console.log(error.message)
//       session.removeSession()
//       router.push({ name: 'LogIn' })
//     })
// }

// const logOut = () => {
//   messageBox.confirm('Do you want Log Out?', logOutFunc)
// }
const logOut = () => {
  const _confirm = () => {
    const userParam = {
      sysUserId: session.sysUserId,
      sysGuestLoginFlag: session.sysGuestLoginFlag,
      sysIpAddr: session.sysIpAddr,
      sysOrganizationCode: session.sysOrganizationCode
    }
    ajaxUtil.ajaxCall(commonProp.logOutUrl, userParam)
      .then((response) => {
        session.removeSession()
        router.push({ name: 'LogIn' })
      })
      .catch((error) => {
        console.log(error.message)
        session.removeSession()
        router.push({ name: 'LogIn' })
      })
  }
  messageBox.confirm('Do you want Log Out?', _confirm)
}

const showMyMenuDialog = () => {
  showMyMenu.value = true
}

const showChangeMyInfoDialog = () => {
  showChangeMyInfo.value = true
}
const showChangePasswordDialog = () => {
  showChangePassword.value = true
}

const showAllMenuDialog = () => {
  showAllMenu.value = true
}

const viewMenuPage = (menuId) => {
  showing.value = false
  const menuDetail = tabMenuList.value.filter(v => v.menuId === menuId)

  if (menuDetail.length > 0) { // 기존에 해당 메뉴가 열려있는 경우
    const existingTab = menuDetail[0]
    console.log('Existing tab:', existingTab)
    const index = tabMenuList.value.indexOf(existingTab)
    const menuInfo = menuList.filter(v => v.menuId === menuId)
    // 새로운 refNo와 함께 src 재설정
    const screenName = existingTab.src.split('?')[0]
    console.log('Screen name:', screenName)
    const menuParam = {
      menuId: existingTab.menuId,
      menuName: existingTab.menuName,
      menuPath: menuInfo[0].enames,
      screenName
    }
    console.log('Menu param:', menuParam)
    const uniqueParam = new Date().getTime()

    const src =
      screenName + '?menuInfo=' + encodeURIComponent(JSON.stringify(menuParam)) + '&unique=' + uniqueParam
    console.log('New src:', src)
    nextTick(() => {
      tabMenuList.value[index] = {
        ...existingTab,
        src
      }
    })
  } else { // 기존에 해당 메뉴가 없는 경우
    if (menuDetail.length === 0) {
      const tabCount = session.sysTabCount
      if (tabMenuList.value.length >= tabCount) {
        messageBox.alertError(i18n.global.t('msg.error.menuCount', [tabCount]))
        return false
      }

      const menuInfo = menuList.filter(v => v.menuId === menuId)

      console.log(`menuInfo : ${menuInfo}`)

      if (menuInfo.length > 0) {
        if (menuInfo[0].setupMenuLevel === '3' && menuInfo[0].methodRule.indexOf('R') > -1) {
          const screenName = menuInfo[0].screenName
          const menuName = menuInfo[0].text
          const menuParam = {
            menuId,
            menuName,
            menuPath: menuInfo[0].enames,
            screenName,
            methodRule: menuInfo[0].methodRule
          }

          const src = screenName + '?menuInfo=' + encodeURIComponent(JSON.stringify(menuParam))

          tabMenuList.value.push({
            menuId,
            menuName,
            src
          })
        } else {
          messageBox.alertError(i18n.global.t('msg.error.menuNotFound'))
          return false
        }
      } else {
        messageBox.alertError(i18n.global.t('msg.error.menuNotFound'))
        return false
      }
    }
  }

  obj.menuTab = menuId
  searchMenuId.value = ''

  if (tabMenuList.value.length > 1) {
    closeAllTab.value = true
  } else {
    closeAllTab.value = false
  }
}

const closeMenu = (menuId) => {
  let menuIndex = -1

  for (const index in tabMenuList.value) {
    if (menuId === tabMenuList.value[index].menuId) {
      menuIndex = parseInt(index)
      break
    }
  }

  if (menuIndex > -1) {
    tabMenuList.value.splice(menuIndex, 1)

    // If the closed tab was the last one in the array,
    // we set the focus on the new last element.
    if (menuIndex === tabMenuList.value.length) {
      menuIndex--
    }
  }

  if (tabMenuList.value.length > 1) {
    closeAllTab.value = true
  } else {
    closeAllTab.value = false
  }

  // We check that we have at least one tab left to focus on.
  if (tabMenuList.value.length > 0) {
    obj.menuTab = tabMenuList.value[menuIndex].menuId
  } else {
    obj.menuTab = ''
  }
  reRenderKey.value++
}

// const focusPrevMenu = (prevMenuId) => {
//   if (prevMenuId !== '') {
//     obj.menuTab = prevMenuId
//   }
// }

// all tab close
const closeAllMenu = () => {
  tabMenuList.value.length = 0
  closeAllTab.value = false
  showDashBoardPage()
}

// Initialize
const menuTree = getMenuTree()

const languageCodeList = ref([])
const screenResolutionList = ref([])

ajaxUtil.getCodeList('LANGUAGE_CODE,RESOLUTION')
  .then(function (codeData) {
    languageCodeList.value = codeData.languageCode
    screenResolutionList.value = codeData.resolution
  })

if (session.sysPasswordFlag === 'true') {
  if (session.sysPwForceChangeFlag === 'true') {
    showChangePasswordDialog()
  } else {
    messageBox.confirm(i18n.global.t('msg.confirm.changePassword'), showChangePasswordDialog)
  }
} else {
  if (session.sysPwForceChangeFlag === 'true') {
    showChangePasswordDialog()
  }
}

const makeSearchMenu = (value) => {
  menuThreeList.value = []
  if (value === '') {
    showing.value = false
    return
  }

  for (const i in wholeMenuThreeList.value) {
    const _menuName = wholeMenuThreeList.value[i].text
    const _strIndex = _menuName.search(value)
    if (_strIndex !== -1) {
    // 검색어 포함하는 메뉴 세팅
      if (menuThreeList.value.length >= 8) {
        showing.value = true
        return
      }
      menuThreeList.value.push(wholeMenuThreeList.value[i])
    }
  }

  showing.value = (menuThreeList.value.length !== 0)
}

const showDashBoardPage = () => {
  const dashBoardMenuId = session.sysInitializeScreenId
  if (!commonUtil.isEmpty(dashBoardMenuId)) {
    nextTick(() => {
      viewMenuPage(dashBoardMenuId)
      obj.menuTab = dashBoardMenuId
    })
  }
}

showDashBoardPage()
const sendDataToIframe = (targetFrameId, initParams) => {
  const iframe = document.getElementById(targetFrameId)
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
      type: 'PARENT_DATA',
      initParams
    }, '*')
  }
}

const _initParams = ref({})
/**
 *
 */
window.onmessage = function (e) {
  if (e.data.e === 'openTabMenu') {
    _initParams.value = e.data.params
    viewMenuPage(_initParams.value.menuId)
  } else if (e.data.e === 'requestData') {
    sendDataToIframe('iframe_' + _initParams.value.menuId, JSON.parse(JSON.stringify(_initParams.value)))
  }
}

const captureScreen = () => {
  const screenName = ref('')
  for (const index in tabMenuList.value) {
    if (obj.menuTab === tabMenuList.value[index].menuId) {
      screenName.value = tabMenuList.value[index].menuName
    }
  }
  const element = document.getElementById('iframe_' + obj.menuTab).contentWindow.document.body

  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = imgData
    link.download = screenName.value + '.png'
    link.click()
  })
}

const onLoadMenuTab = (menuId) => {
  if (!document.getElementById('iframe_' + menuId).contentDocument.body.classList.contains('main')) {
    document.getElementById('iframe_' + menuId).contentDocument.body.classList.add('main')
  }
}

</script>
