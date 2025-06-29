import { Beneficiary } from '@prisma/client'

export const personAvatar = (data: Beneficiary) => {
  const { gender, age, maritalStatus } = data

  // Determine age category
  let ageCategory: string
  if (age && age < 13) {
    ageCategory = 'toddler'
  } else if (age && age < 20) {
    ageCategory = 'teenager'
  } else if (age && age >= 60) {
    ageCategory = 'senior'
  } else {
    ageCategory = 'adult'
  }

  // Determine marital status for adults
  let maritalCategory: string
  if (ageCategory === 'adult') {
    maritalCategory = maritalStatus?.toLowerCase() === 'married' ? 'married' : 'unmarried'
  } else {
    // For non-adults, use unmarried category
    maritalCategory = 'unmarried'
  }

  // Map to avatar path based on gender, age, and marital status
  const avatarMap: Record<string, string> = {
    'female-toddler': '/images/avatar/female-toddler.jpg',
    'female-teenager': '/images/avatar/female-teenage.jpg',
    'female-senior': '/images/avatar/female-senior.jpg',
    'female-married': '/images/avatar/female-married.jpg',
    'female-unmarried': '/images/avatar/female-unmarried.jpg',
    'male-toddler': '/images/avatar/male-toddler.jpg',
    'male-teenager': '/images/avatar/male-teenage.jpg',
    'male-senior': '/images/avatar/male-senior.jpg',
    'male-married': '/images/avatar/male-married.jpg',
    'male-unmarried': '/images/avatar/male-unmarried.jpg'
  }

  const key = `${gender?.toLowerCase()}-${ageCategory === 'adult' ? maritalCategory : ageCategory}`

  return avatarMap[key] || '/images/avatar/male-unmarried.jpg' // fallback to male unmarried if no match
}
