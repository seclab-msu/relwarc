import {
    Comment,
    File as AST
} from '@babel/types';

export function combineComments(
    splitComments: Comment[] | undefined | null
): Comment[] {
    return [];
}

export function parseComments(comments: Comment[]): AST[] {
    return [];
}

export async function uncommenterRetry(
    cb: (uncomment) => void,
    uncomment: boolean
): Promise<void> {
    await cb(uncomment);
}
