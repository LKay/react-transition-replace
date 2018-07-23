export function isNil(obj: any) {
    return obj === undefined || obj === null;
}

export const values = Object.values || ((obj: any) => Object.keys(obj).map((key: string) => obj[key]));
