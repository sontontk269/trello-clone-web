export const FIELD_REQUIRED_MESSAGE = 'This field is required'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Invalid email address'
export const PASSWORD_RULE =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
export const PASSWORD_RULE_MESSAGE =
  'Password must contain at least 8 characters, including uppercase, lowercase letters and numbers'

export const LIMIT_COMMON_FILE_SIZE = 10485760 //byte = 10MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.type || !file.size) {
    return 'File cannot be empty'
  }

  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'File size is too large'
  }

  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is not supported'
  }
  return null
}
