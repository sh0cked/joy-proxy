<template>
  <div class="">

    <proxy-status
      :proxy="proxy"
      :isProxyActive="isProxyActive"
      @activateProxy="activateProxy"/>

    <div class="proxyError" v-if="proxyError">
      <span class="proxyError__label">Proxy error: </span>
      {{proxyError}}
    </div>

    <add-proxy-form v-if="addProxyDialogShown" @addNewProxy="addProxy($event)"/>

    <spinner v-if="!loaded"/>

    <proxy-table
      v-if="loaded"
      :proxies="displayedProxies"
      @applyProxy="applyProxy($event)"
      @removeProxy="removeProxy($event)"
      @clearAllProxies="clearAllProxies"
      @addNewProxy="showAddProxyDialog"
      @filterChanged="onFilterChange($event)"/>

    <special-domain-list v-if="loaded"/>

  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component()
export default class ProxyTab extends Vue {
  isProxyActive = false;
  editedProxy = '';
  proxy = null;
  allProxies = [];
  proxies = [];
  userAgents = [];
  proxyError = '';
  criteria = {};
  loaded = false;
  showAddProxyForm = false;
  addProxyDialogShown = false;

  get displayedProxies() {
    if (!this.allProxies || !this.allProxies.length) {
      return [];
    }
    const { type, country } = this.criteria;
    return this.allProxies
      .filter(item => {
        if (type && type !== 'all') {
          return item.type === type;
        }
        return true;
      })
      .filter(item => {
        if (item.country && country && country !== 'any') {
          return item.country.toLowerCase() === country.toLowerCase();
        }
        return true;
      });
  }

  activateProxy() {
    const action = this.isProxyActive ? 'RESET_PROXY' : 'APPLY_PROXY';
    chrome.runtime.sendMessage(
      { action, payload: this.proxy },
      this.mapExtensionStateToProperties
    );
  }

  applyProxy(proxy) {
    chrome.runtime.sendMessage(
      { action: 'APPLY_PROXY', payload: proxy },
      this.mapExtensionStateToProperties
    );
  }

  addProxy(proxy) {
    chrome.runtime.sendMessage(
      { action: 'ADD_PROXY', payload: proxy },
      this.mapExtensionStateToProperties
    );
  }

  removeProxy(proxy) {
    chrome.runtime.sendMessage(
      { action: 'REMOVE_PROXY', payload: proxy },
      this.mapExtensionStateToProperties
    );
  }

  clearAllProxies() {
    chrome.runtime.sendMessage(
      {
        action: 'CLEAR_ALL_PROXIES',
      },
      this.mapExtensionStateToProperties
    );
  }

  mapExtensionStateToProperties(state) {
    const { enabled, currentProxy, proxyError } = state;
    this.isProxyActive = enabled;
    Vue.set(this, 'allProxies', transformProxies(state));
    if (currentProxy) {
      this.proxy = currentProxy;
      this.proxy.flagUrl = currentProxy.country
        ? chrome.extension.getURL(
            `assets/images/countries/${currentProxy.country.toLowerCase()}.png`
          )
        : null;
    }
    this.userAgents = [];
    this.proxyError = proxyError;
  }

  updateState() {
    chrome.runtime.sendMessage({ action: 'GET_APP_STATE' }, state => {
      this.mapExtensionStateToProperties(state);
      setTimeout(() => {
        this.loaded = true;
      }, 500);
    });
  }

  onFilterChange(criteria) {
    this.criteria = { ...this.criteria, ...criteria };
  }

  // Update popup state from background message
  chromeMessageListener(message) {
    const { action, payload } = message;
    if (action !== 'UPDATE_POPUP_STATE') {
      return;
    }
    this.mapExtensionStateToProperties(payload);
  }

  toggleShowAddProxy() {
    this.showAddProxyForm = !this.showAddProxyForm;
  }

  showAddProxyDialog() {
    this.addProxyDialogShown = true;
  }

  mounted() {
    this.updateState();
    chrome.runtime.onMessage.addListener(this.chromeMessageListener);
  }

  destroyed() {
    chrome.runtime.onMessage.removeListener(this.chromeMessageListener);
  }
}

function transformProxies(appState) {
  const { proxyList, currentProxy, enabled } = appState;
  return proxyList.map(proxy => {
    if (!proxy.country) {
      proxy.country = 'unk';
    }
    return {
      ...proxy,
      flagUrl: proxy.country
        ? chrome.extension.getURL(
            `assets/images/countries/${proxy.country.toLowerCase()}.png`
          )
        : null,
      isActive:
        enabled &&
        currentProxy &&
        proxy.ip === currentProxy.ip &&
        proxy.port === currentProxy.port &&
        proxy.type === currentProxy.type,
    };
  });
}
</script>

<style lang="scss">
.activateBtn {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  margin-right: 24px !important;
  min-width: 114px !important;
  height: 40px !important;
  pointer-events: auto !important;
}

.activateBtn.md-button:not(.inactive) {
  background-color: #0096de !important;
  color: white !important;
}

.activateBtn.md-button[disabled] {
  background-color: #f0ecf6 !important;
  color: #bdb9b9 !important;
}

.proxyError {
  color: red;
  font-size: 12px;
  padding: 0 12px;
  font-weight: bold;
}
</style>
