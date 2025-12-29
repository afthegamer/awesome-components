export interface ComplexFormValue {
  personalInfo: {
    firstName: string;
    lastName: string;
  };

  contactPreference: 'email' | 'phone';

  email?: {
    email: string;
    confirm: string;
  };

  phone?: string;

  loginInfo: {
    username: string;
    password: string;
    confirmPassword: string;
  };
}
