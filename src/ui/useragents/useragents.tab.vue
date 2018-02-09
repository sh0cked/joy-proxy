<template>
  <div class="userAgents">

    <div class="userAgents__status">
      <div class="userAgents__statusLabel">Current userAgent:</div>
      <div class="userAgents__statusHead">{{browserByUA}}</div>
      <div class="userAgents__statusValue">{{currentUserAgent}}</div>
    </div>


    <md-button :disabled="!activeUserAgent" @click="applyUserAgent" class="md-raised activateUserAgentBtn">
      <span>Apply userAgent</span>
      <md-tooltip v-if="!activeUserAgent" md-direction="bottom">Please select useragent from list</md-tooltip>
    </md-button>
    <md-button @click="resetUserAgent" class="md-raised md-accent resetUserAgentBtn">Reset</md-button>

    <add-useragent-form
      v-if="false"
      @addUserAgent="addUserAgent($event)"/>

    <md-list>
      <md-subheader>Useragents</md-subheader>

      <spinner v-if="!loaded"/>

      <div class="userAgents__list" v-if="loaded && userAgents.length">
        <md-list-item
          v-for="useragent in userAgents" class="uaList__item"
          :class="useragent.value == currentUserAgent && 'active'">
          <md-radio v-model="activeUserAgent" :value="useragent.value" :checked="useragent.value == currentUserAgent"/>
          <span class="uaList__rowContent">
            <div class="uaList__rowWrapper">
            <span class="uaList__rowLabel">{{useragent.label}}</span>
            <span class="uaList__rowText">{{useragent.value}}</span>
            </div>
          </span>
        </md-list-item>
      </div>

      <div class="userAgents__noData" v-if="loaded && !userAgents.length">No data</div>

    </md-list>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { parseUserAgent } from '../../utils';

@Component()
export default class UseragentsTab extends Vue {
  activeUserAgent = '';
  userAgents = [];
  loaded = false;
  currentUserAgent = '';

  mounted() {
    chrome.runtime.sendMessage(
      { action: 'GET_APP_STATE' },
      ({ userAgents = [], currentUserAgent } = {}) => {
        this.userAgents = userAgents;
        this.currentUserAgent = currentUserAgent;
        setTimeout(() => {
          this.loaded = true;
        }, 500);
      }
    );
  }

  addUserAgent(useragent) {
    chrome.runtime.sendMessage(
      { action: 'ADD_USERAGENT', payload: useragent },
      state => {
        this.userAgents = state.userAgents;
      }
    );
  }

  removeUserAgent(useragent) {
    chrome.runtime.sendMessage(
      { action: 'REMOVE_USERAGENT', payload: useragent },
      state => {
        this.userAgents = state.userAgents;
      }
    );
  }

  applyUserAgent() {
    chrome.runtime.sendMessage(
      { action: 'APPLY_USERAGENT', payload: this.activeUserAgent },
      state => {
        this.currentUserAgent = state.currentUserAgent;
      }
    );
  }

  resetUserAgent() {
    chrome.runtime.sendMessage({ action: 'RESET_USERAGENT' }, state => {
      this.currentUserAgent = state.currentUserAgent;
    });
  }

  get browserByUA() {
    return parseUserAgent(this.currentUserAgent);
  }
}
</script>

<style lang="scss">
.userAgents {
}

.userAgents__status {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 0 12px;
  color: #6f8390;
}

.userAgents__statusLabel {
  font-size: 12px;
  color: rgba(62, 100, 119, 0.64) !important;
}

.userAgents__statusValue {
  font-size: 13px;
  font-weight: bold;
  line-height: 1.2;
}

.userAgents__statusHead {
  font-size: 17px;
  color: #51606b;
  font-weight: bold;
  text-transform: uppercase;
  padding-bottom: 7px;
}

.uaList__item {
  &.active {
    background-color: rgba(0, 255, 44, 0.26);
  }
}

.uaList__rowContent {
  display: flex;
  font-size: 12px;
  align-items: center;
  color: #6f8390;
  width: 100%;

  .md-icon-button {
    margin-left: auto !important;
  }
}

.uaList__rowWrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.uaList__rowText {
  display: flex;
  max-width: 100%;
  white-space: normal;
  line-height: 1;
  padding-top: 4px;
  font-size: 11px;
}

.uaList__rowLabel {
  font-weight: bold;
}

.userAgents .md-list.md-theme-default {
  padding-top: 0 !important;
}

.userAgents .md-list-item {
  border-bottom: 1px solid #f7f7f7 !important;
  margin-bottom: 0 !important;
  cursor: pointer;
}

.md-list-item-content {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

.md-list-item-content > .md-radio:first-child {
  margin-right: 12px !important;
}

.md-list-item .md-icon {
  color: rgba(62, 100, 119, 0.64) !important;
}

.userAgents__noData {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin: 18px;
  color: #eee;
}

.activateUserAgentBtn {
  background-color: #0096de !important;
  color: white !important;
  height: 40px !important;
  padding: 0 12px !important;
  pointer-events: auto !important;
}

.resetUserAgentBtn {
  pointer-events: auto !important;
  height: 40px !important;
  padding: 0 12px !important;
}
</style>
