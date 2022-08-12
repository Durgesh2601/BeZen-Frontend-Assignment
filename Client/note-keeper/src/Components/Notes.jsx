import { useState } from 'react';
import { Row, Col, Skeleton, Modal, Typography, message, Card } from 'antd';
import axios from 'axios';
import './Styles/Notes.styles.css'
import { useEffect } from 'react';
const { Title, Text } = Typography;
export const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(()=> {
        getNotes();
    },[])
    const getNotes = () => {
        setLoading(true);
        axios.get(`https://notes-keeper-v1.herokuapp.com/`).then((res) => {
            if(res?.status === 200){
                setLoading(false);
                setNotes(res?.data);
            }
        }).catch((err) => {
            setLoading(false);
            message.err(`Oops! Something went wrong. Server did not respond.`)
            console.log(err);
        })
    }
    return (<>
    <Row align='center'>
        <Title level={2}>Welcome To Notes Keeper 2.0</Title>
    </Row>
    <Row align='center'>
        <Text>Here you can store all of your notes and information in an easy-to-use outline and can quickly find what you need.</Text>
    </Row><br/>
    {loading ? <Row>
        <Skeleton/>
    </Row> : 
    <Row className='cards-container'>
        {notes?.map((item) => {
            return (<Col className='cards-col'>
            <Card hoverable title={item?.title}>
                <Text>Tagline : {item?.tagline}</Text>
            </Card>
            </Col>)
        })}
    </Row>
    }
      
    </>)
}