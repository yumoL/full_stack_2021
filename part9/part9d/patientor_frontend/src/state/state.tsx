import React, { createContext, useContext, useReducer } from "react";

import { Diagnosis, Patient } from "../types";
import { Action } from "./reducer";

export type State = {
  patients: { [id: string]: Patient };
  singlePatient: Patient | null;
  diagnoses: { [code: string]: Diagnosis}
};

const initialState: State = {
  patients: {},
  singlePatient: null,
  diagnoses: {}
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);

export const setPatientList = (patientListFromApi: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patientListFromApi };
};

export const getPatientList = (patientFromApi: Patient): Action => {
  return { type: "GET_SINGLE_PATIENT", payload: patientFromApi };
};

export const addNewPatient = (newPatientFromApi: Patient): Action => {
  return { type: "ADD_PATIENT", payload: newPatientFromApi };
};

export const getDiagnosisList = (diagnosisListFromApi: Diagnosis[]): Action => {
  return { type: "GET_DIAGNOSIS_LIST", payload: diagnosisListFromApi };
};

export const addNewEntry = (updatedPatientFromApi: Patient): Action => {
  return { type: "ADD_NEW_ENTRY", payload: updatedPatientFromApi};
};


