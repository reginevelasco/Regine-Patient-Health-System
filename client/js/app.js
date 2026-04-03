import api from './api.js';

// --- Global UI Helpers ---
window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
};

window.openModal = (modalId, titleId, titleText, formId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
    if (titleId) document.getElementById(titleId).innerText = titleText;
    if (formId) {
        const form = document.getElementById(formId);
        form.reset();
        const hidden = form.querySelector('input[type="hidden"]');
        if (hidden) hidden.value = '';
    }
};

window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
};

window.switchSection = (sectionId) => {
    document.querySelectorAll('.sidebar-nav li').forEach(i => {
        i.classList.toggle('active', i.getAttribute('data-section') === sectionId);
    });
    document.querySelectorAll('.content-section').forEach(s => {
        s.style.display = s.id === sectionId ? 'block' : 'none';
    });
    if (sectionId === 'dashboard') loadDashboardStats();
    else if (sectionId === 'patients') loadPatients();
    else if (sectionId === 'doctors') loadDoctors();
    else if (sectionId === 'appointments') loadAppointments();
    else if (sectionId === 'records') loadRecords();
    else if (sectionId === 'billing') loadBilling();
};

// --- CRUD Actions ---
window.openAddPatient = () => {
    const btn = document.querySelector('#patient-form button[type="submit"]');
    if (btn) btn.innerText = 'Save Patient';
    window.openModal('patient-modal', 'patient-modal-title', 'Add New Patient', 'patient-form');
};

window.openAddDoctor = () => {
    const btn = document.querySelector('#doctor-form button[type="submit"]');
    if (btn) btn.innerText = 'Save Doctor';
    window.openModal('doctor-modal', 'doctor-modal-title', 'Add New Doctor', 'doctor-form');
};

window.openAddAppointment = async () => { 
    await populateDropdowns();
    const btn = document.querySelector('#appointment-form button[type="submit"]');
    if (btn) btn.innerText = 'Save Appointment';
    window.openModal('appointment-modal', 'appointment-modal-title', 'Book Appointment', 'appointment-form'); 
};

window.openAddRecord = async () => {
    await populateDropdowns();
    const btn = document.querySelector('#record-form button[type="submit"]');
    if (btn) btn.innerText = 'Save Record';
    window.openModal('record-modal', 'record-modal-title', 'New Medical Record', 'record-form');
};

window.openAddBill = async () => {
    await populateDropdowns();
    const btn = document.querySelector('#billing-form button[type="submit"]');
    if (btn) btn.innerText = 'Save Bill';
    window.openModal('billing-modal', 'billing-modal-title', 'Generate Bill', 'billing-form');
};

// --- Edit/Delete ---
window.editPatient = async (id) => {
    try {
        const p = await api.get(`/patients/${id}`);
        const btn = document.querySelector('#patient-form button[type="submit"]');
        if (btn) btn.innerText = 'Update Patient';
        window.openModal('patient-modal', 'patient-modal-title', 'Edit Patient', 'patient-form');
        document.getElementById('patient-id').value = p.patient_id;
        document.getElementById('first_name').value = p.first_name;
        document.getElementById('last_name').value = p.last_name;
        document.getElementById('date_of_birth').value = p.date_of_birth ? p.date_of_birth.split('T')[0] : '';
        document.getElementById('gender').value = p.gender;
        document.getElementById('contact_number').value = p.contact_number;
        document.getElementById('email').value = p.email;
        document.getElementById('address').value = p.address;
        document.getElementById('blood_type').value = p.blood_type;
    } catch (e) { window.showToast('Error loading data', 'error'); }
};

window.editDoctor = async (id) => {
    try {
        const d = await api.get(`/doctors/${id}`);
        const btn = document.querySelector('#doctor-form button[type="submit"]');
        if (btn) btn.innerText = 'Update Doctor';
        window.openModal('doctor-modal', 'doctor-modal-title', 'Edit Doctor', 'doctor-form');
        document.getElementById('doctor-id').value = d.doctor_id;
        document.getElementById('doc_first_name').value = d.first_name;
        document.getElementById('doc_last_name').value = d.last_name;
        document.getElementById('specialization').value = d.specialization;
        document.getElementById('doc_email').value = d.email;
        document.getElementById('doc_contact_number').value = d.contact_number;
    } catch (e) { window.showToast('Error loading data', 'error'); }
};

window.editAppointment = async (id) => {
    try {
        const a = await api.get(`/appointments/${id}`);
        await populateDropdowns();
        const btn = document.querySelector('#appointment-form button[type="submit"]');
        if (btn) btn.innerText = 'Update Appointment';
        window.openModal('appointment-modal', 'appointment-modal-title', 'Edit Appointment', 'appointment-form');
        document.getElementById('appointment-id').value = a.appointment_id;
        document.getElementById('app_patient_id').value = a.patient_id;
        document.getElementById('app_doctor_id').value = a.doctor_id;
        document.getElementById('appointment_date').value = a.appointment_date ? a.appointment_date.slice(0, 16) : '';
        document.getElementById('app_status').value = a.status;
    } catch (e) { window.showToast('Error loading data', 'error'); }
};

window.editRecord = async (id) => {
    try {
        const r = await api.get(`/medical-records/${id}`);
        await populateDropdowns();
        const btn = document.querySelector('#record-form button[type="submit"]');
        if (btn) btn.innerText = 'Update Record';
        window.openModal('record-modal', 'record-modal-title', 'Edit Medical Record', 'record-form');
        document.getElementById('record-id').value = r.record_id;
        document.getElementById('rec_patient_id').value = r.patient_id;
        document.getElementById('rec_doctor_id').value = r.doctor_id;
        document.getElementById('diagnosis').value = r.diagnosis;
        document.getElementById('treatment').value = r.treatment;
        document.getElementById('notes').value = r.notes;
    } catch (e) { window.showToast('Error loading data', 'error'); }
};

window.editBill = async (id) => {
    try {
        const b = await api.get(`/billing/${id}`);
        await populateDropdowns();
        const btn = document.querySelector('#billing-form button[type="submit"]');
        if (btn) btn.innerText = 'Update Bill';
        window.openModal('billing-modal', 'billing-modal-title', 'Edit Bill', 'billing-form');
        document.getElementById('bill-id').value = b.bill_id;
        document.getElementById('bill_patient_id').value = b.patient_id;
        document.getElementById('total_amount').value = b.total_amount;
        document.getElementById('payment_status').value = b.payment_status;
    } catch (e) { window.showToast('Error loading data', 'error'); }
};

window.deleteItem = async (entity, id) => {
    if (confirm(`Are you sure you want to delete this ${entity.slice(0, -1).replace('-', ' ')}?`)) {
        try {
            await api.delete(`/${entity}/${id}`);
            window.showToast('Deleted successfully');
            if (entity === 'patients') loadPatients();
            else if (entity === 'doctors') loadDoctors();
            else if (entity === 'appointments') loadAppointments();
            else if (entity === 'medical-records') loadRecords();
            else if (entity === 'billing') loadBilling();
            loadDashboardStats();
        } catch (e) { window.showToast('Error deleting item', 'error'); }
    }
};

// --- Data Loaders ---
async function loadDashboardStats() {
    try {
        const [p, d, a, b] = await Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments'), api.get('/billing')]);
        document.getElementById('total-patients').innerText = p.length || 0;
        document.getElementById('total-doctors').innerText = d.length || 0;
        document.getElementById('total-appointments').innerText = a.length || 0;
        const rev = b.reduce((s, x) => s + parseFloat(x.total_amount || 0), 0);
        document.getElementById('total-revenue').innerText = `$${rev.toFixed(2)}`;
    } catch (e) {}
}

async function loadPatients() {
    const data = await api.get('/patients');
    document.querySelector('#patients-table tbody').innerHTML = data.map((p, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${p.first_name} ${p.last_name}</td>
            <td>${p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : 'N/A'}</td>
            <td>${p.gender}</td>
            <td>${p.contact_number || 'N/A'}</td>
            <td>
                <button class="edit-btn" onclick="editPatient(${p.patient_id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteItem('patients', ${p.patient_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function loadDoctors() {
    const data = await api.get('/doctors');
    document.querySelector('#doctors-table tbody').innerHTML = data.map((d, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${d.first_name} ${d.last_name}</td>
            <td>${d.specialization}</td>
            <td>
                <button class="edit-btn" onclick="editDoctor(${d.doctor_id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteItem('doctors', ${d.doctor_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function loadAppointments() {
    const data = await api.get('/appointments');
    document.querySelector('#appointments-table tbody').innerHTML = data.map((a, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${a.patient_first_name} ${a.patient_last_name}</td>
            <td>${a.doctor_first_name} ${a.doctor_last_name}</td>
            <td>${new Date(a.appointment_date).toLocaleString()}</td>
            <td>${a.status}</td>
            <td>
                <button class="edit-btn" onclick="editAppointment(${a.appointment_id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteItem('appointments', ${a.appointment_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function loadRecords() {
    const data = await api.get('/medical-records');
    document.querySelector('#records-table tbody').innerHTML = data.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${r.patient_first_name} ${r.patient_last_name}</td>
            <td>${r.doctor_first_name} ${r.doctor_last_name}</td>
            <td>${r.diagnosis}</td>
            <td>
                <button class="edit-btn" onclick="editRecord(${r.record_id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteItem('medical-records', ${r.record_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function loadBilling() {
    const data = await api.get('/billing');
    document.querySelector('#billing-table tbody').innerHTML = data.map((b, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${b.patient_first_name} ${b.patient_last_name}</td>
            <td>$${parseFloat(b.total_amount).toFixed(2)}</td>
            <td>${b.payment_status}</td>
            <td>
                <button class="edit-btn" onclick="editBill(${b.bill_id})"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteItem('billing', ${b.bill_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

async function populateDropdowns() {
    try {
        const [p, d] = await Promise.all([api.get('/patients'), api.get('/doctors')]);
        const pOps = p.map(x => `<option value="${x.patient_id}">${x.first_name} ${x.last_name}</option>`).join('');
        const dOps = d.map(x => `<option value="${x.doctor_id}">${x.first_name} ${x.last_name}</option>`).join('');
        
        const setEl = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        setEl('app_patient_id', pOps); setEl('app_doctor_id', dOps);
        setEl('rec_patient_id', pOps); setEl('rec_doctor_id', dOps);
        setEl('bill_patient_id', pOps);
    } catch (e) {}
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    const setupForm = (id, endpoint, callback) => {
        const form = document.getElementById(id);
        if (!form) return;
        form.onsubmit = async (e) => {
            e.preventDefault();
            const idVal = form.querySelector('input[type="hidden"]').value;
            const data = {};
            form.querySelectorAll('input, select, textarea').forEach(el => {
                if (el.id && !el.id.includes('-id')) {
                    const key = el.id.replace('doc_', '').replace('app_', '').replace('rec_', '').replace('bill_', '');
                    data[key] = el.value || null;
                }
            });
            try {
                await (idVal ? api.put(`${endpoint}/${idVal}`, data) : api.post(endpoint, data));
                window.showToast('Success!');
                window.closeModal(id.replace('form', 'modal'));
                callback();
                loadDashboardStats();
            } catch (err) { window.showToast('Error saving data', 'error'); }
        };
    };

    setupForm('patient-form', '/patients', loadPatients);
    setupForm('doctor-form', '/doctors', loadDoctors);
    setupForm('appointment-form', '/appointments', loadAppointments);
    setupForm('record-form', '/medical-records', loadRecords);
    setupForm('billing-form', '/billing', loadBilling);

    loadDashboardStats();
    loadPatients();
});
