function saveAndEmit(key, arr) {
  window[key] = arr;
  localStorage.setItem(key, JSON.stringify(arr));
  document.dispatchEvent(new CustomEvent(`data:${key}:changed`));
}

function emitDataChanged(key) {
  document.dispatchEvent(new CustomEvent(`data:${key}:changed`));
}
