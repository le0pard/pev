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
    .test({
      name: 'isPlanJSON',
      exclusive: false,
      message: 'Invalid Plan JSON',
      test: (value) => {
        try {
          const planJSON = JSON.parse(value)
          const planContent = (() => {
            if (Array.isArray(planJSON)) {
              return Object.assign({}, planJSON[0])
            }
            return Object.assign({}, planJSON)
          })()
          return !!planContent.Plan
        } catch (e) {
          return false
        }
      },
    })
})
