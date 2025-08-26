
import { User, SignupFormData, CurrentUser, ApiResponse, AddStudentFormData, UserType, AddTeacherFormData } from '../types';

const USERS_STORAGE_KEY = 'mindsetu_users';

// Helper to get users from localStorage
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Initialize with more diverse mock data if none exists
const initializeMockUsers = () => {
  const existingUsers = getUsers();
  if (existingUsers.length === 0) {
    const mockUsers: User[] = [
      // SuperAdmin for "Greenwood High"
      {
        id: 'superadmin1',
        firstName: 'Sarah',
        lastName: 'Principal',
        email: 'sarah@greenwood.edu',
        password: 'password123',
        userType: UserType.SuperAdmin,
        instituteName: 'greenwood high',
        isActivated: true,
        isPreRegisteredByAdmin: false,
      },
      // Teacher for "Greenwood High", pre-registered by Sarah
      {
        id: 'teacher1gw',
        firstName: 'Tom',
        lastName: 'Faculty',
        email: 'tom@greenwood.edu',
        // password: 'password123', // Teacher sets password on signup
        userType: UserType.Teacher,
        instituteName: 'greenwood high',
        isActivated: false, // Activated upon their own signup
        isPreRegisteredByAdmin: true, // Pre-registered by SuperAdmin
      },
      // Students for "Greenwood High", pre-registered by Tom (once Tom is active)
      // For now, assume Tom is active for student pre-registration demo purposes
      {
        id: 'student1gw',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@greenwood.edu',
        // password: 'password123', // Student sets password on signup
        userType: UserType.Student,
        instituteName: 'greenwood high',
        isActivated: false, // Activated upon their own signup
        isPreRegisteredByAdmin: true, // Pre-registered by Teacher
      },
      {
        id: 'student2gw',
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@greenwood.edu',
        userType: UserType.Student,
        instituteName: 'greenwood high',
        isActivated: false,
        isPreRegisteredByAdmin: true,
      },

      // SuperAdmin for "Oakwood Academy"
      {
        id: 'superadmin2',
        firstName: 'Olivia',
        lastName: 'Director',
        email: 'olivia@oakwood.edu',
        password: 'password123',
        userType: UserType.SuperAdmin,
        instituteName: 'oakwood academy',
        isActivated: true,
        isPreRegisteredByAdmin: false,
      },
      // Student for "Oakwood Academy", pre-registered by Olivia
      {
        id: 'student1oa',
        firstName: 'Eve',
        lastName: 'Online',
        email: 'eve@oakwood.edu',
        userType: UserType.Student,
        instituteName: 'oakwood academy',
        isActivated: false,
        isPreRegisteredByAdmin: true,
      },
    ];
    saveUsers(mockUsers);
  }
};
initializeMockUsers();


export const signupUser = async (formData: SignupFormData): Promise<ApiResponse<CurrentUser>> => {
  return new Promise((resolve) => {
    setTimeout(() => { // Simulate network delay
      const users = getUsers();
      const instituteNameLower = formData.instituteName.toLowerCase();

      if (!formData.password || formData.password.length < 6) {
        resolve({ success: false, error: 'Password must be at least 6 characters long.' });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        resolve({ success: false, error: 'Passwords do not match.' });
        return;
      }
      if (!formData.instituteName.trim()) {
        resolve({ success: false, error: 'Institute name is required.' });
        return;
      }

      // SuperAdmin Signup
      if (formData.userType === UserType.SuperAdmin) {
        const existingSuperAdminForInstitute = users.find(user => user.userType === UserType.SuperAdmin && user.instituteName === instituteNameLower);
        if (existingSuperAdminForInstitute) {
          resolve({ success: false, error: `A SuperAdmin for institute '${formData.instituteName}' already exists.` });
          return;
        }
        const existingUserEmail = users.find(user => user.email === formData.email);
        if (existingUserEmail) {
            resolve({ success: false, error: `This email is already registered.` });
            return;
        }

        const newSuperAdmin: User = {
          id: `sa_${Date.now().toString()}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          userType: UserType.SuperAdmin,
          instituteName: instituteNameLower,
          isActivated: true,
          isPreRegisteredByAdmin: false,
        };
        users.push(newSuperAdmin);
        saveUsers(users);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...superAdminToReturn } = newSuperAdmin;
        resolve({ success: true, data: superAdminToReturn, message: 'SuperAdmin account created! You can now log in.' });
      }
      // Teacher Signup (Claiming pre-registered account)
      else if (formData.userType === UserType.Teacher) {
        const instituteSuperAdminExists = users.some(user => user.userType === UserType.SuperAdmin && user.instituteName === instituteNameLower);
        if (!instituteSuperAdminExists) {
          resolve({ success: false, error: `Institute '${formData.instituteName}' is not registered. A SuperAdmin must register it first.` });
          return;
        }
        const teacherIndex = users.findIndex(user =>
          user.email === formData.email &&
          user.instituteName === instituteNameLower &&
          user.userType === UserType.Teacher
        );
        if (teacherIndex === -1) {
          resolve({ success: false, error: 'You have not been pre-registered by a SuperAdmin for this institute.' });
          return;
        }
        const teacherToActivate = users[teacherIndex];
        if (!teacherToActivate.isPreRegisteredByAdmin) {
          resolve({ success: false, error: 'This teacher account was not pre-registered.' });
          return;
        }
        if (teacherToActivate.isActivated) {
          resolve({ success: false, error: 'This teacher account is already active. Please try logging in.' });
          return;
        }
        teacherToActivate.password = formData.password;
        teacherToActivate.firstName = formData.firstName;
        teacherToActivate.lastName = formData.lastName;
        teacherToActivate.isActivated = true;
        users[teacherIndex] = teacherToActivate;
        saveUsers(users);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...activatedTeacher } = teacherToActivate;
        resolve({ success: true, data: activatedTeacher, message: 'Teacher account activated! You can now log in.' });
      }
      // Student Signup (Claiming pre-registered account)
      else if (formData.userType === UserType.Student) {
        const instituteExists = users.some(user => (user.userType === UserType.SuperAdmin || user.userType === UserType.Teacher) && user.instituteName === instituteNameLower && user.isActivated);
        if (!instituteExists) {
          resolve({ success: false, error: `Institute '${formData.instituteName}' is not registered or no active Teacher/SuperAdmin found. Please contact your institute.` });
          return;
        }
        const studentIndex = users.findIndex(user =>
          user.email === formData.email &&
          user.instituteName === instituteNameLower &&
          user.userType === UserType.Student
        );
        if (studentIndex === -1) {
          resolve({ success: false, error: 'You have not been pre-registered by a Teacher for this institute.' });
          return;
        }
        const studentToActivate = users[studentIndex];
        if (!studentToActivate.isPreRegisteredByAdmin) {
          resolve({ success: false, error: 'This student account was not pre-registered by a Teacher.' });
          return;
        }
        if (studentToActivate.isActivated) {
          resolve({ success: false, error: 'This student account is already active. Please try logging in.' });
          return;
        }
        studentToActivate.password = formData.password;
        studentToActivate.firstName = formData.firstName;
        studentToActivate.lastName = formData.lastName;
        studentToActivate.isActivated = true;
        users[studentIndex] = studentToActivate;
        saveUsers(users);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...activatedStudent } = studentToActivate;
        resolve({ success: true, data: activatedStudent, message: 'Student account activated! You can now log in.' });
      } else {
        resolve({ success: false, error: 'Invalid user type for signup.' });
      }
    }, 500);
  });
};

export const loginUser = async (emailInput: string, passwordInput: string, instituteNameInput: string): Promise<ApiResponse<CurrentUser>> => {
  return new Promise((resolve) => {
    setTimeout(() => { // Simulate network delay
      const users = getUsers();
      const instituteNameLower = instituteNameInput.toLowerCase();
      const potentialUser = users.find(u => u.email === emailInput && u.instituteName === instituteNameLower);

      if (!potentialUser) {
        resolve({ success: false, error: 'Invalid email, institute, or user not found.' });
        return;
      }

      if (potentialUser.password !== passwordInput) {
        resolve({ success: false, error: 'Invalid password.' });
        return;
      }

      if (!potentialUser.isActivated) {
        if (potentialUser.isPreRegisteredByAdmin) {
             resolve({ success: false, error: `Your ${potentialUser.userType} account has been pre-registered. Please complete the signup process to activate it.` });
        } else {
            resolve({ success: false, error: 'This account is not currently active. Please contact support or your administrator.' });
        }
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userToReturn } = potentialUser;
      resolve({ success: true, data: userToReturn });
    }, 500);
  });
};

export const teacherAddStudent = async (actor: CurrentUser, studentData: AddStudentFormData): Promise<ApiResponse<User>> => {
   return new Promise((resolve) => {
    setTimeout(() => {
      if (actor.userType !== UserType.Teacher && actor.userType !== UserType.SuperAdmin) {
        resolve({ success: false, error: "Unauthorized: Only Teachers or SuperAdmins can add students." });
        return;
      }

      const users = getUsers();
      const existingStudent = users.find(user => user.email === studentData.email && user.instituteName === actor.instituteName);

      if (existingStudent) {
        resolve({ success: false, error: `A user with email ${studentData.email} already exists at ${actor.instituteName}.` });
        return;
      }

      const newStudent: User = {
        id: `s_${Date.now().toString()}`,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        userType: UserType.Student,
        instituteName: actor.instituteName,
        isActivated: false,
        isPreRegisteredByAdmin: true,
      };
      users.push(newStudent);
      saveUsers(users);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...studentToReturn } = newStudent;
      resolve({ success: true, data: studentToReturn, message: `Student ${newStudent.firstName} pre-registered. They can now complete their signup.` });
    }, 500);
  });
};

export const superAdminAddTeacher = async (superAdmin: CurrentUser, teacherData: AddTeacherFormData): Promise<ApiResponse<User>> => {
   return new Promise((resolve) => {
    setTimeout(() => {
      if (superAdmin.userType !== UserType.SuperAdmin) {
        resolve({ success: false, error: "Unauthorized: Only SuperAdmins can add teachers." });
        return;
      }

      const users = getUsers();
      const existingTeacher = users.find(user => user.email === teacherData.email && user.instituteName === superAdmin.instituteName);

      if (existingTeacher) {
         resolve({ success: false, error: `A user with email ${teacherData.email} already exists at ${superAdmin.instituteName}.` });
        return;
      }
      const existingUserEmail = users.find(user => user.email === teacherData.email);
       if (existingUserEmail) {
            resolve({ success: false, error: `This email is already registered in the system.` });
            return;
      }

      const newTeacher: User = {
        id: `t_${Date.now().toString()}`,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        userType: UserType.Teacher,
        instituteName: superAdmin.instituteName,
        isActivated: false,
        isPreRegisteredByAdmin: true,
      };
      users.push(newTeacher);
      saveUsers(users);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...teacherToReturn } = newTeacher;
      resolve({ success: true, data: teacherToReturn, message: `Teacher ${newTeacher.firstName} pre-registered. They can now complete their signup.` });
    }, 500);
  });
};
