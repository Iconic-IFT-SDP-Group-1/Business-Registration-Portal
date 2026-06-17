// Application State
const appState = {
    currentUser: null,
    users: JSON.parse(localStorage.getItem('users')) || [],
    documents: JSON.parse(localStorage.getItem('documents')) || [],
    reminders: JSON.parse(localStorage.getItem('reminders')) || [],
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Check if user is logged in
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedInUser) {
        appState.currentUser = loggedInUser;
        renderDashboard(app);
    } else {
        renderAuthPage(app);
    }
});

// ============ VALIDATION FUNCTIONS ============
const validation = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    password: (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    },
    
    businessName: (name) => {
        return name.trim().length >= 3;
    },
    
    phone: (phone) => {
        const regex = /^[\d\s\-\+\(\)]{10,}$/;
        return regex.test(phone);
    },
    
    registrationNumber: (number) => {
        return number.trim().length >= 3;
    }
};

const getValidationErrors = (formData, isRegistration = false) => {
    const errors = {};
    
    // Email validation
    if (!formData.email || !formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!validation.email(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password || !formData.password.trim()) {
        errors.password = 'Password is required';
    } else if (isRegistration && !validation.password(formData.password)) {
        errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)';
    } else if (!isRegistration && formData.password.length < 6) {
        errors.password = 'Password is incorrect';
    }
    
    if (isRegistration) {
        // First Name validation
        if (!formData.firstName || !formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }
        
        // Last Name validation
        if (!formData.lastName || !formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }
        
        // Business Name validation
        if (!formData.businessName || !formData.businessName.trim()) {
            errors.businessName = 'Business name is required';
        } else if (!validation.businessName(formData.businessName)) {
            errors.businessName = 'Business name must be at least 3 characters';
        }
        
        // Phone validation
        if (!formData.phone || !formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!validation.phone(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        
        // Registration Number validation
        if (!formData.registrationNumber || !formData.registrationNumber.trim()) {
            errors.registrationNumber = 'Registration number is required';
        } else if (!validation.registrationNumber(formData.registrationNumber)) {
            errors.registrationNumber = 'Registration number must be at least 3 characters';
        }
        
        // Industry validation
        if (!formData.industry || !formData.industry.trim()) {
            errors.industry = 'Industry is required';
        }
        
        // Business Type validation
        if (!formData.businessType || !formData.businessType.trim()) {
            errors.businessType = 'Business type is required';
        }
        
        // Confirm Password validation
        if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
    }
    
    return errors;
};

// ============ AUTHENTICATION FUNCTIONS ============
function renderAuthPage(container) {
    let isLogin = true;
    
    const renderAuthForm = () => {
        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-wrapper">
                    ${isLogin ? renderLoginForm() : renderRegistrationForm()}
                </div>
            </div>
        `;
        
        attachAuthEventListeners();
    };
    
    const renderLoginForm = () => `
        <div class="auth-header">
            <div class="auth-logo">I</div>
            <h1>Iconic Business Portal</h1>
            <p>Digital Business Registration & Support</p>
        </div>
        
        <form id="loginForm" class="auth-form">
            <div id="loginMessage"></div>
            
            <div class="form-group">
                <label for="loginEmail">Email Address</label>
                <input type="email" id="loginEmail" name="email" placeholder="your@email.com" required>
                <div class="error-message" id="loginEmailError"></div>
            </div>
            
            <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" name="password" placeholder="Enter your password" required>
                <div class="error-message" id="loginPasswordError"></div>
            </div>
            
            <button type="submit" class="btn btn-primary">Login</button>
            
            <div class="toggle-form">
                <p>Don't have an account?</p>
                <a href="#" onclick="event.preventDefault(); isLogin = false; renderAuthForm();">Create one now</a>
            </div>
        </form>
    `;
    
    const renderRegistrationForm = () => `
        <div class="auth-header">
            <div class="auth-logo">I</div>
            <h1>Create Your Profile</h1>
            <p>Join Iconic Business Portal</p>
        </div>
        
        <form id="registrationForm" class="auth-form">
            <div id="registrationMessage"></div>
            
            <div style="display: flex; gap: 15px;">
                <div class="form-group" style="flex: 1;">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" placeholder="John" required>
                    <div class="error-message" id="firstNameError"></div>
                </div>
                
                <div class="form-group" style="flex: 1;">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Doe" required>
                    <div class="error-message" id="lastNameError"></div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="registrationEmail">Email Address</label>
                <input type="email" id="registrationEmail" name="email" placeholder="your@email.com" required>
                <div class="error-message" id="registrationEmailError"></div>
            </div>
            
            <div class="form-group">
                <label for="businessName">Business Name</label>
                <input type="text" id="businessName" name="businessName" placeholder="Your Business Name" required>
                <div class="error-message" id="businessNameError"></div>
            </div>
            
            <div style="display: flex; gap: 15px;">
                <div class="form-group" style="flex: 1;">
                    <label for="industry">Industry</label>
                    <select id="industry" name="industry" required>
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Services">Services</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                    </select>
                    <div class="error-message" id="industryError"></div>
                </div>
                
                <div class="form-group" style="flex: 1;">
                    <label for="businessType">Business Type</label>
                    <select id="businessType" name="businessType" required>
                        <option value="">Select Type</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLC">LLC</option>
                        <option value="Corporation">Corporation</option>
                        <option value="Non-Profit">Non-Profit</option>
                    </select>
                    <div class="error-message" id="businessTypeError"></div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="+1 (555) 123-4567" required>
                <div class="error-message" id="phoneError"></div>
            </div>
            
            <div class="form-group">
                <label for="registrationNumber">Business Registration Number</label>
                <input type="text" id="registrationNumber" name="registrationNumber" placeholder="e.g., REG123456" required>
                <div class="error-message" id="registrationNumberError"></div>
            </div>
            
            <div class="form-group">
                <label>Profile Picture</label>
                <div class="profile-pic-upload">
                    <div id="profilePicPreviewContainer" class="profile-pic-placeholder">📷</div>
                    <input type="file" id="profilePicInput" name="profilePic" accept="image/*">
                    <button type="button" class="btn btn-secondary btn-small" onclick="document.getElementById('profilePicInput').click()">Choose Photo</button>
                    <small style="color: #7f8c8d;">Max 5MB, JPG/PNG</small>
                </div>
            </div>
            
            <div class="form-group">
                <label for="registrationPassword">Password</label>
                <input type="password" id="registrationPassword" name="password" placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char" required>
                <div class="error-message" id="registrationPasswordError"></div>
                <small style="color: #7f8c8d; display: block; margin-top: 8px;">Password must contain: uppercase, lowercase, number, and special character (@$!%*?&)</small>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
                <div class="error-message" id="confirmPasswordError"></div>
            </div>
            
            <button type="submit" class="btn btn-primary">Create Account</button>
            
            <div class="toggle-form">
                <p>Already have an account?</p>
                <a href="#" onclick="event.preventDefault(); isLogin = true; renderAuthForm();">Login here</a>
            </div>
        </form>
    `;
    
    const attachAuthEventListeners = () => {
        if (isLogin) {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
        } else {
            const registrationForm = document.getElementById('registrationForm');
            const profilePicInput = document.getElementById('profilePicInput');
            
            if (registrationForm) {
                registrationForm.addEventListener('submit', handleRegistration);
            }
            
            if (profilePicInput) {
                profilePicInput.addEventListener('change', handleProfilePicChange);
            }
        }
    };
    
    renderAuthForm();
}

function handleLogin(e) {
    e.preventDefault();
    
    // Clear all error messages
    document.getElementById('loginEmailError').innerHTML = '';
    document.getElementById('loginPasswordError').innerHTML = '';
    document.getElementById('loginMessage').innerHTML = '';
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };
    
    const errors = getValidationErrors(formData, false);
    
    if (Object.keys(errors).length > 0) {
        if (errors.email) {
            document.getElementById('loginEmailError').innerHTML = '❌ ' + errors.email;
            document.getElementById('loginEmail').classList.add('error');
        }
        if (errors.password) {
            document.getElementById('loginPasswordError').innerHTML = '❌ ' + errors.password;
            document.getElementById('loginPassword').classList.add('error');
        }
        return;
    }
    
    // Find user
    const user = appState.users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (!user) {
        document.getElementById('loginMessage').innerHTML = '<div class="warning-message">❌ Invalid email or password</div>';
        document.getElementById('loginEmail').classList.add('error');
        document.getElementById('loginPassword').classList.add('error');
        return;
    }
    
    // Login successful
    appState.currentUser = user;
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    
    document.getElementById('loginMessage').innerHTML = '<div class="success-message">✅ Login successful! Redirecting...</div>';
    
    setTimeout(() => {
        renderDashboard(document.getElementById('app'));
    }, 1500);
}

function handleRegistration(e) {
    e.preventDefault();
    
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(el => el.innerHTML = '');
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
    document.getElementById('registrationMessage').innerHTML = '';
    
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
        profilePic: appState.currentRegistrationPic || null
    };
    
    const errors = getValidationErrors(formData, true);
    
    if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(field + 'Error');
            if (errorElement) {
                errorElement.innerHTML = '❌ ' + errors[field];
                const inputElement = document.getElementById(field === 'registrationEmail' ? 'registrationEmail' : field === 'registrationPassword' ? 'registrationPassword' : field === 'registrationNumber' ? 'registrationNumber' : field);
                if (inputElement) {
                    inputElement.classList.add('error');
                }
            }
        });
        return;
    }
    
    // Check if email already exists
    if (appState.users.find(u => u.email === formData.email)) {
        document.getElementById('registrationMessage').innerHTML = '<div class="warning-message">❌ Email already registered</div>';
        document.getElementById('registrationEmail').classList.add('error');
        return;
    }
    
    // Create new user
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
    
    // Initialize user documents and reminders
    initializeUserData(newUser.id);
    
    document.getElementById('registrationMessage').innerHTML = '<div class="success-message">✅ Account created successfully! Logging you in...</div>';
    
    setTimeout(() => {
        appState.currentUser = newUser;
        sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
        appState.currentRegistrationPic = null;
        renderDashboard(document.getElementById('app'));
    }, 2000);
}

function handleProfilePicChange(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must not exceed 5MB');
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64String = event.target.result;
        appState.currentRegistrationPic = base64String;
        
        // Update preview
        const previewContainer = document.getElementById('profilePicPreviewContainer');
        previewContainer.innerHTML = `<img src="${base64String}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    };
    
    reader.readAsDataURL(file);
}

// ============ DASHBOARD FUNCTIONS ============
function renderDashboard(container) {
    const user = appState.currentUser;
    
    container.innerHTML = `
        <header>
            <div class="header-content">
                <div class="logo">
                    <div class="logo-icon">I</div>
                    <span>Iconic Business Portal</span>
                </div>
                <nav class="nav-links">
                    <a href="#" onclick="event.preventDefault(); navigateTo('dashboard')">Dashboard</a>
                    <a href="#" onclick="event.preventDefault(); navigateTo('registration')">Registration</a>
                    <a href="#" onclick="event.preventDefault(); navigateTo('documents')">Documents</a>
                    <a href="#" onclick="event.preventDefault(); navigateTo('compliance')">Compliance</a>
                    <a href="#" onclick="event.preventDefault(); navigateTo('resources')">Resources</a>
                </nav>
                <div class="dropdown user-menu">
                    <div class="user-profile" onclick="toggleUserMenu()">
                        ${user.profilePic ? `<img src="${user.profilePic}" class="profile-pic-small" alt="Profile">` : '<div style="width: 35px; height: 35px; border-radius: 50%; background: #f39c12; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">👤</div>'}
                        <span>${user.firstName}</span>
                    </div>
                    <div id="userMenu" class="dropdown-menu">
                        <a href="#" onclick="event.preventDefault(); navigateTo('profile')">My Profile</a>
                        <a href="#" onclick="event.preventDefault(); handleLogout()">Logout</a>
                    </div>
                </div>
            </div>
        </header>
        
        <div class="dashboard">
            <div id="dashboardContent"></div>
        </div>
    `;
    
    // Default to dashboard view
    navigateTo('dashboard');
}

function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('show');
}

function navigateTo(page) {
    const dashboardContent = document.getElementById('dashboardContent');
    
    // Close user menu
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('show');
    }
    
    switch(page) {
        case 'dashboard':
            renderDashboardOverview(dashboardContent);
            break;
        case 'profile':
            renderProfilePage(dashboardContent);
            break;
        case 'registration':
            renderRegistrationPage(dashboardContent);
            break;
        case 'documents':
            renderDocumentsPage(dashboardContent);
            break;
        case 'compliance':
            renderCompliancePage(dashboardContent);
            break;
        case 'resources':
            renderResourcesPage(dashboardContent);
            break;
        default:
            renderDashboardOverview(dashboardContent);
    }
}

function renderDashboardOverview(container) {
    const user = appState.currentUser;
    
    container.innerHTML = `
        <div class="dashboard-header">
            <div>
                <h2>Welcome back, ${user.firstName}! 👋</h2>
                <p style="color: #7f8c8d;">Your business registration portal</p>
            </div>
        </div>
        
        <div class="profile-header">
            ${user.profilePic ? `<img src="${user.profilePic}" class="profile-pic-large" alt="Profile">` : '<div style="width: 150px; height: 150px; border-radius: 50%; background: #f39c12; display: flex; align-items: center; justify-content: center; color: white; font-size: 60px;">👤</div>'}
            <div class="profile-info">
                <h2>${user.firstName} ${user.lastName}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Business:</strong> ${user.businessName}</p>
                <p><strong>Industry:</strong> ${user.industry}</p>
                <p><strong>Business Type:</strong> ${user.businessType}</p>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📋 Business Registration</h3>
                <p>Complete your business registration process with guidance and support.</p>
                <button class="btn btn-primary" onclick="navigateTo('registration')">View Registration</button>
            </div>
            
            <div class="card">
                <h3>📁 Document Management</h3>
                <p>Upload, manage, and track all your important business documents.</p>
                <button class="btn btn-primary" onclick="navigateTo('documents')">Manage Documents</button>
            </div>
            
            <div class="card">
                <h3>⏰ Compliance Reminders</h3>
                <p>Stay on top of your compliance requirements and deadlines.</p>
                <button class="btn btn-primary" onclick="navigateTo('compliance')">View Reminders</button>
            </div>
            
            <div class="card">
                <h3>🎓 Business Resources</h3>
                <p>Access helpful guides, templates, and support resources.</p>
                <button class="btn btn-primary" onclick="navigateTo('resources')">Browse Resources</button>
            </div>
        </div>
        
        <div class="user-info-card">
            <h3>📊 Your Information</h3>
            <div class="info-row">
                <div class="info-label">Registration Number:</div>
                <div class="info-value">${user.registrationNumber}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${user.phone}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Member Since:</div>
                <div class="info-value">${new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Account Status:</div>
                <div class="info-value"><span class="document-status status-approved">Active</span></div>
            </div>
        </div>
    `;
}

function renderProfilePage(container) {
    const user = appState.currentUser;
    
    container.innerHTML = `
        <div class="section">
            <h2>My Profile</h2>
            
            <div class="profile-header">
                ${user.profilePic ? `<img src="${user.profilePic}" class="profile-pic-large" alt="Profile">` : '<div style="width: 150px; height: 150px; border-radius: 50%; background: #f39c12; display: flex; align-items: center; justify-content: center; color: white; font-size: 60px;">👤</div>'}
                <div class="profile-info">
                    <h2>${user.firstName} ${user.lastName}</h2>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <button class="btn btn-secondary" onclick="alert('Profile picture update feature coming soon')">Update Photo</button>
                </div>
            </div>
            
            <h3 style="margin-top: 30px; margin-bottom: 20px;">Business Information</h3>
            <div class="user-info-card" style="border-left: 5px solid #f39c12;">
                <div class="info-row">
                    <div class="info-label">Business Name:</div>
                    <div class="info-value">${user.businessName}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Industry:</div>
                    <div class="info-value">${user.industry}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Business Type:</div>
                    <div class="info-value">${user.businessType}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Registration Number:</div>
                    <div class="info-value">${user.registrationNumber}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Member Since:</div>
                    <div class="info-value">${new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    `;
}

function renderRegistrationPage(container) {
    const user = appState.currentUser;
    
    container.innerHTML = `
        <div class="section">
            <h2>Business Registration Guidance</h2>
            <p>Follow these steps to ensure your business is properly registered and compliant.</p>
            
            <h3>Registration Steps</h3>
            <div class="resource-list">
                <div class="resource-item">
                    <strong>Step 1: Choose Business Structure</strong>
                    <p>Your business type: <strong>${user.businessType}</strong></p>
                    <small>This affects your tax obligations, liability, and compliance requirements.</small>
                </div>
                
                <div class="resource-item">
                    <strong>Step 2: Register Business Name</strong>
                    <p>Business name: <strong>${user.businessName}</strong></p>
                    <p>Registration number: <strong>${user.registrationNumber}</strong></p>
                    <small>Ensure your name is unique and not already registered.</small>
                </div>
                
                <div class="resource-item">
                    <strong>Step 3: Obtain EIN/Tax ID</strong>
                    <small>Apply for an Employer Identification Number if you have employees or operate as a corporation/partnership.</small>
                </div>
                
                <div class="resource-item">
                    <strong>Step 4: Register for State Taxes</strong>
                    <small>Complete state tax registration and obtain necessary licenses based on your industry.</small>
                </div>
                
                <div class="resource-item">
                    <strong>Step 5: Obtain Business Licenses</strong>
                    <small>Your industry (<strong>${user.industry}</strong>) may require specific permits or licenses.</small>
                </div>
                
                <div class="resource-item">
                    <strong>Step 6: Set Up Accounting</strong>
                    <small>Establish accounting systems and keep proper financial records.</small>
                </div>
            </div>
        </div>
    `;
}

function renderDocumentsPage(container) {
    const user = appState.currentUser;
    const userDocs = appState.documents.filter(d => d.userId === user.id);
    
    container.innerHTML = `
        <div class="section">
            <h2>Document Management</h2>
            
            <button class="btn btn-secondary" onclick="openUploadModal()" style="margin-bottom: 20px;">+ Upload Document</button>
            
            ${userDocs.length === 0 ? `
                <div style="text-align: center; padding: 40px; background: var(--light-bg); border-radius: 8px;">
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">No documents yet</h3>
                    <p style="color: #95a5a6;">Start by uploading your business documents.</p>
                </div>
            ` : `
                <table class="document-table">
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
                                <td><span class="document-status status-${doc.status.toLowerCase()}">${doc.status}</span></td>
                                <td>
                                    <button class="btn btn-small btn-danger" onclick="deleteDocument('${doc.id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `}
        </div>
        
        <div id="uploadModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Upload Document</h2>
                    <button class="close-btn" onclick="closeUploadModal()">×</button>
                </div>
                <form id="uploadForm" onsubmit="handleDocumentUpload(event)">
                    <div class="form-group">
                        <label for="docName">Document Name</label>
                        <input type="text" id="docName" placeholder="e.g., Registration Certificate" required>
                        <div class="error-message" id="docNameError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="docType">Document Type</label>
                        <select id="docType" required>
                            <option value="">Select Type</option>
                            <option value="Registration Certificate">Registration Certificate</option>
                            <option value="Tax ID">Tax ID</option>
                            <option value="License">Business License</option>
                            <option value="Insurance">Insurance Document</option>
                            <option value="Financial">Financial Statement</option>
                            <option value="Other">Other</option>
                        </select>
                        <div class="error-message" id="docTypeError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="docFile">Upload File</label>
                        <input type="file" id="docFile" accept=".pdf,.doc,.docx,.jpg,.png" required>
                        <small style="color: #7f8c8d;">Max 10MB, PDF/DOC/DOCX/JPG/PNG</small>
                        <div class="error-message" id="docFileError"></div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Upload Document</button>
                </form>
            </div>
        </div>
    `;
}

function renderCompliancePage(container) {
    const user = appState.currentUser;
    const userReminders = appState.reminders.filter(r => r.userId === user.id);
    
    container.innerHTML = `
        <div class="section">
            <h2>Compliance Reminders</h2>
            
            <button class="btn btn-secondary" onclick="openReminderModal()" style="margin-bottom: 20px;">+ Add Reminder</button>
            
            ${userReminders.length === 0 ? `
                <div style="text-align: center; padding: 40px; background: var(--light-bg); border-radius: 8px;">
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">No reminders yet</h3>
                    <p style="color: #95a5a6;">Add compliance reminders to stay on track with regulations.</p>
                </div>
            ` : userReminders.map(reminder => `
                <div class="reminder-card ${reminder.status === 'Completed' ? 'completed' : reminder.isUrgent ? 'urgent' : ''}">
                    <div class="reminder-header">
                        <strong>${reminder.title}</strong>
                        <div class="reminder-date">${new Date(reminder.dueDate).toLocaleDateString()}</div>
                    </div>
                    <p style="margin: 10px 0;">${reminder.description}</p>
                    <div style="display: flex; gap: 10px;">
                        ${reminder.status === 'Pending' ? `<button class="btn btn-small btn-success" onclick="completeReminder('${reminder.id}')">Mark Complete</button>` : ''}
                        <button class="btn btn-small btn-danger" onclick="deleteReminder('${reminder.id}')">Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div id="reminderModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add Compliance Reminder</h2>
                    <button class="close-btn" onclick="closeReminderModal()">×</button>
                </div>
                <form id="reminderForm" onsubmit="handleAddReminder(event)">
                    <div class="form-group">
                        <label for="reminderTitle">Title</label>
                        <input type="text" id="reminderTitle" placeholder="e.g., Annual Tax Filing" required>
                        <div class="error-message" id="reminderTitleError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="reminderDescription">Description</label>
                        <textarea id="reminderDescription" placeholder="Enter details..." rows="4" required></textarea>
                        <div class="error-message" id="reminderDescriptionError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="reminderDueDate">Due Date</label>
                        <input type="date" id="reminderDueDate" required>
                        <div class="error-message" id="reminderDueDateError"></div>
                    </div>
                    
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="reminderUrgent">
                            <span>Mark as Urgent</span>
                        </label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Add Reminder</button>
                </form>
            </div>
        </div>
    `;
}

function renderResourcesPage(container) {
    container.innerHTML = `
        <div class="section">
            <h2>Business Support Resources</h2>
            <p>Access helpful guides, templates, and resources to support your business growth.</p>
            
            <h3>📚 Guides & Tutorials</h3>
            <ul class="resource-list">
                <li class="resource-item">
                    <strong>Complete Guide to Business Registration</strong>
                    <small>Learn everything you need to know about registering your business legally and effectively.</small>
                </li>
                <li class="resource-item">
                    <strong>Understanding Business Structures</strong>
                    <small>Detailed comparison of sole proprietorship, partnerships, LLCs, and corporations.</small>
                </li>
                <li class="resource-item">
                    <strong>Tax Compliance for Small Businesses</strong>
                    <small>Essential tax filing deadlines and requirements for new business owners.</small>
                </li>
                <li class="resource-item">
                    <strong>How to Obtain Business Licenses</strong>
                    <small>Industry-specific information about permits and licenses required in your area.</small>
                </li>
            </ul>
            
            <h3 style="margin-top: 30px;">📋 Downloadable Templates</h3>
            <ul class="resource-list">
                <li class="resource-item">
                    <strong>Business Plan Template</strong>
                    <small>Create a comprehensive business plan to guide your company's growth.</small>
                </li>
                <li class="resource-item">
                    <strong>Operating Agreement Template</strong>
                    <small>Essential document for LLCs and partnerships defining member roles and responsibilities.</small>
                </li>
                <li class="resource-item">
                    <strong>Record Keeping Checklist</strong>
                    <small>Important documents and records to maintain for compliance and tax purposes.</small>
                </li>
                <li class="resource-item">
                    <strong>Employee Onboarding Checklist</strong>
                    <small>Ensure proper setup and documentation when hiring your first employees.</small>
                </li>
            </ul>
            
            <h3 style="margin-top: 30px;">🔗 External Resources</h3>
            <ul class="resource-list">
                <li class="resource-item">
                    <strong>Small Business Administration (SBA)</strong>
                    <small>Federal government resources and support for small business owners.</small>
                </li>
                <li class="resource-item">
                    <strong>IRS Business Tax Center</strong>
                    <small>Official tax information, forms, and filing requirements for businesses.</small>
                </li>
                <li class="resource-item">
                    <strong>SCORE Mentoring</strong>
                    <small>Free business mentoring and workshops from experienced business professionals.</small>
                </li>
                <li class="resource-item">
                    <strong>Local Chamber of Commerce</strong>
                    <small>Connect with other business owners and access local business resources.</small>
                </li>
            </ul>
        </div>
    `;
}

// ============ MODAL & EVENT FUNCTIONS ============
function openUploadModal() {
    document.getElementById('uploadModal').classList.add('show');
}

function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('show');
}

function openReminderModal() {
    document.getElementById('reminderModal').classList.add('show');
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reminderDueDate').min = today;
}

function closeReminderModal() {
    document.getElementById('reminderModal').classList.remove('show');
}

function handleDocumentUpload(e) {
    e.preventDefault();
    
    const user = appState.currentUser;
    const name = document.getElementById('docName').value;
    const type = document.getElementById('docType').value;
    const file = document.getElementById('docFile').files[0];
    
    // Validation
    let hasError = false;
    
    if (!name.trim()) {
        document.getElementById('docNameError').innerHTML = '❌ Document name is required';
        hasError = true;
    } else {
        document.getElementById('docNameError').innerHTML = '';
    }
    
    if (!type) {
        document.getElementById('docTypeError').innerHTML = '❌ Document type is required';
        hasError = true;
    } else {
        document.getElementById('docTypeError').innerHTML = '';
    }
    
    if (!file) {
        document.getElementById('docFileError').innerHTML = '❌ Please select a file';
        hasError = true;
    } else if (file.size > 10 * 1024 * 1024) {
        document.getElementById('docFileError').innerHTML = '❌ File size must not exceed 10MB';
        hasError = true;
    } else {
        document.getElementById('docFileError').innerHTML = '';
    }
    
    if (hasError) return;
    
    // Add document
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
    
    closeUploadModal();
    navigateTo('documents');
}

function handleAddReminder(e) {
    e.preventDefault();
    
    const user = appState.currentUser;
    const title = document.getElementById('reminderTitle').value;
    const description = document.getElementById('reminderDescription').value;
    const dueDate = document.getElementById('reminderDueDate').value;
    const isUrgent = document.getElementById('reminderUrgent').checked;
    
    // Validation
    let hasError = false;
    
    if (!title.trim()) {
        document.getElementById('reminderTitleError').innerHTML = '❌ Title is required';
        hasError = true;
    } else {
        document.getElementById('reminderTitleError').innerHTML = '';
    }
    
    if (!description.trim()) {
        document.getElementById('reminderDescriptionError').innerHTML = '❌ Description is required';
        hasError = true;
    } else {
        document.getElementById('reminderDescriptionError').innerHTML = '';
    }
    
    if (!dueDate) {
        document.getElementById('reminderDueDateError').innerHTML = '❌ Due date is required';
        hasError = true;
    } else {
        document.getElementById('reminderDueDateError').innerHTML = '';
    }
    
    if (hasError) return;
    
    // Add reminder
    const newReminder = {
        id: Date.now().toString(),
        userId: user.id,
        title: title,
        description: description,
        dueDate: dueDate,
        isUrgent: isUrgent,
        status: 'Pending',
        createdAt: new Date().toISOString()
    };
    
    appState.reminders.push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(appState.reminders));
    
    closeReminderModal();
    navigateTo('compliance');
}

function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        appState.documents = appState.documents.filter(d => d.id !== docId);
        localStorage.setItem('documents', JSON.stringify(appState.documents));
        navigateTo('documents');
    }
}

function deleteReminder(reminderId) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        appState.reminders = appState.reminders.filter(r => r.id !== reminderId);
        localStorage.setItem('reminders', JSON.stringify(appState.reminders));
        navigateTo('compliance');
    }
}

function completeReminder(reminderId) {
    const reminder = appState.reminders.find(r => r.id === reminderId);
    if (reminder) {
        reminder.status = 'Completed';
        localStorage.setItem('reminders', JSON.stringify(appState.reminders));
        navigateTo('compliance');
    }
}

function initializeUserData(userId) {
    // Add some sample documents for new users
    const sampleDocs = [
        {
            id: Date.now().toString() + '1',
            userId: userId,
            name: 'Welcome Guide',
            type: 'Guide',
            status: 'Approved',
            uploadedAt: new Date().toISOString()
        }
    ];
    
    // Add some sample reminders
    const sampleReminders = [
        {
            id: Date.now().toString() + '1',
            userId: userId,
            title: 'Annual Tax Filing',
            description: 'File your annual business tax return',
            dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isUrgent: false,
            status: 'Pending',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now().toString() + '2',
            userId: userId,
            title: 'License Renewal',
            description: 'Renew your business license',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isUrgent: false,
            status: 'Pending',
            createdAt: new Date().toISOString()
        }
    ];
    
    appState.documents.push(...sampleDocs);
    appState.reminders.push(...sampleReminders);
    localStorage.setItem('documents', JSON.stringify(appState.documents));
    localStorage.setItem('reminders', JSON.stringify(appState.reminders));
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('loggedInUser');
        appState.currentUser = null;
        renderAuthPage(document.getElementById('app'));
    }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const uploadModal = document.getElementById('uploadModal');
    const reminderModal = document.getElementById('reminderModal');
    
    if (uploadModal && e.target === uploadModal) {
        uploadModal.classList.remove('show');
    }
    if (reminderModal && e.target === reminderModal) {
        reminderModal.classList.remove('show');
    }
});