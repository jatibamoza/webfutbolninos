// Bridge pattern: cualquier módulo puede llamar toast() sin necesitar el context React.
// ToastContext.jsx registra el handler real al montarse.
let _handler = null;

export function registerToast(handler) {
  _handler = handler;
}

export function toast(message, type = 'success') {
  if (_handler) {
    _handler(message, type);
  } else {
    console.warn('[toast] handler no registrado aún:', message);
  }
}
