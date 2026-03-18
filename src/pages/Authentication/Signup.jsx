import Auth from "../../components/Auth/Auth";
import { Link,  useNavigate } from 'react-router-dom';
import { signup } from '../../apis/fakeStoreProdApi';

import './Auth.css';
import axios from "axios";
import { useState } from "react";
function Signup(){
    const navigate = useNavigate();

    const [resetForm, setResetForm] = useState(false);

    async function onAuthformSubmit(authArguments){
        try {
            await axios.post(signup(), {
                username:authArguments.username,
                email: authArguments.email,
                password: authArguments.password
            });
            navigate('/signin');
        } catch (error) {
            console.log(error);
            setResetForm(true);
        }
    }

    return(
        <div className="container">
            <div className="row">
                <div className="home-title text-center ">Welcome to Shop Cart</div>
            </div>
            <div className="Login">
                <div className="login-wrapper" id="loginForm">
                    <h4 className="text-center">Signup</h4>
                </div>
                <Auth 
                    onSubmit={onAuthformSubmit}wsl

                    resetForm={resetForm}
                />
                <div className="signup-btn text-center" id="showSignUp">
                    <Link to="/signin" >
                        Already have an account? Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default Signup;