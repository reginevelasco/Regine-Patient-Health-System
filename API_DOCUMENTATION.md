# Patient Health System API Documentation

Base URL: `http://localhost:3000/api`

## Endpoints

### Departments
- `GET /departments` - Get all departments
- `GET /departments/:id` - Get department by ID
- `POST /departments` - Create a new department
- `PUT /departments/:id` - Update a department
- `DELETE /departments/:id` - Delete a department

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID
- `POST /doctors` - Add a new doctor
- `PUT /doctors/:id` - Update doctor info
- `DELETE /doctors/:id` - Remove a doctor

### Patients
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient by ID
- `POST /patients` - Register a new patient
- `PUT /patients/:id` - Update patient details
- `DELETE /patients/:id` - Delete a patient record

### Appointments
- `GET /appointments` - Get all appointments
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Book an appointment
- `PUT /appointments/:id` - Update appointment status/date
- `DELETE /appointments/:id` - Cancel/Delete appointment

### Medical Records
- `GET /medical-records` - Get all records
- `GET /medical-records/:id` - Get record by ID
- `GET /medical-records/patient/:patientId` - Get records for a specific patient
- `POST /medical-records` - Create a new medical record
- `PUT /medical-records/:id` - Update a record
- `DELETE /medical-records/:id` - Delete a record

### Prescriptions
- `GET /prescriptions` - Get all prescriptions
- `GET /prescriptions/:id` - Get prescription by ID
- `GET /prescriptions/record/:recordId` - Get prescriptions for a specific medical record
- `POST /prescriptions` - Add a prescription
- `PUT /prescriptions/:id` - Update prescription
- `DELETE /prescriptions/:id` - Remove prescription

### Billing
- `GET /billing` - Get all bills
- `GET /billing/:id` - Get bill by ID
- `GET /billing/patient/:patientId` - Get bills for a specific patient
- `POST /billing` - Generate a bill
- `PUT /billing/:id` - Update payment status
- `DELETE /billing/:id` - Delete a bill

### Users
- `GET /users` - Get all users
- `POST /users` - Create a user
- `POST /users/login` - User login
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
