import React, {useEffect, useState} from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {WebView} from 'react-native-webview';

import {Icons} from '../utils/icons';
import {BoschIcon} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import moment from 'moment';
import {
  liveData,
  model18M,
  reservedModbusAddress,
  Enum,
  runningModeModbusAddress,
} from '../utils/enum';
import {useSelector, useDispatch} from 'react-redux';
import {requestStoragePermission} from '../utils/BleCommunicator';
import * as ContractorActions from '../store/actions/ContractorActions';
import {showToast} from '../components/CustomToast';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function Email(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    createPDF();
  }, []);
  const [htmlContent, setHtmlContent] = useState('');
  const [email, setEmail] = useState('');
  const datapoints = Enum.liveCheckPoint.slice(0, 25);
  const datapointsFault = Enum.liveCheckPoint.slice(23);
  //datapointsFault.slice(1, 1);
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const bleData = useSelector(state => state.contractor.selectedUnit.liveData);
  const savedValues = useSelector(
    state => state.contractor.selectedUnit.checkpointValue,
  );
  const savedTime = useSelector(state =>
    moment(state.contractor.selectedUnit.checkPointSavedOn).format(
      'dddd, MMMM Do YYYY, hh:mm:ss A',
    ),
  );

  const onValidateEmail = async () => {
    if (email && email != '') {
      const reg =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      const emailList = email.split(/[ ;]+/);

      let count = 0;
      emailList.forEach(element => {
        if (element.length > 0) {
          if (element.match(reg)) {
            count++;

            if (count === emailList.length) {
              const Buffer = require('buffer').Buffer;
              let encodedContent = new Buffer(htmlContent).toString('base64');
              let input = {
                gatewayId: selectedUnit.gateway.gatewayId,
                emailContent: encodedContent,
                toEmail: emailList,
              };
              dispatch(ContractorActions.liveCheckPointEmail(input));
              props.navigation.goBack();
            }
          } else {
            showToast('Enter Valid Email', 'error');
          }
        }
      });
    } else {
      showToast('Enter the Email', 'error');
    }
  };

  async function downloadPDF() {
    if (Platform.OS === 'android') {
      const permission = await requestStoragePermission();
      if (!permission) {
        showToast(
          Dictionary.bleCommunicator.externalStoragePermissionDenied,
          'info',
        );
        return;
      }
    }
    const content = await createPDF();
    if (content) {
      let dateNow = moment(new Date()).format('dddd_MM_DD_YY_h_mm_ss_a');
      let options = {
        html: content,
        fileName: dateNow,
        directory: 'Documents',
      };
      try {
        let file = await RNHTMLtoPDF.convert(options);

        showToast(Dictionary.liveCheckpoint.downloadPDF);
      } catch (e) {}
    }
  }

  function createPDF() {
    const listItem = Enum.liveCheckPoint.slice(0, 25);
    let borderStyle = 'border: 1px solid black;padding:5px';
    let withTextColor = 'padding:5px;color:red;';
    let borderStyleUnitInfo =
      'border: 1px solid black;padding:5px;font-size:16px;';
    // Improvement pending - Get image from assets and transform to basea64 instead of what's below here
    let boschImage =
      'data:image/png;base64,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';

    let header1 = 'margin-bottom:5px;font-size:33px;';
    let header2 = 'font-size:20px;margin-bottom:5px';
    let header3 = 'margin-bottom:5px;font-size:23px;';
    let td = 'border: 1px solid white;padding:10px;';
    let th =
      'background-color:black; border: 1px solid white;color:white;padding:10px;text-align: center;';
    let tr = 'background-color: #edeeef';

    let container = 'margin:0 auto;width:98%;padding:2px;';
    let width80 = 'width:80%;float:left;';
    let width20 = 'width:20%;float:left;';
    let column = 'float: left;';
    let row = 'after {content: "";display: table;clear: both}';
    let html =
      '<style>* {margin:0; padding:0;}header {width:100%;float:left;}h2{font-size:30px;margin-bottom:5px}h1{margin-bottom:5px;font-size:53px;}h3{margin-bottom:5px;font-size:43px;}table,td{border: 1px solid white;padding:10px;} th{background-color:black; border: 1px solid white;color:white;padding:10px;} tr:nth-child(even) {background-color: #edeeef; }tr:nth-child(odd) {background-color: #dfe1e3;}.container {margin:0 auto;width:98%;padding:2px;}.width80 {width:65%;float:left;}.width20 {width:35%;float:left;}.column {float: left;width:50%;}.row:after {content: "";display: table;clear: both}		</style>' +
      '<div style="' +
      container +
      '"><header><div class="width80" style="margin-bottom:30px;padding-top:15px;"><h1 style="' +
      header1 +
      '">Bosch Easy Air App</h1>' +
      '<div style="font-size:20px;margin-bottom:5px">' +
      '<h2 style="' +
      header2 +
      '">Live Check Point Values</h2>' +
      '</div>' +
      '<p style="font-size:13px;">' +
      savedTime +
      '</p></div><div  class="width20"><img src="' +
      boschImage +
      '" width="240"/> </div></header>';
    html +=
      '<div style="font-size:16px;margin-bottom:5px">' +
      '</div><table cellspacing="1" cellpadding="1" style="border: 1px solid black;border-collapse: collapse;">';

    let serialNumber = '';
    let modelNumber = '';
    let partNumber = '';
    let installedDate = '';
    if (selectedUnit && selectedUnit.odu) {
      if (selectedUnit.odu.serialNumber) {
        serialNumber = selectedUnit.odu.serialNumber;
      }

      if (selectedUnit.odu.modelNumber) {
        modelNumber = selectedUnit.odu.modelNumber;
      }
      if (selectedUnit.odu.modelNumber) {
        partNumber = serialNumber.substr(serialNumber.length - 10);
      }
    }
    if (selectedUnit && selectedUnit.odu && selectedUnit.odu.serviceStartDate) {
      installedDate = moment(selectedUnit.odu.serviceStartDate).format(
        'MM/DD/YYYY',
      );
    }

    html += '<th colspan="2"  style="' + th + '">UNIT INFORMATION</th>';
    html += '<tr style="' + tr + '">';
    html += '<td style="' + td + '">' + 'ODU Model Number' + ' </td>';
    html += '<td style="' + td + '">' + modelNumber + ' </td>';
    html += '</tr>';
    html += '<tr style="' + tr + '">';
    html += '<td style="' + td + '">' + 'ODU Serial Number' + ' </td>';
    html += '<td style="' + td + '">' + serialNumber + ' </td>';
    html += '</tr>';

    html += '<tr style="' + tr + '">';
    html += '<td style="' + td + '">' + 'ODU Part Number' + ' </td>';
    html += '<td style="' + td + '">' + partNumber + ' </td>';
    html += '</tr>';

    html += '<tr style="' + tr + '">';
    html += '<td style="' + td + '">' + 'Service Start Date' + ' </td>';
    html += '<td style="' + td + '">' + installedDate + ' </td>';
    html += '</tr>';

    html += '</table>';
    html +=
      '<p style="margin-top:10px">Disclaimer: Service start date shown here does not void warranty requirement for proof of installation.</p></div>';
    html += '<div style="font-size:16px;margin-bottom:50px">' + '</div>';

    html += '<div class="row">';
    html +=
      ' <div class="column"><table cellspacing="1" cellpadding="1" style="border: 1px solid black;border-collapse: collapse;">';
    html += '<tr style="' + tr + '">';
    html += '<th style="' + th + '">' + Dictionary.liveCheckpoint.no + ' </th>';
    html +=
      '<th style="' +
      th +
      '">' +
      Dictionary.liveCheckpoint.description +
      ' </th>';
    html +=
      '<th style="' + th + '">' + Dictionary.liveCheckpoint.value + ' </th>';
    html += '</tr>';
    for (let p = 0; p < listItem.length; p++) {
      html += '<tr style="' + tr + '">';
      html += '<td style="' + td + '">' + p + '</td>';
      html +=
        '<td style="' +
        td +
        '">' +
        Dictionary.liveCheckpoint.text[listItem[p]] +
        '</td>';
      let value = '';
      //  if (savedValues && savedValues[listItem[p]]) {
      value = savedValues[listItem[p]];
      if (listItem[p] === runningModeModbusAddress) {
        value = liveData.unitMode.noMode[value];
      } else {
        value = value + ' ' + Dictionary.liveCheckpoint.unit[listItem[p]];
      }
      //  }
      html += '<td style="' + td + '">' + value + '</td>';
      html += '</tr>';
    }
    html += '</table></div>';
    html +=
      ' <div class="column"><table cellspacing="1" cellpadding="1" style="border: 1px solid black;border-collapse: collapse;">';

    html += '</table></div></div>';

    html += '<div style="font-size:16px;margin-bottom:50px">' + '</div>';

    html += '<div class="row" ><div class="column">';

    if (datapointsFault && datapointsFault.length > 0) {
      html +=
        '<table cellspacing="1" cellpadding="1" style="border: 1px solid black;border-collapse: collapse;"">';
      html += '<tr style="' + tr + '">';
      html += '<th style="' + th + '">' + 'NO' + ' </th>';
      html += '<th style="' + th + '">' + 'DESCRIPTION' + ' </th>';
      html += '<th style="' + th + '">' + 'VALUE' + ' </th>';
      html += '</tr>';
      let index = 1;
      for (let p = 0; p < datapointsFault.length; p++) {
        if (
          Dictionary.liveCheckpoint.text[datapointsFault[p]] !==
          'Software Version'
        ) {
          html += '<tr style="' + tr + '">';
          html += '<td style="' + td + '">' + index + '</td>';
          index = index + 1;
          html +=
            '<td style="' +
            td +
            '">' +
            Dictionary.liveCheckpoint.text[datapointsFault[p]] +
            '</td>';

          let modbusValue = '';
          let data = datapointsFault[p];
          if (
            model18M.includes(selectedUnit.odu.modelNumber) &&
            reservedModbusAddress.includes(data)
          ) {
            text = Dictionary.liveCheckpoint.reserved;
            modbusValue = '-';
          } else {
            text = Dictionary.liveCheckpoint.text[data];
            let valueMap = bleData[data];
            if (data === runningModeModbusAddress) {
              modbusValue = liveData.unitMode.noMode[valueMap];
            } else {
              if (data === 30029) {
                valueMap !== undefined && parseFloat(valueMap) > 100
                  ? (modbusValue =
                      parseInt(valueMap, 10).toString() +
                      ' ' +
                      Dictionary.liveCheckpoint.unit[data])
                  : (modbusValue =
                      (
                        Math.round(parseFloat(valueMap) * 100) / 100
                      ).toString() +
                      ' ' +
                      Dictionary.liveCheckpoint.unit[data]);
              } else {
                modbusValue =
                  valueMap !== undefined
                    ? valueMap + ' ' + Dictionary.liveCheckpoint.unit[data]
                    : '';
              }
            }
          }

          html += '<td style="' + td + '">' + modbusValue + '</td>';

          html += '</tr>';
        }
      }
      html += '</table>';
    } else {
      html +=
        '<div style="' +
        withTextColor +
        '">' +
        '<h3 style="' +
        header3 +
        '">No fault code history to report.</h3>' +
        '</div>';
    }
    html += '</div>';

    html +=
      '<div style="' +
      column +
      '"><h2>Before Everything,There\'s Bosch.</h2><p  style="font-size:15px;"> Simple. Reliable. Innovative.</p> <p  style="font-size:15px;">Connected & Innovative Comfort Solutions</p><p style=" font-weight: bold;font-size:15px;">BoschHeatingAndCooling.com</p></div>';
    html += '<div style="height:250px;margin-bottom:50px"></div>';
    html += '</div>';

    setHtmlContent(html);
    return html;
  }
  const {width} = useWindowDimensions();
  const source = {
    html: props.navigation.state.params.htmlcontent,
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ffff'}}>
      <View style={{marginHorizontal: 15, marginVertical: 15, elevation: 5}}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#808080',
            borderBottomWidth: 0.5,
          }}>
          <View
            style={{
              flexDirection: 'column',
              flex: 0.2,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text>To : </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              flex: 0.7,
              justifyContent: 'center',
            }}>
            <TextInput
              autoCorrect={false}
              spellCheck={false}
              style={{color: '#0b84e0'}}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableHighlight
            style={{
              flexDirection: 'column',
              flex: 0.1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#0b84e0',
              height: 30,
              width: 30,
              borderRadius: 15,
              margin: 5,
            }}
            onPress={onValidateEmail}>
            <BoschIcon
              color={Colors.white}
              name={Icons.arrowUp}
              size={20}
              style={{height: 20}}
            />
          </TouchableHighlight>
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#808080',
            borderBottomWidth: 0.5,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'column',
              flex: 0.2,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text>From : </Text>
          </View>
          <View style={{flexDirection: 'column', flex: 0.7}}>
            <TextInput
              style={{fontWeight: 'bold', color: Colors.black}}
              value={'ac.techsupport@us.bosch.com'}
              editable={false}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#808080',
            borderBottomWidth: 0.5,
            paddingVertical: 10,
          }}>
          <View
            style={{
              flexDirection: 'column',
              flex: 0.2,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Text>Subject : </Text>
          </View>
          <View style={{flexDirection: 'column', flex: 0.7}}>
            <TextInput
              editable={false}
              style={{fontWeight: 'bold', color: Colors.black}}
              value={`${Dictionary.liveCheckpoint.emailSubject} ${selectedUnit.odu.serialNumber}`}
            />
          </View>
        </View>
      </View>
      <View style={{marginHorizontal: 25, flex: 1}}>
        <WebView source={source} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  padding: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  copyrightsFooter: {
    left: 0,
    right: 0,
    bottom: 0,
  },
});
