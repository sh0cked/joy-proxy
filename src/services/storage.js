const STORAGE_TYPE = 'local';

export const saveValue = (value, storageType = STORAGE_TYPE) =>
  new Promise((resolve, reject) => {
    chrome.storage[storageType].set(value, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });

export const getValue = (value, storageType = STORAGE_TYPE) =>
  new Promise((resolve, reject) => {
    chrome.storage[storageType].get(value, items => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });

export const removeValue = (value, storageType = STORAGE_TYPE) =>
  new Promise((resolve, reject) => {
    chrome.storage[storageType].remove(value, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
