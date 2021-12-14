import { HAR } from './har';

export { DynamicDEPMiner } from './backend';

export interface DynamicDEPMiner {
    getDEPs(): HAR[];
    close(): void;
}
