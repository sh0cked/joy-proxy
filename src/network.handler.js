let currentUserAgent = navigator.userAgent;

const onBeforeSendHeadersListener = (details) => {
  const { requestHeaders: headers } = details;
  const blockingResponse = {};
  headers.forEach((header) => {
    if (header.name === 'User-Agent') {
      header.value = currentUserAgent;
    }
  });
  blockingResponse.requestHeaders = headers;
  return blockingResponse;
};

export const changeUserAgent = (userAgent) => {
  currentUserAgent = userAgent;
  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeadersListener,
    { urls: ['<all_urls>'] },
    ['requestHeaders', 'blocking'],
  );
};

export const resetUserAgent = () => {
  currentUserAgent = navigator.userAgent;
  chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeadersListener);
};
