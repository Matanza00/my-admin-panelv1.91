const jobSlipIdGenerator = (departmentCode, area) => {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  // Use a static object to keep track of counters
  if (!jobSlipIdGenerator.counters) {
    jobSlipIdGenerator.counters = {};
  }

  // Check if a counter exists for the given department, area, and date
  if (!jobSlipIdGenerator.counters[dateKey]) {
    jobSlipIdGenerator.counters[dateKey] = {};
  }

  if (!jobSlipIdGenerator.counters[dateKey][departmentCode]) {
    jobSlipIdGenerator.counters[dateKey][departmentCode] = {};
  }

  if (!jobSlipIdGenerator.counters[dateKey][departmentCode][area]) {
    jobSlipIdGenerator.counters[dateKey][departmentCode][area] = 1; // Start from 01 for a new day
  } else {
    jobSlipIdGenerator.counters[dateKey][departmentCode][area] += 1; // Increment for the day
  }

  // Get the counter value and format it as a two-digit number
  const counterValue = jobSlipIdGenerator.counters[dateKey][departmentCode][area]
    .toString()
    .padStart(2, '0');

  // Generate the jobslipId
  return `${departmentCode}-${area}/DC/${counterValue}`;
};

export default jobSlipIdGenerator;
