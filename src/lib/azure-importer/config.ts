export const ALIASES_OF_UNITS: {[key: string]: string[]} = {
  seconds: ['second', 'secs', 'sec', 's'],
  minutes: ['m', 'min', 'mins'],
  hours: ['hour', 'h', 'hr', 'hrs'],
  days: ['d'],
  weeks: ['week', 'wk', 'w', 'wks'],
  months: ['mth'],
  years: ['yr', 'yrs', 'y', 'ys'],
};

export const TIME_UNITS_IN_SECONDS: Record<string, number> = {
  s: 1,
  second: 1,
  sec: 1,
  secs: 1,
  seconds: 1,
  min: 60,
  mins: 60,
  minute: 60,
  minutes: 60,
  h: 3600,
  hs: 3600,
  hr: 3600,
  hrs: 3600,
  hour: 3600,
  hours: 3600,
  d: 86400,
  ds: 86400,
  day: 86400,
  days: 86400,
  w: 604800,
  ws: 604800,
  wk: 604800,
  wks: 604800,
  week: 604800,
  weeks: 604800,
  m: 2419200,
  mnth: 2419200,
  mth: 2419200,
  mnths: 2419200,
  mths: 2419200,
  month: 2419200,
  months: 2419200,
  y: 31536000,
  ys: 31536000,
  yr: 31536000,
  yrs: 31536000,
  year: 31536000,
  years: 31536000,
};
