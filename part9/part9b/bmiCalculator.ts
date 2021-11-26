const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / (height * height / 10000);
  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi > 24.9) {
    return 'Overweight';
  }
  return 'Normal (healthy weight)';
};

//input parameters using command line
const calculateBmiCL = () => {
  const height = Number(process.argv[2]);
  const weight = Number(process.argv[3]);
  return calculateBmi(height, weight);
};

console.log(calculateBmiCL());

export { calculateBmi };