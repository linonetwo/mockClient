var WebSocketClient = require('websocket').client;
var moment = require('moment');

var client = new WebSocketClient();

client.on('connectFailed', function (error) {
  console.log('Connect Error: ' + error.toString());
});

function getRandomValue(max = 1000, min = 200) {
  return String(Math.floor(Math.random() * max) + min);
}

function fiftyTwo() {
  const indicatorData = [];
  for (let i = 1; i <= 52; i++) {
    if (i === 18) {
      indicatorData.push({ id: i, value: Math.random() });
      continue;
    }
    if (i === 52) {
      indicatorData.push({ id: i, value: Math.random() > 0.95 ? 0 : 1 });
      continue;
    }
    indicatorData.push({ id: i, value: getRandomValue() })
  }
  return indicatorData;
}

function getToSendMessage() {
  return {
    code: 0,
    message: "This is a message",
    type: "Data",
    gatewayId: 14,
    siteId: 12,
    districtId: 8,
    companyId: 4,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    data: [
      {
        deviceId: 37, // 设备的全局唯一ID，随配置文件下发
        cabinetId: 50, //设备所处机柜的全局唯一ID，随配置文件下发
        indicatorData: fiftyTwo(),
      },
      {
        deviceId: 46, // 设备的全局唯一ID，随配置文件下发
        cabinetId: 50, //设备所处机柜的全局唯一ID，随配置文件下发
        indicatorData: fiftyTwo(),
      },
      {
        deviceId: 51, // 设备的全局唯一ID，随配置文件下发
        cabinetId: 50, //设备所处机柜的全局唯一ID，随配置文件下发
        indicatorData: fiftyTwo(),
      }
    ]
  };
};
client.on('connect', function (connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function (error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function () {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });

  function sendRealData() {
    if (connection.connected) {
      const dataThisTime = getToSendMessage();
      console.log('sending')
      console.log(dataThisTime);
      connection.sendUTF(
        JSON.stringify(dataThisTime)
      );
      connection.close();
    }
  }

  sendRealData();

});

// http://groot.nanchao.org:8081/
// client.connect('ws://power51app.grootapp.com:81/', 'echo-protocol');
// const link = () => client.connect('ws://192.168.31.151:2333/', 'echo-protocol');
const link = () => client.connect('ws://power51app.grootapp.com:81/', 'echo-protocol');
const interval = 55;
console.log('start sending message in interval ' + interval);
setInterval(link, interval * 1000);
// client.connect('ws://localhost:2333/', 'echo-protocol');
