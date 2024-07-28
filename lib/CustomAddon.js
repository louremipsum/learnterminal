export default class CustomAttachAddon {
  constructor(socket, options) {
    this._disposables = [];
    this._socket = socket;
    this._socket.binaryType = "arraybuffer";
    this._bidirectional = !(options && options.bidirectional === false);
  }

  activate(term) {
    this._disposables.push(
      this._addEventListener(this._socket, "message", (event) => {
        const data = event.data;
        term.write(typeof data === "string" ? data : new Uint8Array(data));
      })
    );

    if (this._bidirectional) {
      this._disposables.push(term.onData((data) => this._sendData(data)));
      this._disposables.push(term.onBinary((data) => this._sendBinary(data)));
    }

    this._disposables.push(
      this._addEventListener(this._socket, "close", () => this.dispose())
    );
    this._disposables.push(
      this._addEventListener(this._socket, "error", () => this.dispose())
    );
  }

  dispose() {
    for (const d of this._disposables) {
      d.dispose();
    }
    this._disposables = [];
  }

  _sendData(data) {
    if (this._checkOpenSocket()) {
      this._socket.send(data);
    }
  }

  _sendBinary(data) {
    if (!this._checkOpenSocket()) return;
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
      buffer[i] = data.charCodeAt(i) & 255;
    }
    this._socket.send(buffer);
  }

  _checkOpenSocket() {
    switch (this._socket.readyState) {
      case WebSocket.OPEN:
        return true;
      case WebSocket.CONNECTING:
        throw new Error("Attach addon was loaded before socket was open");
      case WebSocket.CLOSING:
        console.warn("Attach addon socket is closing");
        return false;
      case WebSocket.CLOSED:
        throw new Error("Attach addon socket is closed");
      default:
        throw new Error("Unexpected socket state");
    }
  }

  _addEventListener(element, type, listener) {
    element.addEventListener(type, listener);
    return {
      dispose: () => {
        if (listener) {
          element.removeEventListener(type, listener);
        }
      },
    };
  }
}
