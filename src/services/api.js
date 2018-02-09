/* global FormData */
// TODO Make optional checking proxy country
import axios from 'axios';
import { updateState } from '../state';

axios.defaults.timeout = 2500;

export const getCountryByIp = ip => {
  const data = new FormData();
  data.append('ips', ip);
  return axios
    .post('http://testmyproxies.com/_scripts/showLocations.php', data)
    .then(res => {
      if (!res.data) {
        return 'unk';
      }
      return Object.values(res.data)[0];
    })
    .catch(() => 'unk');
};

export const loadProxyList = () =>
  axios
    .get('https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list')
    .then(res => {
      try {
        const list = res.data
          .split('\n')
          .map(item => {
            try {
              return JSON.parse(`${item}`);
            } catch (err) {
              return null;
            }
          })
          .filter(item => Boolean(item));

        updateState({
          proxyList: list.map(item => ({
            ip: item.host,
            port: item.port,
            country: item.country,
            type: item.type,
          })),
        });
      } catch (err) {
        console.log('err', err);
        return Promise.reject(err);
      }
    });
