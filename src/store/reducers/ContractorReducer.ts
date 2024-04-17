import {Enum} from '../../utils/enum';
import {
  CONTRACTOR_LIST,
  WARRANTY_INFO,
  ADD_COMPONENT,
  ADD_WARRANTY_INFO,
  REQUEST_SENT_SUCCESS,
  ADD_GATEWAY_UNIT,
  REPLACE_GATEWAY_UNIT,
  VERIFY_ODU,
  UPDATE_REMOTE_ACCESS,
  GATEWAY_LIVE_DATA,
  SET_SELECTED_UNIT,
  GET_UNITS_LIST,
  ENERGY_USAGE_DATA,
  TROUBLESHOOTING,
  BLE_STATUS,
  CHECKPOINT_VALUE,
  GET_CHARGEUNIT_VALUE,
  SET_CHARGEUNIT_VALUE,
  INVITED_CONTRACTOR_LIST,
  ADMIN_EDIT_ACCESS,
  FAQ_LIST,
  ADMIN_INVITE_CONTRACTOR,
  ADMIN_REMOVE_CONTRACTOR,
  DELETE_UNITS,
  UPDATE_DEVICE_ALREADY_CONNECTED,
  UPDATE_TERMS_AND_CONDITIONS_FLAG,
  FAULT_STATUS_ON_NORMAL_UNITS,
  UPDATE_ANALYTICS_VALUE,
  UPDATE_CHECKPOINT_VALUE,
  MOUNT_ANTENNA_HIDE,
  POWERUP_ODU_HIDE,
  PR_CURRENT_STEP,
  PR_PRODUCT_INFO,
  PR_VERIFY_PRODUCT,
  PR_INVALID_PRODUCT,
  PR_SNL_GET_PRODUCTS,
  PR_SNL_GET_PRODUCT_TYPES,
  PR_SNL_GET_PRODUCT_IMAGES,
  PR_REGISTER,
  PP_VERIFY_USER,
  PR_SET_HOMEOWNER,
  PR_SAVE_TOKEN,
  PP_RESPONSE,
  PR_REGISTER_NEW_HOMEOWNER,
  PR_RESET_FLOW,
  PR_CLEAN,
  UPDATE_FAULT_CODE,
} from '../labels/ContractorLabels';
import {getPPAccountInformation} from '../actions/ContractorActions';

const initialState = {
  contractorList: [],
  invitedContractorList: [],
  unitsList: null,
  mapMarkersList: null,
  mapMarkersListPending: null,
  contractorDetails: {},
  energyUsage: {},
  troubleshooting: {},
  faqList: {},
  selectedUnit: {
    odu: {},
    gateway: {},
    warrantyInfo: {},
    remoteRequestSent: null,
    remoteAccessGranted: null,
    liveDataLoading: false,
    liveDataError: '',
    liveData: {},
    isBleConnected: false,
    checkpointValue: {},
    checkPointSavedOn: 0,
    chargeUnit: {
      method1: null,
      method2: null,
    },
  },
  deviceConnectedToBle: false,
  deviceDetails: {},
  faultStatusOnNormalUnit: '',
  adminUserAnalytics: null,
  selectedCheckpointTabValue: null,
  mountAntennaHideStatus: false,
  powerUpOduHideStatus: false,
  currentStep: 0,
  prProductInfo: {
    serialNumber: '',
    modelNumber: '',
    productDescription: '',
    installationDate: null,
    applicationType: 1,
  },
  prHomeownerInfo: {
    fullName: '',
    address: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
    email: '',
    applicationType: 2,
    phoneNumber: '',
  },
  snlProductInfo: {
    productsList: [],
    productsTypeList: [],
    productImages: [],
  },
  snlAllProductData: [],
  prPopups: {
    showPopup: false,
    showSignUpPopup: false,
    showCompletePopup: false,
    showRegisteredPopup: false,
    showHomeownerPopup: false,
  },
  prTokenDetails: {
    prToken: '',
    prTokenTimestamp: 0,
  },
  ppAccountCreated: false,
  ppAccountCompleted: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTRACTOR_LIST: {
      return {
        ...state,
        contractorList: action.data,
      };
    }
    case INVITED_CONTRACTOR_LIST: {
      return {
        ...state,
        invitedContractorList: action.data,
      };
    }
    case FAQ_LIST: {
      return {
        ...state,
        faqList: action.data,
      };
    }
    case ADMIN_EDIT_ACCESS: {
      let updates = action.data;
      var updatedContractorList = state.contractorList.map(contractor =>
        contractor.contractorId === updates.contractorId
          ? {
              ...contractor,
              accessibleUnits: updates.accessibleUnits,
              isFullAccess: updates.isFullAccess,
            }
          : contractor,
      );
      return {
        ...state,
        contractorList: updatedContractorList,
      };
    }
    case ADMIN_INVITE_CONTRACTOR: {
      return {
        ...state,
        invitedContractorList: [...state.invitedContractorList, action.data],
      };
    }
    case ADMIN_REMOVE_CONTRACTOR: {
      if (action.data.action === 'delete') {
        return {
          ...state,
          contractorList: state.contractorList.filter(
            item => !action.data.contractorId.includes(item.contractorId),
          ),
        };
      }
      if (action.data.action === 'cancel') {
        return {
          ...state,
          invitedContractorList: state.invitedContractorList.filter(
            item => !action.data.contractorId.includes(item.contractorId),
          ),
        };
      }
      break;
    }
    case WARRANTY_INFO: {
      return {
        ...state,
        selectedUnit: {
          ...state.selectedUnit,
          warrantyInfo: action.data,
        },
      };
    }
    case ADD_WARRANTY_INFO: {
      let warrantyDetails = {};
      Object.assign(warrantyDetails, state.selectedUnit.warrantyInfo);
      warrantyDetails.applicationType = action.data.applicationType;
      warrantyDetails.ODUWarrantyDetails = {
        name: action.data.name,
        address: action.data.address,
        email: action.data.email,
        phoneNumber: action.data.phoneNumber,
      };
      return {
        ...state,
        selectedUnit: {
          ...state.selectedUnit,
          warrantyInfo: warrantyDetails,
        },
      };
    }
    case ADD_COMPONENT: {
      var updatedWarrantyInfo = {};
      var index;
      var updatedUnitsList = [...state.unitsList];
      Object.assign(updatedWarrantyInfo, state.selectedUnit.warrantyInfo);
      if (action.data.componentType && action.data.componentType === Enum.odu) {
        updatedWarrantyInfo.ODUInstallationDate =
          action.data.ODUInstallationDate;
        index = state.unitsList.findIndex(
          item => item.odu.serialNumber === state.selectedUnit.odu.serialNumber,
        );
        updatedUnitsList[index].odu.isODUInstalled = true;
        updatedUnitsList[index].odu.lastWorkedOn =
          action.data.ODUInstallationDate;
      } else {
        updatedWarrantyInfo.components.push(action.data);
      }
      return {
        ...state,
        unitsList: updatedUnitsList,
        selectedUnit: {
          ...state.selectedUnit,
          warrantyInfo: updatedWarrantyInfo,
        },
      };
    }
    case REQUEST_SENT_SUCCESS: {
      let remoteRequestSent = {remoteRequestSent: action.data};
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...remoteRequestSent},
      };
    }
    case VERIFY_ODU: {
      let data = {
        odu: {
          serialNumber: action.data.ODUSerialNumber,
          modelNumber: action.data.ODUModelNumber,
        },
      };
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...data},
      };
    }
    case ADD_GATEWAY_UNIT: {
      let gwdata = {
        gateway: {
          gatewayId: action.data.gatewayId,
          contractorId: action.data.contractorId,
          bluetoothId: action.data.bluetoothId,
          bluetoothPassword: action.data.bluetoothPassword,
          gatewayVersion: '',
          firmwareVersion: action.firmwareVersion,
        },
        remoteRequestSent: null,
        remoteAccessGranted: null,
        warrantyInfo: {},
        systemStatus: 'PENDING',
      };

      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...gwdata},
        unitsList: [{...state.selectedUnit, ...gwdata}, ...state.unitsList],
      };
    }
    case REPLACE_GATEWAY_UNIT: {
      const lists = state.unitsList.map(list => {
        if (list.gateway.gatewayId === action.data.oldGatewayId) {
          list.gateway.gatewayId = action.data.gatewayId;
          list.gateway.bluetoothId = action.data.bluetoothId;
          list.gateway.bluetoothPassword = action.data.bluetoothPassword;
        }
        return list;
      });
      return {
        ...state,
        selectedUnit: {
          ...state.selectedUnit,
          gateway: {
            ...state.selectedUnit.gateway,
            gatewayId: action.data.gatewayId,
            bluetoothId: action.data.bluetoothId,
            bluetoothPassword: action.data.bluetoothPassword,
          },
        },
        unitsList: lists,
      };
    }
    case GET_UNITS_LIST: {
      action.data.pendingList.sort(function compare(a, b) {
        var dateA: any = new Date(a.odu.serviceStartDate);
        var dateB: any = new Date(b.odu.serviceStartDate);
        return dateB - dateA;
      });
      action.data.unitsList.sort(function (a, b) {
        if (a.homeOwnerDetails.lastName < b.homeOwnerDetails.lastName) {
          return -1;
        }
        if (a.homeOwnerDetails.lastName > b.homeOwnerDetails.lastName) {
          return 1;
        }
        return 0;
      });
      return {
        ...state,
        unitsList: [...action.data.pendingList, ...action.data.unitsList],
        mapMarkersList: action.data.unitsList,
        mapMarkersListPending: action.data.pendingList,
        contractorDetails: action.data.contractorDetails,
      };
    }
    case SET_SELECTED_UNIT: {
      return {
        ...state,
        selectedUnit: {
          ...action.data,
          remoteRequestSent: null,
          chargeUnit: {
            method1: null,
            method2: null,
          },
        },
      };
    }
    case DELETE_UNITS: {
      return {
        ...state,
        unitsList: state.unitsList.filter(
          item => !action.data.includes(item.gateway.gatewayId),
        ),
        mapMarkersListPending: state.mapMarkersListPending.filter(
          item => !action.data.includes(item.gateway.gatewayId),
        ),
      };
    }
    case UPDATE_REMOTE_ACCESS: {
      let remoteAccessGranted = {remoteAccessGranted: action.data};
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...remoteAccessGranted},
      };
    }
    case ENERGY_USAGE_DATA: {
      return {
        ...state,
        energyUsage: action.data,
      };
    }
    case GATEWAY_LIVE_DATA: {
      let liveDataObj = action.data;
      let newLiveDataObj = {...state.selectedUnit.liveData, ...liveDataObj};
      let bleLiveData = {liveData: newLiveDataObj};
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...bleLiveData},
      };
    }
    case UPDATE_FAULT_CODE: {
      let newSelectedUnit = {...state.selectedUnit};
      newSelectedUnit.faultCode = action.data;
      return {
        ...state,
        selectedUnit: newSelectedUnit,
      };
    }
    case TROUBLESHOOTING: {
      return {
        ...state,
        troubleshooting: action.data,
      };
    }
    case CHECKPOINT_VALUE: {
      let checkpointObj = action.data.checkPointData;
      let lastSavedDate = action.data.lastSavedDate;
      let newCheckpointObj = {
        ...state.selectedUnit.checkpointValue,
        ...checkpointObj,
      };
      let data = {
        checkpointValue: newCheckpointObj,
        checkPointSavedOn: lastSavedDate,
      };
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...data},
      };
    }
    case BLE_STATUS: {
      let isBleConnected = {isBleConnected: action.data};
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...isBleConnected},
      };
    }
    case GET_CHARGEUNIT_VALUE: {
      let chargeUnitValues = {
        chargeUnit: action.data,
      };
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...chargeUnitValues},
      };
    }
    case SET_CHARGEUNIT_VALUE: {
      let chargeUnitValues = {
        chargeUnit: action.data,
      };
      return {
        ...state,
        selectedUnit: {...state.selectedUnit, ...chargeUnitValues},
      };
    }
    case UPDATE_DEVICE_ALREADY_CONNECTED: {
      let deviceStatus = false;
      if (action.data) {
        deviceStatus = true;
      }
      return {
        ...state,
        deviceConnectedToBle: deviceStatus,
        deviceDetails: action.data,
      };
    }
    case UPDATE_TERMS_AND_CONDITIONS_FLAG: {
      let isTermsConditionsAccepted = {isTermsConditionsAccepted: true};
      return {
        ...state,
        contractorDetails: {
          ...state.contractorDetails,
          isTermsConditionsAccepted: isTermsConditionsAccepted,
        },
      };
    }

    case FAULT_STATUS_ON_NORMAL_UNITS: {
      return {
        ...state,
        faultStatusOnNormalUnit: action.data,
      };
    }

    case UPDATE_ANALYTICS_VALUE: {
      return {
        ...state,
        adminUserAnalytics: action.data,
      };
    }

    case UPDATE_CHECKPOINT_VALUE: {
      return {
        ...state,
        selectedCheckpointTabValue: action.data,
      };
    }

    case MOUNT_ANTENNA_HIDE: {
      let mountAntennaHideStatus;
      if (action.data) {
        mountAntennaHideStatus = true;
      }
      return {
        ...state,
        mountAntennaHideStatus,
      };
    }

    case POWERUP_ODU_HIDE: {
      let powerUpOduHideStatus;
      if (action.data) {
        powerUpOduHideStatus = true;
      }
      return {
        ...state,
        powerUpOduHideStatus,
      };
    }

    case PR_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.data,
        prPopups: {
          ...state.prPopups,
          showPopup: false,
          showRegisteredPopup: false,
        },
      };

    case PR_PRODUCT_INFO:
      return {
        ...state,
        prProductInfo: {
          serialNumber: action.data.serialNumber,
          modelNumber: action.data.modelNumber,
          productDescription: action.data.productDescription,
          installationDate: action.data.installationDate,
          applicationType: action.data.applicationType,
        },
      };

    case PR_VERIFY_PRODUCT: {
      let data = {
        item: {
          modelNumber: action.data.Item.modelNumber,
          productDescription: action.data.Item.productDescription,
        },
      };
      return {
        ...state,
        prProductInfo: {
          modelNumber: data.item.modelNumber,
          productDescription: data.item.productDescription,
        },
      };
    }

    case PR_INVALID_PRODUCT: {
      return {
        ...state,
        prProductInfo: {
          //serialNumber: '',
          modelNumber: '',
          productDescription: '',
        },
      };
    }

    case PR_SNL_GET_PRODUCTS: {
      let data = {
        item: {
          productList: [{label: String, value: String, index: 0}],
        },
      };
      let i = 0;
      action.data.forEach(element => {
        data.item.productList.push({
          label: element.productName,
          value: element.productName,
          index: i,
        });
        i++;
      });
      data.item.productList.shift();
      return {
        ...state,
        snlProductInfo: {
          productsList: data.item.productList,
        },
        snlAllProductData: action.data,
      };
    }

    case PR_SNL_GET_PRODUCT_TYPES: {
      let data = {
        item: {
          productsTypeList: [
            {label: String, value: String, index: 0, images: []},
          ],
        },
      };
      let i = 0;
      state.snlAllProductData[action.data].productDetails.forEach(element => {
        data.item.productsTypeList.push({
          label: element.productType,
          value: element.productType,
          index: i,
          images: element.images,
        });
        i++;
      });
      data.item.productsTypeList.shift();
      return {
        ...state,
        snlProductInfo: {
          ...state.snlProductInfo,
          productsTypeList: data.item.productsTypeList,
        },
      };
    }

    case PR_SNL_GET_PRODUCT_IMAGES: {
      let data = {
        item: {
          productImages: [{image: String}],
        },
      };
      state.snlProductInfo.productsTypeList[action.data].images.forEach(
        element => {
          data.item.productImages.push({image: element.image});
        },
      );
      data.item.productImages.shift();
      return {
        ...state,
        snlProductInfo: {
          ...state.snlProductInfo,
          productImages: data.item.productImages,
        },
      };
    }

    case PR_REGISTER: {
      return {
        ...state,
      };
    }

    case PR_REGISTER_NEW_HOMEOWNER: {
      return {
        ...state,
        prPopups: {
          ...state.prPopups,
          showHomeownerPopup: false,
        },
      };
    }

    case PR_SET_HOMEOWNER: {
      return {
        ...state,
        //currentStep: 2,
        prPopups: {
          showPopup: true,
          showSignUpPopup: false,
          showCompletePopup: false,
          showRegisteredPopup: true,
          showHomeownerPopup: true,
        },
        prHomeownerInfo: {
          fullName: action.data.fullName,
          address: action.data.address,
          city: action.data.city,
          country: action.data.country,
          state: action.data.state,
          zipCode: action.data.zipCode,
          email: action.data.email,
          applicationType: action.data.applicationType,
          phoneNumber: action.data.phoneNumber,
        },
      };
    }

    case PR_RESET_FLOW:
      return {
        ...state,
        currentStep: 0,
        prProductInfo: {
          serialNumber: '',
          modelNumber: '',
          productDescription: '',
          installationDate: null,
          applicationType: 1,
        },
        prPopups: {
          ...state.prPopups,
          showPopup: false,
          showRegisteredPopup: false,
        },
      };

    case PP_VERIFY_USER: {
      return {
        ...state,
        prPopups: {
          showPopup: false,
          showSignUpPopup: false,
          showCompletePopup: false,
          showRegisteredPopup: false,
          showHomeownerPopup: false,
        },
      };
    }

    case PR_SAVE_TOKEN: {
      var timestamp = new Date().getTime();
      return {
        ...state,
        prTokenDetails: {
          prTokenTimestamp: timestamp,
          prToken: action.data,
        },
      };
    }

    case PR_SAVE_TOKEN: {
      return {
        ...state,
        prToken: action.data,
      };
    }

    case PP_RESPONSE: {
      return {
        ...state,
        ppAccountCreated: action.data.UserRegistration,
        ppAccountCompleted: action.data.CompletedProfile,
      };
    }

    case PR_CLEAN: {
      return {
        ...state,
        currentStep: 0,
        prProductInfo: {
          serialNumber: '',
          modelNumber: '',
          productDescription: '',
          installationDate: null,
          applicationType: 1,
        },
        prHomeownerInfo: {
          fullName: '',
          address: '',
          city: '',
          country: '',
          state: '',
          zipCode: '',
          email: '',
          applicationType: 2,
          phoneNumber: '',
        },
        snlProductInfo: {
          productsList: [],
          productsTypeList: [],
          productImages: [],
        },
        snlAllProductData: [],
        prPopups: {
          ...state.prPopups,
          showPopup: false,
          showRegisteredPopup: false,
          showHomeownerPopup: false,
        },
      };
    }

    case PR_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.data,
        prPopups: {
          ...state.prPopups,
          showPopup: false,
          showRegisteredPopup: false,
        },
      };

    case PR_PRODUCT_INFO:
      return {
        ...state,
        prProductInfo: {
          serialNumber: action.data.serialNumber,
          modelNumber: action.data.modelNumber,
          productDescription: action.data.productDescription,
          installationDate: action.data.installationDate,
          applicationType: action.data.applicationType,
        },
      };

    case PR_VERIFY_PRODUCT: {
      let data = {
        item: {
          modelNumber: action.data.Item.modelNumber,
          productDescription: action.data.Item.productDescription,
        },
      };
      return {
        ...state,
        prProductInfo: {
          modelNumber: data.item.modelNumber,
          productDescription: data.item.productDescription,
        },
      };
    }

    case PR_INVALID_PRODUCT: {
      return {
        ...state,
        prProductInfo: {
          serialNumber: '',
          modelNumber: '',
          productDescription: '',
        },
      };
    }

    case PR_SNL_GET_PRODUCTS: {
      let data = {
        item: {
          productList: [{label: String, value: String, index: 0}],
        },
      };
      let i = 0;
      action.data.forEach(element => {
        data.item.productList.push({
          label: element.productName,
          value: element.productName,
          index: i,
        });
        i++;
      });
      data.item.productList.shift();
      return {
        ...state,
        snlProductInfo: {
          productsList: data.item.productList,
        },
        snlAllProductData: action.data,
      };
    }

    case PR_SNL_GET_PRODUCT_TYPES: {
      let data = {
        item: {
          productsTypeList: [
            {label: String, value: String, index: 0, images: []},
          ],
        },
      };
      let i = 0;
      state.snlAllProductData[action.data].productDetails.forEach(element => {
        data.item.productsTypeList.push({
          label: element.productType,
          value: element.productType,
          index: i,
          images: element.images,
        });
        i++;
      });
      data.item.productsTypeList.shift();
      return {
        ...state,
        snlProductInfo: {
          ...state.snlProductInfo,
          productsTypeList: data.item.productsTypeList,
        },
      };
    }

    case PR_SNL_GET_PRODUCT_IMAGES: {
      let data = {
        item: {
          productImages: [{image: String}],
        },
      };
      state.snlProductInfo.productsTypeList[action.data].images.forEach(
        element => {
          data.item.productImages.push({image: element.image});
        },
      );
      data.item.productImages.shift();
      return {
        ...state,
        snlProductInfo: {
          ...state.snlProductInfo,
          productImages: data.item.productImages,
        },
      };
    }

    case PR_REGISTER: {
      return {
        ...state,
      };
    }

    case PR_REGISTER_NEW_HOMEOWNER: {
      return {
        ...state,
        prPopups: {
          ...state.prPopups,
          showHomeownerPopup: false,
        },
      };
    }

    case PR_SET_HOMEOWNER: {
      return {
        ...state,
        //currentStep: 2,
        prPopups: {
          showPopup: true,
          showSignUpPopup: false,
          showCompletePopup: false,
          showRegisteredPopup: true,
          showHomeownerPopup: true,
        },
        prHomeownerInfo: {
          fullName: action.data.fullName,
          address: action.data.address,
          city: action.data.city,
          state: action.data.state,
          zipCode: action.data.zipCode,
          email: action.data.email,
          applicationType: action.data.applicationType,
          phoneNumber: action.data.phoneNumber,
        },
      };
    }

    case PR_RESET_FLOW:
      return {
        ...state,
        currentStep: 0,
        prProductInfo: {
          serialNumber: '',
          modelNumber: '',
          productDescription: '',
          installationDate: new Date(),
          applicationType: 1,
        },
        prPopups: {
          ...state.prPopups,
          showPopup: false,
          showRegisteredPopup: false,
        },
      };

    case PP_VERIFY_USER: {
      return {
        ...state,
        prPopups: {
          showPopup: false,
          showSignUpPopup: false,
          showCompletePopup: false,
          showRegisteredPopup: false,
          showHomeownerPopup: false,
        },
      };
    }

    case PR_SAVE_TOKEN: {
      return {
        ...state,
        prToken: action.data,
      };
    }

    case PP_RESPONSE: {
      return {
        ...state,
        ppAccountCreated: action.data.UserRegistration,
        ppAccountCompleted: action.data.CompletedProfile,
      };
    }

    default:
      return state;
  }
};
