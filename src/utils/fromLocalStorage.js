export default function (key) {
  const dataJSON = localStorage.getItem(key);
  const data = JSON.parse(dataJSON);
  return data;
}
