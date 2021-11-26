import diagnoseEntries from "../../data/diagnoses";
import { DiagnoseEntry } from "../types";

const getDiagnoses = (): Array<DiagnoseEntry> => {
    return diagnoseEntries;
};

export default {
    getDiagnoses
};