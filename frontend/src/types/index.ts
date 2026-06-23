export type Role = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN'

export interface User {
  id:       number
  username: string
  email:    string
  role:     Role
}

export interface PatientProfile {
  patient_uid:    string
  full_name:      string
  dob:            string
  gender:         string
  contact_number: string
}
