import { PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function seedSuperAdmin() {
  try {
    // Superadmin data
    const superAdminData = {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'SuperSecurePass123!',
      gender: 'Male',
      phone: '1234567890',
    }

    // Check if superadmin already exists
    const existingUser = await prisma.users.findUnique({
      where: { email: superAdminData.email },
    })

    if (existingUser) {
      console.log('Superadmin already exists:', superAdminData.email)
      return
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(superAdminData.phone)) {
      throw new Error('Phone number must be exactly 10 digits')
    }

    // Validate gender
    if (!['Male', 'Female'].includes(superAdminData.gender)) {
      throw new Error('Gender must be Male or Female')
    }

    const salt = genSaltSync(10)

    // Hash password
    const hashedPassword = hashSync(superAdminData.password, salt)

    // Create superadmin
    const superAdmin = await prisma.users.create({
      data: {
        name: superAdminData.name,
        email: superAdminData.email,
        password: hashedPassword,
        gender: superAdminData.gender,
        phone: superAdminData.phone,
      },
    })

    console.log('Superadmin created successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      name: superAdmin.name,
    })
  } catch (error) {
    console.error('Error seeding superadmin:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeder
seedSuperAdmin()
