<template>
  <div class="addUserAgent">
    <div class="addUserAgent__label">Add new browser useragent</div>
    <div class="addUserAgent__inputField">
      <md-field md-inline :class="invalid ? 'md-invalid' : ''">
        <label>Mozilla/5.0 (compatible; MSIE 9.0;...</label>
        <md-input v-model="useragent"></md-input>
        <span class="md-error">Can't be empty</span>
      </md-field>
      <md-button class="md-raised" @click="addNewDomain">
        Add
      </md-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { isDomainNameValid } from '../../utils';

@Component()
export default class AddProxyForm extends Vue {
  useragent = '';
  invalid = false;

  addNewDomain() {
    if (!this.useragent) {
      this.invalid = true;
      return;
    }
    this.$emit('addUserAgent', this.useragent);
    this.invalid = false;
    this.useragent = '';
  }
}
</script>

<style lang="scss">
.addUserAgent {
  .md-button {
    margin: 0 0 0 8px;
    position: relative;
    top: -5px;
  }
}

.addUserAgent__label {
  font-size: 11px;
  font-weight: 700;
  position: relative;
  padding: 0 12px;
  margin-bottom: -22px;
}

.addUserAgent__inputField {
  display: flex;
  align-items: center;
  padding: 0 12px;
}
</style>
