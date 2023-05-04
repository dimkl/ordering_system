import { BaseModel } from "../../shared/baseModel";
export declare class Ingredient extends BaseModel {
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
            allergen: {
                type: string;
                default: boolean;
            };
            suitable_for_diet: {
                $ref: string;
            };
        };
        required: string[];
        definitions: {
            suitable_for_diet: {
                enum: string[];
            };
        };
        additionalProperties: boolean;
    };
    static get public_columns(): string[];
}
type SuitableForDiet = "all" | "diabetic" | "gluten_free" | "halal" | "hindu" | "kosher" | "low_calorie" | "low_fat" | "low_lactose" | "low_salt" | "vegan" | "vegetarian";
export interface Ingredient {
    id: number;
    title: string;
    description: string;
    qr: string;
    sku: string;
    created_at: Date;
    updated_at: Date;
    uuid: string;
    allergen: boolean;
    suitable_for_diet: SuitableForDiet;
}
export {};
