export function convertTimeStringToMinutes(timeString: string) { // 09:30
  const [hours, minutes] = timeString.split(':').map(Number)

  return hours * 60 + minutes
}
