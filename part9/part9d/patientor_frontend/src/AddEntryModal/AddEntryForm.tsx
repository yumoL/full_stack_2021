import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { Entry, EntryType, BaseEntry, HealthCheckRating } from "../types";
import { DiagnosisSelection, NumberField, SelectField, TypeOption } from "./EntryFormField";
import { TextField } from "../AddPatientModal/FormField";
import * as Yup from "yup";
import { useStateValue } from "../state";
import { Button, Grid } from "semantic-ui-react";

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
export type EntryFormValues = UnionOmit<Entry, 'id'>;

export type BaseEntryFormValues = Omit<BaseEntry, "id">;

interface HospitalSpecificField {
  dischargeDate: string,
  criteria: string
}

interface OccupationalHealthCareSpecificField {
  employerName: string,
  startDate: string,
  endDate: string
}

interface HealthCheckSpecificField {
  healthCheckRating: HealthCheckRating
}

type EntrySpecificFields = HospitalSpecificField | OccupationalHealthCareSpecificField | HealthCheckSpecificField;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

interface StepOneProps {
  next: (values: BaseEntryFormValues) => void;
  data: BaseEntryFormValues;
  onCancel: () => void;
}

interface StepTwoProps {
  next: (values: EntrySpecificFields) => void;
  prev: () => void;
  type: EntryType;
  onCancel: () => void;
}

interface SpecificEntryFormProps {
  handleSubmit: (values: EntrySpecificFields) => void;
  handlePrev: () => void;
  onCancel: () => void;
}

const stepOneValidationSchema = Yup.object({
  description: Yup.string().required().label("Description"),
  date: Yup.string().required().label("Date"),
  specialist: Yup.string().required().label("Specialist"),
});

const hospitalEntryValidationSchema = Yup.object({
  dischargeDate: Yup.string().required().label("Discharge date"),
  criteria: Yup.string().required().label("Criteria"),
});

const occupationalHealthCareEntryValidationSchema = Yup.object({
  employerName: Yup.string().required().label("Employer name"),
  startDate: Yup.string().required().label("Sick leave start date"),
  endDate: Yup.string().required().label("Sick leave end date"),
});

const StepOne = ({ next, data, onCancel }: StepOneProps) => {
  const [{ diagnoses }] = useStateValue();
  const handleSubmit = (values: BaseEntryFormValues) => {
    next(values);
  };
  return (
    <Formik
      initialValues={data}
      validationSchema={stepOneValidationSchema}
      onSubmit={(values) => { handleSubmit(values); }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => (
        <Form className="form ui">
          <Field
            label="Description"
            placeholder="description"
            name="description"
            component={TextField} />
          <Field
            label="Date"
            placeholder="YYYY-MM-DD"
            name="date"
            component={TextField} />
          <Field
            label="Specialist"
            placeholder="specialist"
            name="specialist"
            component={TextField} />
          <DiagnosisSelection
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            diagnoses={Object.values(diagnoses)}
          />
          <SelectField
            label="Type"
            name="type"
            options={typeOptions}
          />
          <Grid>
            <Grid.Column floated="left" width={5}>
              <Button type="button" onClick={onCancel} color="red">
                Cancel
              </Button>
            </Grid.Column>
            <Grid.Column floated="right" width={5}>
              <Button
                type="submit"
                floated="right"
                color="green"
                disabled={!dirty || !isValid}
              >
                Next
              </Button>
            </Grid.Column>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const HospitalEntryForm = ({ handleSubmit, handlePrev, onCancel }: SpecificEntryFormProps) => {
  return (
    <Formik
      initialValues={{
        dischargeDate: "",
        criteria: ""
      }}
      onSubmit={(values) => { handleSubmit(values); }}
      validationSchema={hospitalEntryValidationSchema}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              name="dischargeDate"
              component={TextField} />
            <Field
              label="Criteria"
              placeholder="criteria"
              name="criteria"
              component={TextField} />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button type="button" floated="left" color="yellow" onClick={() => handlePrev()}>
                  Back
                </Button>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}

    </Formik>
  );
};

const OccupationalHealthCareEntryForm = ({ handleSubmit, handlePrev, onCancel }: SpecificEntryFormProps) => {
  return (
    <Formik
      initialValues={{
        employerName: "",
        startDate: "",
        endDate: ""
      }}
      onSubmit={(values) => { handleSubmit(values); }}
      validationSchema={occupationalHealthCareEntryValidationSchema}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Employer name"
              placeholder="employer name"
              name="employerName"
              component={TextField} />
            <Field
              label="Sick leave start date"
              placeholder="YYYY-MM-DD"
              name="startDate"
              component={TextField} />
            <Field
              label="Sick leave end date"
              placeholder="YYYY-MM-DD"
              name="endDate"
              component={TextField} />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button type="button" floated="left" color="yellow" onClick={() => handlePrev()}>
                  Back
                </Button>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}

    </Formik>
  );
};

const HealthCheckEntryForm = ({ handleSubmit, handlePrev, onCancel }: SpecificEntryFormProps) => {
  return (
    <Formik
      initialValues={{
        healthCheckRating: HealthCheckRating.Healthy
      }}
      onSubmit={(values) => { handleSubmit(values); }}
    >
      {({ isValid }) => {
        return (
          <Form className="form ui">
            <Field
              label="Health check rating"
              name="healthCheckRating"
              component={NumberField}
              min={0}
              max={3}
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button type="button" floated="left" color="yellow" onClick={() => handlePrev()}>
                  Back
                </Button>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}

    </Formik>
  );
};

const StepTwo = ({ next, prev, type, onCancel }: StepTwoProps) => {
  const handleSubmit = (values: EntrySpecificFields) => {
    next(values);
  };
  const switchSpecificEntry = () => {
    switch (type) {
      case EntryType.Hospital:
        return <HospitalEntryForm handleSubmit={handleSubmit} handlePrev={prev} onCancel={onCancel} />;
      case EntryType.OccupationalHealthcare:
        return <OccupationalHealthCareEntryForm handleSubmit={handleSubmit} handlePrev={prev} onCancel={onCancel} />;
      case EntryType.HealthCheck:
        return <HealthCheckEntryForm handleSubmit={handleSubmit} handlePrev={prev} onCancel={onCancel} />;
      default:
        return <div></div>;
    }
  };
  return (
    <div>{switchSpecificEntry()}</div>
  );
};


const typeOptions: TypeOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational health care" },
  { value: EntryType.HealthCheck, label: "Health check" },
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [type, setType] = useState<EntryType>(EntryType.HealthCheck);

  const [baseEntryData, setBaseEntryData] = useState<BaseEntryFormValues>({
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    type: EntryType.HealthCheck
  });


  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleNextStepFromStep1 = (newData: BaseEntryFormValues) => {
    setBaseEntryData(newData);
    if (newData.type) {
      setType(newData.type);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleSubmitFromStep2 = (newData: EntrySpecificFields) => {
    switch (type) {
      case EntryType.Hospital:
        if (!("dischargeDate" in newData && "criteria" in newData)) {
          break;
        }
        onSubmit({
          ...baseEntryData,
          discharge: {
            date: newData.dischargeDate,
            criteria: newData.criteria
          }
        });
        break;
      case EntryType.OccupationalHealthcare:
        if (!("employerName" in newData && "startDate" in newData && "endDate" in newData)) {
          break;
        }
        onSubmit({
          ...baseEntryData,
          employerName: newData.employerName,
          sickLeave: {
            startDate: newData.startDate,
            endDate: newData.endDate
          }
        });
        break;
      case EntryType.HealthCheck:
        if (!("healthCheckRating" in newData)) {
          break;
        }
        onSubmit({
          ...baseEntryData,
          healthCheckRating: newData.healthCheckRating
        });
        break;
      default:
        break;
    }

  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };


  const steps = [
    <StepOne key={0} next={handleNextStepFromStep1} data={baseEntryData} onCancel={onCancel} />,
    <StepTwo key={1} next={handleSubmitFromStep2} prev={handlePrev} type={type} onCancel={onCancel} />
  ];

  return (
    <div>
      {steps[currentStep]}
    </div>
  );
};
