import "dotenv/config";
import { prisma } from "./lib/prisma";
import { seedAdminIfNeeded } from "./services/authService";

async function main() {
  console.log("Starting database seeding...");

  // 1. Seed Admin
  const admin = await seedAdminIfNeeded();
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Seed Departments
  const departmentsData = [
    { name: "Front Office", description: "Guest relations, front desk, and reservations." },
    { name: "Housekeeping", description: "Cleaning, laundry, and room maintenance." },
    { name: "Food & Beverage", description: "Restaurant, kitchen, bar, and room service." },
    { name: "Maintenance", description: "Facilities, plumbing, electrical, and HVAC." },
    { name: "Human Resources", description: "Staffing, training, and employee relations." },
  ];

  const departmentsMap: Record<string, string> = {};
  for (const dept of departmentsData) {
    const record = await prisma.department.upsert({
      where: { name: dept.name },
      update: { description: dept.description },
      create: dept,
    });
    departmentsMap[dept.name] = record.id;
  }
  console.log("Departments seeded.");

  // 3. Seed Roles
  const rolesData = [
    { name: "Manager", description: "Department oversight and management." },
    { name: "Receptionist", description: "Guest check-in, check-out, and phone calls." },
    { name: "Housekeeper", description: "Guest room and area cleaning." },
    { name: "Chef", description: "Food preparation and kitchen supervision." },
    { name: "Waiter", description: "Table service and guest dining experience." },
    { name: "Maintenance Technician", description: "Equipment repairs and facility maintenance." },
    { name: "HR Officer", description: "Employee recruitment and administrative support." },
  ];

  const rolesMap: Record<string, string> = {};
  for (const role of rolesData) {
    const record = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
    rolesMap[role.name] = record.id;
  }
  console.log("Roles seeded.");

  // 4. Seed Shifts
  const shiftsData = [
    { name: "Morning", startTime: "07:00", endTime: "15:00", description: "Standard morning shift." },
    { name: "Afternoon", startTime: "15:00", endTime: "23:00", description: "Evening shift." },
    { name: "Night", startTime: "23:00", endTime: "07:00", description: "Overnight shift." },
  ];

  const shiftsMap: Record<string, string> = {};
  for (const shift of shiftsData) {
    const existing = await prisma.shift.findFirst({ where: { name: shift.name } });
    if (existing) {
      shiftsMap[shift.name] = existing.id;
    } else {
      const record = await prisma.shift.create({ data: shift });
      shiftsMap[shift.name] = record.id;
    }
  }
  console.log("Shifts seeded.");

  // 5. Seed Employees
  const employeesData = [
    {
      employeeNumber: "EMP-1001",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@hotel.com",
      phone: "+15550101",
      hireDate: new Date("2024-01-15"),
      departmentId: departmentsMap["Front Office"],
      roleId: rolesMap["Manager"],
      shiftId: shiftsMap["Morning"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1002",
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@hotel.com",
      phone: "+15550102",
      hireDate: new Date("2024-02-01"),
      departmentId: departmentsMap["Front Office"],
      roleId: rolesMap["Receptionist"],
      shiftId: shiftsMap["Morning"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1003",
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.j@hotel.com",
      phone: "+15550103",
      hireDate: new Date("2024-02-15"),
      departmentId: departmentsMap["Housekeeping"],
      roleId: rolesMap["Housekeeper"],
      shiftId: shiftsMap["Morning"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1004",
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.g@hotel.com",
      phone: "+15550104",
      hireDate: new Date("2024-03-01"),
      departmentId: departmentsMap["Housekeeping"],
      roleId: rolesMap["Housekeeper"],
      shiftId: shiftsMap["Afternoon"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1005",
      firstName: "David",
      lastName: "Wilson",
      email: "david.w@hotel.com",
      phone: "+15550105",
      hireDate: new Date("2024-03-10"),
      departmentId: departmentsMap["Food & Beverage"],
      roleId: rolesMap["Chef"],
      shiftId: shiftsMap["Morning"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1006",
      firstName: "Emily",
      lastName: "Brown",
      email: "emily.b@hotel.com",
      phone: "+15550106",
      hireDate: new Date("2024-04-05"),
      departmentId: departmentsMap["Food & Beverage"],
      roleId: rolesMap["Waiter"],
      shiftId: shiftsMap["Afternoon"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1007",
      firstName: "Michael",
      lastName: "Taylor",
      email: "michael.t@hotel.com",
      phone: "+15550107",
      hireDate: new Date("2024-04-12"),
      departmentId: departmentsMap["Maintenance"],
      roleId: rolesMap["Maintenance Technician"],
      shiftId: shiftsMap["Night"],
      status: "ACTIVE" as const,
    },
    {
      employeeNumber: "EMP-1008",
      firstName: "Sarah",
      lastName: "Davis",
      email: "sarah.d@hotel.com",
      phone: "+15550108",
      hireDate: new Date("2024-05-01"),
      departmentId: departmentsMap["Human Resources"],
      roleId: rolesMap["HR Officer"],
      shiftId: shiftsMap["Morning"],
      status: "ACTIVE" as const,
    },
  ];

  const employeeIds: string[] = [];
  for (const emp of employeesData) {
    const record = await prisma.employee.upsert({
      where: { employeeNumber: emp.employeeNumber },
      update: {
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: emp.phone,
        departmentId: emp.departmentId,
        roleId: emp.roleId,
        shiftId: emp.shiftId,
        status: emp.status,
      },
      create: emp,
    });
    employeeIds.push(record.id);
  }
  console.log("Employees seeded.");

  // 6. Seed Attendance over last 5 days including today
  const today = new Date();
  const statuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "ABSENT", "LEAVE"] as const;

  for (let i = 0; i < 5; i++) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - i);
    const dateUTC = new Date(
      Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate())
    );

    for (let idx = 0; idx < employeeIds.length; idx++) {
      const empId = employeeIds[idx];
      const status = statuses[(idx + i) % statuses.length];

      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let notes: string | null = null;

      if (status === "PRESENT") {
        checkIn = new Date(dateUTC.getTime() + 7 * 3600 * 1000); // 07:00
        checkOut = new Date(dateUTC.getTime() + 15 * 3600 * 1000); // 15:00
      } else if (status === "LATE") {
        checkIn = new Date(dateUTC.getTime() + 8 * 3600 * 1000 + 30 * 60 * 1000); // 08:30
        checkOut = new Date(dateUTC.getTime() + 15 * 3600 * 1000);
        notes = "Traffic delay";
      } else if (status === "LEAVE") {
        notes = "Approved annual leave";
      } else if (status === "ABSENT") {
        notes = "Unexcused absence";
      }

      await prisma.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId: empId,
            date: dateUTC,
          },
        },
        update: {
          status,
          checkIn,
          checkOut,
          notes,
        },
        create: {
          employeeId: empId,
          date: dateUTC,
          status,
          checkIn,
          checkOut,
          notes,
        },
      });
    }
  }
  console.log("Attendance records seeded.");
  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
