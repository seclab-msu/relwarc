import { hasattr } from './utils/common';

interface CommunicationEvent {
    type: string;
    data: unknown;
}

export class WebsocketClient {
    private socket: WebSocket | null;
    private readonly callbacks: object;

    constructor() {
        this.socket = null;
        this.callbacks = {};
    }
    connect(url: string): Promise<void> {
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

    emit(messageType: string, messageData?: string | object): void {
        if (this.socket) {
            this.socket.send(JSON.stringify({
                'type': messageType,
                'data': messageData,
            }));
        } else {
            throw new Error('Emit without socket');
        }
    }

    onmessage(event: MessageEvent): void {
        try {
            const data: CommunicationEvent = JSON.parse(event.data);
            const messageType = data.type;
            const messageData = data.data;

            if (hasattr(this.callbacks, messageType)) {
                this.callbacks[messageType](messageData);
            }
        } catch (exc) {
            console.error('got error' + exc);
        }
    }

    on(eventType: 'navigate', callback: (event: string) => void): void;
    on(eventType: 'exit', callback: () => void): void;
    on(eventType: string, callback: (event: string | never) => void): void {
        this.callbacks[eventType] = callback;
    }
}

