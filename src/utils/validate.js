
export const checkValidData = (email, password) => {
    const isEmailValid = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
    const isPasswordValid = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(password);

    if(!isEmailValid){
        return 'Email ID is not valid';
    }
    
    if(!isPasswordValid){
        return 'Password is not valid'
    }

    return null;
}