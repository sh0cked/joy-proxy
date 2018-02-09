<template>
  <main class="contentWrapper">
    <popup-header/>
    <section class="content">
      <md-tabs>
        <md-tab id="tab-actions" md-label="Proxy settings" @click="switchTab('proxy')"></md-tab>
        <md-tab id="tab-useragents" md-label="Useragents" @click="switchTab('userAgents')"></md-tab>
        <md-tab id="tab-home" md-label="Options" @click="switchTab('options')"></md-tab>
      </md-tabs>
      <div class="contentInner">

        <transition name="fade">
          <proxy-tab v-if="activeSection === 'proxy'"/>
        </transition>

        <transition name="fade">
          <useragents-tab v-if="activeSection === 'userAgents'"/>
        </transition>

        <transition name="fade">
          <options-tab v-if="activeSection === 'options'"/>
        </transition>

      </div>
    </section>
    <popup-footer/>
  </main>

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component()
export default class Popup extends Vue {
  activeSection = 'proxy';

  switchTab(targetTab) {
    this.activeSection = '';
    setTimeout(() => {
      this.activeSection = targetTab;
    }, 410);
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 430px;
  min-width: 430px;
  min-height: 400px;
  padding-right: 2px;
  background-color: white;
  ::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  ::-webkit-scrollbar-track {
    background: #eee;
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: #eaeaea;
    width: 2px;
  }
}

html.md-theme-default {
  background-color: white;
}

/*.md-tabs.md-theme-default {*/
/*box-shadow: 0 0 33px rgba(0, 0, 0, 0.01);*/
/*}*/

.contentWrapper {
  width: 100%;
  min-width: 100%;
  min-height: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content {
  flex: 1;
}

.md-tabs-navigation .md-button {
  height: 40px !important;
}

.md-tabs-navigation {
  .md-button.md-theme-default {
    color: #6f8390 !important;
    &.md-active {
      color: #0096de !important;
    }
  }
  .md-tabs-indicator {
    background-color: #0096de !important;
  }
}

.proxyError {
  color: red;
  font-size: 12px;
  padding: 0 12px;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
