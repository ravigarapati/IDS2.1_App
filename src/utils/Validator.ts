import {Dictionary} from './dictionary';

type validatorOutput = {
  match?: boolean;
  errorText?: string;
};
export const validateInputField = (value, condition) => {
  let response: validatorOutput = {match: false, errorText: ''};
  if (value !== undefined && condition.required && value.length === 0) {
    response.match = false;
    response.errorText = Dictionary.error.required;
    return response;
  } else if (condition.pattern) {
    let pattern = new RegExp(condition.pattern);
    let match = pattern.test(value.trim());
    if (!match) {
      response.match = false;
      response.errorText = Dictionary.error.patternError;
      return response;
    } else {
      response.match = match;
      return response;
    }
  } else if (condition.length && condition.length !== value.length) {
    response.match = false;
    response.errorText = Dictionary.error.lengthError + ' ' + condition.length;
    return response;
  } else if (condition.minlength && condition.minlength > value.length) {
    response.match = false;
    response.errorText =
      Dictionary.error.minLengthError + ' ' + condition.minlength;
    return response;
  } else if (condition.maxlength && condition.maxlength < value.length) {
    response.match = false;
    response.errorText =
      Dictionary.error.maxLengthError + ' ' + condition.maxlength;
    return response;
  } else {
    response.match = true;
    response.errorText = '';
    return response;
  }
};
