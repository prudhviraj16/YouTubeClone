import React,{useState,useEffect} from "react";
import styled from "styled-components";
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
// import { fetchData } from "../Redux/Login/action";
import { loginFailure, loginStart, loginSuccess } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import {auth,provider} from '../firebase'
import { signInWithPopup } from "firebase/auth";
import cors from 'cors'



const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
border: 1px solid ${({ theme }) => theme.soft};
border-radius: 3px;
padding: 10px;
background-color: transparent;
width: 100%;
color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {

  const dispatch = useDispatch()  

  const navigate = useNavigate()
 

  const [data,setData] = useState({
    username : '',
    email : '',
    password : '',
    
  }) 


  const [login,setLogin] = useState({
    email : '',
    password : '',
    
  }) 


  const handleChange = (e) =>{
    const {name,value} = e.target
    setData(prevState=>{
      return {
        ...prevState,
        [name] : value
      }
    })
  }


  const loginChange = (e) =>{
      const {name,value} = e.target

      setLogin(prevState=>{
        return {
          ...prevState,
          [name] : value
        }
      })

  }


  const submitHandler = (e)=>{
    e.preventDefault();

    try{
      axios.post('http://localhost:4000/api/users/register',data).then(res=>console.log(res,"okay")).catch((err)=>console.log(err))
    }
    catch(err){
      console.log(err)
    }
  }



  const handleLogin = async (e) => {
      e.preventDefault()
      dispatch(loginStart())
      try{
          const res = await axios.post("/users/signin",login)
          console.log(res)
          dispatch(loginSuccess(res.data))
          navigate("/") 
      }
      catch(err){
          dispatch(loginFailure())
      }
  }

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post("http://localhost:4000/api/users/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            console.log(res)
            dispatch(loginSuccess(res.data));
            navigate("/")
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to YouTube</SubTitle>
        <Input placeholder="Email" name="email" className="loginInput" onChange={loginChange} required type='email'/>
        <Input type="password" placeholder="password" name="password" className="loginInput" onChange={loginChange} required minLength="6"/>
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>SignIn With Google</Button>
        <Title>or</Title>
         <Input placeholder="Username" name="username" className="loginInput" onChange={handleChange} required />
         <Input placeholder="Email" name="email" className="loginInput" onChange={handleChange} required type='email'/>
         <Input placeholder="Password" name="password" className="loginInput" onChange={handleChange} required type='password' minLength="6"/>
        <Button onClick={submitHandler}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
