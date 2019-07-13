import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .notRequired(),
  query: Yup.string()
    .notRequired(),
  content: Yup.string()
    .required('Required')
    .test({
      name: 'isJSON',
      exclusive: false,
      message: 'Invalid JSON',
      test: (value) => {
        try {
          JSON.parse(value)
          return true
        } catch (e) {
          return false
        }
      },
    })
})
