const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/shop.json');

class Section extends BaseModel {
  static get tableName() {
    return 'sections';
  }

  static get jsonSchema() {
    return schema;
  }

  static get public_columns() {
    return Object.keys(schema.properties);
  }

  static get relationMappings() {
    return {
      shop: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/shop',
        join: {
          from: 'sections.shop_id',
          to: 'shops.id'
        }
      }
    }
  }
}

module.exports = Section;