import { BaseModel } from "../../shared/baseModel";
export declare class Holiday extends BaseModel {
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
            created_at: {
                readOnly: boolean;
                type: string;
            };
            updated_at: {
                readOnly: boolean;
                type: string;
            };
            name: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            date: {
                type: string;
                format: string;
            };
            shop_id: {
                type: string;
                exclusiveMinimum: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
    static get relationMappings(): {
        shop: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
export interface Holiday {
    id: number;
    created_at: Date;
    updated_at: Date;
    name: string;
    date: Date;
    shop_id: number;
}
