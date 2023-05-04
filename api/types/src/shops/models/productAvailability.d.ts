import { BaseModel } from "../../shared/baseModel";
export declare class ProductAvailability extends BaseModel {
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
                inclusiveMinimum: number;
                default: number;
            };
            product_id: {
                type: string;
                exclusiveMinimum: number;
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
export interface ProductAvailability {
    id: number;
    created_at: Date;
    updated_at: Date;
    quantity: number;
    product_id: number;
    shop_id: number;
}
