import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "GET_SINGLE_PATIENT";
      payload: Patient;
    }
    | {
      type: "GET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    } | {
      type: "ADD_NEW_ENTRY";
      payload: Patient;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "GET_SINGLE_PATIENT":
      return {
        ...state,
        singlePatient: action.payload
      };
    case "GET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({...memo, [diagnosis.code]: diagnosis}),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "ADD_NEW_ENTRY":
      return {
        ...state,
        singlePatient: action.payload
      };
    default:
      return state;
  }
};
