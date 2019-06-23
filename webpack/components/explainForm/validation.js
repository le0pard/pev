const isValidJson = (content) => {
  try {
    JSON.parse(content)
    return true
  } catch (e) {
    return false
  }
}

export const validate = (values) => {
  const errors = {}
  if (!values.content) {
    errors.content = 'Required'
  } else if (!isValidJson(values.content)) {
    errors.content = 'Invalid JSON'
  }
  return errors
}
