const WebSocketClient = require('websocket').client;
const pokemon = require('pokemon-random-name');
const chinese = require("chinese-random-name");
const uuid = require("node-uuid").v4;
const moment = require('moment');
const _ = require('lodash');

const alarmTypes = [
  {
    "code": "10000",
    "label": "越上限报警"
  },
  {
    "code": "10001",
    "label": "越上限复位"
  },
  {
    "code": "10100",
    "label": "越下限报警"
  },
  {
    "code": "10101",
    "label": "越下限复位"
  },
  {
    "code": "10200",
    "label": "开关异常变位"
  },
  {
    "code": "10201",
    "label": "开关正常变位"
  },
  {
    "code": "10300",
    "label": "通讯中断"
  },
  {
    "code": "10301",
    "label": "通讯恢复"
  }
];

const randomName = (maxLength, factor = 0.8) => {
  let name = '';
  for (let index = 0; index < maxLength; index++) {
    name += chinese.names.get3();
    if (Math.random() > factor / 2) {
      name += pokemon();
    }
    if (Math.random() > factor) {
      break;
    }
  }
  return name;
};
const generateLog = (quentity) => {
  let timeInterval = 1;
  const logList = [];
  for (let index = 0; index < quentity; index++) {
    logList.push({
      code: 0,
      type: "Alarm",
      companyId: 8, // 客户单位ID
      districtId: 13,  // 厂区ID
      siteId: 18,      // 变电站ID
      gatewayId: 19,   // 网关ID
      cabinetId: 73, // 设备所处机柜的全局唯一ID
      deviceId: 70,  // 设备的全局唯一ID

      alarmCode: _.sample(alarmTypes).code, // 警告编号
      timestamp: moment(Date.now()).add(++timeInterval, 'seconds').format('YYYY-MM-DD HH:mm:ss'), // 警告时间
      message: pokemon() + randomName(50),
    })
  }
  for (let index = 0; index < quentity; index++) {
    logList.push({
      code: 0,
      type: "Alarm",
      companyId: 8, // 客户单位ID
      districtId: 15,  // 厂区ID
      siteId: 20,      // 变电站ID
      gatewayId: 21,   // 网关ID
      cabinetId: 75, // 设备所处机柜的全局唯一ID
      deviceId: 77,  // 设备的全局唯一ID

      alarmCode: _.sample(alarmTypes).code, // 警告编号
      timestamp: moment(Date.now()).add(++timeInterval, 'seconds').format('YYYY-MM-DD HH:mm:ss'), // 警告时间
      message: pokemon() + randomName(50),
    })
  }
  return logList;
}

const client = new WebSocketClient();

client.on('connectFailed', function (error) {
  console.log('Connect Error: ' + error.toString());
});


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


  if (connection.connected) {
    generateLog(10).map(alarmItem => {
      console.log('adding:');
      console.dir(alarmItem);
      connection.sendUTF(JSON.stringify(alarmItem));
    })
    connection.close();
  }
});

client.connect('ws://power51app.grootapp.com:81/', 'echo-protocol');
// client.connect('ws://192.168.31.151:2333/', 'echo-protocol');
