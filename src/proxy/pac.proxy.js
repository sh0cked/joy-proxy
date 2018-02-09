export const generatePacScript = (specialDomains, proxy) => {
  if (!specialDomains || !specialDomains.length) {
    return;
  }
  const condition = specialDomains.reduce((acc, item, idx) => {
    acc += `shExpMatch(host,'${item}')`;
    if (idx !== specialDomains.length - 1) {
      acc += ' || ';
    }
    return acc;
  }, '');

  return `
    function FindProxyForURL(url, host) {
      if ((host == 'localhost') || (shExpMatch(host, 'localhost.*')) || (shExpMatch(host, '*.local')) || (host == '127.0.0.1')) {
        return 'DIRECT';
      }
      if (shExpMatch(host, '/^\\d+\\.\\d+\\.\\d+\\.\\d+$/g')) {
        if (isInNet(host, '10.0.0.0', '255.0.0.0') || isInNet(host, '192.168.0.0', '255.255.0.0')) {
          return 'DIRECT';
        }
      }
      if (${condition}){
        return 'PROXY ${proxy.ip}:${proxy.port}';
      }
      return 'DIRECT';
    }
  `;
};
