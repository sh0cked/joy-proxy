import { initMessageResponder } from './message.responder';
import {
  setProxyErrorHandler,
  initialHandleProxyConfig,
  resetProxy,
} from './proxy/proxy.manager';
import { loadProxyList } from './services/api';
import { restoreExtState } from './state';
import { showNofitication } from './utils';

async function start() {
  await resetProxy();
  await initialHandleProxyConfig();
  await restoreExtState();
  initMessageResponder();
  setProxyErrorHandler();
  try {
    await loadProxyList();
  } catch (err) {
    showNofitication({
      title: 'Error on loading proxy list',
      message: `${err}`,
    });
  }
}

start();
