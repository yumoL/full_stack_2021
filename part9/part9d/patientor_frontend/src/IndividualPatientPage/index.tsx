import React from "react";
import { useParams } from "react-router";
import { Diagnosis, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import axios from "axios";
import { useStateValue, getPatientList, getDiagnosisList, addNewEntry } from "../state";
import { Button, Icon } from "semantic-ui-react";
import { Gender } from "../types";
import { EntryDetails } from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

type IdParam = {
  id: string;
};

const IndividualPatientPage = () => {
  const [{ singlePatient, diagnoses }, dispatch] = useStateValue();
  const id = useParams<IdParam>().id;
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const getDiagnosisName = (code: string):string => {
    const matched: Diagnosis|undefined = Object.values(diagnoses).find(d => d.code==code);
    if (!matched){
      return "The name is undefined";
    }
    return matched.name;
  };

  const fetchSinglePatient = async () => {
    try {
      const { data: singlePatientFromApi } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch(getPatientList(singlePatientFromApi));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDiagnosisList = async() => {
    try {
      const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
        `${apiBaseUrl}/diagnoses`
      );
      dispatch(getDiagnosisList(diagnosisListFromApi));
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    
    if (singlePatient != null && singlePatient.id == id) {
      return;
    }
    void fetchSinglePatient();
    void fetchDiagnosisList();
  }, [dispatch]);

  const submitNewEntry = async (values: EntryFormValues) => {
    console.log("submitted", values);
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addNewEntry(updatedPatient));
      closeModal();
    } catch (e: any) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };


  return (
    <div>
      {singlePatient != null &&
        <div>
          <h1>{singlePatient.name} {singlePatient.gender == Gender.Male ? <Icon name="male" /> : <Icon name="female" />}</h1>
          <p>ssn: {singlePatient.ssn}</p>
          <p>occupation: {singlePatient.occupation}</p>
          <br />
          {singlePatient.entries.length > 0 &&
            <div>
              <h3>Entries</h3>
              {singlePatient.entries.map(entry => <EntryDetails key={entry.id} entry={entry} getDiagnosisName={getDiagnosisName}/>)}
            </div>
          }
        </div>
      }
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <br />
      <br />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default IndividualPatientPage;