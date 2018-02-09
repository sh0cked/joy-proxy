import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import App from './index.vue';
import ProxyTable from './proxy/proxy.table.vue';
import PopupHeader from './common/header.vue';
import PopupFooter from './common/footer.vue';
import ProxyFilter from './proxy/proxy.filter.vue';
import AddProxyForm from './proxy/add.proxy.form.vue';
import Pagination from './proxy/pagination.vue';
import Spinner from './common/spinner.vue';
import ProxyStatus from './proxy/proxy.status.vue';
import ProxyTab from './proxy/proxy.tab.vue';
import OptionsTab from './options/options.tab.vue';
import UseragentsTab from './useragents/useragents.tab.vue';
import AddUserAgentForm from './useragents/add.useragent.form.vue';
import AddSpecialDomainForm from './options/add.specialdomain.form.vue';
import SpecialDomainList from './options/special.domain.list.vue';
import Chip from './common/chip.vue';
import { loadFonts, runOnDOMReady } from '../utils';

Vue.use(VueMaterial);

Vue.component('proxy-table', ProxyTable);
Vue.component('popup-header', PopupHeader);
Vue.component('popup-footer', PopupFooter);
Vue.component('add-proxy-form', AddProxyForm);
Vue.component('proxy-filter', ProxyFilter);
Vue.component('table-pagination', Pagination);
Vue.component('spinner', Spinner);
Vue.component('proxy-status', ProxyStatus);
Vue.component('proxy-tab', ProxyTab);
Vue.component('options-tab', OptionsTab);
Vue.component('useragents-tab', UseragentsTab);
Vue.component('add-useragent-form', AddUserAgentForm);
Vue.component('add-special-domains-form', AddSpecialDomainForm);
Vue.component('special-domain-list', SpecialDomainList);
Vue.component('chip', Chip);

runOnDOMReady(() => {
  loadFonts();
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    render: h => h(App),
  });
});
