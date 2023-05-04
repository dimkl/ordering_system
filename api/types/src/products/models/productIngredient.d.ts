import { BaseModel } from "../../shared/baseModel";
export declare class ProductIngredient extends BaseModel {
    id: number;
    created_at: Date;
    updated_at: Date;
    ingredient_id: number;
    product_id: number;
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
            ingredient_id: {
                type: string;
                exclusiveMinimum: number;
            };
            product_id: {
                type: string;
                exclusiveMinimum: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
    get hasUuid(): boolean;
}
export interface ProductIngredient {
    id: number;
    created_at: Date;
    updated_at: Date;
    ingredient_id: number;
    product_id: number;
}
