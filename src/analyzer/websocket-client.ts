interface CommunicationEvent {
    type: string;
    data: any;
}

export class WebsocketClient {
    private socket: WebSocket | null;
    private readonly callbacks: object;

    constructor() {
        this.socket = null;
        this.callbacks = {};
    }
    connect(url: string) {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(url);

            this.socket.onmessage = this.onmessage.bind(this);

            this.socket.onopen = function () {
                resolve();
            };

            this.socket.onclose = function (err) {
                reject(err);
            };
        });
    }

    emit(messageType: string, messageData: any = undefined) {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                'type': messageType,
                'data': messageData,
            }));
        } else {
            throw new Error("Emit without socket");
        }
    }

    onmessage(event: MessageEvent) {
        try {
            const data: CommunicationEvent = JSON.parse(event.data);
            const messageType = data.type;
            const messageData = data.data;

            if (this.callbacks.hasOwnProperty(messageType)) {
                this.callbacks[messageType](messageData);
            }
        } catch (exc) {
            console.error('got error' + exc);
        }
    }

    on(eventType: string, callback: (any) => void) {
        this.callbacks[eventType] = callback;
    }
}


module.exports = WebsocketClient;