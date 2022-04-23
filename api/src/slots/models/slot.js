const BaseModel = require('../../shared/baseModel');
const schema = require('../schemas/slot.json');

class Slot extends BaseModel {
  static get tableName() {
    return 'slots';
  }

  static get jsonSchema() {
    return schema;
  }


  static get modifiers() {
    return {
      ...super.modifiers,
      publicColumns(query) {
        query
          .select('slots.*')
          .joinRelated('user')
          .select('user.uuid as user_id')
          .joinRelated('section')
          .select('section.uuid as section_id');
      },
      active(query) {
        query.where({ active: true });
      }
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../users/models/user',
        join: {
          from: 'slots.user_id',
          to: 'users.id'
        }
      },
      section: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: __dirname + '/../../shops/models/section',
        join: {
          from: 'slots.section_id',
          to: 'sections.id'
        }
      }
    }
  }
}

module.exports = Slot;