import { addDays, getThisUpcomingSunday } from '../../localization';

const getDefaultDayLabels = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const nextSunday = getThisUpcomingSunday();

  return days.map((day, i) => {
    const date = addDays(nextSunday, i);
    return `${day} ${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  });
};

export const defaultTimeLabels = Array.from({ length: 48 }, (_, i) => {
  const hour = (Math.floor(i / 2) + 7) % 24;
  const minutes = i % 2 === 0 ? '00' : '30';
  const adjustedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const amPm = hour >= 12 && hour < 24 ? 'PM' : 'AM';
  return `${adjustedHour}:${minutes} ${amPm}`;
});

export const defaultDayLabels = getDefaultDayLabels();
