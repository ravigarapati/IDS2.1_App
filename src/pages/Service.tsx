/**
 * @file Service is displayed when user clicks 'Service' button for system with alert.
 * Displays possible causes for trouleshooting.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Accordion, Link} from '../components';
import {Banner, BoschIcon, CustomText, InfoTooltip} from '../components';
import {Icons} from '../utils/icons';
import {useSelector, useDispatch} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';
import moment from 'moment';
import {showToast} from '../components/CustomToast';
import {Mock} from '../utils/Mock';

function Info({type, data}) {
  const iconList = {
    Tips: Icons.lightBulb,
    Notes: Icons.infoFrame,
    Warning: Icons.alertWarning,
  };
  return (
    <View style={styles.infoContainer}>
      <View style={[styles.flexRow, styles.padBot10]}>
        <BoschIcon name={iconList[type]} size={24} style={{height: 24}} />
        <CustomText
          style={styles.padLeft10}
          align="left"
          font="medium"
          text={type}
        />
      </View>
      <View style={styles.padLeft10}>
        <ListItem data={data} />
      </View>
    </View>
  );
}

function ListItem({data}) {
  return (
    <>
      {data.map((item, index) => {
        return (
          <View key={index}>
            <View style={styles.flexRow}>
              <CustomText align="left" text="▶" />
              <CustomText
                style={[styles.padLeft10, styles.padBot10]}
                align="left"
                text={item.text}
                key={index}
              />
            </View>

            {item.warnings && <Info type="Warning" data={item.warnings} />}
            {item.tips && <Info type="Tips" data={item.tips} />}
            {item.notes && <Info type="Notes" data={item.notes} />}

            {item.child &&
              item.child.map((child, childIndex) => {
                return (
                  <View key={childIndex}>
                    <View style={[styles.flexRow, styles.padLeft30]}>
                      <CustomText align="left" text="●" />
                      <CustomText
                        align="left"
                        style={[styles.padLeft10, styles.padBot10]}
                        text={child.text}
                        key={childIndex}
                      />
                    </View>
                    {child.warnings && (
                      <Info type="Warning" data={child.warnings} />
                    )}
                    {child.tips && <Info type="Tips" data={child.tips} />}
                    {child.notes && <Info type="Notes" data={child.notes} />}
                  </View>
                );
              })}
          </View>
        );
      })}
    </>
  );
}
export default function Service() {
  const data = useSelector(state => state.contractor.troubleshooting);
  const gatewayId = useSelector(
    state => state.contractor.selectedUnit.gateway.gatewayId,
  );
  const deviceConnectedToBle = useSelector(
    state => state.contractor.deviceConnectedToBle,
  );
  const connectedDeviceData = useSelector(
    state => state.contractor.deviceDetails,
  );
  const bluetoothId = useSelector(
    state => state.contractor.selectedUnit.gateway.bluetoothId,
  );
  const demoMode = useSelector(state => state.notification.demoStatus);

  const dispatch = useDispatch();
  useEffect(() => {
    if (demoMode) {
      showToast(Dictionary.demoMode.serviceScreenVariation, 'info');
    }
    if (deviceConnectedToBle) {
      if (connectedDeviceData.name === bluetoothId) {
        if (!demoMode) {
          dispatch(ContractorActions.getTroubleshootingData(gatewayId));
        }
      } else {
        showToast('Already connected to another gateway', 'error');
      }
    } else {
      if (!demoMode) {
        dispatch(ContractorActions.getTroubleshootingData(gatewayId));
      }
    }
  }, []);
  const bleConnected = useSelector(
    state => state.contractor.selectedUnit.isBleConnected,
  );
  return (
    <FlatList
      ListHeaderComponent={
        <>
          {(data.faultCode || demoMode) && (
            <>
              <Banner
                data={{
                  iconName: Icons.alertPin,
                  iconColor: Colors.darkRed,
                  text: demoMode
                    ? Mock.faultCode.faultCode +
                      ': ' +
                      Mock.faultCode.faultDescription
                    : data.faultCode + ': ' + data.faultDescription,
                  background: Colors.lightRed,
                }}
              />
              <CustomText
                style={[styles.padHor20, styles.padTop10]}
                size={12}
                font="light-italic"
                text={
                  Dictionary.troubleshooting.faultTimestamp +
                  moment(
                    demoMode ? Mock.faultCode.timestamp : data.timestamp,
                  ).format('MM/DD/YYYY hh:mm:ss A')
                }
              />
              <View style={styles.titleContainer}>
                <CustomText
                  style={styles.flex1}
                  font="medium"
                  size={20}
                  text={Dictionary.troubleshooting.possibleCauses}
                />
                <InfoTooltip
                  text={Dictionary.troubleshooting.possibleCausesInfo}
                  positionVertical="bottom"
                />
              </View>
            </>
          )}
        </>
      }
      contentContainerStyle={styles.container}
      data={demoMode ? Mock.faultCode.causes : data.causes}
      listKey={
        demoMode ? Mock.faultCode.faultDescription : data.faultDescription
      }
      keyExtractor={item => item.title}
      renderItem={({item, index}) => (
        <View key={item.title + index} style={styles.padHor20}>
          <Accordion
            index={index}
            disabled={!bleConnected && !demoMode}
            title={item.title}>
            <ListItem data={item.info} />
          </Accordion>
        </View>
      )}
      ListFooterComponent={
        <View style={[styles.footer]}>
          {bleConnected || demoMode ? (
            <>
              <Link
                text="IOM"
                type="arrow"
                onPress={() => {}}
                url="https://issuu.com/boschthermotechnology/docs/ids2.1_bovb20_iom_07.2022?fr=sMjY1ZjYwMzIwNjA"
              />
            </>
          ) : (
            <View style={styles.flexRow}>
              <BoschIcon
                size={24}
                name={Icons.infoFrame}
                style={{height: 24}}
              />
              <CustomText
                align="left"
                style={styles.padLeft10}
                size={12}
                text={Dictionary.troubleshooting.connectToBluetooth}
              />
            </View>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  flexGrow: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  flex1: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
  flexRow: {
    flexDirection: 'row',
  },
  titleContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  infoContainer: {
    backgroundColor: Colors.lightGray,
    marginVertical: 10,
    padding: 15,
  },
  padHor20: {
    paddingHorizontal: 20,
  },
  padLeft10: {
    paddingLeft: 10,
  },
  padBot10: {
    paddingBottom: 10,
  },
  padLeft30: {
    paddingLeft: 30,
  },
  padTop10: {
    paddingTop: 10,
  },
  footer: {
    padding: 20,
  },
});
