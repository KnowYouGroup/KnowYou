<template>
<div class="notfound-box">
  <div class="notfound-shadow">
    <h1 class="icon-404"></h1>
    <p class="tc">啊呀！测试题被不明生物吞啦！<br>下载“懂你”，发现更多好玩的测试题吧~</p>
    <a class="ui-btn btn-download" href="https://fir.im/n3ah">点击下载</a>
  </div>
</div>
</template>
<script>
export default {}
</script>
<style>
.notfound-shadow { position:absolute; left:0; top:50%; width:100%; transform:translate(0, -50%); margin-top:-.4rem;}
.icon-404{width:1.2rem; height:1.5rem; margin:0 auto; background:url(../assets/img/404Icon@3x.png) no-repeat 50% 50%; background-size:100% auto;}
.notfound-shadow p,
.notfound-shadow p a{font-size:.16rem; line-height:.24rem; color:rgba(120,120,120,1); padding:0 3px;}
.notfound-shadow p a:hover{color:#19a9d5;}
.notfound-box .min-footer{position:absolute; width:100%; left:0; bottom:20px;}
.btn-download{width:1.5rem; height:.45rem; display:block; margin:.2rem auto 0; padding:0; line-height:.45rem; background:rgb(254,90,81); font-size:.16rem; color:#fff; border-radius:.03rem; text-align:center;}
</style>



