import { BaseModel } from "../../shared/baseModel";
export declare class Product extends BaseModel {
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
            qr: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            sku: {
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
            variant_id: {
                type: string;
                exclusiveMinimum: number;
            };
            category_id: {
                type: string;
                exclusiveMinimum: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
    static get relationMappings(): {
        ingredients: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
                through: {
                    from: string;
                    to: string;
                };
            };
        };
        variations: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        category: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
    };
    static get modifiers(): {
        joinVariations(query: any): void;
        publicColumns(query: any): void;
        publicInsertColumns(query: any): void;
    };
    static findWithIngredients(productId: any): import("objection").QueryBuilder<Product, Product | undefined>;
    static findVariationsWithIngredients(productId: any): import("objection").QueryBuilder<Product, Product | undefined>;
}
export interface Product {
    id: number;
    title: string;
    description: string;
    qr: string;
    sku: string;
    created_at: Date;
    updated_at: Date;
    uuid: string;
    variant_id: number;
    category_id: number;
}
