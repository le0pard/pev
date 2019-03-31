import lf from 'lovefield'

const MAIN_DB_NAME = 'dbPlans'
const PLANS_TABLE = 'plans'
const PLANS_LIMIT = 300

export default class DBConnector {
  constructor() {
    this.schemaBuilder = lf.schema.create(MAIN_DB_NAME, 1)
    this.createSchema()
    // this.connection().then((db) => {
    //   const plansTable = db.getSchema().table(PLANS_TABLE)
    //   const row = plansTable.createRow({
    //     content: {
    //       example: 1,
    //       test: [1, 2, 3]
    //     },
    //     createdAt: new Date()
    //   })
    //   db.insert().into(plansTable).values([row]).exec().then(() => {
    //     db.select()
    //       .from(plansTable)
    //       .orderBy(plansTable.createdAt, lf.Order.DESC)
    //       .limit(PLANS_LIMIT)
    //       .exec().then((rows) => {
    //         console.log('rows', rows)
    //         const lastCreatedAt = rows[rows.length - 1].createdAt

    //         db.delete()
    //           .from(plansTable)
    //           .where(plansTable.createdAt.lt(lastCreatedAt))
    //           .exec()
    //       })
    //   })
    // })
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
}
