export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export function validateSignUp({name , email , password}){
    const errors = {};

    if(!name || name.length < 2) errors.name = "Name must be at least 2 characters long";
    if(!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format";
    if(!password || password.length < 6) errors.password = "Password must be at least 6 characters long";

    return errors;
}


export async function signUp(req , res){
    const {name , email , password} = req.body;

    const errors = validateSignUp({name , email , password});
    if(Object.keys(errors).length > 0) {
        return res.status(400).json({message: Object.values(errors)[0]}); // Send first error
    }
   
}


export const validateSignupForm = (formData) => {
  const errors = {};

  if (!formData.name) {
    errors.name = 'Name is required';
  } else if (!validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateNoteForm = (noteData) => {
  const errors = {};

  if (!noteData.title || !noteData.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!noteData.content || !noteData.content.trim()) {
    errors.content = 'Content is required';
  }

  return errors;
};