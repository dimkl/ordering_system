export declare function createJwt(customerUuid: string, { role }?: {
    role?: string | undefined;
}): Promise<{
    role: string;
    access_token: string;
    scopes: string;
}>;
