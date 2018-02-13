import WebFont from 'webfontloader';
import axios from 'axios';
import parse from 'user-agent-parser';

axios.defaults.timeout = 3000;

const IP_REGEXP = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

/**
 * Validate proxy obj for correct ip\port
 * Example of valid proxy : 123.32.54.66:3128
 * @param proxy {Object} Proxy object
 * @returns {boolean} Result
 */
export const isProxyValid = ({ ip, port } = {}) => {
  if (!ip || !port) {
    return false;
  }
  if (isNaN(port)) {
    return false;
  }
  if (!IP_REGEXP.test(ip)) {
    return false;
  }
  if (Number(port) <= 0 || Number(port) >= 65535) {
    return false;
  }
  return true;
};

/**
 * Run callback function when document will be loaded
 * @param callback {Function}
 */
export const runOnDOMReady = callback => {
  if (document.readyState === 'complete' || document.readyState === 'loaded') {
    callback();
    return;
  }
  document.addEventListener('DOMContentLoaded', callback);
};
/**
 * Get current active browser's tab
 * @returns {Promise}
 */
export const reloadActiveTab = () =>
  new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, arrayOfTabs => {
      const activeTab = arrayOfTabs[0];
      if (activeTab) {
        if (activeTab.url && activeTab.url.includes('chrome://')) {
          return;
        }
        chrome.tabs.reload(activeTab.id);
        resolve();
      } else {
        reject();
      }
    });
  });

export const showNofitication = ({ title, message }) => {
  chrome.notifications.create(
    'proxyNotify',
    {
      type: 'basic',
      iconUrl: 'assets/icons/icon128.png',
      title,
      message,
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn(chrome.runtime.lastError);
      }
    }
  );
};

export const loadFonts = () => {
  WebFont.load({
    google: {
      families: ['Roboto', 'Gloria Hallelujah'],
    },
  });
};

export const checkForInternetConnection = () =>
  axios
    .head(`https://google.com?random=${Math.random()}`)
    .then(res => ({
      isOnline: res.status === 200,
    }))
    .catch(() => ({
      isOnline: false,
    }));

export const parseUserAgent = userAgent => {
  const res = parse(userAgent);
  return `${res.browser.name} ${res.browser.major} / ${res.os.name}`;
};
