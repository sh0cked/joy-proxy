<template>
  <footer class="footer">
    Copyright 2018
    <span class="footer__email">shulgamichail@gmail.com</span>
  </footer>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component()
export default class Footer extends Vue {}
</script>

<style lang="scss">
.footer {
  height: 40px;
  min-height: 40px;
  background-color: #fbfbfb;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
  color: #6f8390;
  margin-top: 16px;
}

.footer__email {
  font-weight: bold;
  padding-left: 12px;
}
</style>
