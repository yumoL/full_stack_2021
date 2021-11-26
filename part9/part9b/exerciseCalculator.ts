const calculateExercises = (target: number, hours: Array<number>) => {
  const res: result = {
    periodLength: 0,
    trainingDays: 0,
    success: false,
    rating: 0,
    ratingDescription: '',
    target: 0,
    average: 0
  };

  res.periodLength = hours.length;
  res.trainingDays = trainingDays(hours);
  res.average = average(hours);
  res.success = success(res.average, target);
  res.rating = rating(res.average, target);
  res.ratingDescription = ratingDescription(res.rating);
  res.target = target;
  return res;
};

const calculateExercisesCL = () => {
  const target = Number(process.argv[2]);
  const hours: Array<number> = process.argv.slice(3).map(a => Number(a));
  return calculateExercises(target, hours);
};

const trainingDays = (hours: Array<number>) => {
  let days = 0;
  for (const hour of hours) {
    if (hour > 0) {
      days++;
    }
  }
  return days;
};

const success = (average: number, target: number) => {
  if (average >= target) {
    return true;
  }
  return false;
};

const rating = (average: number, target: number) => {
  if (average >= target) {
    return 3;
  }
  if (average <= target / 2) {
    return 1;
  }
  return 2;
};

const ratingDescription = (rating: number) => {
  if (rating == 1) {
    return 'You need more exercice';
  }
  if (rating == 2) {
    return 'Your exercise time is at a good level but could be better';
  }
  return 'Congratulations, you have achieved your target!';
};

const average = (hours: Array<number>) => {
  const sum = hours.reduce((a, b) => a + b, 0);
  return sum / hours.length;
};

interface result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

console.log(calculateExercisesCL);

export { calculateExercises };