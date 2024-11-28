<template>
  <div class="error_pg">
    <div class="pg_404_wrapper">
      <p class="h1_404 "> 404 </p>
        <p class="message_404"> 페이지가 존재하지 않습니다. </p>
        <p class="desc_404"> We are very sorry for inconvenience. It looks like you’re try to access a page that either has been deleted or never existed. </p>
        <div class="button_box404">
      <!-- <q-btn
        class="btn q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="Close Menu"
        no-caps
        @click="closeMenu"
      /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
  // methods: {
  //   closeMenu () {
  //     console.log('close')
  //   }
  // }
})
</script>
<style>
  .error_pg { background: #c1c4d4; width: 100%; height:100vh; display: flex;  justify-content: center; align-items: center; }
  .pg_404_wrapper { width: 480px; height: 50vh; font-family: Roboto;  text-align: center; border: 0px solid #c0c; }
  .h1_404 {  font-size: 190px; font-weight: 700; margin-bottom: 20px; color: #5156be; }
  .message_404 { font-family: NotoSansKR; font-size: 30px; font-weight: 300;  color: #000; margin-bottom: 24px; }
  .desc_404 { margin-bottom: 24px; font-size: 16px; font-weight: 300;  color: #444; line-height: 1.5em; }
  .button_box404 { display: flex; justify-content: center; }
  .button_box404 .btn { background-color: #606784;  border-radius: 4px; font-size: 14px;  font-weight: 400;  color: #fff;  display: flex;  padding: 12px 33px;}
  .button_box404 .btn:hover { background-color: #181b47; }
</style>
