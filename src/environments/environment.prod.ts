import { SocketIoConfig } from 'ngx-socket-io';

// The list of file replacements can be found in `angular.json`.
const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

export const environment = {
  production: true,
  socketConfig: config
};
