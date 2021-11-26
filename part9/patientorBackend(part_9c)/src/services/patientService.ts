import patientEntries from "../../data/patients";
import { NonSensitivePatientEntry, NewPatientEntry, PatientEntry, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Array<NonSensitivePatientEntry> => {
  return patientEntries.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatients = (entry: NewPatientEntry): PatientEntry => {
  const patient: PatientEntry = {
    id: uuid(),
    ...entry
  };
  patientEntries.push(patient);
  return patient;
};

const getSpecificPatient = (id: string): PatientEntry|undefined => {
  return patientEntries.find(p => p.id == id);
};

const addEntryForanPatient = (id: string, entry: NewEntry): PatientEntry | undefined => {
  const patient = patientEntries.find(p => p.id == id);
  if(patient == undefined) {
    return patient;
  }
  const newEntry: Entry = {
    id: uuid(),
    ...entry
  };
  patient.entries.push(newEntry);
  return patient;
};

export default {
  getPatients,
  addPatients,
  getSpecificPatient,
  addEntryForanPatient
};