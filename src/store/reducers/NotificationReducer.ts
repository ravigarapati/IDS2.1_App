import {
  CLEAR_COUNT,
  GET_ACTIVE_NOTIFICATIONS,
  GET_ARCHIVE_NOTIFICATIONS,
  MOVE_TO_ARCHIVE,
  UPDATE_ACTIVE_NOTIFICATIONS,
  UPDATE_COUNT,
  UPDATE_ARCHIVE_NOTIFICATIONS,
  SEARCH_ARCHIVENOTIFICATION,
  GET_SETTING_CONFIGURATION,
  SET_SETTING_CONFIGURATION,
  SAVED_ARCHIVENOTIFICATIONS,
  SET_ISSUEDATE,
  UPDATE_SEARCHED_ACTIVE_NOTIFICATIONS,
  UNREAD_NOTIFICATION_COUNT,
  SET_DEMO_MODE,
} from '../labels/NotificationLabels';

const initialState = {
  active: [],
  archive: [],
  archiveKey: {},
  count: 0,
  lastUpdated: null,
  archiveCopy: [],
  activeCopy: [],
  settingConfiguration: [],
  activeNotificationIssueDate: '',
  demoStatus: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ACTIVE_NOTIFICATIONS:
      let count = 0;
      let data = action.data;
      // if (state.lastUpdated) {
      //   count = data.filter((item) => item.issueDate > state.lastUpdated)
      //     .length;
      // }
      let sortedActiveList = action.data.sort((a, b) => {
        return b.issueDate - a.issueDate;
      });
      return {
        ...state,
        active: sortedActiveList,
        activeCopy: sortedActiveList,
        lastUpdated: Date.now(),
        //count: count,
      };
    case UPDATE_ACTIVE_NOTIFICATIONS:
      return {
        ...state,
        active: [action.data, ...state.active],
        activeCopy: [action.data, ...state.active],
      };
    case GET_ARCHIVE_NOTIFICATIONS:
      return {
        ...state,
        archiveCopy: [...action.data.Items],
        archive: [...action.data.Items],
        archiveKey: action.data.LastEvaluatedKey,
      };
    case UPDATE_ARCHIVE_NOTIFICATIONS:
      return {
        ...state,
        archiveCopy: [...state.archive, ...action.data.Items],
        archive: [...state.archive, ...action.data.Items],
        archiveKey: action.data.LastEvaluatedKey,
      };

    case UPDATE_COUNT:
      return {
        ...state,
        count: state.count + 1,
      };
    case CLEAR_COUNT:
      return {
        ...state,
        count: 0,
      };
    case MOVE_TO_ARCHIVE: {
      let updatedActive = [...state.active];
      let updatedArchive = [...state.archive];

      let index = state.active.findIndex(obj => obj.issueDate === action.data);
      if (index !== -1) {
        let item = updatedActive[index];
        updatedActive.splice(index, 1);
        updatedArchive = [item, ...state.archive];
      }
      return {
        ...state,
        active: updatedActive,
        archive: updatedArchive,
        activeCopy: updatedActive,
        // archiveCopy: updatedArchive,
      };
    }
    case SEARCH_ARCHIVENOTIFICATION: {
      let sortedSearchedArchiveList = action.data.sort((a, b) => {
        return b.issueDate - a.issueDate;
      });
      return {
        archiveCopy: [...state.archiveCopy],
        archive: sortedSearchedArchiveList,
        active: [...state.active],
      };
    }

    case SAVED_ARCHIVENOTIFICATIONS: {
      return {
        archive: [...state.archiveCopy],
        archiveCopy: [...state.archiveCopy],
        active: [...state.active],
      };
    }
    case GET_SETTING_CONFIGURATION:
      return {
        ...state,
        settingConfiguration: action.data,
      };
    case SET_SETTING_CONFIGURATION:
      return {
        ...state,
        settingConfiguration: action.data,
      };
    case SET_ISSUEDATE:
      return {
        ...state,
        activeNotificationIssueDate: action.data,
      };
    case UPDATE_SEARCHED_ACTIVE_NOTIFICATIONS:
      return {
        ...state,
        activeCopy: action.data,
      };
    case UNREAD_NOTIFICATION_COUNT:
      return {
        ...state,
        count: action.data,
      };
    case SET_DEMO_MODE:
      return {
        ...state,
        demoStatus: action.data,
      };
    default:
      return state;
  }
};
