import React from "react";
import { Segment, Icon } from 'semantic-ui-react';
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";
import { Entry, HealthCheckRating, EntryType } from "../types";

type EntryProps = {
  entry: Entry,
  getDiagnosisName: (code: string) => string
};

export const EntryDetails = ({entry, getDiagnosisName}: EntryProps) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union number: ${JSON.stringify(value)}`
    );
  };

  const OccupationalHealthcareEntry = () => {
    if (!("employerName" in entry)) {
      return <div></div>;
    }

    return (
      <div>
        <Segment>
          <h2>{entry.date} <Icon name="stethoscope"/> {entry.employerName}</h2>
          <p>description: {entry.description}</p>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map(c => <li style={{color:"grey"}} key={c}>{getDiagnosisName(c)}</li>)
          }
        </Segment>
      </div>
    );
  };

  const HospitalEntry = () => {
    return (
      <div>
        <Segment>
          <h2>{entry.date} <Icon name="medkit"/></h2>
          <p>description: {entry.description}</p>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map(c => <li style={{color:"grey"}} key={c}>{getDiagnosisName(c)}</li>)
          }
        </Segment>
      </div>
    );
  };

  const HealthCheckEntry = () => {
    const getHeartColor = (): SemanticCOLORS => {
      if("healthCheckRating" in entry){
        switch (entry.healthCheckRating) {
          case HealthCheckRating.Healthy:
            return "green";
          case HealthCheckRating.LowRisk:
            return "yellow";
          case HealthCheckRating.HighRisk:
            return "orange";
          case HealthCheckRating.CriticalRisk:
            return "red";
          default:
            return "grey";
        }
      }
      return "grey";
    };
    return (
      <div>
        <Segment>
          <h2>{entry.date} <Icon name="doctor"/></h2>
          <p>description: {entry.description}</p>
          {entry.diagnosisCodes &&
            entry.diagnosisCodes.map(c => <li style={{color:"grey"}} key={c}>{getDiagnosisName(c)}</li>)
          }
          <Icon color={getHeartColor()} name="heart"/>
        </Segment>
      </div>
    );
  };

  switch (entry.type) {
    case EntryType.Hospital:
      return <HospitalEntry />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEntry />;
    case EntryType.HealthCheck:
      return <HealthCheckEntry />;
    default:
      return assertNever(entry);
  }
};
