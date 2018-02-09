import { getValue, saveValue } from './services/storage';
import { userAgents } from './assets/useragents';

let appState = {
  enabled: false,
  useOnlyForSpecialDomains: false,
  proxyList: [],
  currentProxy: null,
  config: {
    autoReloadTab: true,
  },
  userAgents: userAgents,
  currentUserAgent: navigator.userAgent,
  proxyError: null,
  options: {
    reloadActiveTabOnApplyProxy: true,
  },
  specialDomains: [
    '*.ya.ru|ya.ru',
    '*.yadi.sk|yadi.sk',
    '*.hbogo.com|hbogo.com',
    '*.hbo.com|hbo.com',
    '*.pandora.com|www.pandora.com',
  ],
};

export const getState = () => appState;

export const updateState = newState => {
  if (!newState) {
    return Promise.reject('"newState" param is missing');
  }
  appState = { ...appState, ...newState };
  return saveValue({ state: appState }).then(() => appState);
};

/**
 * Get ext settings from storage
 * @returns {Promise.<Object>} Restored extension state
 */
export const restoreExtState = async () => {
  const { state: restoredState } = await getValue('state');
  console.log('Restored state -> ', appState);
  await updateState({ ...restoredState, proxyError: null });
};
