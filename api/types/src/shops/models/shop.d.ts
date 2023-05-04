import { BaseModel } from "../../shared/baseModel";
import type { User } from "../../users/models/user";
export declare class Shop extends BaseModel {
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
            uuid: {
                readOnly: boolean;
                type: string;
                minLength: number;
                maxLength: number;
                format: string;
            };
            name: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            lat: {
                type: string;
                format: string;
            };
            lng: {
                type: string;
                format: string;
            };
            opening_time: {
                type: string;
                format: string;
            };
            closing_time: {
                type: string;
                format: string;
            };
            opening_days: {
                type: string;
                items: {
                    type: string;
                };
            };
            manager_id: {
                type: string;
                exclusiveMinimum: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get jsonAttributes(): string[];
    static get public_columns(): string[];
    static get modifiers(): {
        availableProducts(query: any): void;
        publicColumns(query: any): void;
        publicInsertColumns(query: any): void;
    };
    static get relationMappings(): {
        products: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                through: {
                    from: string;
                    to: string;
                };
                to: string;
            };
        };
    };
    openingDate(date: any): Date | undefined;
    closingDate(date: any): Date | undefined;
    isOpen(startDate: any, endDate?: any): boolean;
}
export interface Shop {
    id: number;
    created_at: Date;
    updated_at: Date;
    uuid: string;
    name: string;
    lat: number;
    lng: number;
    opening_time: string;
    closing_time: string;
    opening_days: string;
    manager_id: number;
    user?: User;
}
