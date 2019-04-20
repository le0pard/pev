import lf from 'lovefield'

const MAIN_DB_NAME = 'dbPlans'
const PLANS_TABLE = 'plans'
const PLANS_LIMIT = 300

export default class DBConnector {
  constructor() {
    this.schemaBuilder = lf.schema.create(MAIN_DB_NAME, 1)
    this.createSchema()
  }

  createSchema() {
    this.schemaBuilder.createTable(PLANS_TABLE)
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('name', lf.Type.STRING)
      .addColumn('query', lf.Type.STRING)
      .addColumn('content', lf.Type.OBJECT)
      .addColumn('createdAt', lf.Type.DATE_TIME)
      .addPrimaryKey([{name: 'id', autoIncrement: true, order: lf.Order.ASC}])
      .addIndex('idxCreatedAt', [{name: 'createdAt', order: lf.Order.DESC}], false)
      .addNullable(['name', 'query'])
  }

  connection() {
    if (this.db) {
      return Promise.resolve(this.db)
    } else {
      const options = {
        storeType: lf.schema.DataStoreType.INDEXED_DB
      }
      return this.schemaBuilder.connect(options).then((db) => {
        this.db = db
        return this.db
      })
    }
  }

  cleanupOldPlans(rows) {
    if (rows.length) {
      return this.connection().then((db) => {
        const plansTable = db.getSchema().table(PLANS_TABLE)
        const lastCreatedAt = rows[rows.length - 1].createdAt

        return db.delete()
          .from(plansTable)
          .where(plansTable.createdAt.lt(lastCreatedAt))
          .exec()
      })
    }
    return null
  }

  getPlans() {
    return this.connection().then((db) => {
      const plansTable = db.getSchema().table(PLANS_TABLE)
      return db.select()
        .from(plansTable)
        .orderBy(plansTable.createdAt, lf.Order.DESC)
        .limit(PLANS_LIMIT)
        .exec().then((rows) => {
          this.cleanupOldPlans(rows)
          return rows
        })
    })
  }

  getPlan(planId) {
    return this.connection().then((db) => {
      const plansTable = db.getSchema().table(PLANS_TABLE)
      return db.select()
        .from(plansTable)
        .where(plansTable.id.eq(planId))
        .exec().then((rows) => {
          if (rows && rows.length) {
            return rows[0]
          } else {
            return null
          }
        })
    })
  }

  addPlan(plan) {
    return this.connection().then((db) => {
      const plansTable = db.getSchema().table(PLANS_TABLE)
      const row = plansTable.createRow({
        ...plan,
        createdAt: new Date()
      })
      return db.insert()
        .into(plansTable)
        .values([row])
        .exec().then((rows) => {
          if (rows && rows.length) {
            return rows[0]
          } else {
            return null
          }
        })
    })
  }

  deletePlan(planId) {
    return this.connection().then((db) => {
      const plansTable = db.getSchema().table(PLANS_TABLE)
      return db.delete().from(plansTable).where(plansTable.id.eq(planId)).exec()
    })
  }

  cleanupPlans() {
    return this.connection().then((db) => {
      const plansTable = db.getSchema().table(PLANS_TABLE)
      return db.delete().from(plansTable).exec()
    })
  }
}
