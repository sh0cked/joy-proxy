<template>
  <div class="specialDomains">

    <div class="specialDomains__top">
      <md-checkbox
        v-model="useProxyOnlyForSpecialDomains"
        :disabled="!specialDomains || !specialDomains.length"
        class="md-primary toggleDomains__checkbox">
        Use proxy only for custom domains
      </md-checkbox>
      <div class="specialDomain__addNew" @click="isAddFormShown = !isAddFormShown">
        <span v-if="!isAddFormShown">Add new domain</span>
        <span v-if="isAddFormShown">Close</span>
      </div>
    </div>

    <add-special-domains-form @addNewDomain="addDomain($event)" v-if="isAddFormShown"/>

    <div class="chipsContainer" :class="!useProxyOnlyForSpecialDomains && 'inactive'">
      <chip
        v-for="domain in specialDomains"
        :text="domain"
        :image="`https://www.google.com/s2/favicons?domain=${domain}`"
        @remove="removeDomain(domain)"/>
      <div class="chipsContainer__empty" v-if="!specialDomains || !specialDomains.length">
        No custom domains added
      </div>
    </div>


  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

@Component()
export default class AddSpecialDomainForm extends Vue {
  specialDomains = [];
  useProxyOnlyForSpecialDomains = false;
  isAddFormShown = false;
  ready = false;

  @Watch('useProxyOnlyForSpecialDomains')
  onUseSpecProxiesChange(value) {
    this.triggerUsingProxyType(value);
  }

  removeDomain(domain) {
    chrome.runtime.sendMessage(
      { action: 'REMOVE_SPECIAL_DOMAIN', payload: domain },
      this.mapCustomDomains
    );
  }

  addDomain(domain) {
    chrome.runtime.sendMessage(
      { action: 'ADD_SPECIAL_DOMAIN', payload: domain },
      this.mapCustomDomains
    );
  }

  mounted() {
    chrome.runtime.sendMessage({ action: 'GET_APP_STATE' }, state => {
      this.useProxyOnlyForSpecialDomains = state.options.reloadActiveTabOnApplyProxy;
      this.mapCustomDomains(state);
    });
    setTimeout(() => {
      this.ready = true;
    }, 500);
  }

  triggerUsingProxyType(value) {
    if (!this.ready) {
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'TRIGGER_USING_PROXY_ONLY_FOR_SPECIAL_DOMAINS',
        payload: value,
      },
      () => {}
    );
  }

  mapCustomDomains(state) {
    this.specialDomains = state.specialDomains.map(item => item.split('|')[1]);
  }
}
</script>

<style lang="scss">
.specialDomains {
  display: flex;
  flex-direction: column;
}

.specialDomains__top {
  display: flex;
  justify-content: space-between;
  padding: 14px 12px 20px;
}

.md-checkbox.toggleDomains__checkbox {
  color: #6f8390;
  font-size: 13px;
  font-weight: 900;
  margin: 0 !important;
  padding: 0 !important;
}

.specialDomain__addNew {
  display: flex;
  margin-left: auto;
  border: none;
  box-shadow: none;
  cursor: pointer;
  color: #008ee6;
  font-size: 13px;
  font-weight: 500;
  background-color: transparent;
  -webkit-appearance: none;
  &:hover {
    text-decoration: underline;
  }
}

.chipsContainer {
  display: flex;
  flex-wrap: wrap;
  padding: 0 12px;

  &.inactive {
    opacity: 0.5;
    pointer-events: none;
  }
}

.chipsContainer__empty {
  font-size: 14px;
  font-weight: bold;
  color: rgba(62, 100, 119, 0.64) !important;
  padding: 20px 0;
  text-align: center;
  width: 100%;
}
</style>
