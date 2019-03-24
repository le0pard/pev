export const validate = (values) => {
  const errors = {}
  if (!values.content) {
    errors.content = 'Required'
  } else {
    // const dbVersion = parseFloat(values.dbVersion)
    // if (DB_VERSIONS.indexOf(dbVersion) < 0) {
    //   errors.dbVersion = 'Unsupported database version'
    // }
  }
  return errors
}
