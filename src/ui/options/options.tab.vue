<template>
  <div class="optionsContent">
    <h2 class="optionsHeader">JoyProxy Options</h2>
    <div class="options__inner">
      <md-checkbox v-model="reloadActiveTab" class="md-primary toggleDomains__checkbox">
        Reload active tab on changing proxy
      </md-checkbox>
      <p class="note">
        Initial proxy list was loaded from <a
        href="https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list">https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list</a>
      </p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

@Component()
export default class OptionsTab extends Vue {
  reloadActiveTab = true;

  @Watch('reloadActiveTab')
  changeOptions(value) {
    chrome.runtime.sendMessage({
      action: 'CHANGE_OPTIONS',
      payload: {
        type: 'reloadActiveTab',
        value,
      },
    });
  }
}
</script>

<style lang="scss">
.optionsContent {
  padding: 0 12px;
}

.optionsHeader {
  font-size: 14px;
  font-weight: bold;
  color: #6f8390;
}

.note {
  font-size: 12px;
  white-space: pre-line;
  color: #96afc0;
  font-weight: 500;
}
</style>
