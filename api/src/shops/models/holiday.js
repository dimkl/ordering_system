const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/holiday.json');

class Holiday extends BaseModel {
  static get tableName() {
    return 'holidays';
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
        modelClass: __dirname + '/../../shops/models/shop',
        join: {
          from: 'holidays.shop_id',
          to: 'shops.id'
        }
      }
    }
  }
}

module.exports = Holiday;