let debugFlag = false;

export function debugEnabled(): boolean {
    return debugFlag;
}

export function setDebug(enabled: boolean): void {
    debugFlag = enabled;
}
