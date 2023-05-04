import type { Customer } from "../../src/customers/models/customer";
import type { Product, Ingredient, ProductIngredient } from "../../src/products/models";
import type { Order, OrderItem } from "../../src/orders/models";
import type { User } from "../../src/users/models/user";
import type { Slot, TimeSlot } from "../../src/availability/models";
import type { Shop, Section, ProductAvailability, Holiday } from "../../src/shops/models";
export declare class DataFactory {
    static createCustomer(options?: Partial<Customer>): Promise<Customer>;
    static createIngredient(options?: Partial<Ingredient>): Promise<Ingredient>;
    static createProduct(options?: Partial<Product>): Promise<Product>;
    static createOrder(options?: Partial<Order>, customer?: Partial<Customer>, timeSlot?: Partial<TimeSlot>): Promise<Order>;
    static createOrderItem(options?: Partial<OrderItem>, order?: Partial<Order>, product?: Partial<Product>, customer?: Partial<Customer>): Promise<{
        product: Partial<Product>;
        order: Partial<Order>;
        id: number;
        created_at: Date;
        updated_at: Date;
        order_id: number;
        quantity: number;
        product_id: number;
        uuid: string;
        state: "draft" | "placed" | "prepared" | "delivered" | "canceled";
        $modelClass: import("objection").ModelClass<OrderItem>;
        QueryBuilderType: import("objection").QueryBuilder<OrderItem, OrderItem[]>;
    }>;
    static createUser(options?: Partial<User>): Promise<User>;
    static createShop(options?: Partial<Shop>, user?: Partial<User>): Promise<Shop>;
    static createSection(options?: Partial<Section>, shop?: Partial<Shop>, user?: Partial<User>): Promise<Section>;
    static createSlot(options?: Partial<Slot>, section?: Partial<Section>, user?: Partial<User>, shop?: Partial<Shop>): Promise<Slot>;
    static createTimeSlot(options?: Partial<TimeSlot>, customer?: Partial<Customer>, slot?: Partial<Slot>, section?: Partial<Section>, user?: Partial<User>, shop?: Partial<Shop>): Promise<TimeSlot>;
    static createHoliday(options?: Partial<Holiday>, shop?: Partial<Shop>, user?: Partial<User>): Promise<{
        shop: Partial<Shop>;
        id: number;
        created_at: Date;
        updated_at: Date;
        name: string;
        date: Date;
        shop_id: number;
        uuid?: string | undefined;
        $modelClass: import("objection").ModelClass<Holiday>;
        QueryBuilderType: import("objection").QueryBuilder<Holiday, Holiday[]>;
    }>;
    static createProductAvailability(options?: Partial<ProductAvailability>, product?: Partial<Product>, shop?: Partial<Shop>, user?: Partial<User>): Promise<{
        shop: Partial<Shop>;
        product: Partial<Product>;
        id: number;
        created_at: Date;
        updated_at: Date;
        quantity: number;
        product_id: number;
        shop_id: number;
        uuid?: string | undefined;
        $modelClass: import("objection").ModelClass<ProductAvailability>;
        QueryBuilderType: import("objection").QueryBuilder<ProductAvailability, ProductAvailability[]>;
    }>;
    static createProductIngredient(options?: Partial<ProductIngredient>, product?: Partial<Product>, ingredient?: Partial<Ingredient>): Promise<{
        ingredient: Partial<Ingredient>;
        product: Partial<Product>;
        id: number;
        created_at: Date;
        updated_at: Date;
        ingredient_id: number;
        product_id: number;
        uuid?: string | undefined;
        $modelClass: import("objection").ModelClass<ProductIngredient>;
        QueryBuilderType: import("objection").QueryBuilder<ProductIngredient, ProductIngredient[]>;
    }>;
}
