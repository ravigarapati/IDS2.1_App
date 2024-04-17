import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BoschIcon, CustomHeader, CustomText} from '../components';
import {Colors, Typography} from '../styles';
import {Icons} from '../utils/icons';
import {useSelector, useDispatch} from 'react-redux';
import {clearNotificationsCount} from '../store/actions/NotificationActions';
import {clearHomeOwnerNotificationsCount} from '../store/actions/HomeOwnerActions';
import {prCleanInfo} from '../store/actions/ContractorActions';

const padding = {paddingHorizontal: 10};
const padding10 = {paddingHorizontal: 20};
const circle = {
  height: 16,
  width: 16,
  borderRadius: 8,
  backgroundColor: Colors.darkRed,
  right: 20,
  position: 'absolute',
};
const ellipsis = {
  height: 16,
  width: 30,
  borderRadius: 8,
  backgroundColor: Colors.darkRed,
  right: 10,
  position: 'absolute',
};
export const navOptions = {
  header: props => <CustomHeader {...props} />,
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: Colors.white,
  },
  headerTitleStyle: {
    ...Typography.boschReg21,
  },
};

export const navOptions2 = {
  //header: props => <CustomHeader {...props} />,
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: Colors.white,
  },
  headerTitleStyle: {
    ...Typography.boschReg21,
  },
};

export const MenuButton = (props: any) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={padding}
      onPress={() => {
        props.navigation.openDrawer();
      }}>
      <BoschIcon
        name={Icons.listViewMobile}
        size={34}
        accessibilityLabel={'Menu'}
        style={{height: 34}}
      />
    </TouchableOpacity>
  );
};

export const BackButton = (props: any) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={'Navigates to previous screen.'}
      accessibilityRole="button"
      style={padding}
      onPress={() => {
        props.navigation.goBack();
      }}>
      <BoschIcon name={Icons.backLeft} size={24} style={{height: 24}} />
    </TouchableOpacity>
  );
};

export const BackButtonDrawer = (props: any) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={'Navigates to previous screen.'}
      accessibilityRole="button"
      style={padding}
      onPress={() => {
        props.navigation.navigate('HomeTabs');
      }}>
      <BoschIcon name={Icons.backLeft} size={24} />
    </TouchableOpacity>
  );
};
export const PRBackButton = (props: any) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={padding}
      onPress={() => {
        dispatch(prCleanInfo());
        props.navigation.goBack();
      }}>
      <BoschIcon name={Icons.backLeft} size={24} style={{height: 24}} />
    </TouchableOpacity>
  );
};

export const GoToHomeOwnerHome = (props: any) => {
  return (
    <TouchableOpacity
      style={padding}
      onPress={() => {
        props.navigation.navigate(props.screenName);
      }}>
      <BoschIcon name={Icons.backLeft} size={24} style={{height: 24}} />
    </TouchableOpacity>
  );
};

export const GoToContractorHome = (props: any) => {
  return (
    <TouchableOpacity
      style={padding}
      onPress={() => {
        props.navigation.navigate('ContractorHome', {tab: 'map'});
      }}>
      <BoschIcon name={Icons.backLeft} size={24} style={{height: 24}} />
    </TouchableOpacity>
  );
};

export const NotificationButton = (props: any) => {
  const count = useSelector(state => state.notification.count);
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={padding10}
      onPress={() => {
        props.screenName === 'Unit Dashboard'
          ? props.navigation.navigate('Notification', {isSearch: true})
          : props.navigation.navigate('Notification', {isSearch: false});

        dispatch(clearNotificationsCount());
      }}>
      <BoschIcon
        name={Icons.notification}
        size={28}
        accessibilityLabel={'notification'}
        style={{height: 28}}
      />
      {count > 0 && (
        <View style={count > 99 ? ellipsis : circle}>
          <CustomText text={count} color={Colors.white} size={10} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const HomeOwnerNotificationButton = (props: any) => {
  const count = useSelector(state => state.homeOwner.notificationsCount);

  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      accessibilityLabel={`Notification button, current unread notifications: ${count}`}
      accessibilityRole="button"
      accessibilityHint="Activate it to navigate to notification screen."
      style={padding10}
      onPress={() => {
        if (props.landing !== undefined) {
          props.navigation.navigate('HomeOwnerNotification', {
            showLabel: true,
          });
        } else {
          props.navigation.navigate('HomeOwnerNotification');
        }

        dispatch(clearHomeOwnerNotificationsCount());
      }}>
      <BoschIcon
        name={Icons.notification}
        size={28}
        accessibilityLabel={'notification'}
        style={{height: 28}}
      />
      {count > 0 && (
        <View style={count > 99 ? ellipsis : circle}>
          <CustomText text={count} color={Colors.white} size={10} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const tabOptions = {
  labelStyle: {
    fontSize: 12,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    paddingBottom: 5,
  },
  upperCaseLabel: false,
  activeTintColor: Colors.darkBlue,
  inactiveTintColor: Colors.black,
  showIcon: true,
  showLabel: true,
  pressColor: Colors.mediumGray,
  style: {
    backgroundColor: Colors.white,
    margin: 0,
    elevation: 0,
    borderColor: Colors.mediumGray,
    borderBottomWidth: 1,
  },
  tabStyle: {
    padding: 0,
    paddingHorizontal: 10,
  },
  iconStyle: {
    marginTop: 8,
    height: 'auto',
  },
  indicatorStyle: {
    backgroundColor: Colors.darkBlue,
  },
};
