import { prisma } from '@/lib/prisma';
import ClientHome from './ClientHome';

async function getMedicines() {
  try {
    const medicines = await prisma.medicine.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { name: 'asc' }
    });
    return medicines;
  } catch (error) {
    console.error('Failed to fetch medicines:', error);
    return [];
  }
}

async function getSettings() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    return settingsMap;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }
}

export default async function Home() {
  const medicines = await getMedicines();
  const settings = await getSettings();

  return (
    <main>
      <ClientHome medicines={medicines} settings={settings} />
    </main>
  );
}
