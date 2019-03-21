import lf from 'lovefield'

export default class DBConnector {
  constructor() {
    this.schemaBuilder = lf.schema.create('dbPlans', 1)
    this.createSchema()
    this.connection().then((db) => {
      const plansTable = db.getSchema().table('plans')
      const row = plansTable.createRow({
        content: {
          example: 1,
          test: [1, 2, 3]
        },
        createdAt: new Date()
      })
      db.insertOrReplace().into(plansTable).values([row]).exec().then(() => {
        // console.log('rows', rows)
      })
    })
  }
  createSchema() {
    this.schemaBuilder.createTable('plans')
      .addColumn('id', lf.Type.INTEGER)
      .addColumn('name', lf.Type.STRING)
      .addColumn('query', lf.Type.STRING)
      .addColumn('content', lf.Type.OBJECT)
      .addColumn('createdAt', lf.Type.DATE_TIME)
      .addPrimaryKey([{name: 'id', autoIncrement: true}])
      .addIndex('idxCreatedAt', [{name: 'createdAt', order: lf.Order.DESC}], false)
      .addNullable(['name', 'query'])
  }
  connection() {
    if (this.db) {
      return Promise.resolve(this.db)
    } else {
      return this.schemaBuilder.connect().then((db) => {
        this.db = db
        return this.db
      })
    }
  }
}
