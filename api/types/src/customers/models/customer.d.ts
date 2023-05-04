import { BaseModel } from "../../shared/baseModel";
declare const Customer_base: import("objection-password").PasswordStatic<typeof BaseModel> & Omit<typeof BaseModel, "new"> & BaseModel;
export declare class Customer extends Customer_base {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    uuid: string;
    static get tableName(): string;
    static get jsonSchema(): {
        $id: string;
        $async: boolean;
        title: string;
        description: string;
        type: string;
        properties: {
            id: {
                readOnly: boolean;
                type: string;
            };
            first_name: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            last_name: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            email: {
                type: string;
                format: string;
                minLength: number;
                maxLength: number;
            };
            password: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            created_at: {
                readOnly: boolean;
                type: string;
            };
            updated_at: {
                readOnly: boolean;
                type: string;
            };
            uuid: {
                readOnly: boolean;
                type: string;
                minLength: number;
                maxLength: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
    static get modifiers(): {
        tokenColumns(query: any): void;
        publicColumns(query: any): void;
        publicInsertColumns(query: any): void;
    };
    get scopes(): never[];
}
export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    uuid: string;
}
export {};
