import bcrypt from 'bcryptjs'

const saltRounds = 15

export const generateHash = (data: string) => {
  return bcrypt.hashSync(data, saltRounds)
}

export const verifyHash = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}

function getRandomChar(characters: string): string {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  const randomIndex = array[0] % characters.length
  return characters[randomIndex]
}

export const generateStrongPassword = () => {
  const minLength = 12
  const maxLength = 16

  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numericChars = '0123456789'
  const specialChars = '!@#$%^&*()_-+=<>?'

  const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars

  let password = ''

  // Ensure at least one character from each character set
  password += getRandomChar(lowercaseChars)
  password += getRandomChar(uppercaseChars)
  password += getRandomChar(numericChars)
  password += getRandomChar(specialChars)

  // Fill the remaining length with random characters
  for (let i = password.length; i < length; i++)
    password += getRandomChar(allChars)

  // Shuffle the password to ensure randomness
  password = password.split('').sort(() => Math.random() - 0.5).join('')

  return password
}
