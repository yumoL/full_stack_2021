import express from 'express';
import { DiagnoseEntry } from '../types';
import diagnoseService from '../services/diagnoseService';

const router = express.Router();

router.get('/', (_req, res) => {
    const diagnoses: Array<DiagnoseEntry> = diagnoseService.getDiagnoses();
    res.send(diagnoses);
});

export default router;