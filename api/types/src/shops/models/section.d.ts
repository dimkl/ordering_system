import { BaseModel } from "../../shared/baseModel";
import type { User } from "../../users/models/user";
import type { Shop } from "./shop";
export declare class Section extends BaseModel {
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
            name: {
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
                format: string;
            };
            sku: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            shop_id: {
                type: string;
                exclusiveMinimum: number;
            };
            user_id: {
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
export interface Section {
    id: number;
    created_at: Date;
    updated_at: Date;
    uuid: string;
    name: string;
    sku: string;
    shop_id: number;
    user_id: number;
    user: User;
    shop: Shop;
}
