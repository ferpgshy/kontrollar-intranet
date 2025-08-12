// dispara evento para a dashboard e salva no localStorage
function saveAndEmit(key, arr) {
  window[key] = arr;
  localStorage.setItem(key, JSON.stringify(arr));
  document.dispatchEvent(new CustomEvent(`data:${key}:changed`));
}

// só dispara (útil quando você já salvou antes)
function emitDataChanged(key) {
  document.dispatchEvent(new CustomEvent(`data:${key}:changed`));
}
