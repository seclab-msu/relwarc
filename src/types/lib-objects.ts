export class LibClass {
    readonly libName: string;
    readonly isAJAXCall: boolean;

    constructor(libName: string, isAJAXCall: boolean) {
        this.libName = libName;
        this.isAJAXCall = isAJAXCall;
    }
}

export class LibObject {
    readonly libName: string;

    constructor(libName: string) {
        this.libName = libName;
    }
}
