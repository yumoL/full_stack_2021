import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (height == null || weight == null || height == 0 || weight == 0
    || isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }
  const result = {
    weight: weight,
    height: height,
    bmi: calculateBmi(height, weight)
  };
  res.send(result);
});

// check if a list contains an element that is not number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const containNoNumber = (arr: Array<any>) => {
  const result = arr.find(ele => isNaN(Number(ele)));
  if (result != undefined) {
    return true;
  }
  return false;
};


app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises: hours, target } = req.body;

  if (hours == null || target == null) {
    res.status(400).send({ error: 'parameters missing' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (isNaN(Number(target)) || !Array.isArray(hours) || containNoNumber(hours)) {
    res.status(400).send({ error: 'malformatted parameters' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(target, hours);
  res.send(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
