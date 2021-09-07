const calculateBmi = () => {
  const height: number = Number(process.argv[2])
  const weight: number = Number(process.argv[3])
  const bmi = weight / (height * height / 10000);
  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi > 24.9) {
    return 'Overweight';
  }
  return 'Normal (healthy weight)';
}

console.log(calculateBmi());