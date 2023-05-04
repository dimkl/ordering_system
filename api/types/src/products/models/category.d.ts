import { BaseModel } from "../../shared/baseModel";
export declare class Category extends BaseModel {
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
                exclusiveMinimum: number;
            };
            title: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            description: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            uuid: {
                readOnly: boolean;
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
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
}
export interface Category {
    id: number;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    uuid: string;
}
