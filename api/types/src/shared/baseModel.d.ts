import { Model, AjvValidator } from "objection";
declare const BaseModel_base: typeof Model;
export declare class BaseModel extends BaseModel_base {
    uuid?: string;
    static get modifiers(): {
        publicColumns(query: any): void;
        publicInsertColumns(query: any): void;
    };
    static createValidator(): AjvValidator;
    $beforeInsert(queryContext: any): Promise<void>;
    $beforeUpdate(): Promise<void>;
    get hasUuid(): boolean;
    generateUuid(): void;
    static findByIdOrUid(idOrUid: string | number): import("objection").QueryBuilder<BaseModel, BaseModel>;
    static whereByIdOrUid(idsOrUids: string[] | number[] | string | number): import("objection").QueryBuilder<BaseModel, BaseModel[]>;
    static getId(idOrUid: string | number): Promise<any>;
}
export {};
