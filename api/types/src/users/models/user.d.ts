import { BaseModel } from "../../shared/baseModel";
declare const User_base: import("objection-password").PasswordStatic<typeof BaseModel> & Omit<typeof BaseModel, "new"> & BaseModel;
export declare class User extends User_base {
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
            role: {
                $ref: string;
                default: string;
            };
        };
        required: string[];
        definitions: {
            role: {
                enum: string[];
            };
        };
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
    get scopes(): never[];
}
export interface User {
    id: number;
    created_at: Date;
    updated_at: Date;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    uuid: string;
    role: "guest" | "waiter" | "chef" | "other" | "admin";
}
export {};
