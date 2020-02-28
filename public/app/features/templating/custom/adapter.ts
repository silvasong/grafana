import cloneDeep from 'lodash/cloneDeep';
import { QueryVariableModel } from '../variable';
import { dispatch } from '../../../store/store';
import { setOptionAsCurrent, setOptionFromUrl, toVariableIdentifier } from '../state/actions';
import { VariableAdapter } from '../adapters';
import { initialCustomVariableState, customVariableReducer, ALL_VARIABLE_TEXT } from './reducer';
import { CustomVariablePicker } from './CustomVariablePicker';
import { CustomVariableEditor } from './CustomVariableEditor';
import { updateCustomVariableOptions } from './actions';

export const createCustomVariableAdapter = (): VariableAdapter<QueryVariableModel> => {
  return {
    description: 'Define variable values manually',
    label: 'Custom',
    initialState: initialCustomVariableState,
    reducer: customVariableReducer,
    picker: CustomVariablePicker,
    editor: CustomVariableEditor,
    dependsOn: () => {
      return false;
    },
    setValue: async (variable, option, emitChanges = false) => {
      await dispatch(setOptionAsCurrent(toVariableIdentifier(variable), option, emitChanges));
    },
    setValueFromUrl: async (variable, urlValue) => {
      await dispatch(setOptionFromUrl(toVariableIdentifier(variable), urlValue));
    },
    updateOptions: async variable => {
      await dispatch(updateCustomVariableOptions(toVariableIdentifier(variable)));
    },
    getSaveModel: variable => {
      const { index, uuid, initLock, global, ...rest } = cloneDeep(variable);
      return rest;
    },
    getValueForUrl: variable => {
      if (variable.current.text === ALL_VARIABLE_TEXT) {
        return ALL_VARIABLE_TEXT;
      }
      return variable.current.value;
    },
  };
};