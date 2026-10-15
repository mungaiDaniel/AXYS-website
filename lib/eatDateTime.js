const EAT_TIME_ZONE = 'Africa/Nairobi';

// Converts a stored UTC instant into the YYYY-MM-DDTHH:mm value required by
// datetime-local controls, always using East Africa Time (UTC+3).
export function toEATDateTimeLocal(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const values = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: EAT_TIME_ZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).filter(({ type }) => type !== 'literal').map(({ type, value: part }) => [type, part])
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

// Treats a datetime-local value as EAT rather than the browser/server timezone.
export function fromEATDateTimeLocal(value) {
  if (!value) return '';
  const withSeconds = value.length === 16 ? `${value}:00` : value;
  return new Date(`${withSeconds}+03:00`).toISOString();
}

export function formatEATDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleString('en-KE', {
    timeZone: EAT_TIME_ZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
