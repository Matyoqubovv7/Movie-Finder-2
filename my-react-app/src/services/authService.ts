export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

class AuthService {
  private readonly USERS_KEY = 'moviehub_users';
  private readonly CURRENT_USER_KEY = 'moviehub_current_user';

  // Get all users from localStorage
  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Get current logged in user
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Save current user to localStorage
  private saveCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = this.getUsers();
      
      // Check if email already exists
      const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        return {
          success: false,
          message: 'Bu email manzil allaqachon ro\'yxatdan o\'tgan'
        };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email.toLowerCase(),
        password: userData.password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
      };

      // Add user to storage
      users.push(newUser);
      this.saveUsers(users);

      // Auto login after registration
      this.saveCurrentUser(newUser);

      return {
        success: true,
        message: 'Muvaffaqiyatli ro\'yxatdan o\'tildi!',
        user: newUser
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ro\'yxatdan o\'tishda xatolik yuz berdi'
      };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = this.getUsers();
      
      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (!user) {
        return {
          success: false,
          message: 'Email yoki parol noto\'g\'ri'
        };
      }

      // Check password
      if (user.password !== credentials.password) {
        return {
          success: false,
          message: 'Email yoki parol noto\'g\'ri'
        };
      }

      // Login successful
      this.saveCurrentUser(user);

      return {
        success: true,
        message: 'Muvaffaqiyatli kirildi!',
        user: user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Kirishda xatolik yuz berdi'
      };
    }
  }

  // Logout user
  logout(): void {
    this.saveCurrentUser(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string }> {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'Foydalanuvchi topilmadi'
        };
      }

      // Update user data
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);

      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.saveCurrentUser(users[userIndex]);
      }

      return {
        success: true,
        message: 'Profil muvaffaqiyatli yangilandi'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Profilni yangilashda xatolik yuz berdi'
      };
    }
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return {
          success: false,
          message: 'Foydalanuvchi topilmadi'
        };
      }

      // Check current password
      if (users[userIndex].password !== currentPassword) {
        return {
          success: false,
          message: 'Joriy parol noto\'g\'ri'
        };
      }

      // Update password
      users[userIndex].password = newPassword;
      this.saveUsers(users);

      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.saveCurrentUser(users[userIndex]);
      }

      return {
        success: true,
        message: 'Parol muvaffaqiyatli o\'zgartirildi'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Parolni o\'zgartirishda xatolik yuz berdi'
      };
    }
  }
}

export const authService = new AuthService(); 