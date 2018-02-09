// TODO Change extension icon when proxy is active\inactive
/**
 * Map that contains path to ext icons
 * @type {{ON: string, OFF: string}}
 */
const EXT_ICONS = {
  ON: '../assets/icons/icon48.png',
  OFF: '../assets/icons/icon48.png',
};

/**
 * Change browser's extension icon
 * @param ready {Boolean} Main application state
 */
export const changeExtensionIcon = (ready) => {
  const iconPath = ready ? EXT_ICONS.ON : EXT_ICONS.OFF;
  chrome.browserAction.setIcon({
    path: iconPath,
  });
};
