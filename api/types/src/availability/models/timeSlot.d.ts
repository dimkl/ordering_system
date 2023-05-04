import type { Customer } from "../../customers/models/customer";
import type { Slot } from "./slot";
import { BaseModel } from "../../shared/baseModel";
export declare class TimeSlot extends BaseModel {
    static get tableName(): string;
    static get public_columns(): string[];
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
            started_at: {
                type: string;
                format: string;
            };
            ended_at: {
                type: string;
                format: string;
            };
            customer_id: {
                type: string;
                exclusiveMinimum: number;
            };
            slot_id: {
                type: string;
                exclusiveMinimum: number;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
    static get modifiers(): {
        publicColumns(query: any): void;
        reserved(query: any, startedAt: any, endedAt: any): void;
        publicInsertColumns(query: any): void;
    };
    static get relationMappings(): {
        customer: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        slot: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
    };
}
export interface TimeSlot {
    id: number;
    created_at: Date;
    updated_at: Date;
    started_at: Date;
    ended_at: Date;
    slot_id: number;
    customer_id: number;
    uuid: string;
    slot?: Slot;
    customer?: Customer;
}
