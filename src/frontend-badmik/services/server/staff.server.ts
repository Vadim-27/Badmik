// src/services/server/staff.server.ts
import "server-only";
import { serverFetch } from "@/lib/http/serverFetch";
import { ENDPOINTS } from "@/lib/endpoints";
import type { Staff, StaffRegisterDto, UpdateStaffDto } from "@/services/types/staff.dto";

// маленький хелпер, що одразу повертає JSON
async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await serverFetch(path, init);
  return res.json() as Promise<T>;
}

export async function srvStaffList(): Promise<Staff[]> {
  return json<Staff[]>(ENDPOINTS.staff.getAll);
}

export async function srvStaffById(id: string): Promise<Staff> {
  // return json<Staff>(`${ENDPOINTS.staff}/${id}`);
  return json<Staff>(ENDPOINTS.staff.getById(id));
}

// якщо знадобляться мутації з сервера
export async function srvCreateStaff(dto: StaffRegisterDto): Promise<Staff> {
  return json<Staff>(ENDPOINTS.staff.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

// export async function srvUpdateStaff(id: string, dto: UpdateStaffDto): Promise<Staff> {
//   // у вас PUT /api/staff (id у body)
//   return json<Staff>(ENDPOINTS.staff, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id, ...dto }),
//   });
// }

