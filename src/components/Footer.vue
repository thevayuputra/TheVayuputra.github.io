<template>
  <div class="footer">
    <div class="right">Reach me at <a href="mailto:vayuputra.developer@gmail.com">vayuputra.developer@gmail.com</a> or <router-link to="/contact">Contact Me</router-link></div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppFooter"
});

</script>

<style scoped lang="less">

@import '../css/variables.less';

.footer {
  background-color: @bodyBgColor;
  width: 100%;
  font-size: 0.8em;
  opacity: 0.7;
  padding-bottom: 30px;
}

.left, .right {
  padding-top: 10px;
  text-align: center;
}

@media only screen and (min-width: 620px){

  .footer {
    padding: 0;
  }

  .left, .right {
    padding: 20px;
  }

  .left {
    float: left;
  }

  .right {
    float:right;
  }
}
</style>