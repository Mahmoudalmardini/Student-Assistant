const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAccountsAPI() {
  console.log('🚀 Testing Account Management API...\n');

  try {
    // Test 1: Login as Super Admin
    console.log('1. Testing Super Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      identifier: 'admin',
      password: 'admin123'
    });
    
    if (loginResponse.status === 200) {
      console.log('✅ Super Admin login successful');
      console.log('   User:', loginResponse.data.user);
      const token = loginResponse.data.access_token;
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Test 2: Create Student Account
      console.log('\n2. Testing Student Account Creation...');
      const studentAccount = {
        role: 'student',
        studentFirstName: 'Alice',
        studentLastName: 'Brown',
        universityId: 'STU2024001',
        studentPassword: 'password123',
        studentConfirmPassword: 'password123'
      };

      try {
        const createStudentResponse = await axios.post(`${BASE_URL}/accounts`, studentAccount, { headers });
        console.log('✅ Student account created successfully');
        console.log('   Student ID:', createStudentResponse.data.id);
        
        const studentId = createStudentResponse.data.id;

        // Test 3: Login as Student
        console.log('\n3. Testing Student Login...');
        const studentLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          identifier: 'STU2024001',
          password: 'password123'
        });
        
        if (studentLoginResponse.status === 200) {
          console.log('✅ Student login successful');
          console.log('   Student User:', studentLoginResponse.data.user);
        }

        // Test 4: Create Admin Account (Super Admin only)
        console.log('\n4. Testing Admin Account Creation...');
        const adminAccount = {
          role: 'admin',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe_admin',
          password: 'password123',
          confirmPassword: 'password123'
        };

        const createAdminResponse = await axios.post(`${BASE_URL}/accounts`, adminAccount, { headers });
        console.log('✅ Admin account created successfully');
        console.log('   Admin ID:', createAdminResponse.data.id);

        // Test 5: Get All Accounts
        console.log('\n5. Testing Get All Accounts...');
        const getAllResponse = await axios.get(`${BASE_URL}/accounts`, { headers });
        console.log('✅ All accounts retrieved successfully');
        console.log('   Total accounts:', getAllResponse.data.length);

        // Test 6: Update Student Account
        console.log('\n6. Testing Account Update...');
        const updateData = {
          firstName: 'Alice Updated',
          lastName: 'Brown Updated'
        };
        
        const updateResponse = await axios.patch(`${BASE_URL}/accounts/${studentId}`, updateData, { headers });
        console.log('✅ Account updated successfully');
        console.log('   Updated name:', updateResponse.data.firstName, updateResponse.data.lastName);

        // Test 7: Get Accounts by Role
        console.log('\n7. Testing Get Accounts by Role...');
        const getByRoleResponse = await axios.get(`${BASE_URL}/accounts/role/student`, { headers });
        console.log('✅ Student accounts retrieved successfully');
        console.log('   Student accounts count:', getByRoleResponse.data.length);

        console.log('\n🎉 All tests passed successfully!');
        
      } catch (error) {
        console.error('❌ Error in account operations:', error.response?.data || error.message);
      }

    } else {
      console.log('❌ Super Admin login failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAccountsAPI();
