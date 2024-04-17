import type {MutableRefObject} from 'react';
import {useCallback, useRef} from 'react';
import {AccessibilityInfo, findNodeHandle, Platform} from 'react-native';

/**
 * Returns a ref object which when bound to an element, will focus that
 * element in VoiceOver/TalkBack on its appearance
 */
export default function useAccessibilityFocus(): [MutableRefObject<any>, void] {
  const ref = useRef(null);

  const setFocus = useCallback(() => {
    if (Platform.OS === 'ios') {
      if (ref.current) {
        const focusPoint = findNodeHandle(ref.current);
        if (focusPoint) {
          AccessibilityInfo.setAccessibilityFocus(focusPoint);
        }
      }
    }
  }, [ref]);

  return [ref, setFocus];
}
