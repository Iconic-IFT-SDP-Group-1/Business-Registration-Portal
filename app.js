// ============ APPLICATION STATE ============
const appState = {
    currentUser: null,
    users: JSON.parse(localStorage.getItem('users')) || [],
    documents: JSON.parse(localStorage.getItem('documents')) || [],
    reminders: JSON.parse(localStorage.getItem('reminders')) || [],
    isAuthenticated: false
};

// ============ INITIALIZE APP ============
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        appState.currentUser = loggedInUser;
        appState.isAuthenticated = true;
        initializeApp();
    } else {
        renderAuthPage();
    }
});

// ============ AUTHENTICATION ============
function renderAuthPage() {
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = `
        <div class="auth-page">
            <div class="auth-container">
                <div class="auth-wrapper">
                    <div id="authFormContainer"></div>
                </div>
            </div>
        </div>
    `;
    
    showLoginForm();
}

function showLoginForm() {
    const container = document.getElementById('authFormContainer');
    container.innerHTML = `
        <div class="auth-header">
            <div class="auth-logo">I</div>
            <h1>Iconic Business Portal</h1>
            <p>Digital Business Registration & Support</p>
        </div>
        
        <form id="loginForm" onsubmit="handleLogin(event)">
            <div id="loginMessage"></div>
            
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="loginEmail" placeholder="your@email.com" required>
                <div class="error-message" id="loginEmailError"></div>
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="loginPassword" placeholder="Enter your password" required>
                <div class="error-message" id="loginPasswordError"></div>
            </div>
            
            <button type="submit" class="btn-primary" style="width: 100%;">Login</button>
            
            <div class="toggle-form">
                <p>Don't have an account? <a href="#" onclick="event.preventDefault(); showRegistrationForm();">Create one</a></p>
            </div>
        </form>
    `;
}

function showRegistrationForm() {
    const container = document.getElementById('authFormContainer');
    container.innerHTML = `
        <div class="auth-header">
            <div class="auth-logo">I</div>
            <h1>Create Your Account</h1>
            <p>Join Iconic Business Portal</p>
        </div>
        
        <form id="registrationForm" onsubmit="handleRegistration(event)" style="max-height: 70vh; overflow-y: auto;">
            <div id="registrationMessage"></div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                    <label>First Name</label>
                    <input type="text" id="firstName" placeholder="Aminu" required>
                    <div class="error-message" id="firstNameError"></div>
                </div>
                
                <div class="form-group">
                    <label>Last Name</label>
                    <input type="text" id="lastName" placeholder="Mudi" required>
                    <div class="error-message" id="lastNameError"></div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="registrationEmail" placeholder="your@email.com" required>
                <div class="error-message" id="registrationEmailError"></div>
            </div>
            
            <div class="form-group">
                <label>Business Name</label>
                <input type="text" id="businessName" placeholder="Your Business Name" required>
                <div class="error-message" id="businessNameError"></div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="form-group">
                    <label>Industry</label>
                    <select id="industry" required>
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Services">Services</option>
                        <option value="Education">Education</option>
                    </select>
                    <div class="error-message" id="industryError"></div>
                </div>
                
                <div class="form-group">
                    <label>Business Type</label>
                    <select id="businessType" required>
                        <option value="">Select Type</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLC">LLC</option>
                        <option value="Corporation">Corporation</option>
                    </select>
                    <div class="error-message" id="businessTypeError"></div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="phone" placeholder="+1 (555) 123-4567" required>
                <div class="error-message" id="phoneError"></div>
            </div>
            
            <div class="form-group">
                <label>Business Registration Number</label>
                <input type="text" id="registrationNumber" placeholder="e.g., REG123456" required>
                <div class="error-message" id="registrationNumberError"></div>
            </div>
            
            <div class="form-group">
                <label>Profile Picture</label>
                <div class="profile-pic-upload">
                    <div id="profilePicPreview">📷</div>
                    <input type="file" id="profilePicInput" accept="image/*" onchange="handleProfilePicChange(event)">
                    <button type="button" class="btn-secondary" onclick="document.getElementById('profilePicInput').click()">Choose Photo</button>
                </div>
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="registrationPassword" placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char" required>
                <div class="error-message" id="registrationPasswordError"></div>
                <small>Must contain: uppercase, lowercase, number, and special character (@$!%*?&)</small>
            </div>
            
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm your password" required>
                <div class="error-message" id="confirmPasswordError"></div>
            </div>
            
            <button type="submit" class="btn-primary" style="width: 100%;">Create Account</button>
            
            <div class="toggle-form">
                <p>Already have an account? <a href="#" onclick="event.preventDefault(); showLoginForm();">Login</a></p>
            </div>
        </form>
    `;
}

function handleLogin(event) {
    event.preventDefault();
    clearAuthErrors();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showAuthError('loginMessage', 'Email and password are required');
        return;
    }
    
    const user = appState.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showAuthError('loginMessage', 'Invalid email or password');
        return;
    }
    
    appState.currentUser = user;
    appState.isAuthenticated = true;
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    
    document.getElementById('loginMessage').innerHTML = '<div class="success-message">✅ Login successful! Redirecting...</div>';
    
    setTimeout(() => {
        initializeApp();
    }, 1500);
}

function handleRegistration(event) {
    event.preventDefault();
    clearAuthErrors();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('registrationEmail').value,
        businessName: document.getElementById('businessName').value,
        industry: document.getElementById('industry').value,
        businessType: document.getElementById('businessType').value,
        phone: document.getElementById('phone').value,
        registrationNumber: document.getElementById('registrationNumber').value,
        password: document.getElementById('registrationPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        profilePic: appState.profilePicData || null
    };
    
    // Validation
    const errors = validateRegistration(formData);
    if (Object.keys(errors).length > 0) {
        displayValidationErrors(errors);
        return;
    }
    
    // Check if email exists
    if (appState.users.find(u => u.email === formData.email)) {
        showAuthError('registrationMessage', 'Email already registered');
        return;
    }
    
    // Create user
    const newUser = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.businessName,
        industry: formData.industry,
        businessType: formData.businessType,
        phone: formData.phone,
        registrationNumber: formData.registrationNumber,
        password: formData.password,
        profilePic: formData.profilePic,
        createdAt: new Date().toISOString()
    };
    
    appState.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(appState.users));
    
    document.getElementById('registrationMessage').innerHTML = '<div class="success-message">✅ Account created! Logging you in...</div>';
    
    setTimeout(() => {
        appState.currentUser = newUser;
        appState.isAuthenticated = true;
        sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
        appState.profilePicData = null;
        initializeApp();
    }, 2000);
}

function handleProfilePicChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must not exceed 5MB');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        appState.profilePicData = e.target.result;
        document.getElementById('profilePicPreview').innerHTML = `<img src="${e.target.result}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;">`;
    };
    reader.readAsDataURL(file);
}

function validateRegistration(data) {
    const errors = {};
    
    if (!data.firstName?.trim()) errors.firstName = 'First name is required';
    if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.registrationEmail = 'Invalid email';
    if (!data.businessName?.trim()) errors.businessName = 'Business name is required';
    if (!data.industry) errors.industry = 'Industry is required';
    if (!data.businessType) errors.businessType = 'Business type is required';
    if (!data.phone?.trim()) errors.phone = 'Phone is required';
    if (!data.registrationNumber?.trim()) errors.registrationNumber = 'Registration number is required';
    if (!data.password?.trim()) errors.registrationPassword = 'Password is required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password)) {
        errors.registrationPassword = 'Password must be 8+ chars with uppercase, lowercase, number, and special char';
    }
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    
    return errors;
}

function displayValidationErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorEl = document.getElementById(field + 'Error');
        if (errorEl) {
            errorEl.textContent = '❌ ' + errors[field];
        }
    });
}

function clearAuthErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function showAuthError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = `<div class="warning-message">❌ ${message}</div>`;
    }
}

// ============ MAIN APPLICATION ============
function initializeApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-logo">
                <div class="logo-icon">I</div>
                <div class="logo-text">
                    <span class="logo-name">Iconic Business Portal</span>
                    <span class="logo-tagline">Registration & Support</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" data-page="dashboard" onclick="navigate('dashboard', this)">
                    📊 Dashboard
                </a>
                <a href="#" class="nav-item" data-page="registration" onclick="navigate('registration', this)">
                    📋 Registration
                </a>
                <a href="#" class="nav-item" data-page="documents" onclick="navigate('documents', this)">
                    📁 Documents
                </a>
                <a href="#" class="nav-item" data-page="compliance" onclick="navigate('compliance', this)">
                    ⏰ Compliance
                </a>
                <a href="#" class="nav-item" data-page="resources" onclick="navigate('resources', this)">
                    🎓 Resources
                </a>
                <a href="#" class="nav-item" data-page="profile" onclick="navigate('profile', this)">
                    👤 My Profile
                </a>
            </nav>

            <div class="sidebar-help">
                <div class="help-icon">💬</div>
                <div>
                    <p class="help-title">Need Help?</p>
                    <p class="help-sub">Contact our support team</p>
                </div>
            </div>
        </aside>

        <div class="main-wrapper">
            <header class="topbar">
                <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
                <div class="topbar-spacer"></div>
                <div class="topbar-right">
                    <div class="user-profile" onclick="toggleUserMenu()">
                        ${appState.currentUser.profilePic ? `<img src="${appState.currentUser.profilePic}" class="avatar" alt="Profile">` : '<div class="avatar">' + appState.currentUser.firstName.charAt(0).toUpperCase() + '</div>'}
                        <div class="user-info">
                            <span class="user-name" id="topbarUserName">${appState.currentUser.firstName} ${appState.currentUser.lastName}</span>
                            <span class="user-email" id="topbarUserEmail">${appState.currentUser.email}</span>
                        </div>
                    </div>
                    <div class="dropdown-menu" id="userDropdown">
                        <a href="#" onclick="navigate('profile', document.querySelector('[data-page=profile]'))">My Profile</a>
                        <a href="#" onclick="handleLogout()">Logout</a>
                    </div>
                </div>
            </header>

            <main class="page-content" id="page-content"></main>
        </div>
    `;
    
    navigate('dashboard', document.querySelector('[data-page=dashboard]'));
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('show');
}

function navigate(page, element) {
    // Close dropdown
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.remove('show');
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    
    // Render page
    const pageContent = document.getElementById('page-content');
    
    switch(page) {
        case 'dashboard':
            renderDashboard(pageContent);
            break;
        case 'registration':
            renderRegistration(pageContent);
            break;
        case 'documents':
            renderDocuments(pageContent);
            break;
        case 'compliance':
            renderCompliance(pageContent);
            break;
        case 'resources':
            renderResources(pageContent);
            break;
        case 'profile':
            renderProfile(pageContent);
            break;
    }
}

// ============ PAGE RENDERERS ============
function renderDashboard(container) {
    const user = appState.currentUser;
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Welcome back, ${user.firstName}! 👋</h1>
            <p class="page-sub">Your business registration dashboard</p>
        </div>
        
        <div class="dashboard-profile">
            ${user.profilePic ? `<img src="${user.profilePic}" class="profile-pic-large" alt="Profile">` : '<div class="profile-pic-large">👤</div>'}
            <div>
                <h2>${user.firstName} ${user.lastName}</h2>
                <p><strong>Business:</strong> ${user.businessName}</p>
                <p><strong>Industry:</strong> ${user.industry}</p>
                <p><strong>Email:</strong> ${user.email}</p>
            </div>
        </div>
        
        <div class="grid-4">
            <div class="card">
                <h3>📋 Business Registration</h3>
                <p>Complete your registration process</p>
                <button class="btn-primary" onclick="navigate('registration', document.querySelector('[data-page=registration]'))">View</button>
            </div>
            <div class="card">
                <h3>📁 Documents</h3>
                <p>Manage your business documents</p>
                <button class="btn-primary" onclick="navigate('documents', document.querySelector('[data-page=documents]'))">View</button>
            </div>
            <div class="card">
                <h3>⏰ Compliance</h3>
                <p>Track compliance reminders</p>
                <button class="btn-primary" onclick="navigate('compliance', document.querySelector('[data-page=compliance]'))">View</button>
            </div>
            <div class="card">
                <h3>🎓 Resources</h3>
                <p>Access helpful resources</p>
                <button class="btn-primary" onclick="navigate('resources', document.querySelector('[data-page=resources]'))">View</button>
            </div>
        </div>
    `;
}

function renderRegistration(container) {
    const user = appState.currentUser;
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Business Registration Guidance</h1>
            <p class="page-sub">Follow these steps to complete your registration</p>
        </div>
        
        <div class="card">
            <h3>Your Business Details</h3>
            <div class="info-row">
                <span class="info-label">Business Name:</span>
                <span class="info-value">${user.businessName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Industry:</span>
                <span class="info-value">${user.industry}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Business Type:</span>
                <span class="info-value">${user.businessType}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Registration Number:</span>
                <span class="info-value">${user.registrationNumber}</span>
            </div>
        </div>
        
        <div class="card" style="margin-top: 20px;">
            <h3>Registration Steps</h3>
            <div class="checklist-item">
                <div class="step-circle step-done">✓</div>
                <div>
                    <p class="checklist-title">Step 1: Choose Business Structure</p>
                    <p class="checklist-sub">Your business type: ${user.businessType}</p>
                </div>
            </div>
            <div class="checklist-item">
                <div class="step-circle step-done">✓</div>
                <div>
                    <p class="checklist-title">Step 2: Register Business Name</p>
                    <p class="checklist-sub">Business name: ${user.businessName}</p>
                </div>
            </div>
            <div class="checklist-item">
                <div class="step-circle step-active">3</div>
                <div>
                    <p class="checklist-title">Step 3: Obtain Tax ID/EIN</p>
                    <p class="checklist-sub">Apply for an Employer Identification Number</p>
                </div>
            </div>
            <div class="checklist-item">
                <div class="step-circle step-pending-c">4</div>
                <div>
                    <p class="checklist-title">Step 4: Register for State Taxes</p>
                    <p class="checklist-sub">Complete state tax registration</p>
                </div>
            </div>
            <div class="checklist-item">
                <div class="step-circle step-pending-c">5</div>
                <div>
                    <p class="checklist-title">Step 5: Obtain Business Licenses</p>
                    <p class="checklist-sub">Industry-specific permits and licenses</p>
                </div>
            </div>
        </div>
    `;
}

function renderDocuments(container) {
    const user = appState.currentUser;
    const userDocs = appState.documents.filter(d => d.userId === user.id);
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Document Management</h1>
            <p class="page-sub">Upload and manage your business documents</p>
        </div>
        
        <button class="btn-primary" onclick="showDocumentUploadForm()">+ Upload Document</button>
        
        <div class="card" style="margin-top: 20px;">
            ${userDocs.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: #8B5E3C;">
                    <p style="font-size: 1.2rem; margin-bottom: 10px;">No documents yet</p>
                    <p>Upload your first document to get started</p>
                </div>
            ` : `
                <table class="doc-table">
                    <thead>
                        <tr>
                            <th>Document Name</th>
                            <th>Type</th>
                            <th>Uploaded</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userDocs.map(doc => `
                            <tr>
                                <td>${doc.name}</td>
                                <td>${doc.type}</td>
                                <td>${new Date(doc.uploadedAt).toLocaleDateString()}</td>
                                <td><span class="status-badge status-${doc.status.toLowerCase()}">${doc.status}</span></td>
                                <td>
                                    <button class="btn-small" onclick="deleteDocument('${doc.id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}
        </div>
    `;
}

function showDocumentUploadForm() {
    const user = appState.currentUser;
    const form = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <h2>Upload Document</h2>
                <form onsubmit="handleDocumentUpload(event)">
                    <div class="form-group">
                        <label>Document Name</label>
                        <input type="text" id="docName" placeholder="e.g., Registration Certificate" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Document Type</label>
                        <select id="docType" required>
                            <option value="">Select Type</option>
                            <option value="Registration Certificate">Registration Certificate</option>
                            <option value="Tax ID">Tax ID</option>
                            <option value="Business License">Business License</option>
                            <option value="Insurance">Insurance Document</option>
                            <option value="Financial Statement">Financial Statement</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Upload File</label>
                        <input type="file" id="docFile" accept=".pdf,.doc,.docx,.jpg,.png" required>
                        <small>Max 10MB</small>
                    </div>
                    
                    <button type="submit" class="btn-primary">Upload</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', form);
}

function handleDocumentUpload(event) {
    event.preventDefault();
    
    const user = appState.currentUser;
    const name = document.getElementById('docName').value;
    const type = document.getElementById('docType').value;
    const file = document.getElementById('docFile').files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must not exceed 10MB');
        return;
    }
    
    const newDoc = {
        id: Date.now().toString(),
        userId: user.id,
        name: name,
        type: type,
        status: 'Pending',
        uploadedAt: new Date().toISOString()
    };
    
    appState.documents.push(newDoc);
    localStorage.setItem('documents', JSON.stringify(appState.documents));
    
    closeModal();
    navigate('documents', document.querySelector('[data-page=documents]'));
}

function deleteDocument(docId) {
    if (confirm('Delete this document?')) {
        appState.documents = appState.documents.filter(d => d.id !== docId);
        localStorage.setItem('documents', JSON.stringify(appState.documents));
        navigate('documents', document.querySelector('[data-page=documents]'));
    }
}

function renderCompliance(container) {
    const user = appState.currentUser;
    const userReminders = appState.reminders.filter(r => r.userId === user.id);
    
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Compliance Reminders</h1>
            <p class="page-sub">Track your compliance deadlines</p>
        </div>
        
        <button class="btn-primary" onclick="showReminderForm()">+ Add Reminder</button>
        
        <div style="margin-top: 20px;">
            ${userReminders.length === 0 ? `
                <div class="card" style="text-align: center; padding: 40px; color: #8B5E3C;">
                    <p style="font-size: 1.2rem; margin-bottom: 10px;">No reminders yet</p>
                    <p>Add compliance reminders to stay on track</p>
                </div>
            ` : userReminders.map(reminder => `
                <div class="reminder-card ${reminder.status === 'Completed' ? 'completed' : reminder.isUrgent ? 'urgent' : ''}">
                    <h3>${reminder.title}</h3>
                    <p>${reminder.description}</p>
                    <p class="reminder-date">Due: ${new Date(reminder.dueDate).toLocaleDateString()}</p>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        ${reminder.status === 'Pending' ? `<button class="btn-small" onclick="completeReminder('${reminder.id}')">Mark Complete</button>` : ''}
                        <button class="btn-small" onclick="deleteReminder('${reminder.id}')">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showReminderForm() {
    const form = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <h2>Add Compliance Reminder</h2>
                <form onsubmit="handleAddReminder(event)">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="reminderTitle" placeholder="e.g., Annual Tax Filing" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="reminderDescription" placeholder="Enter details..." rows="4" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" id="reminderDueDate" required>
                    </div>
                    
                    <div class="form-group">
                        <label><input type="checkbox" id="reminderUrgent"> Mark as Urgent</label>
                    </div>
                    
                    <button type="submit" class="btn-primary">Add Reminder</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', form);
}

function handleAddReminder(event) {
    event.preventDefault();
    
    const user = appState.currentUser;
    const newReminder = {
        id: Date.now().toString(),
        userId: user.id,
        title: document.getElementById('reminderTitle').value,
        description: document.getElementById('reminderDescription').value,
        dueDate: document.getElementById('reminderDueDate').value,
        isUrgent: document.getElementById('reminderUrgent').checked,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    appState.reminders.push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(appState.reminders));
    
    closeModal();
    navigate('compliance', document.querySelector('[data-page=compliance]'));
}

function completeReminder(reminderId) {
    const reminder = appState.reminders.find(r => r.id === reminderId);
    if (reminder) {
        reminder.status = 'Completed';
        localStorage.setItem('reminders', JSON.stringify(appState.reminders));
        navigate('compliance', document.querySelector('[data-page=compliance]'));
    }
}

function deleteReminder(reminderId) {
    if (confirm('Delete this reminder?')) {
        appState.reminders = appState.reminders.filter(r => r.id !== reminderId);
        localStorage.setItem('reminders', JSON.stringify(appState.reminders));
        navigate('compliance', document.querySelector('[data-page=compliance]'));
    }
}

function renderResources(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Business Resources</h1>
            <p class="page-sub">Access guides, templates, and support materials</p>
        </div>
        
        <div class="grid-3">
            <div class="card">
                <h3>📚 Complete Guide to Business Registration</h3>
                <p>Learn everything you need to know about registering your business legally.</p>
            </div>
            <div class="card">
                <h3>📋 Business Plan Template</h3>
                <p>Create a comprehensive business plan to guide your company's growth.</p>
            </div>
            <div class="card">
                <h3>💼 Understanding Business Structures</h3>
                <p>Detailed comparison of sole proprietorship, partnerships, LLCs, and corporations.</p>
            </div>
            <div class="card">
                <h3>📊 Tax Compliance Guide</h3>
                <p>Essential tax filing deadlines and requirements for new business owners.</p>
            </div>
            <div class="card">
                <h3>🏢 How to Obtain Business Licenses</h3>
                <p>Industry-specific information about permits and licenses required in your area.</p>
            </div>
            <div class="card">
                <h3>📑 Operating Agreement Template</h3>
                <p>Essential document for LLCs and partnerships defining member roles.</p>
            </div>
        </div>
    `;
}

function renderProfile(container) {
    const user = appState.currentUser;
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">My Profile</h1>
            <p class="page-sub">Your account information</p>
        </div>
        
        <div class="card">
            <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                ${user.profilePic ? `<img src="${user.profilePic}" class="profile-pic-large" alt="Profile">` : '<div class="profile-pic-large">👤</div>'}
                <div>
                    <h2>${user.firstName} ${user.lastName}</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                </div>
            </div>
            
            <h3>Business Information</h3>
            <div class="info-row">
                <span class="info-label">Business Name:</span>
                <span class="info-value">${user.businessName}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Industry:</span>
                <span class="info-value">${user.industry}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Business Type:</span>
                <span class="info-value">${user.businessType}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Registration Number:</span>
                <span class="info-value">${user.registrationNumber}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Member Since:</span>
                <span class="info-value">${new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    `;
}

// ============ UTILITY FUNCTIONS ============
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('loggedInUser');
        appState.currentUser = null;
        appState.isAuthenticated = false;
        renderAuthPage();
    }
}
