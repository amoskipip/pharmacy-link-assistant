import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123'
    }
  });
  console.log('Created admin:', admin.username);

  const medicines = [
    {
      name: 'Panadol Extra',
      description: 'Fast relief from pain and fever. Contains paracetamol and caffeine.',
      price: 150.00,
      stock: 100,
      category: 'Pain Relief',
      requiresPrescription: false
    },
    {
      name: 'Amoxicillin 500mg',
      description: 'Antibiotic for bacterial infections. Take as prescribed.',
      price: 320.00,
      stock: 50,
      category: 'Antibiotics',
      requiresPrescription: true
    },
    {
      name: 'Omeprazole 20mg',
      description: 'For acid reflux and stomach ulcers.',
      price: 280.00,
      stock: 75,
      category: 'Digestive',
      requiresPrescription: true
    },
    {
      name: 'Piriton Syrup',
      description: 'Antihistamine for allergies and hay fever.',
      price: 180.00,
      stock: 60,
      category: 'Allergy',
      requiresPrescription: false
    },
    {
      name: 'Metformin 500mg',
      description: 'For type 2 diabetes management.',
      price: 250.00,
      stock: 80,
      category: 'Diabetes',
      requiresPrescription: true
    },
    {
      name: 'Eno Sachets',
      description: 'Quick relief from heartburn and indigestion.',
      price: 50.00,
      stock: 200,
      category: 'Digestive',
      requiresPrescription: false
    },
    {
      name: 'Ventolin Inhaler',
      description: 'Relief from asthma symptoms.',
      price: 850.00,
      stock: 25,
      category: 'Respiratory',
      requiresPrescription: true
    },
    {
      name: 'Rehydration Salts',
      description: 'For treatment of dehydration due to diarrhea.',
      price: 80.00,
      stock: 150,
      category: 'General Health',
      requiresPrescription: false
    }
  ];

  for (const medicine of medicines) {
    await prisma.medicine.upsert({
      where: { name: medicine.name },
      update: medicine,
      create: medicine
    });
  }
  console.log('Created sample medicines');

  const settings = [
    { key: 'logo', value: 'Nyagah Chemist' },
    { key: 'heroTitle', value: 'Your Trusted Online Pharmacy' },
    { key: 'heroSubtitle', value: 'Quality medicines delivered to your doorstep. Upload your prescription and get started today.' },
    { key: 'phone', value: '+254 700 000 000' },
    { key: 'email', value: 'info@nyagahchemist.com' },
    { key: 'address', value: 'Nairobi, Kenya' },
    { key: 'workingHours', value: 'Mon - Sat: 8:00 AM - 8:00 PM' },
    { key: 'sundayHours', value: 'Sunday: 9:00 AM - 5:00 PM' }
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }
  console.log('Created default settings');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
