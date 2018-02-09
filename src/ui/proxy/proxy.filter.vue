<template>
  <div class="md-flex proxyFilter">
    <md-field class="proxyFilter__field left">
      <label for="type">Type</label>
      <md-select v-model="type" name="movie" id="type">
        <md-option value="all">All</md-option>
        <md-option value="http">Http</md-option>
        <md-option value="https">Https</md-option>
      </md-select>
    </md-field>
    <md-field class="proxyFilter__field right">
      <label for="countrySelect">Country</label>
      <md-select v-model="country" name="countrySelect" id="countrySelect">
        <md-option :value="c.ccode" v-for="c in countries">{{c.cname}}</md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import countryCodes from '../utils/countrycodes';

@Component({
  props: {
    criteria: {
      type: Object,
      default: () => ({
        country: 'any',
        type: 'all',
      }),
    },
  },
})
export default class ProxyFilter extends Vue {
  country = 'any';
  type = 'all';
  countries = [{ ccode: 'any', cname: 'Any' }, ...countryCodes];

  @Watch('country')
  onCountryChange(value) {
    this.$emit('filterChanged', {
      country: value,
    });
  }

  @Watch('type')
  onTypeChange(value) {
    this.$emit('filterChanged', {
      type: value,
    });
  }

  mounted() {
    // TODO Save filter params in state
    // const { type, country } = this.criteria;
    // if (type) {
    //   this.type = type;
    // }
    // if (country) {
    //   this.country = country;
    // }
  }
}
</script>

<style lang="scss">
.proxyFilter {
  display: flex;
  margin-bottom: 8px;

  .md-field.proxyFilter__field {
    &:after {
      background-color: rgba(206, 199, 199, 0.42) !important;
    }

    .md-icon {
      color: rgba(206, 199, 199, 0.42) !important;
    }
  }

  .md-input {
    color: #6f8390 !important;
  }
}

.proxyFilter__field {
  margin-bottom: 4px !important;
}

.proxyFilter__field.left {
  margin-right: 8px;
}

.proxyFilter__field.right {
  margin-left: 8px;
}

.md-input.md-select-value {
  color: #6f8390 !important;
  -webkit-text-fill-color: #6f8390 !important;
}

.proxyFilter__field label {
  color: rgba(62, 100, 119, 0.64) !important;
}
</style>
