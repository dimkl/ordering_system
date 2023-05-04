export declare const development: {
    client: string;
    connection: string | undefined;
    migrations: {
        directory: string;
        tableName: string;
    };
    seeds: {
        directory: string;
    };
    searchPath: string[];
    asyncStackTraces: boolean;
    useNullAsDefault: boolean;
};
export declare const production: {
    client: string;
    connection: string | undefined;
    migrations: {
        directory: string;
        tableName: string;
    };
    seeds: {
        directory: string;
    };
    searchPath: string[];
    asyncStackTraces: boolean;
    useNullAsDefault: boolean;
};
export declare const test: {
    connection: string;
    client: string;
    migrations: {
        directory: string;
        tableName: string;
    };
    seeds: {
        directory: string;
    };
    searchPath: string[];
    asyncStackTraces: boolean;
    useNullAsDefault: boolean;
};
declare const _default: {
    development: {
        client: string;
        connection: string | undefined;
        migrations: {
            directory: string;
            tableName: string;
        };
        seeds: {
            directory: string;
        };
        searchPath: string[];
        asyncStackTraces: boolean;
        useNullAsDefault: boolean;
    };
    production: {
        client: string;
        connection: string | undefined;
        migrations: {
            directory: string;
            tableName: string;
        };
        seeds: {
            directory: string;
        };
        searchPath: string[];
        asyncStackTraces: boolean;
        useNullAsDefault: boolean;
    };
    test: {
        connection: string;
        client: string;
        migrations: {
            directory: string;
            tableName: string;
        };
        seeds: {
            directory: string;
        };
        searchPath: string[];
        asyncStackTraces: boolean;
        useNullAsDefault: boolean;
    };
};
export default _default;
