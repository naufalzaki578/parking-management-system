export const PARKING_RATE = {
  firstHour: 5000,
  additionalHour: 3000
};

export function calculateFee(entryTime, exitTime) {
  const entry = new Date(entryTime);
  const exit = new Date(exitTime);

  const milliseconds = Math.max(0, exit - entry);
  const minutes = Math.ceil(milliseconds / 60000);
  const hours = Math.max(1, Math.ceil(minutes / 60));

  if (hours === 1) return PARKING_RATE.firstHour;

  return PARKING_RATE.firstHour +
    (hours - 1) * PARKING_RATE.additionalHour;
}
