export enum Gender {
  Male = 'male',
  Female = 'female'
}

export enum EntryType {
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck'
}

export interface DiagnoseEntry {
  code: string,
  name: string,
  latin?: string
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: {
    date: string,
    criteria: string
  }
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave: {
    startDate: string,
    endDate: string
  }
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface PatientEntry {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string,
  entries: Entry[]
}

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'|'entries'>;

export type NewPatientEntry = Omit<PatientEntry, 'id'>;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type NewEntry = UnionOmit<Entry, 'id'>;

export type NewBaseEntry = Omit<BaseEntry, 'id'>;