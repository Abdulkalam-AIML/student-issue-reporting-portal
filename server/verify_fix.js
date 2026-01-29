const axios = require('axios');

const run = async () => {
  try {
    console.log('--- Starting Verification ---');

    // 1. Register Student
    // Use a random email to avoid "User already exists" error on re-runs
    const randomId = Math.floor(Math.random() * 10000);
    const studentEmail = `student${randomId}@srm.edu`;
    
    console.log(`Attempting registration for ${studentEmail}...`);
    const regRes = await axios.post('http://localhost:5001/api/auth/register', {
        name: 'Test Student',
        email: studentEmail,
        password: 'password123',
        role: 'student',
        studentType: 'hosteller', // Fixed: lowercase 'hosteller' matches enum
        department: 'CSE',
        year: 3
    });
    const token = regRes.data.token;
    console.log('✅ Registered Student. Token acquired.');

    // 2. Create Issue (Missing Severity - Test Fix)
    console.log('Attempting to create issue (missing severity)...');
    try {
        const issueRes = await axios.post('http://localhost:5001/api/issues', {
            title: 'Backend Fix Test',
            description: 'Testing if server crashes on undefined severity',
            department: 'Infrastructure',
            category: 'infrastructure'
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        console.log('✅ Issue Created successfully.');
        console.log(`   Severity set to: ${issueRes.data.severity} (Expected: low)`);
        console.log(`   SLA Deadline: ${issueRes.data.slaDeadline}`);
    } catch (err) {
        console.error('❌ Issue Creation Failed:', err.response ? err.response.data : err.message);
    }

    // 3. Admin Login (Test Hardcoded Logic)
    console.log('Attempting Admin Login...');
    try {
        const adminRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'hackathon@gmail.com',
            password: 'Fortex'
        });
        console.log('✅ Admin Login Successful.');
        console.log(`   Role: ${adminRes.data.role} (Expected: admin)`);
        console.log(`   Name: ${adminRes.data.name}`);
    } catch (err) {
        console.error('❌ Admin Login Failed:', err.response ? err.response.data : err.message);
    }

  } catch (e) {
    console.error('❌ Fatal Error:', e.response ? e.response.data : e.message);
  }
};

run();
