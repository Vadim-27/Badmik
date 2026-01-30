// src/services/types/staff.dto.ts

// ===== Enums зі Swagger =====
export type StaffStatus = "New" | "Active" | "Disabled" | "Deleted";
export type StaffEmploymentType = "Employee" | "Contractor" | "PartTime" | "Volunteer";
export type SalaryType = "Hourly" | "Salary" | "PerTraining";
export type StaffPositionType = "Trainer" | "Manager" | "Administrator" | "Accountant";


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


export interface Staff {
  id: string;                 
  userId: string;             
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
  perTrainingRate: number;
  currency: string;

  payrollNotes: string;
  positionType?: StaffPositionType | null;

  timeZone: string;
  workingHours: string;
  workingHoursExceptions: string;

  statusReason: string | null;
}




export interface StaffRegisterDto {
  email?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;

  clubId: string;
  doB: string; 

  staffStatus: StaffStatus;
  employmentType: StaffEmploymentType;

  title?: string | null;
  startDate: string; 

 
  phoneNumber?: string | null;
  imageUrl?: string | null;

  notes?: string | null;

  salaryType: SalaryType;
  hourlyRate?: number;
  monthlySalary?: number;
  perTrainingRate?: number;
  currency?: string | null;
  payrollNotes?: string | null;
  positionType?: StaffPositionType | null;

  timeZone?: string | null;

  
  workingHours?: WorkingHoursDto | null;
  workingHoursExceptions?: string | null;
}


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
  perTrainingRate?: number;
  currency?: string | null;
  payrollNotes?: string | null;
  positionType?: StaffPositionType | null;

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


export type ChangeStaffPasswordDto = {
  staffId: string;
  password: string;
};