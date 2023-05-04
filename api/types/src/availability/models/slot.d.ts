import type { User } from "../../users/models/user";
import type { Section } from "../../shops/models";
import { BaseModel } from "../../shared/baseModel";
export declare class Slot extends BaseModel {
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
                format: string;
            };
            updated_at: {
                readOnly: boolean;
                type: string;
                format: string;
            };
            uuid: {
                readOnly: boolean;
                type: string;
                minLength: number;
                maxLength: number;
                format: string;
            };
            section_id: {
                type: string;
                exclusiveMinimum: number;
            };
            user_id: {
                type: string;
                exclusiveMinimum: number;
            };
            sku: {
                type: string;
                minLength: number;
                maxLength: number;
            };
            active: {
                type: string;
                default: boolean;
            };
            capacity: {
                type: string;
                exclusiveMinimum: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get modifiers(): {
        publicColumns(query: any): void;
        active(query: any): void;
        available(query: any, shopId: any, startDate: any, endDate: any): void;
        publicInsertColumns(query: any): void;
    };
    static get relationMappings(): {
        user: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        section: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        time_slots: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
export interface Slot {
    id: number;
    created_at: Date;
    updated_at: Date;
    capacity: number;
    active: boolean;
    sku: string;
    section_id: number;
    user_id: number;
    uuid: string;
    user: User;
    section: Section;
}
