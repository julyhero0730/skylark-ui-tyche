import { defineStore } from 'pinia'
import { boot } from 'quasar/wrappers'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      loginCheck: false,
      sysUserId: '',
      sysUserName: '',
      sysUserKind: '',
      sysEmployeeNo: '',
      sysChnlCd: '',
      sysLangCd: 'EN',
      sysGroupList: '',
      sysCurrentBusinessDate: '',
      sysPreviousBusinessDate: '',
      sysNextBusinessDate: '',
      sysSessId: '',
      sysIpAddr: '',
      sysMacAddr: '',
      sysBranchCode: '',
      sysParentBranchCode: '',
      sysBaseCurrency: '',
      sysBranchBic: '',
      sysRegionHeadOffice: '',
      sysOrganizationCode: '',
      sysGuestLoginFlag: '',
      sysDatePattern: '',
      sysDateSymbol: '',
      sysDecimalPoint: '',
      sysMenuMode: '',
      sysOverActiFlag: '',
      sysOverUrl: '',
      sysTabCount: '',
      menuList: '',
      sysAllMenu: '',
      menu3LvlList: '',
      sysPwForceChangeFlag: '',
      sysPasswordFlag: '',
      maxLoginFalseCount: '',
      sysMenuParams: '',
      sysInitializeScreenId: '',
      token: null
    }
  },
  actions: {
    /**
     *
     */
    setLoginInfo (userId, langCd, organizationCode, userName, userKind, employeeNo, chnlCd, sessId, ipAddr, macAddr, branchCode, guestLoginFlag, groupList) {
      this.sysUserId = userId
      this.sysLangCd = langCd
      this.sysOrganizationCode = organizationCode
      this.sysUserName = userName
      this.sysUserKind = userKind
      this.sysEmployeeNo = employeeNo
      this.sysChnlCd = chnlCd
      this.sysSessId = sessId
      this.sysIpAddr = ipAddr
      this.sysMacAddr = macAddr
      this.sysBranchCode = branchCode
      this.sysGuestLoginFlag = guestLoginFlag
      this.sysGroupList = groupList
      this.loginCheck = true
    },
    /**
     *
     */
    setBranchInfo (currentBusinessDate, previousBusinessDate, nextBusinessDate, parentBranchCode, baseCurrency, branchBic, regionHeadOffice) {
      this.sysCurrentBusinessDate = currentBusinessDate
      this.sysPreviousBusinessDate = previousBusinessDate
      this.sysNextBusinessDate = nextBusinessDate
      this.sysParentBranchCode = parentBranchCode
      this.sysBaseCurrency = baseCurrency
      this.sysBranchBic = branchBic
      this.sysRegionHeadOffice = regionHeadOffice
    },
    /**
     *
     */
    setSysConfig (datePattern, dateSymbol, decimalPoint, menuMode, overActiFlag, overUrl, tabCount, maxLoginFalseCount, menuId) {
      this.sysDatePattern = datePattern
      this.sysDateSymbol = dateSymbol
      this.sysDecimalPoint = decimalPoint
      this.sysMenuMode = menuMode
      this.sysOverActiFlag = overActiFlag
      this.sysOverUrl = overUrl
      this.sysTabCount = tabCount
      this.maxLoginFalseCount = maxLoginFalseCount
      this.sysInitializeScreenId = menuId
    },
    /**
     *
     */
    removeSession () {
      this.loginCheck = false
      this.sysUserId = ''
      this.sysUserName = ''
      this.sysUserKind = ''
      this.sysEmployeeNo = ''
      this.sysLangCd = 'EN'
      this.sysChnlCd = ''
      this.sysCurrentBusinessDate = ''
      this.sysPreviousBusinessDate = ''
      this.sysNextBusinessDate = ''
      this.sysSessId = ''
      this.sysIpAddr = ''
      this.sysMacAddr = ''
      this.sysBranchCode = ''
      this.sysParentBranchCode = ''
      this.sysBaseCurrency = ''
      this.sysBranchBic = ''
      this.sysRegionHeadOffice = ''
      this.sysOrganizationCode = ''
      this.sysGuestLoginFlag = ''
      this.sysDatePattern = ''
      this.sysDateSymbol = ''
      this.sysDecimalPoint = ''
      this.sysMenuMode = ''
      this.sysOverActiFlag = ''
      this.sysOverUrl = ''
      this.sysTabCount = ''
      this.menuList = ''
      this.sysAllMenu = ''
      this.menu3LvlList = ''
      this.sysPwForceChangeFlag = ''
      this.sysPasswordFlag = ''
      this.sysGroupList = ''
      this.sysMenuParams = ''
      this.sysInitializeScreenId = ''
      this.clearToken()
    },
    /**
     *
     */
    setMenuParams (params) {
      this.sysMenuParams = params
    },
    /**
     *
     */
    setToken (newToken) {
      this.token = newToken
    },
    /**
       *
       */
    clearToken () {
      this.token = null
    }
  },
  /**
   *
   */
  persist: true
})

export default boot(({ app }) => {
  app.config.globalProperties.$useSessionStore = useSessionStore
  app.mount('#app')
})
