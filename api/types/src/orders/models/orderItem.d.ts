import { BaseModel } from "../../shared/baseModel";
export declare class OrderItem extends BaseModel {
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
            order_id: {
                type: string;
                exclusiveMinimum: number;
            };
            created_at: {
                readOnly: boolean;
                type: string;
            };
            updated_at: {
                readOnly: boolean;
                type: string;
            };
            quantity: {
                type: string;
                exclusiveMinimum: number;
                default: number;
            };
            product_id: {
                type: string;
                exclusiveMinimum: number;
            };
            state: {
                $ref: string;
                default: string;
            };
            uuid: {
                readOnly: boolean;
                type: string;
                minLength: number;
                maxLength: number;
            };
        };
        required: string[];
        definitions: {
            state: {
                enum: string[];
            };
        };
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
    static get relationMappings(): {
        product: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        order: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
export interface OrderItem {
    id: number;
    created_at: Date;
    updated_at: Date;
    order_id: number;
    quantity: number;
    product_id: number;
    uuid: string;
    state: "draft" | "placed" | "prepared" | "delivered" | "canceled";
}
