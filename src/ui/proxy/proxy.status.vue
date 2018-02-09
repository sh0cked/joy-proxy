<template>
  <div class="proxyStatus">
    <md-button class="md-raised activateBtn"
               :disabled="!proxy"
               :class="isProxyActive ? 'inactive': ''"
               @click="activateProxy()">
      <span v-if="!isProxyActive">Start</span>
      <span v-if="isProxyActive">Stop</span>
      <md-tooltip v-if="!proxy" md-direction="bottom">Please select proxy server from table</md-tooltip>
    </md-button>
    <div class="status" :class="isProxyActive ? '' : 'off'">
      <div class="status__label">Status</div>
      <div class="status__value">
        <span v-if="isProxyActive">ON</span>
        <span v-if="!isProxyActive">OFF</span>
      </div>
    </div>
    <div class="proxyInfo">
      <span class="proxyInfo__label">Selected proxy:</span>
      <div class="proxyInfo__noInfo" v-if="!proxy">Unset</div>
      <div class="proxyInfo__ipWrapper" v-if="proxy">
        <img class="proxyInfo__countryFlag" :src="proxy.flagUrl" alt="">
        <span class="proxyInfo__ip">{{proxy.ip}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    proxy: Object,
    isProxyActive: Boolean,
  },
})
export default class ProxyStatus extends Vue {
  activateProxy() {
    this.$emit('activateProxy');
  }
}
</script>

<style lang="scss">
.proxyStatus {
  display: flex;
  padding: 12px 0;
}

.status {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 12px;
  min-width: 60px;
}

.status.off .status__value {
  color: #b4bdc1;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  padding-top: 4px;
}

.status__label {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #6f8390;
}

.status__value {
  font-size: 20px;
  font-weight: bold;
  color: #68c368;
  height: 32px;
  padding-top: 4px;
}

.proxyInfo {
  padding: 0 12px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.proxyInfo__noInfo {
  color: #b4bdc1;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  padding-top: 4px;
}

.proxyInfo__ipWrapper {
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.proxyInfo__label {
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: #6f8390;
  padding-right: 12px;
}

.proxyInfo__countryFlag {
  margin-right: 6px;
  width: 24px;
}

.proxyInfo__divider {
  padding: 0 2px;
  color: rgba(62, 100, 119, 0.87);
}

.proxyInfo__ip,
.proxyInfo__port {
  font-size: 17px;
  font-weight: bold;
  color: rgba(62, 100, 119, 0.87);
}
</style>
