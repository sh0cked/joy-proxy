<template>
  <div class="pagination">
    <md-button @click="goPrev()" :disabled="currentPage === 1 || disable">Prev</md-button>
    <div class="pagination__center">
      <span>{{page}}</span>
      <span>/</span>
      <span>{{pages}}</span>
    </div>
    <md-button @click="goNext" :disabled="currentPage === pages || disable">Next</md-button>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    pages: Number,
    perPage: Number,
    disable: Boolean,
  },
})
export default class Pagination extends Vue {
  currentPage = 1;

  get page() {
    return this.disable ? 1 : this.currentPage;
  }

  onPageChange() {
    this.$emit('onPageChange', this.currentPage);
  }

  goPrev() {
    this.currentPage -= 1;
    this.onPageChange();
  }

  goNext() {
    this.currentPage += 1;
    this.onPageChange();
  }

  setCurrentPage(page = 1) {
    this.currentPage = page;
  }
}
</script>

<style lang="scss">
.pagination {
  height: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;

  .md-button {
    margin: 0 !important;
    color: #6f8390 !important;
  }
}

.pagination__center {
  font-size: 13px;
  font-weight: bold;
  color: #6f8390;
}
</style>
