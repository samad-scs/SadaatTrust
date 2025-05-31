export const loginAction = async (form: FormData) => {
  'use server'

  const email = form.get('email')
  const password = form.get('password')

  console.log({ email, password })

  // ** Check User In DB
}
