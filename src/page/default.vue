<template>
<div class="index-box">
  <div class="index-shadow">
    <h1 @click="logOut">Default</h1>
    <p class="tc">默认下载页面</p>
  </div>
</div>
</template>
<script>
import {removeCookie} from '@/config/mUtils'
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    logOut () {
      removeCookie('uToken')
      removeCookie('uID')
      removeCookie('pVersion')
    }
  }
}
</script>
<style>
.index-shadow { position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); margin-top:-40px;}
.index-shadow h1{ font-size: 40px; line-height:80px; color:#fff; text-shadow: 0 1px 0 #dee5e7, 0 2px 0 #fcfdfd, 0 5px 10px rgba(0, 0, 0, 0.125), 0 10px 20px rgba(0, 0, 0, 0.2);}
.index-shadow p,
.index-shadow p a{font-size:14px; color:#98a6ad; padding:0 3px;}
.index-shadow p a:hover{color:#19a9d5;}
.index-box .min-footer{position:absolute; width:100%; left:0; bottom:20px;}
</style>

