/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EntryType, Gender, HealthCheckRating, NewBaseEntry, NewEntry, NewPatientEntry } from "../types";

const isString = (text: unknown): text is string => {
  return typeof text == 'string' || text instanceof String;
};

const parseText = (text: unknown, textField: string): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing ${textField}`);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('incorrect or missing date: ' + date);
  }
  return date;
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const isSsn = (text: string): boolean => {
  const re = /^\d{6}-\d{2,3}\S{1}$/;
  if (re.test(text)) {
    return true;
  }
  return false;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn) || !isSsn(ssn)) {
    throw new Error('Incorrect or misssing SSN: ' + ssn);
  }
  return ssn;
};

const parseEntries = (entries: unknown): any[] => {
  if (!entries) {
    return [];
  }
  if (!Array.isArray(entries)) {
    throw new Error('Incorrect entries');
  }
  return entries;
};

type PatientFields = {
  name: unknown,
  dateOfBirth: unknown,
  ssn: unknown,
  gender: unknown,
  occupation: unknown,
  entries: unknown
};


const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation, entries }: PatientFields): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseText(name, "name"),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSsn(ssn),
    gender: parseGender(gender),
    occupation: parseText(occupation, "occupation"),
    entries: parseEntries(entries)
  };
  return newEntry;
};

const toNewEntry = (reqBody: any): NewEntry | undefined => {
  //wrong type
  if (!Object.values(EntryType).includes(reqBody.type)) {
    throw new Error('Invalid entry type');
  }
  //check common required fields
  const newBaseEntry: NewBaseEntry = {
    description: parseText(reqBody.description, 'entry description'),
    date: parseDate(reqBody.date),
    specialist: parseText(reqBody.specialist, 'specialist'),
    diagnosisCodes: parseEntries(reqBody.diagnosisCodes)
  };
  //check each type
  switch (reqBody.type) {
    case EntryType.Hospital:
      return toHospitalEntry(newBaseEntry, reqBody.discharge);
    case EntryType.OccupationalHealthcare:
      return toOccupationalHealthcareEntry(newBaseEntry, reqBody.employerName, reqBody.sickLeave);
    case EntryType.HealthCheck:
      return toHealthCheckEntry(newBaseEntry, reqBody.healthCheckRating);
    default:
      return undefined;
  }
};

const toHospitalEntry = (newBaseEntry: NewBaseEntry, discharge: unknown): NewEntry => {
  const entry: NewEntry = {
    ...newBaseEntry,
    type: EntryType.Hospital,
    discharge: parseDischarge(discharge)
  };
  return entry;
};

const toOccupationalHealthcareEntry = (newBaseEntry: NewBaseEntry, employerName: string, sickLeave: { startDate: string, endDate: string }): NewEntry => {
  const entry: NewEntry = {
    ...newBaseEntry,
    type: EntryType.OccupationalHealthcare,
    employerName: parseText(employerName, "employer name"),
    sickLeave: parseSickLeave(sickLeave)
  };
  return entry;
};

const toHealthCheckEntry = (newBaseEntry: NewBaseEntry, healthCheckRating: HealthCheckRating): NewEntry => {
  const entry: NewEntry = {
    ...newBaseEntry,
    type: EntryType.HealthCheck,
    healthCheckRating: parseHealthCheckRating(healthCheckRating)
  };
  return entry;
};

const parseDischarge = (discharge: any): {date:string, criteria:string} => {
  if(!discharge) {
    throw new Error("discharge field is missing from the hospital entry");
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseText(discharge.criteria, "criteria")
  };
};

const parseSickLeave = (sickLeave: any): {startDate:string, endDate:string} => {
  if(!sickLeave) {
    throw new Error("sick leave field is missing from the occupational health check entry");
  }
  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate)
  };
};

const parseHealthCheckRating = (rating: HealthCheckRating): HealthCheckRating => {
  if ( rating==undefined || !Object.values(HealthCheckRating).includes(rating)) {
    throw new Error('Incorrect or missing rating: ' + rating);
  }
  return rating;
};

export default { toNewPatientEntry, toNewEntry };


