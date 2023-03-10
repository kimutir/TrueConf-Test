// запоминает данные в localStorage

export default function ({ key, param, value, num }) {
  const storeQueuesJSON = localStorage.getItem(key);
  const storeQueue = JSON.parse(storeQueuesJSON);

  storeQueue[num][param] = value;

  localStorage.queues = JSON.stringify(storeQueue);
}
