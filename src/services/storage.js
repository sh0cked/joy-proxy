//

/**
 * Storage type "sync" is only supported in CHROME
 * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/sync
 * @type {string}
 */
const STORAGE_TYPE = 'local';

/**
 * Save value to chrome storage
 * @param value  A single key to get, list of keys to get, or a dictionary specifying default values
 * An empty list or object will return an empty result object. Pass in null to get the entire contents of storage.
 * @param storageType {String} Storage type
 * @returns {Promise<Object>}
 */
export const saveValue = (value, storageType = STORAGE_TYPE) =>
  new Promise((resolve, reject) => {
    chrome.storage[storageType].set(value, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });

/**
 * Get value from chrome storage
 * @param value {Object} An object which gives each key/value pair to update storage with.
 * Any other key/value pairs in storage will not be affected.
 * Primitive values such as numbers will serialize as expected. Values with a typeof "object" and "function"
 * will typically serialize to {}, with the exception of Array (serializes as expected),
 * Date, and Regex (serialize using their String representation).
 * @param storageType {String} Storage type
 * @returns {Promise}
 */
export const getValue = (value, storageType = STORAGE_TYPE) =>
  new Promise((resolve, reject) => {
    chrome.storage[storageType].get(value, items => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(items);
    });
  });

/**
 * Removes one or more items from storage.
 * @param value string or array of string keys A single key or a list of keys for items to remove.
 * @param storageType {String} Storage type
 * @returns {Promise}
 */
/* exported removeValue */
export const removeValue = (value, storageType = STORAGE_TYPE) =>
  new Promise((resolve, reject) => {
    chrome.storage[storageType].remove(value, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
