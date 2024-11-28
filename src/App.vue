<template>
    <router-view />
  </template>

<script>
import { defineComponent } from 'vue'

// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-balham.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'

import { LicenseManager } from 'ag-grid-enterprise'

LicenseManager.setLicenseKey('[TRIAL]_CompanyName=SYSTEM,LicensedApplication=Trial Support - May,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=-1,LicensedProductionInstancesCount=0,AssetReference=AG-037733,SupportServicesEnd=31_May_2023_[v2]_MTY4NTQ4NzYwMDAwMA==1e9d6ab04f075a6ef1ea64d676600ee9')

export default defineComponent({
  name: 'App'
})
</script>
