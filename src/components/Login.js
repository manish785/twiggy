import { useState, useRef } from 'react';
import { checkValidData } from '../utils/validate';
import { auth } from "../utils/firebase";
import { USER_AVATAR } from "../utils/constants";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { BG_URL } from '../utils/constants';

const Login = () => {
    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

    const navigate = useNavigate();

    const getUser = {
        email: 'test1234@gmail.com',
        password: 'test@1234'
    }

    const guestUserHandler = (event) => {
        event.preventDefault();
        email.current.value = getUser.email;
        password.current.value = getUser.password;
    }

    const toggleSignInForm = () => {
        setIsSignInForm(!isSignInForm);
    }

    const toggleLoginStatus = () => {
        setIsLoggedIn(!isLoggedIn);
    }

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                toggleLoginStatus();
                navigate('/login');
            })
            .catch((error) => {
                navigate('/error');
            })
    }

    const handleButtonClick = () => {
        // Validate the form data
        const message = checkValidData(email.current.value, password.current.value);
        setErrorMessage(message);
        if (message) {
            return;
        }

        if (!isSignInForm) {
            // Sign Up Logic
            createUserWithEmailAndPassword(
                auth,
                email.current.value,
                password.current.value
            )
                .then((userCredential) => {
                    const user = userCredential.user;
                    updateProfile(user, {
                        displayName: name.current.value,
                        photoURL: USER_AVATAR,
                    })
                        .then(() => {
                            toggleLoginStatus();
                            const { uid, email, displayName, photoURL } = auth.currentUser;
                            navigate('/');
                        })
                        .catch((error) => {
                            setErrorMessage(error.message);
                        });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode + "-" + errorMessage);
                });
        } else {
            signInWithEmailAndPassword(auth, email.current.value, password.current.value)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    toggleLoginStatus(); // Update login status
                    navigate('/');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setErrorMessage(errorCode + "-" + errorMessage);
                });

        }
    }

    return (
        <div className='mt-[-224px] full-screen'>
            <div className="absolute">
                <img
                    className="h-[800px] w-screen object-cover"
                    src={BG_URL}
                    alt="BG-IMG"
                />
            </div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="absolute mt-[130px] left-0 right-0 w-[70%] md:w-[70%] xl:w-[25%] p-4 md:p-8 mx-auto text-white bg-black rounded-lg my-36 bg-opacity-888 "
            >
                <h1 className="py-4 text-3xl font-bold">
                    {isLoggedIn ? 'Logout' : (isSignInForm ? 'Sign In' : 'Sign Up')}
                </h1>
                {!isSignInForm && (
                    <input
                        ref={name}
                        type="text"
                        placeholder="Full Name"
                        className="p-4 rounded-md my-2 w-full bg-[#333333] border-b-2  border-transparent  focus:border-b-2 focus:outline-0"
                    />
                )}
                <input
                    ref={email}
                    type="email"
                    placeholder="Email Address"
                    className="p-4 rounded-md my-2 w-full bg-[#333333] border-b-2  border-transparent focus:border-b-2  focus:outline-0"
                />
                <input
                    ref={password}
                    type="password"
                    placeholder="Password"
                    className="p-4 rounded-md my-2 w-full bg-[#333333] border-b-2 border-transparent  focus:border-b-2  focus:outline-0"
                />
                <p className="text-[#e50914]">{errorMessage}</p>
                <button className='p-4 my-6 rounded-md bg-[#e50914] hover:bg-[#d6180b] w-full font-medium'
                    onClick={guestUserHandler}
                >
                    Add Guest Credentials
                </button>
                <button
                    className="p-4 my-6 rounded-md bg-[#e50914] hover:bg-[#d6180b] w-full font-medium"
                    onClick={handleButtonClick}
                >
                    {isSignInForm ? 'Sign In' : 'Sign Up'}
                </button>
                <p
                    className="my-4 cursor-pointer opacity-100  hover:opacity-100 hover:underline"
                    onClick={toggleSignInForm}
                >
                    {isSignInForm
                        ? 'New User ? Sign Up Now'
                        : 'Already registered? Sign In Now'}
                </p>
            </form>
        </div>
    )
}

export default Login;