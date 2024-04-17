import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {CustomText, Button, CustomInputText, CodeScanner} from '../components';
import React, {useEffect, useState} from 'react';
//import wifi from 'react-native-android-wifi';
import TcpSocket from 'react-native-tcp-socket';
import {Buffer} from 'buffer';
import {ScrollView} from 'react-native-gesture-handler';
import {scanButton} from '../utils/ScanPermissions';
import {
  connectWifi,
  getInitConf,
  connectTCPAction,
  setSchedule,
  exitCom,
  calculateDevicePassword,
} from '../store/actions/HomeOwnerActions';
//import Schedule from './UnitConfiguration/Schedule';

const SocketTest = () => {
  const [txtSSID, setTxtSSID] = useState('');
  const [txtPwd, setTxtPWD] = useState('');
  const [SSIDPWD, setSSIDPWD] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [beforeSSIDPWD, setBeforeSSIDPWD] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const [connectMesagges, setConnectMessages] = useState('');
  const [SSIDMessage, setSSIDMessage] = useState('');
  const [PwdMessage, setPwdMessage] = useState('');
  const [crc16Val, setCrc16Val] = useState('');

  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [encryptedMessageBefore, setEncryptedMessageBefore] = useState('');
  const [statusSendMessage, setstatusSendMessage] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [logMaskedCode, setLogMaskedCode] = useState();
  const [disabledSendMessageButton, setDisabledSendMessageButton] =
    useState(false);
  const [message, setMessage] = useState(null);
  const [answerBytes, setAnswerBytes] = useState();

  var messageHex;
  var maskArray = [];

  const sendMessage = () => {
    connectWifi(txtSSID, txtPwd, scannedData);
  };

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
    dehumidType: 0,
    hours1224: 0,
    dateTime: {
      anio: 23,
      month: 5,
      day: 17,
      hour: 11,
      minute: 43,
      second: 12,
    },
    schedule: 0,
  };

  /* const schedulePL = {
      mode: 3,
      scheduleName: 'New Schedule',
      schN: [
        {
          //Monday
          numberProg: 4,
          programs: [
            {
              heat: 700,
              cool: 760,
              time: 360,
            },
            {
              heat: 680,
              cool: 780,
              time: 480,
            },
            {
              heat: 700,
              cool: 760,
              time: 1020,
            },
            {
              heat: 700,
              cool: 760,
              time: 1320,
            },
          ],
        },
        {
          //Tuesday
          numberProg: 4,
          programs: [
            {
              heat: 700,
              cool: 760,
              time: 360,
            },
            {
              heat: 680,
              cool: 780,
              time: 480,
            },
            {
              heat: 700,
              cool: 760,
              time: 1020,
            },
            {
              heat: 700,
              cool: 760,
              time: 1320,
            },
          ],
        },
        //Wednesday
        {
          numberProg: 2,
          programs: [
            {
              heat: 700,
              cool: 720,
              time: 360,
            },
            {
              heat: 600,
              cool: 400,
              time: 1020,
            },
          ],
        },
        //Thursday
        {
          numberProg: 2,
          programs: [
            {
              heat: 700,
              cool: 720,
              time: 360,
            },
            {
              heat: 600,
              cool: 400,
              time: 1020,
            },
          ],
        },
        //Friday
        {
          numberProg: 2,
          programs: [
            {
              heat: 700,
              cool: 720,
              time: 360,
            },
            {
              heat: 600,
              cool: 400,
              time: 1020,
            },
          ],
        },
        //Saturday
        {
          numberProg: 2,
          programs: [
            {
              heat: 700,
              cool: 720,
              time: 360,
            },
            {
              heat: 600,
              cool: 400,
              time: 1020,
            },
          ],
        },
        //Sunday
        {
          numberProg: 2,
          programs: [
            {
              heat: 700,
              cool: 720,
              time: 360,
            },
            {
              heat: 600,
              cool: 400,
              time: 1020,
            },
          ],
        },
      ],
    };*/

  const schedulePL = {
    scheduleName: 'Home',
    mode: 3,
    schN: [
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
      {
        numberProg: 2,
        programs: [
          {heat: 780, cool: 700, time: 0},
          {heat: 780, cool: 700, time: 0},
        ],
      },
    ],
  };

  const connect = () => {
    //connectTCPAction();
    connectTCPAction(txtSSID, txtPwd, scannedData, demo);
  };

  const exit = () => {
    exitCom();
  };

  const demo = () => {};
  const sendInitialConf = iniCon => {
    getInitConf(iniCon, schedulePL, demo);
  };

  const sendSchedule = sched => {
    setSchedule(sched);
  };

  useEffect(() => {
    //requestLocationPermission();
    setTxtSSID('INFINITUMBFC3_2.4');
    setTxtPWD('daWJPV7mAQ');
    //setTxtSSID('zbsmart_vine');
    //setTxtPWD('12356789');
  }, []);

  useEffect(() => {
    if (scannedData) {
      setDevicePassword(() => calculateDevicePassword(scannedData));
      //98d863d2416a_07972612
    }
  }, [scannedData]);

  return (
    <View>
      {!showScanner ? (
        <View>
          <View>
            <TextInput
              style={styles.inputText}
              placeholder="SSID"
              onChangeText={texto => setTxtSSID(texto)}
              value={txtSSID}
            />
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              onChangeText={pwd => setTxtPWD(pwd)}
              value={txtPwd}
            />
          </View>
          <Pressable onPress={() => scanButton(setShowScanner)}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>Scan QR2</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => scanButton(setShowScanner)}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>getPassword</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => scanButton(connect())}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>ConnectTCP</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              sendMessage();
            }}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>
                Send Message to TCP Server HLByte
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              sendInitialConf(initialConfiguration);
            }}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>
                Send Message Initial Configuration
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              sendSchedule(schedulePL);
            }}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>Send Message Schedule</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              exit();
            }}>
            <View style={styles.buttonsStyle}>
              <Text style={styles.textButton}>Exit Command</Text>
            </View>
          </Pressable>
          {statusSendMessage != '' ? (
            <View>
              <Text style={{fontWeight: 'bold'}}>{statusSendMessage}</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View>
          <CodeScanner data={setScannedData} onClose={setShowScanner} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#330066',
    marginBottom: 20,
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  inputText: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'grey',
    padding: 10,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  scrollViewStyle: {
    height: 159,
  },
});

export default SocketTest;
