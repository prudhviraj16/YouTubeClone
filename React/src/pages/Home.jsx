import React,{useState,useEffect} from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from 'axios'
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type}) => {

  const [video,setVideo] = useState([])

  useEffect(()=>{
    const fetchVideos = async () =>{
      const res =await axios.get(`http://localhost:4000/api/videos/${type}`,{
        headers :{ 
        'Access-Control-Allow-Origin': 'http://localhost:4000/api/',
        'Access-Control-Allow-Methods': ['POST', 'GET', 'OPTIONS'],
        'Access-Control-Allow-Headers': ['X-PINGOTHER', 'Content-Type']
        }
      })

      setVideo(res.data)
    }

    fetchVideos()
  },[type])

  return (
    <Container>
      {video.map((video)=>(
        <Card key={video._id} video={video}/>
      ))}
    </Container>
  );
};

export default Home;
