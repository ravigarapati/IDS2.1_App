import {View, Text} from 'react-native';
import React from 'react';
import TcpSocket from 'react-native-tcp-socket';
import {Buffer} from 'buffer';

//Functions to TCP Connection

var maskArray = [];
var client;
var schLoc = {};
var answers = {
  answerConnection: false,
  answerInConfig: false,
  answerSchedule: false,
};
var answerIConfig = '';
var answerChedule = '';

const functionOne = () => {};

export const connectTCPPromise = (SSID, Password, scannedData) => {
  return new Promise((resolve, rejected) => {
    //value, message
    client = TcpSocket.createConnection(
      {
        port: 8861,
        host: '192.168.68.1',
      },
      () => {
        // sending data to server
        //client.write('Hi Server');
      },
    );
    //Events
    // socket event for - connection established
    client.on('connect', () => {
      // if (SSID !== '' && SSID !== null) {
      //resolve(connectWIFI(SSID, Password, scannedData));
      setTimeout(function () {
        connectWIFI(SSID, Password, scannedData);
      }, 2000);
      //} else {
      // resolve(true);
      //}
      //client.write(message);
    });

    // socket event for - error occured
    client.on('error', error => {
      rejected(true);
    });

    // socket event for - connection closed
    client.on('close', () => {});

    // socket event for - data received
    client.on('data', data => {
      //client.destroy(); // Close the client socket completely
      var buf = Buffer.from(data);
      // setAnswerBytes('Bytes Array:' + buf.toString(16))
      let hexChar = '';
      for (let i = 0; i < buf.length; i++) {
        const byte = buf[i];
        hexChar += ' ' + byte.toString(16); // convert the decimal `byte` to hex string;
      }
      //9a 4 1 0 0 20
      /* answerConnection : '',
      answerInConfig :'',
      answerSchedule: ''*/

      if (
        hexChar.toString().replace(/\s/g, '') ===
          //'9a 4 1 0 0 20'.toString().replace(/\s/g, '')
          '9a 4 1 0 0 20'.toString().replace(/\s/g, '') ||
        hexChar.toString().replace(/\s/g, '') === '9a410020' ||
        hexChar.toString().replace(/\s/g, '') === '9a411c1e0' ||
        hexChar.toString().replace(/\s/g, '') === '9a 4 1 1 c1 e0'
      ) {
        //answers.answerConnection = '9a 4 1 0 0 20'.toString().replace(/\s/g, '');
        answers.answerConnection = true;
        resolve(true);
      } else if (
        hexChar.toString().replace(/\s/g, '') ===
          //'9a 4 2 0 0 d0'.toString().replace(/\s/g, '')
          '9a 4 2 0 0 d0'.toString().replace(/\s/g, '') ||
        hexChar.toString().replace(/\s/g, '') === '9a4200d0'
      ) {
        //answers.answerInConfig = '9a 4 2 0 0 d0'.toString().replace(/\s/g, '');
        answers.answerInConfig = true;
        if (schLoc.exist) {
          sendSchedule(schLoc.schl);
        }
      } else if (
        hexChar.toString().replace(/\s/g, '') ===
          //'9a 4 4 0 3 70'.toString().replace(/\s/g, '')
          '9a 4 4 0 3 70'.toString().replace(/\s/g, '') ||
        hexChar.toString().replace(/\s/g, '') === '9a440370'
      ) {
        // answers.answerSchedule = '9a 4 4 0 3 70'.toString().replace(/\s/g, '');
        answers.answerSchedule = true;
      } else if (
        hexChar.toString().replace(/\s/g, '') ===
          //'9a 4 4 64 2 9b'.toString().replace(/\s/g, '')
          '9a 4 4 64 2 9b'.toString().replace(/\s/g, '') ||
        hexChar.toString().replace(/\s/g, '') === '9a446429b'
      ) {
        if (schLoc.exist) {
          sendSchedule(schLoc.schl);
          schLoc = {};
        }
      } else {
      }
      // client.destroy(); // Close the client socket completely
    });
  });
};

export const connectTCP = () => {
  //value, message
  client = TcpSocket.createConnection(
    {
      port: 8861,
      host: '192.168.68.1',
    },
    () => {
      // sending data to server
      //client.write('Hi Server');
    },
  );

  //Events
  // socket event for - connection established
  client.on('connect', () => {
    //client.write(message);
  });

  // socket event for - data received
  client.on('data', data => {
    //client.destroy(); // Close the client socket completely
    var buf = Buffer.from(data);
    // setAnswerBytes('Bytes Array:' + buf.toString(16))
    let hexChar = 'Server Answer:';
    for (let i = 0; i < buf.length; i++) {
      const byte = buf[i];
      hexChar += ' ' + byte.toString(16); // convert the decimal `byte` to hex string;
    }
    // client.destroy(); // Close the client socket completely
  });

  // socket event for - error occured
  client.on('error', error => {});

  // socket event for - connection closed
  client.on('close', () => {});

  /*if (value === '1') {
    client.write(message);
  }*/
};

export const messageTCP = msg => {
  setTimeout(() => {
    client.write(msg);
  }, 500);
};

export const closeTCP = () => {
  client.destroy();
};
//Encrypt the each byte with XOR Algorithm
function encryptValues(value1, value2) {
  let result = (parseInt(value1, 16) ^ parseInt(value2, 16))
    .toString(16)
    .padStart(2, '0');
  // .toUpperCase();
  return result;
}

//Encrypt final array with the masked Code
const arrayEncrypt = arraylet => {
  //let maskArray = ['32', '30', '36', '37', '30', '35', '33', '33'];
  let dataContentArray = arraylet.split(' ');

  let indx = 0;
  let inc = true;

  let decodedArray = [];
  let decodedArrayBytes = [];

  dataContentArray.map(data => {
    if (indx < maskArray.length) {
    } else {
      indx = 0;
    }
    let value = encryptValues(data, maskArray[indx]);
    decodedArrayBytes.push('0x' + value);
    decodedArray.push(value.toString(16));
    if (inc) {
      indx++;
    }
  });

  //Return array with the encrypted chain and bytesArrray to calculate CRC16
  return {decodedArray, decodedArrayBytes};
};

const crc16 = buffer => {
  var crc = 0xffff;
  var odd;

  for (var i = 0; i < buffer.length; i++) {
    crc = crc ^ buffer[i];

    for (var j = 0; j < 8; j++) {
      odd = crc & 0x0001;
      crc = crc >> 1;
      if (odd) {
        crc = crc ^ 0xa001;
      }
    }
  }

  return crc;
};

const convertStringtoByte = (str, typ) => {
  var result = '';
  var contI = 0;
  let contTyp = 0;
  for (let i = 0; i < str.length; i++) {
    let hex = str.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-2) + ' ';
    contI = i + 1;
  }

  if (typ === 1) {
    contTyp = 32;
  } else {
    contTyp = 30;
  }

  for (let i = contI + 1; i <= contTyp; i++) {
    if (i === contTyp) {
      result += '00';
    } else {
      result += '00 ';
    }
  }

  return result;
};

const calculateHighLowSize = crcValue => {
  if (crcValue.length === 3) {
    if (parseInt(crcValue.slice(0, 1)) < 10) {
      crcValue = '0' + crcValue;
    }
  }

  let strChain1 = crcValue.slice(0, 2);
  let strChain2 = crcValue.slice(-2);

  let strChainReverse = strChain2 + strChain1;

  return strChainReverse.toString(16);
};

const hexToBytes = hex => {
  var bytes = [];

  for (var c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }

  return bytes;
};

function asciitoHex(ascii) {
  const array = [...ascii];
  let result;
  let hex;
  let arrayHex = [];
  /* array.map(letter => {
    result = letter.charCodeAt(0);
    hex = result.toString(16);
    arrayHex.push('0x' + hex);
  });*/

  array.forEach(letter => {
    result = letter.charCodeAt(0);
    hex = result.toString(16);
    arrayHex.push('0x' + hex);
  });

  return arrayHex;
}

function ConvertStringToHex(str) {
  var arr = [];
  for (var i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i).toString(16).slice(-4);
  }
  return arr;
}

const decimalToHex = (numb, bytes) => {
  let hexStr = numb.toString(16);
  let long = hexStr.toString().length;
  let arrayHex = [];
  //Verify if conversion is odd
  if (long % 2 !== 0) {
    if (long === 1) {
      hexStr = '0' + hexStr.toString();
      arrayHex.unshift(hexStr.toString());
    } else {
      while (long > 0) {
        if (long > 1) {
          arrayHex.unshift(hexStr.toString().slice(-2));
          hexStr = hexStr.replace(hexStr.toString().slice(-2), '');
          long = hexStr.toString().length;
        } else {
          hexStr = '0' + hexStr.toString();
          arrayHex.unshift(hexStr.toString());
          long = 0;
        }
      }
    }
  } else {
    arrayHex.unshift(hexStr.toString());
  }

  let difBytArray = bytes - arrayHex.length;
  if (difBytArray > 0) {
    for (let i = 0; i < difBytArray; i++) {
      arrayHex.unshift('00');
    }
  }

  return arrayHex;
};

/*
let initialConfiguration = {
  type: 2,
  fossilFuel: 0,
  hpEnergized: 0,
  hpEmHeat: 3,
  dualFBSetpoint: 400,
  dualFCOvertime: 45,
  heatStages: 1,
  coolStages: 2,
  humidityConf: 1,
  humidType: 0,
  dehumidType:0,
  hours1224: 0,
  dateTime: {
    anio:23,
    month:5,
    day:17,
    hour:11,
    minute:43,
    second:12,
  } ,
  schedule:0
}*/

export const getInitialConfiguration = (initialConf, sch) => {
  return new Promise(resolve => {
    let arrayDoubleByte = [
      {
        config: 'dualFBSetpoint',
        numBytes: 2,
      },
      {
        config: 'dualFCOvertime',
        numBytes: 2,
      },
      {
        config: 'dateTime',
        numBytes: 6,
      },
    ];
    let hexaValuesChain = '';

    for (const property in initialConf) {
      let prop = `${property}`;
      let val = `${initialConf[property]}`;
      let num = 1;
      if (prop !== 'dateTime') {
        /*arrayDoubleByte.map(nb => {
          if (nb.config.toString() === prop.toString()) {
            num = nb.numBytes;
          }
        });*/
        arrayDoubleByte.forEach(nb => {
          if (nb.config.toString() === prop.toString()) {
            num = nb.numBytes;
          }
        });
        let hxValue = decimalToHex(parseInt(val), num)
          .toString()
          .replace(',', ' ');
        //arrayValues.push(hxValue);
        hexaValuesChain += ' ' + hxValue;
      } else {
        let elementsDT = initialConf.dateTime;
        for (const propertyDT in elementsDT) {
          let propDT = `${propertyDT}`;
          let valDT = `${elementsDT[propertyDT]}`;
          let hxValueDT = decimalToHex(parseInt(valDT), 1)
            .toString()
            .replace(',', ' ');
          hexaValuesChain += ' ' + hxValueDT;
        }
      }
    }
    //return hexaValuesChain
    hexaValuesChain = '02' + hexaValuesChain;
    let decoded = arrayEncrypt(hexaValuesChain);
    //Convert Hex encrypted chain to Byte array to send to calculate the CRC16
    let encryptDecoded = '';
    /* decoded.decodedArray.map(letter => {
      encryptDecoded += ' ' + letter;
    });*/
    decoded.decodedArray.forEach(letter => {
      encryptDecoded += ' ' + letter;
    });

    //calculate CRC16
    let crcValues = crc16(Uint8Array.from(decoded.decodedArrayBytes)).toString(
      16,
    );

    if (crcValues.length === 3) {
      if (parseInt(crcValues.slice(0, 1)) < 10) {
        crcValues = '0' + crcValues;
      }
    }

    //let crcFinal = crcValues.toUpperCase();
    let crcFinal = crcValues;
    crcFinal = calculateHighLowSize(crcFinal);

    //Adding Header to encrypted Chain
    decoded.decodedArray.unshift('18'.toString(16));
    decoded.decodedArray.unshift('9a'.toString(16));

    //Adding in the Last position the CRC16Values
    decoded.decodedArray.push(crcFinal.slice(0, 2).toString(16));
    decoded.decodedArray.push(crcFinal.slice(-2).toString(16));

    a = decoded.decodedArray;
    let b = a.join(''); // turn the array into a string of hex values

    //Converting Hex to Bytes just before send the chain to the device
    let rawHexIC = Buffer.from(b, 'hex');
    // setMessage(rawHex);
    messageTCP(rawHexIC);
    schLoc = sch;
    setTimeout(() => {
      resolve(answers);
    }, 3000);
    /*if(sch.exist){
       // sendSchedule(sch.schl);
        resolve(true)
    }
    else{
        resolve(true)
    }*/
  });
};

export const connectWIFI = (txtSSID, txtPwd, scannedData) => {
  //return new Promise((resolve, rejected) => {
  //First Step Convert SSID and PWD to hex
  let encryptSSID = convertStringtoByte(txtSSID, 1);

  let encryptPwd = convertStringtoByte(txtPwd, 2);

  //Calculating Dynamic MaskedCode

  let scannedDataSecond = scannedData.slice(-8);

  // let arrayConvert = asciitoHex(scannedDataFist);
  let arrayConvert2 = asciitoHex(scannedDataSecond);

  let simpleMaskCode = ConvertStringToHex(scannedDataSecond);

  //maskArray = resultMask;
  maskArray = ConvertStringToHex(scannedDataSecond);

  //Send to Encrypt the Chain

  let decoded = arrayEncrypt('01 ' + encryptSSID + ' ' + encryptPwd);

  //Convert Hex encrypted chain to Byte array to send to calculate the CRC16
  let encryptDecoded = '';
  /* decoded.decodedArray.map(letter => {
    encryptDecoded += ' ' + letter;
  });*/

  decoded.decodedArray.forEach(letter => {
    encryptDecoded += ' ' + letter;
  });

  //calculate CRC16
  let crcValues = crc16(Uint8Array.from(decoded.decodedArrayBytes)).toString(
    16,
  );

  if (crcValues.length === 3) {
    if (parseInt(crcValues.slice(0, 1)) < 10) {
      crcValues = '0' + crcValues;
    }
  }

  //let crcFinal = crcValues.toUpperCase();
  let crcFinal = crcValues;

  //HighLowByte into CRC16Values
  crcFinal = calculateHighLowSize(crcFinal);

  //Adding Header to encrypted Chain
  decoded.decodedArray.unshift('41'.toString(16));
  decoded.decodedArray.unshift('9a'.toString(16));

  //Adding in the Last position the CRC16Values
  decoded.decodedArray.push(crcFinal.slice(0, 2).toString(16));
  decoded.decodedArray.push(crcFinal.slice(-2).toString(16));

  a = decoded.decodedArray;
  const b = a.join(''); // turn the array into a string of hex values

  //Converting Hex to Bytes just before send the chain to the device
  const rawHex = Buffer.from(b, 'hex');
  // setMessage(rawHex);
  messageTCP(rawHex);
  // exitCommand()
  //connectTCP(1, rawHex);
  //});
};

//dispatch Schedule

const longSchedule = {
  iD: 4,
  mode: 1,
  name: 40,
  perCont: 1,
  heat: 2,
  cool: 2,
  time: 2,
};

//Schedule Payload Example
/*const schedule= {
  mode:3,
  scheduleName:'Home',
  schN: [{
  //Monday
  numberProg:4,
  programs: [
  {
  heat:700,
  cool:760,
  time:360
  },
  {
  heat:680,
  cool:780,
  time:480,
  },
  {
  heat:700,
  cool:760,
  time:1020,
  },
  {
  heat:700,
  cool:760,
  time:1320,
  },
  ]
  }
  ,
  {
    //Tuesday
    numberProg:4,
    programs: [
    {
    heat:700,
    cool:760,
    time:360
    },
    {
    heat:680,
    cool:780,
    time:480,
    },
    {
    heat:700,
    cool:760,
    time:1020,
    },
    {
    heat:700,
    cool:760,
    time:1320,
    },
    ]
    },
  //Wednesday
  {
  numberProg:2,
  programs: [
  {
  heat:700,
  cool:720,
  time:360
  },
  {
  heat:600,
  cool:400,
  time:1020,
  },
  ]},
  //Thursday
  {
    numberProg:2,
    programs: [
    {
    heat:700,
    cool:720,
    time:360
    },
    {
    heat:600,
    cool:400,
    time:1020,
    },
    ]},
  //Friday
  {
    numberProg:2,
    programs: [
    {
    heat:700,
    cool:720,
    time:360
    },
    {
    heat:600,
    cool:400,
    time:1020,
    },
    ]},
  //Saturday
  {
    numberProg:2,
    programs: [
    {
    heat:700,
    cool:720,
    time:360
    },
    {
    heat:600,
    cool:400,
    time:1020,
    },
    ]},
  //Sunday
  {
  numberProg:2,
  programs: [
  {
  heat:700,
  cool:720,
  time:360
  },
  {
  heat:600,
  cool:400,
  time:1020,
  },
  ]
  }
  ]
  }   */

const stringToHex = str => {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const hexValue = charCode.toString(16);

    // Pad with zeros to ensure two-digit representation
    hex += hexValue.padStart(2, '0');
  }
  return hex;
};

const fillZero = (str, num) => {
  let dif = num - str.toString().length;
  let newFilledStr = str;
  if (dif > 0) {
    for (let i = 0; i < dif; i++) {
      newFilledStr = newFilledStr + '0';
    }
  } else {
    newFilledStr = str;
  }
  return newFilledStr;
};

const convertSchedule = locSchedule => {
  let strSchedule = '';
  let ID = '',
    mode = '',
    name = '',
    schProgram = '';
  //decimalToHex(2, 4).map(val => (ID += val));
  decimalToHex(2, 4).forEach(val => (ID += val));
  decimalToHex(locSchedule.mode, longSchedule.mode).forEach(
    val => (mode += val),
  );
  name = stringToHex(locSchedule.scheduleName);
  name = fillZero(name, longSchedule.name);
  //let mode = decimalToHex(2,4).map((val)=>{header += val})
  locSchedule.schN.map(sch => {
    //schProgram += 'Sn' + decimalToHex(sch.numberProg,1)
    schProgram += decimalToHex(sch.numberProg, 1);
    sch.programs.map(prg => {
      // schProgram += 'Prg' + decimalToHex(prg.heat,2).toString().replace(',','') + decimalToHex(prg.cool,2).toString().replace(',','') + decimalToHex(prg.time,2).toString().replace(',','')
      schProgram +=
        decimalToHex(prg.heat, 2).toString().replace(',', '') +
        decimalToHex(prg.cool, 2).toString().replace(',', '') +
        decimalToHex(prg.time, 2).toString().replace(',', '');
    });
  });
  let newStr = '';
  strSchedule = '04' + ID + mode + name + schProgram;
  strSchedule = strSchedule.match(/.{1,2}/g) ?? [];
  strSchedule.map(c => (newStr += c + ' '));
  return newStr;
};

export const sendSchedule = schedule => {
  let scheduleChain = convertSchedule(schedule);
  scheduleChain = '04 ' + scheduleChain;
  let decoded = arrayEncrypt(scheduleChain);
  //Convert Hex encrypted chain to Byte array to send to calculate the CRC16
  let encryptDecoded = '';
  /* decoded.decodedArray.map(letter => {
    encryptDecoded += ' ' + letter;
  });*/
  decoded.decodedArray.forEach(letter => {
    encryptDecoded += ' ' + letter;
  });

  //calculate CRC16
  let crcValues = crc16(Uint8Array.from(decoded.decodedArrayBytes)).toString(
    16,
  );

  if (crcValues.length === 3) {
    if (parseInt(crcValues.slice(0, 1)) < 10) {
      crcValues = '0' + crcValues;
    }
  }

  //let crcFinal = crcValues.toUpperCase();
  let crcFinal = crcValues;
  crcFinal = calculateHighLowSize(crcFinal);

  //Adding Header to encrypted Chain
  decoded.decodedArray.unshift('b3'.toString(16));
  decoded.decodedArray.unshift('00'.toString(16));
  decoded.decodedArray.unshift('ff'.toString(16));
  decoded.decodedArray.unshift('9a'.toString(16));

  //Adding in the Last position the CRC16Values
  decoded.decodedArray.push(crcFinal.slice(0, 2).toString(16));
  decoded.decodedArray.push(crcFinal.slice(-2).toString(16));

  let a = decoded.decodedArray;
  let b = a.join(''); // turn the array into a string of hex values

  //Converting Hex to Bytes just before send the chain to the device
  let rawHexSch = Buffer.from(b, 'hex');
  // setMessage(rawHex);
  messageTCP(rawHexSch);
  //exitCommand();
};

//****Exit Command */

export const exitCommand = () => {
  const chainExit = '03 00';
  let decoded = arrayEncrypt(chainExit);

  //calculate CRC16
  let crcValues = crc16(Uint8Array.from(decoded.decodedArrayBytes)).toString(
    16,
  );

  if (crcValues.length === 3) {
    if (parseInt(crcValues.slice(0, 1)) < 10) {
      crcValues = '0' + crcValues;
    }
  }

  //let crcFinal = crcValues.toUpperCase();
  let crcFinal = crcValues;
  crcFinal = calculateHighLowSize(crcFinal);

  decoded.decodedArray.unshift('04'.toString(16));
  decoded.decodedArray.unshift('9a'.toString(16));
  //Adding in the Last position the CRC16Values
  decoded.decodedArray.push(crcFinal.slice(0, 2).toString(16));
  decoded.decodedArray.push(crcFinal.slice(-2).toString(16));

  let a = decoded.decodedArray;
  let b = a.join(''); // turn the array into a string of hex values

  //Converting Hex to Bytes just before send the chain to the device
  let rawHexexCom = Buffer.from(b, 'hex');
  // setMessage(rawHex);
  messageTCP(rawHexexCom);
};

const stringtoCrc16 = str => {
  let strArrayByte = [];
  str = ConvertStringToHex(str);
  str = str.toString(16);

  str = str.split(',');
  str.map(element => {
    strArrayByte.push('0x' + element);
  });

  //let crc16FC= crc16(firstChainByte).toString(16);
  let str16 = crc16(Uint8Array.from(strArrayByte)).toString(16);

  if (str16.length === 3) {
    if (parseInt(str16.slice(0, 1)) < 10) {
      str16 = '0' + str16;
    }
  }
  //HighLowByte into CRC16Values
  str16 = calculateHighLowSize(str16);

  return str16;
};

export const calculatePasswordDevice = scannedNumber => {
  let firstChain = scannedNumber.slice(0, 8);
  let secondChain = scannedNumber.slice(-8);

  let firstCRC16 = stringtoCrc16(firstChain);
  let secondCRC16 = stringtoCrc16(secondChain);

  let crcVal = firstCRC16 + secondCRC16;
  crcVal = stringtoCrc16(crcVal);

  let strPassword = firstCRC16 + secondCRC16 + crcVal;

  return strPassword;
};

export const calculatePasswordDeviceB = scannedNumber => {
  let firstChain = scannedNumber.slice(0, 8);
  let secondChain = scannedNumber.slice(-8);
  let firstChainByte = [];
  let secondChainByte = [];

  firstChain = ConvertStringToHex(firstChain);
  firstChain = firstChain.toString(16);

  secondChain = ConvertStringToHex(secondChain);
  secondChain = secondChain.toString(16);

  firstChain = firstChain.split(',');
  firstChain.map(element => {
    firstChainByte.push('0x' + element);
  });

  secondChain = secondChain.split(',');
  secondChain.map(element => {
    secondChainByte.push('0x' + element);
  });

  //let crc16FC= crc16(firstChainByte).toString(16);
  let crc16FC = crc16(Uint8Array.from(firstChainByte)).toString(16);

  if (crc16FC.length === 3) {
    if (parseInt(crc16FC.slice(0, 1)) < 10) {
      crc16FC = '0' + crc16FC;
    }
  }

  let crc16SC = crc16(Uint8Array.from(secondChainByte)).toString(16);

  if (crc16SC.length === 3) {
    if (parseInt(crc16SC.slice(0, 1)) < 10) {
      crc16SC = '0' + crc16SC;
    }
  }

  //HighLowByte into CRC16Values
  crc16FC = calculateHighLowSize(crc16FC);
  crc16SC = calculateHighLowSize(crc16SC);

  let crcVal = crc16FC + crc16SC;
  /*let crcArrayByte = [];
  const result = crcVal.match(/.{1,2}/g) ?? []; 
  result.map((value)=>{
    crcArrayByte.push('0x' + value)
  });
  crcVal = crc16(Uint8Array.from(crcArrayByte)).toString(16);*/

  let crcValHx = ConvertStringToHex(crcVal);

  let crcValArrayByte = [];
  /*crcValHx.map(valCr => {
    crcValArrayByte.push('0x' + valCr);
  });*/

  crcValHx.forEach(valCr => {
    crcValArrayByte.forEach('0x' + valCr);
  });

  crcVal = crc16(Uint8Array.from(crcValArrayByte)).toString(16);

  if (crcVal.length === 3) {
    if (parseInt(crcVal.slice(0, 1)) < 10) {
      crcVal = '0' + crcVal;
    }
  }

  //HighLowByte into CRC16Values
  crcVal = calculateHighLowSize(crcVal);
  let strPassword = crc16FC + crc16SC + crcVal;

  return strPassword;
};
