const baseRoute = [
  {
    path: '/',
    name: 'LogIn',
    component: () => import('pages/frm/fcd/lgn/frmFcdLgn.vue')
  },
  {
    path: '/Main',
    name: 'IndexPage',
    component: () => import('pages/IndexPage.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: '/:first+/:second+/:third+/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFoundTab.vue')
  }
]
export default baseRoute
