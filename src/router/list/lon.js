const lonRoute = [
  {
    path: '/lon/col/mng/lonColSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonColSch', component: () => import('pages/lon/col/mng/lonColSch.vue') }
    ]
  },
  {
    path: '/lon/col/mng/lonColMng',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonColMng', component: () => import('pages/lon/col/mng/lonColMng.vue'), props: true }
    ]
  },
  {
    path: '/lon/ogn/apc/lonOgnSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonOgnSch', component: () => import('pages/lon/ogn/apc/lonOgnSch.vue') }
    ]
  },
  {
    path: '/lon/ogn/apc/lonOgnApc',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonOgnApc', component: () => import('pages/lon/ogn/apc/lonOgnApc.vue') }
    ]
  },
  {
    path: '/lon/col/mng/lonColPlg',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonColPlg', component: () => import('pages/lon/col/mng/lonColPlg.vue') }
    ]
  },
  {
    path: '/lon/ogn/cnt/lonCntSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonCntSch', component: () => import('pages/lon/ogn/cnt/lonCntSch.vue') }
    ]
  },
  {
    path: '/lon/ogn/ath/lonAthSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonAthSch', component: () => import('pages/lon/ogn/ath/lonAthSch.vue') }
    ]
  },
  {
    path: '/lon/ogn/ath/lonOgnAth',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonOgnAth', component: () => import('pages/lon/ogn/ath/lonOgnAth.vue') }
    ]
  },
  {
    path: '/lon/ogn/cnt/lonCntMng',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonCntMng', component: () => import('pages/lon/ogn/cnt/lonCntMng.vue'), props: true }
    ]
  },
  {
    path: '/lon/ogn/cnt/lonCntChg',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonCntChg', component: () => import('pages/lon/ogn/cnt/lonCntChg.vue') }
    ]
  },
  {
    path: '/lon/srv/dbs/lonDbsSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonDbsSch', component: () => import('pages/lon/srv/dbs/lonDbsSch.vue') }
    ]
  },
  {
    path: '/lon/srv/dbs/lonDbsMng',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonDbsMng', component: () => import('pages/lon/srv/dbs/lonDbsMng.vue') }
    ]
  },
  {
    path: '/lon/srv/rpm/lonRpmSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonRpmSch', component: () => import('pages/lon/srv/rpm/lonRpmSch.vue') }
    ]
  },
  {
    path: '/lon/srv/rpm/lonRpmMng',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonRpmMng', component: () => import('pages/lon/srv/rpm/lonRpmMng.vue'), props: true }
    ]
  },
  {
    path: '/lon/com/prd/lonComPrd',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonComPrd', component: () => import('pages/lon/com/prd/lonComPrd.vue') }
    ]
  },
  {
    path: '/lon/pmg/psd/lonPmgPsd',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonPmgPsd', component: () => import('pages/lon/pmg/psd/lonPmgPsd.vue') }
    ]
  },
  {
    path: '/lon/pmg/pdr/lonPmgPdr',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonPmgPdr', component: () => import('pages/lon/pmg/pdr/lonPmgPdr.vue') }
    ]
  },
  {
    path: '/lon/col/gua/lonGuaSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonGuaSch', component: () => import('pages/lon/col/gua/lonGuaSch.vue') }
    ]
  },
  {
    path: '/lon/col/gua/lonColGua',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonColGua', component: () => import('pages/lon/col/gua/lonColGua.vue') }
    ]
  },
  {
    path: '/lon/aqc/mng/lonAqcSch',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonAqcSch', component: () => import('pages/lon/aqc/mng/lonAqcSch.vue') }
    ]
  },
  {
    path: '/lon/com/cst/lonComCst',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonComCst', component: () => import('pages/lon/com/cst/lonComCst.vue') }
    ]
  },
  {
    path: '/lon/aqc/cst/lonAqcCst',
    component: () => import('src/layouts/PageLayout.vue'),
    children: [
      { path: '', name: 'lonAqcCst', component: () => import('pages/lon/aqc/cst/lonAqcCst.vue') }
    ]
  }
]
export default lonRoute
