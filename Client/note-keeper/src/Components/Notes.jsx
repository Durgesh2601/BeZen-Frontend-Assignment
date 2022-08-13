import { useState } from 'react';
import { Row, Col, Skeleton, Modal, Typography, message, Card } from 'antd';
import { PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import axios from 'axios';
import './Styles/Notes.styles.css'
import { useEffect } from 'react';
const { Title, Text } = Typography;
export const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
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
    const checkIsPinned = (id) => {
        if(notes){
            const newNote = notes?.filter((element) => element?._id === id);
            if(newNote[0]?.isPinned){
                return <PushpinFilled size={22} onClick={() => togglePin(newNote[0]?._id, newNote[0]?.isPinned)} />
            } else {
                return <PushpinOutlined size={20} onClick={() => togglePin(newNote[0]?._id, newNote[0]?.isPinned)}/>
            }
            
        }
    }
    const togglePin = (id, status) => {
       axios.patch(`https://notes-keeper-v1.herokuapp.com/pin/${id}`, {isPinned : !status}).then((res) => {
        if(res?.status === 200) {
            message.success(`Note pinned successfully`);
        }
       }).catch((err) => {
        message.err(`Oops! Something went wrong`);
        console.log(err)
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
            <Card hoverable title={item?.title}
            extra={checkIsPinned(item?._id)}>
                <Row>
                <Text><strong>Tagline</strong> : {item?.tagline}</Text>
                </Row>
                <Text><strong>Description</strong> : {item?.body}</Text>
            </Card>
            </Col>)
        })}
    </Row>
    }
      
    </>)
}