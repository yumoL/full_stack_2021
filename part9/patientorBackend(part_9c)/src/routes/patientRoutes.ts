import express from 'express';
import { NonSensitivePatientEntry } from '../types';
import patientService from '../services/patientService';
import utils from "../utils/utils";

const router = express.Router();

router.get('/', (_req, res) => {
  const patients: Array<NonSensitivePatientEntry> = patientService.getPatients();
  res.send(patients);
});

router.post('/', (req, res) => {
  try {
    /* eslint-disable @typescript-eslint/no-unsafe-argument */
    const newPatientEntry = utils.toNewPatientEntry(req.body);
    const addedEntry = patientService.addPatients(newPatientEntry);
    res.json(addedEntry);
  } catch (e) {
    console.log((e as Error).message);
    res.status(400).send({error: (e as Error).message});
  }
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const patient = patientService.getSpecificPatient(id);
  if (patient == undefined) {
    res.status(400).send('No such patient');
    return;
  }
  res.send(patient);
});

router.post('/:id/entries', (req, res) => {
  const id = req.params.id;
  try {
    const newEntry = utils.toNewEntry(req.body);
    if(newEntry == undefined) {
      res.status(400).send('Something wrong happened when parsing the new entry');
      return;
    }
    const updatedPatient = patientService.addEntryForanPatient(id, newEntry);
    if(updatedPatient == undefined) {
      res.status(400).send('No such patient');
      return;
    } else {
      res.json(updatedPatient);
    }
    
  } catch(e) {
    console.log((e as Error).message);
    res.status(400).send({error: (e as Error).message});
  }
});

export default router;