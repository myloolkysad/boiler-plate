import React, {useState} from 'react'
import Axios from 'axios';
import { useDispatch } from 'react-redux'
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';  // react-router-dom v6부터 useHistory에서 useNavigate로 바뀜
import { withRouter } from 'react-router-dom';

function LogingPage(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => { //input email의 onChange이벤트를 연결할 함수 선언
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {//input password의 onChange이벤트를 연결할 함수 선언
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); //화면 새로고침 방지

        console.log('Email', Email);
        console.log('Password', Password);
        
        let body = {
            email: Email,
            password: Password
        };
        dispatch(loginUser(body))
        .then(response => {
            console.log(response);
            if(response.payload.loginSuccess) {
                //props.history.push('/');
                navigate("/login");
            } else {
                alert('Error~');
            }
        });
        
    }

    return (
        <div style={{display:'flex', justifyContent:'center', alignItems: 'center',
             width:'100%', height: '100vh'
        }}>
            <form style={{display:'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>
                
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                <br/>
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LogingPage