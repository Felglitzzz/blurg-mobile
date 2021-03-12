import { AuthFormValues } from "../types";

const isEmpty = (obj: any) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const validateSignupForm = (formData: any, errors: Partial<AuthFormValues>) => {
  const emailTest = /\S+@\S+\.\S+/;

  if (!formData?.firstName?.trim()) {
    errors.firstName = 'Please enter a valid first name';
  }

  if (!formData?.lastName?.trim()) {
    errors.lastName = 'Please enter a valid last name';
  }
  if (!emailTest.test(formData?.email ?? '')) {
    const errorMessage = 'Please input a valid email';
    errors.email = errorMessage;
  }

  if (!formData?.password?.trim()) {
    errors.password = 'Password cannot be empty';
  }

  if (!formData?.cpassword?.trim()) {
    console.log('i got here')
    errors.cpassword = 'Please confirm password';
  }

  if (formData?.cpassword && formData?.password !== formData?.cpassword) {
    errors.password = 'Passwords do not match!';
  }

  return isEmpty(errors);
};

export const validateSigninForm = (formData: any, errors: Partial<AuthFormValues>) => {
  const emailTest = /\S+@\S+\.\S+/;

  if (!emailTest.test(formData?.email ?? '')) {
    const errorMessage = 'Please input a valid email';
    errors.email = errorMessage;
  }

  if (!formData?.password?.trim()) {
    errors.password = 'Password cannot be empty';
  }

  return isEmpty(errors);
};