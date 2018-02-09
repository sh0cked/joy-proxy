<template>
  <div class="proxyTable">
    <div class="proxyTable__heading">
      <div class="proxyTable__headingLeft">Proxy list</div>
      <div class="proxyTable__headingRight">
        <button type="button"
                class="proxyTable__headingBtn"
                @click="addProxy">Add proxy
        </button>
        <button type="button"
                class="proxyTable__headingBtn"
                @click="filterShown = !filterShown">
          <span v-if="filterShown">Close filter</span>
          <span v-if="!filterShown">Show filter</span>
        </button>
      </div>
    </div>

    <proxy-filter v-if="filterShown"
                  ref="filter"
                  @filterChanged="changeFilterCriteria"/>

    <div class="proxyTable__noData" v-if="!proxies || !proxies.length">
      Proxy list is empty
    </div>

    <div class="proxyRow"
         :class="proxy.isActive && 'active'"
         v-for="proxy in displayedProxies"
         v-if="displayedProxies && displayedProxies.length">
      <div class="proxyRow__left">
        <img class="proxyRow__image" :src="proxy.flagUrl" v-if="proxy.flagUrl && proxy.flagUrl !== 'unk'">
        <span class="proxyRow__ip">{{proxy.ip}}</span>
        <span class="proxyRow__port">{{proxy.port}}</span>
        <span class="proxyRow__type">{{proxy.type}}</span>
      </div>

      <div class="proxyRow__right">
        <md-button @click="applyProxy(proxy)">Apply</md-button>
        <md-button class="md-icon-button" @click="removeProxy(proxy)">
          <md-icon>delete</md-icon>
        </md-button>
      </div>
    </div>

    <table-pagination
      ref="pagination"
      :pages="totalPages"
      :perPage="3"
      :disable="!proxies || !proxies.length"
      @onPageChange="setTablePage($event)"/>

  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    proxies: Array,
  },
})
export default class ProxyTable extends Vue {
  filterShown = false;
  perPage = 5;
  currentPage = 1;

  get displayedProxies() {
    if (!this.proxies || !this.proxies.length) {
      return [];
    }
    return this.proxies.slice(
      (this.currentPage - 1) * this.perPage,
      (this.currentPage - 1) * this.perPage + this.perPage
    );
  }

  get totalPages() {
    if (!this.proxies || !this.proxies.length || !this.perPage) {
      return 1;
    }
    return Math.ceil(this.proxies.length / this.perPage);
  }

  setTablePage(page) {
    this.currentPage = page;
  }

  changeFilterCriteria(criteria) {
    this.$emit('filterChanged', criteria);
    this.currentPage = 1;
    if (this.$refs.pagination) {
      this.$refs.pagination.setCurrentPage(1);
    }
  }

  applyProxy(proxy) {
    this.$emit('applyProxy', proxy);
  }

  editProxy(proxy) {
    this.$emit('editProxy', proxy);
  }

  addProxy() {
    this.$emit('addNewProxy');
  }

  removeProxy(proxy) {
    this.$emit('removeProxy', proxy);
  }

  clearAllProxies() {
    this.$emit('clearAllProxies');
  }

  clearFilter() {
    if (!this.$refs.filter) {
      return;
    }
    this.$refs.filter.country = 'any';
    this.$refs.filter.type = 'all';
  }
}
</script>

<style lang="scss">
.proxyTable {
  padding: 0 12px;
}

.proxyTable__heading {
  padding: 8px 0 10px;
  display: flex;
  justify-content: space-between;
}

.proxyTable__headingLeft {
  color: #6f8390;
  font-size: 16px;
  font-weight: bold;
}

.proxyTable__headingRight {
}

.proxyTable__headingBtn {
  border: none;
  box-shadow: none;
  cursor: pointer;
  color: #008ee6;
  font-size: 13px;
  font-weight: 600;
  background-color: transparent;
  -webkit-appearance: none;
  &:hover {
    text-decoration: underline;
  }
}

.proxyRow {
  display: flex;
  align-items: center;
  padding: 0;
  font-size: 12px;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #fbfbfb;
  }

  &.active {
    background-color: #c3ffd9;
  }

  .md-button.md-theme-default {
    margin: 0 !important;
    height: 36px;
    line-height: 36px;
    border-radius: 0;
    color: rgba(62, 100, 119, 0.64) !important;
    font-size: 13px;
    font-weight: 600;
  }
  .md-icon {
    color: rgba(62, 100, 119, 0.64) !important;
  }
}

.proxyRow__left {
  min-width: 212px;
}

.proxyRow__right {
  margin-left: auto;
}

.proxyRow__image {
  width: 25px !important;
  margin-right: 10px;
  margin-left: 4px;
}

.proxyRow__protocol {
}

.proxyRow__ip {
  font-size: 12px;
  font-weight: 600;
  min-width: 100px;
  display: inline-block;
  color: #495c69;
}

.proxyRow__port {
  color: rgba(62, 100, 119, 0.64) !important;
  font-size: 12px;
  font-weight: 500;
  min-width: 36px;
  display: inline-block;
}

.proxyTable__noData {
  font-size: 20px;
  font-weight: bold;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e2e2e2;
}

.proxyRow__type {
  color: rgba(62, 100, 119, 0.64) !important;
  font-size: 12px;
  font-weight: 900;
  min-width: 30px;
  display: inline-block;
}
</style>
