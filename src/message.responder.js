import { getState, updateState } from './state';
import {
  addProxy,
  addSpecialDomain,
  addUserAgent,
  applyProxy,
  applyUserAgent,
  clearAllProxies,
  removeProxy,
  removeSpecialDomain,
  removeUserAgent,
  resetProxy,
  resetUserAgent,
  triggerUsingCustomDomains,
} from './extension.service';
import { loadProxyList } from './services/api';

export const extMessageListener = (message, sender, sendResponse) => {
  const { action, payload } = message;
  switch (action) {
    case 'GET_APP_STATE': {
      const appState = getState();
      sendResponse(appState);
      break;
    }

    case 'UPDATE_APP_STATE': {
      updateState(payload);
      break;
    }

    case 'ADD_PROXY': {
      addProxy(payload).then(sendResponse);
      return true;
    }

    case 'REMOVE_PROXY': {
      removeProxy(payload).then(sendResponse);
      return true;
    }

    case 'APPLY_PROXY': {
      applyProxy(payload).then(sendResponse);
      return true;
    }

    case 'RESET_PROXY': {
      resetProxy().then(sendResponse);
      return true;
    }

    case 'ADD_SPECIAL_DOMAIN': {
      addSpecialDomain(payload).then(sendResponse);
      return true;
    }

    case 'REMOVE_SPECIAL_DOMAIN': {
      removeSpecialDomain(payload).then(sendResponse);
      return true;
    }

    case 'CLEAR_ALL_PROXIES': {
      clearAllProxies().then(sendResponse);
      return true;
    }

    case 'ADD_USERAGENT': {
      addUserAgent(payload).then(sendResponse);
      return true;
    }

    case 'REMOVE_USERAGENT': {
      removeUserAgent(payload).then(sendResponse);
      return true;
    }

    case 'APPLY_USERAGENT': {
      applyUserAgent(payload).then(sendResponse);
      return true;
    }
    case 'RESET_USERAGENT': {
      resetUserAgent().then(sendResponse);
      return true;
    }

    case 'TRIGGER_USING_PROXY_ONLY_FOR_SPECIAL_DOMAINS': {
      triggerUsingCustomDomains(payload).then(sendResponse);
      return true;
    }

    case 'CHANGE_OPTIONS': {
      const OPTIONS_TYPE = {
        reloadActiveTab: 'reloadActiveTabOnApplyProxy',
      };
      const type = OPTIONS_TYPE[payload.type];
      if (!type) {
        return;
      }

      const state = getState();
      updateState({
        options: {
          ...state.options,
          [type]: payload.value,
        },
      });
      return true;
    }

    case 'LOAD_PROXIES': {
      loadProxyList().then(() => sendResponse(getState()));
      return true;
    }

    default:
      console.warn('Unk action in message responder ,', action, payload);
  }
};

export const initMessageResponder = () =>
  chrome.runtime.onMessage.addListener(extMessageListener);
