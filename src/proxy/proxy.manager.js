import { isProxyValid, showNofitication } from '../utils';
import { getCountryByIp } from '../services/api';
import { updateState, getState } from '../state';
import { generatePacScript } from './pac.proxy';
import { changeExtensionIcon } from '../ui';

export const applyProxy = proxy =>
  new Promise((resolve, reject) => {
    const state = getState();
    if (
      state.specialDomains &&
      state.specialDomains.length &&
      state.options.reloadActiveTabOnApplyProxy
    ) {
      const config = {
        mode: 'pac_script',
        pacScript: {
          data: generatePacScript(state.specialDomains, proxy),
        },
      };
      chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
        if (chrome.runtime.lastError) {
          console.log(
            `Error occur on apply proxy, ${chrome.runtime.lastError}`
          );
          reject(chrome.runtime.lastError);
        }
        resolve();
      });
    } else {
      applyFixedProxy(proxy).then(resolve);
    }
  });

export const applyFixedProxy = (proxy, options = {}) =>
  new Promise((resolve, reject) => {
    const { ip, port } = proxy;
    const config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          host: ip,
          port: Number(port),
        },
      },
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });

/**
 * Reset proxy setting to system
 */
export const resetProxy = () =>
  new Promise((resolve, reject) => {
    chrome.proxy.settings.set(
      { value: { mode: 'system' }, scope: 'regular' },
      () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve();
      }
    );
  });

export const readCurrentProxyConfig = () =>
  new Promise((resolve, reject) => {
    chrome.proxy.settings.get({ incognito: false }, config => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(config);
    });
  });

export const initialHandleProxyConfig = async () => {
  const proxyConfig = await readCurrentProxyConfig();
  const { levelOfControl, value = {} } = proxyConfig;
  if (levelOfControl !== 'controlled_by_this_extension') {
    // TODO Re-take control over proxy settings in chrome?
    console.warn(
      "Extension doesn't have control over proxy settings in browser!"
    );
    return;
  }
  if (value.mode === 'system') {
    await updateState({
      currentProxy: null,
      enabled: false,
    });
    changeExtensionIcon(false);
    return;
  }
  if (value.mode === 'pac_script') {
    const pacscript = value.pacScript.data;
    if (!pacscript) {
      return;
    }
    const PROXY_REGEXP = /PROXY\s(\S.*)(?=';)/;
    const res = PROXY_REGEXP.exec(pacscript);
    if (res && res[1]) {
      const [ip, port] = res[1].split(':');
      if (isProxyValid({ ip, port })) {
        const country = await getProxyCountry({ ip, port });
        updateState({
          currentProxy: {
            ip,
            port,
            country,
          },
          enabled: true,
        });
        changeExtensionIcon(true);
      }
    }
  }
  const { rules } = value;
  if (!rules || !rules.singleProxy) {
    return;
  }
  const { host: ip, port } = rules.singleProxy;
  const country = await getProxyCountry({ ip, port });
  updateState({
    currentProxy: {
      ip,
      port,
      country,
    },
    enabled: true,
  });
  changeExtensionIcon(true);
};
/**
 * Reset proxy when Chrome emits proxy error
 */
export const setProxyErrorHandler = () => {
  chrome.proxy.onProxyError.addListener(details => {
    console.log('Error with proxy  , ', details);
    showNofitication({ title: 'Proxy error', message: details.error });
    updateState({ proxyError: details.error }).then(state =>
      chrome.runtime.sendMessage({
        action: 'UPDATE_POPUP_STATE',
        payload: state,
      })
    );
  });
};

async function getProxyCountry({ ip, port }) {
  let country;
  const { proxyList } = getState();
  if (proxyList && proxyList.length) {
    const activeProxy = proxyList.find(
      item => item.ip === ip && item.port === port
    );
    if (activeProxy) {
      country = activeProxy.country;
    }
  }
  if (!country) {
    country = await getCountryByIp(ip);
  }
  return country;
}
