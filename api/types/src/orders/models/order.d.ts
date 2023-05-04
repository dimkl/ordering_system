import type { OrderItem } from "./orderItem";
import { TimeSlot } from "../../availability/models";
import { Customer } from "../../customers/models/customer";
import { BaseModel } from "../../shared/baseModel";
export declare class Order extends BaseModel {
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
            customer_id: {
                type: string;
                exclusiveMinimum: number;
            };
            state: {
                $ref: string;
                default: string;
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
            };
            time_slot_id: {
                type: string;
                exclusiveMinimum: number;
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
    static get modifiers(): {
        publicColumns(query: any): void;
        publicInsertColumns(query: any): void;
    };
    static get relationMappings(): {
        order_items: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        customer: {
            relation: import("objection").RelationType;
            modelClass: string;
            join: {
                from: string;
                to: string;
            };
        };
        timeSlot: {
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
                through: {
                    from: string;
                    to: string;
                };
            };
        };
    };
    static findWithOrderItemsAndProducts(orderId: any): import("objection").QueryBuilder<Order, Order | undefined>;
}
export interface Order {
    id: number;
    created_at: Date;
    updated_at: Date;
    customer_id: number;
    time_slot_id: number;
    uuid: string;
    state: "draft" | "placed" | "processing" | "delivered" | "payment_requested" | "invoiced" | "paid" | "canceled";
    order_items: OrderItem[];
    customer: Customer;
    timeSlot: TimeSlot;
}
