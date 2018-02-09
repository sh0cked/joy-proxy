<template>
  <div class="addSpecialDomain">
    <div class="addSpecialDomain__label">Add custom domain</div>
    <div class="addSpecialDomain__inputField">
      <md-field md-inline :class="invalid ? 'md-invalid' : ''">
        <label>example.com</label>
        <md-input ref="input" v-model="editedDomain" v-on:keyup.13="addNewDomain"></md-input>
        <span class="md-error">Invalid domain name</span>
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
import parseDomain from 'parse-domain';

@Component()
export default class AddCustomDomainForm extends Vue {
  editedDomain = '';
  invalid = false;

  addNewDomain() {
    const domain = parseDomain(this.editedDomain);
    if (!domain) {
      this.invalid = true;
      return;
    }
    this.$emit('addNewDomain', `${domain.domain}.${domain.tld}`);
    this.invalid = false;
    this.editedDomain = '';
  }

  mounted() {
    Vue.nextTick(() => {
      this.$refs.input.$el.focus();
    });
  }
}
</script>

<style lang="scss">
.addSpecialDomain {
  .md-button {
    margin: 0 0 0 8px;
    position: relative;
    top: -5px;
  }
}

.addSpecialDomain__label {
  font-size: 11px;
  font-weight: 700;
  position: relative;
  padding: 0 12px;
  margin-bottom: -22px;
}

.addSpecialDomain__inputField {
  display: flex;
  align-items: center;
  padding: 0 12px;
}
</style>
