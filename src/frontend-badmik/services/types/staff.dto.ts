// src/services/types/staff.dto.ts

// ===== Enums зі Swagger =====
export type StaffStatus = "New" | "Active" | "Disabled" | "Deleted";
export type StaffEmploymentType = "Employee" | "Contractor" | "PartTime" | "Volunteer";
export type SalaryType = "Hourly" | "Salary" | "PerTraining";

export type TimeRangeDto = { from: string | null; to: string | null };
export type WorkingHoursDto = {
  monday:    TimeRangeDto | null;
  tuesday:   TimeRangeDto | null;
  wednesday: TimeRangeDto | null;
  thursday:  TimeRangeDto | null;
  friday:    TimeRangeDto | null;
  saturday:  TimeRangeDto | null;
  sunday:    TimeRangeDto | null;
};

// ===== Те, що повертає бек у списках/деталях =====
export interface Staff {
  id: string;                 // uuid
  userId: string;             // uuid (зв'язок з користувачем)
  email: string;

  firstName: string;
  lastName: string;

  staffStatus: StaffStatus;
  employmentType: StaffEmploymentType;

  clubId: string;            

  createdAt: string;          
  updatedAt: string;          

  title: string;
  startDate: string;          
  endDate: string;            

  notes: string;

  salaryType: SalaryType;
  hourlyRate: number;
  monthlySalary: number;
  currency: string;

  payrollNotes: string;
  timeZone: string;
  workingHours: string;
  workingHoursExceptions: string;

  statusReason: string | null;
}



// ===== DTO для POST /api/staff (реєстрація) — зі Swagger =====
export interface StaffRegisterDto {
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;

  clubId: string;
  doB: string; // ISO date-time

  staffStatus: StaffStatus;
  employmentType: StaffEmploymentType;

  title?: string | null;
  startDate: string; // YYYY-MM-DD

  // ⬇️ ДОДАТИ
  phoneNumber?: string | null;
  imageUrl?: string | null;

  notes?: string | null;

  salaryType: SalaryType;
  hourlyRate?: number;
  monthlySalary?: number;
  currency?: string | null;
  payrollNotes?: string | null;

  timeZone?: string | null;

  // ⬇️ ТУТ ГОЛОВНЕ: об’єкт або null (не string)
  workingHours?: WorkingHoursDto | null;
  workingHoursExceptions?: string | null;
}

// Якщо ти хочеш відділити "create" від "register":
export type CreateStaffDto = StaffRegisterDto;

// ===== DTO для PUT /api/staff (оновлення) =====

export interface UpdateStaffDto {
  id: string;

  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;

  // ✅ нові поля
  phoneNumber?: string | null;
  imageUrl?: string | null;
  doB?: string | null;

  staffStatus?: StaffStatus;
  employmentType?: StaffEmploymentType;

  clubId?: string;
  title?: string | null;
  startDate?: string;
  endDate?: string | null;
  notes?: string | null;

  salaryType?: SalaryType;
  hourlyRate?: number;
  monthlySalary?: number;
  currency?: string | null;
  payrollNotes?: string | null;

  timeZone?: string | null;
  workingHours?: WorkingHoursDto | null; // ⬅️ було string, треба об’єкт
  workingHoursExceptions?: string | null;

  statusReason?: string | null;
}

// ===== Зручні аліаси під відповіді GET =====
export type StaffListResponse = {
data: Staff[];
total: number; // total rows for server-side pagination
};
export type StaffDetailsResponse = Staff;
