export const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

export const isNonEmpty = (value: string) => value.trim().length > 0

export default {
  isEmail,
  isNonEmpty,
}
