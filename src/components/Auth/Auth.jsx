// CSS imports
import { useEffect, useState } from 'react';
import './Auth.css';
function Auth({onSubmit, resetForm}){

    const [formDetails, setFormDetails] = useState({username:'', email:'', password:'', isLoading: false});

    function updateUsername(updateUsername){
        setFormDetails({...formDetails, username: updateUsername});
    }
    function updateEmail(updateEmail){
        setFormDetails({...formDetails, email: updateEmail});
    }
    function updatePassword(updatePassword){
        setFormDetails({...formDetails, password: updatePassword});
    }
    function onFormSubmit() {
        setFormDetails({...formDetails, isLoading: true});
        onSubmit(formDetails);
    }

    useEffect(() =>{
        setFormDetails({username:'', email:'', password:'', isLoading: false});
    }, [resetForm]);

    return(
        <>
            <div className="input-group">
                <input onChange={(e) => updateUsername(e.target.value)} value={formDetails.username}  type="text" className="form-control" id="username" placeholder="Username" />
            </div>
            <div className="input-group">
                <input onChange={(e) => updateEmail(e.target.value)} value={formDetails.email} type="email" className="form-control" id="UserEmail" placeholder="Useremail" />
            </div>
            <div className="input-group">
                <input onChange={(e) => updatePassword(e.target.value)} value={formDetails.password} type="password" className="form-control" id="userPassword" placeholder="Password" />
            </div>
            <div className="input-group">
                <button onClick={onFormSubmit} class="form-control btn btn-primary" type="button" disabled={formDetails.isLoading}>
                    {(formDetails.isLoading) && <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                    {(formDetails.isLoading) ? 'Loading...':'Submit'}
                </button>
            </div>

        </>
    );
}
export default Auth;
