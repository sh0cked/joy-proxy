<template>
  <div class="addProxyForm">
    <div class="addProxyForm__label">Add new proxy server</div>
    <div class="addProxyForm__inputField">
      <md-field md-inline :class="invalid ? 'md-invalid' : ''">
        <label>ip:port</label>
        <md-input ref="input" v-model="editedProxy" v-on:keyup.13="addNewProxy"></md-input>
        <span class="md-error">Invalid proxy</span>
      </md-field>
      <md-button class="md-raised" @click="addNewProxy">
        Add
      </md-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { isProxyValid } from '../../utils';

@Component()
export default class AddProxyForm extends Vue {
  editedProxy = '';
  invalid = false;

  addNewProxy() {
    const proxy = this.parseProxyStr(this.editedProxy);
    if (!isProxyValid(proxy)) {
      this.invalid = true;
      return;
    }
    this.$emit('addNewProxy', proxy);
    this.invalid = false;
    this.editedProxy = '';
  }

  parseProxyStr(proxyStr) {
    if (!proxyStr || typeof proxyStr !== 'string') {
      return {};
    }
    const [ip, port, user, password] = proxyStr.split(':');
    return {
      ip,
      port,
      user,
      password,
    };
  }

  serializeProxy(proxyObject) {
    if (!proxyObject) {
      return '';
    }
    return ['ip', 'port', 'user', 'password'].reduce((acc, key, idx) => {
      if (!proxyObject[key]) {
        return acc;
      }
      if (idx !== 0) {
        acc += ':';
      }
      acc += `${proxyObject[key]}`;
      return acc;
    }, '');
  }

  mounted() {
    Vue.nextTick(() => {
      this.$refs.input.$el.focus();
    });
  }
}
</script>

<style lang="scss">
.addProxyForm {
  margin-top: 4px;

  .md-button {
    margin: 0 0 0 8px;
    position: relative;
    top: -5px;
  }
}

.addProxyForm__label {
  font-size: 11px;
  font-weight: 700;
  position: relative;
  padding: 0 12px;
  margin-bottom: -22px;
  color: #6f8390;
}

.addProxyForm__inputField {
  display: flex;
  align-items: center;
  padding: 0 12px;
}
</style>
