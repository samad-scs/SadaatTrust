const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedSuperAdmin() {
  try {
    // Dynamically import bcrypt-ts
    const bcrypt = await import('bcrypt-ts')

    // Superadmin data
    const superAdminData = {
      name: 'Super Admin',
      email: 'admin@sadaat.com',
      password: 'Abc@223133',
      gender: 'Male',
      phone: '1234567890',
      isSuperAdmin: true,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '0'
    }

    // Check if superadmin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: superAdminData.email }
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

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminData.password, 10)

    // Create superadmin
    const superAdmin = await prisma.user.create({
      data: {
        name: superAdminData.name,
        email: superAdminData.email,
        password: hashedPassword,
        gender: superAdminData.gender,
        phone: superAdminData.phone
      }
    })

    console.log('Superadmin created successfully:', {
      id: superAdmin.id,
      email: superAdmin.email,
      name: superAdmin.name
    })
  } catch (error) {
    console.error('Error seeding superadmin:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeder
seedSuperAdmin()
