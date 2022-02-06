import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    let history = useHistory();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const   {name,email,password} = credentials;
     
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name,email,password })
    });
    const json = await response.json();
    console.log(json);
        //Save the authtoken and redirect
        if(json.success){
        localStorage.setItem('token', json.authtoken);
        history.push("/");
        props.showAlert("Account Created Successfully","success");
        }
        else{
            props.showAlert("Invalid details","danger");
        }
    
    
}

const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
}
    return (
        <div className="container">
            <div className="mt-2"></div>
            <h2>Create a new account</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3" className="my-2">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange}  aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="mb-3" className="my-2">
                    <label htmlFor="email">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your name with anyone else.</small>
                </div>
                <div className="mb-3" className="my-2">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password"  onChange={onChange}  minLength ="5" required/>
                </div>
                <div className="mb-3" className="my-2">
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange}  minLength="5" required/>
                </div>
                
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
};

export default Signup;
