export interface RcaVerdict {
    severity: string;
    priority: string;
    rootCause: string;
    fixes: string[];
}

export async function analyzeFailure(_input: { title: string; file: string; error: string; stack?: string }): Promise<RcaVerdict> {
    return {
        severity: 'low',
        priority: 'low',
        rootCause: 'No AI analysis available (stub)',
        fixes: []
    };
}
