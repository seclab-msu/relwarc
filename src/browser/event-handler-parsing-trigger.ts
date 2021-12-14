interface Evaluatable {
    evaluate(f: () => unknown): Promise<unknown> | unknown
}

export async function triggerParsingOfEventHandlerAttributes(
    e: Evaluatable
): Promise<unknown> {
    return await e.evaluate(async () => {
        const allElements = document.querySelectorAll('*');
        const handlers: string[] = [];

        allElements.forEach(elem => {
            const eventHandlers = elem.getAttributeNames().filter(name => {
                return !name.indexOf('on');
            });
            for (const eventHandler of eventHandlers) {
                if (typeof elem[eventHandler] === 'function') {
                    handlers.push(elem.getAttribute(eventHandler) as string);
                }
            }
        });
        return handlers;
    });
}
