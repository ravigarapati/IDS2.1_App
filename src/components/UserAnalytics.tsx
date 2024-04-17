import React, {useEffect} from 'react';
import analytics from '@react-native-firebase/analytics';
import {Enum} from '../utils/enum';
import {useSelector} from 'react-redux';

export default function UserAnalytics(pageTitle: any) {
  const userRole = useSelector((state) =>
    state.auth.user.attributes['custom:role'] === Enum.roles.homeowner
      ? 'homeowner'
      : 'admin/contractor',
  );
  const adminAnalyticsValue = useSelector(
    (state) => state.contractor.adminUserAnalytics,
  );
  const hoAnalyticsValue = useSelector(
    (state) => state.homeOwner.hoUserAnalytics,
  );
  const valCheck =
    userRole === 'homeowner' ? hoAnalyticsValue : adminAnalyticsValue;
  useEffect(() => {
    if (valCheck === true) {
      analytics().logEvent(pageTitle, {
        role: userRole,
      });
    }
  }, [valCheck]);
}
