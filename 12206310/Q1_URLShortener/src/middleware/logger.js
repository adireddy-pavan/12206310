export const logEvent = (event) => {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({ timestamp: new Date().toISOString(), ...event });
  localStorage.setItem('logs', JSON.stringify(logs));
};
