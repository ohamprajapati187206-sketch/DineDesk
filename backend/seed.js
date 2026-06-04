const prisma = require('./db');
const bcrypt = require('bcrypt');

async function main() {
  // Create default branch
  const branch = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Main Branch', address: 'Surat, Gujarat', phone: '9999999999' }
  });
  console.log('Branch created:', branch.name);

  // Create superadmin (no branchId)
  const hash = await bcrypt.hash('admin123', 10);
  const superadmin = await prisma.user.upsert({
    where: { email: 'oham@dinedesk.com' },
    update: { role: 'superadmin', branchId: null },
    create: { name: 'Oham', email: 'oham@dinedesk.com', password: hash, role: 'superadmin', branchId: null }
  });
  console.log('Superadmin:', superadmin.email);

  // Migrate existing data to branch 1
  await prisma.order.updateMany({ where: { branchId: undefined }, data: { branchId: 1 } });
  await prisma.diningTable.updateMany({ where: {}, data: { branchId: 1 } });
  await prisma.room.updateMany({ where: {}, data: { branchId: 1 } });
  await prisma.booking.updateMany({ where: {}, data: { branchId: 1 } });
  await prisma.inventoryItem.updateMany({ where: {}, data: { branchId: 1 } });
  await prisma.staff.updateMany({ where: {}, data: { branchId: 1 } });
  console.log('Existing data migrated to Main Branch');
}

main().catch(console.error).finally(() => prisma.$disconnect());