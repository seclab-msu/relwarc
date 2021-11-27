export function observeMutations(
    win: Window,
    cb: () => void
): MutationObserver {
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    };

    const observer = new MutationObserver(() => cb());

    observer.observe(win.document.documentElement, config);
    return observer;
}
