// Fetch proxy country by ip and dd proxy to proxyList
import {
  applyProxy as applyProxyInChrome,
  resetProxy as chromeResetProxy,
} from './proxy/proxy.manager';
import { getCountryByIp } from './services/api';
import {
  changeUserAgent,
  resetUserAgent as resetChromeUserAgent,
} from './network.handler';
import { updateState, getState } from './state';
import { reloadActiveTab } from './utils';
import { changeExtensionIcon } from './ui';

export const addProxy = async (proxy) => {
  const { proxyList } = getState();
  proxy.country = await getCountryByIp(proxy.ip);
  return await updateState({ proxyList: [proxy, ...proxyList] });
};

// Remove proxy from list
export const removeProxy = async (proxy) => {
  const { proxyList } = getState();
  const newProxyList = proxyList.filter(item => item.ip !== proxy.ip);
  return await updateState({ proxyList: newProxyList });
};

// Set chrome proxy and return updated state
export const applyProxy = async (proxy) => {
  const state = getState();
  try {
    await applyProxyInChrome(proxy);
    if (state.options.reloadActiveTabOnApplyProxy) {
      reloadActiveTab();
    }
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
  changeExtensionIcon(true);
  return await updateState({
    enabled: true,
    currentProxy: proxy,
    proxyError: null,
  });
};

// Reset chrome proxy
export const resetProxy = async () => {
  await chromeResetProxy();
  changeExtensionIcon(false);
  return await updateState({
    enabled: false,
    proxyError: null,
  });
};

export const addSpecialDomain = async (domain) => {
  const { specialDomains } = getState();
  if (specialDomains.find(item => item.includes(domain))) {
    return;
  }
  const state = await updateState({
    specialDomains: [`*.${domain}|${domain}`, ...specialDomains],
  });
  if (state.enabled && state.currentProxy) {
    await resetProxy();
    await applyProxy(state.currentProxy);
  }
  return state;
};

export const removeSpecialDomain = async (domain) => {
  const { specialDomains } = getState();
  if (!specialDomains || !specialDomains.length) {
    return;
  }
  const idx = specialDomains.findIndex(item => item.includes(domain));
  if (idx !== -1) {
    specialDomains.splice(idx, 1);
  }
  const state = getState();
  if (state.enabled && state.currentProxy) {
    await resetProxy();
    await applyProxy(state.currentProxy);
  }
  return updateState({
    specialDomains,
  });
};

export const clearAllProxies = () =>
  updateState({
    proxyList: [],
  });

export const addUserAgent = (useragent) => {
  const state = getState();
  return updateState({
    userAgents: [useragent, ...state.userAgents],
  });
};

export const removeUserAgent = (useragent) => {
  const state = getState();
  const idx = state.userAgents.findIndex(ua => ua.value === useragent.value);
  if (idx === -1) {
    return Promise.resolve(state);
  }
  state.userAgents.splice(idx, 1);
  return updateState({
    userAgents: state.userAgents,
  });
};

export const applyUserAgent = (userAgent) => {
  changeUserAgent(userAgent);
  return updateState({
    currentUserAgent: userAgent,
  });
};

export const resetUserAgent = () => {
  resetChromeUserAgent();
  return updateState({
    currentUserAgent: navigator.userAgent,
  });
};

export const triggerUsingCustomDomains = async (value) => {
  const state = getState();
  const wasEnabled = getState().enabled;
  await resetProxy();
  await updateState({
    options: {
      ...state.options,
      reloadActiveTabOnApplyProxy: Boolean(value)
    }
  });
  if (getState().currentProxy && wasEnabled) {
    return applyProxy(state.currentProxy);
  }
  return getState();
};
