import { useState } from 'react';
import { Row, Skeleton, Typography, message, Form, Button, } from 'antd';
import axios from 'axios';
import './Styles/Notes.styles.css'
import { useEffect } from 'react';
import { NotesCard } from './NotesCard';
import { AddNotes } from './AddNotes';
import { Pages } from './Pagination/Pagination';
const { Title, Text } = Typography;
export const Notes = () => {
    const [pinnedNotes, setPinnedNotes] = useState([]);
    const [otherNotes, setOtherNotes] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addNoteLoading, setAddNoteLoading] = useState(false);
    const [spinner, setSpinner] = useState({id: '', status:false});
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();
    useEffect(()=> {
        getNotes(page);
    },[page])
    const getNotes = (page=1) => {
        setLoading(true);
        axios.get(`https://notes-keeper-v1.herokuapp.com/?page=${page}&size=6`).then((res) => {
            if(res?.status === 200){
                const data = res?.data;
                const pinnedNotes = data?.filter((item) => item?.isPinned === true);
                setPinnedNotes(pinnedNotes);
                const otherNotes = data?.filter((item) => item?.isPinned === false);
                setOtherNotes(otherNotes);
                setLoading(false);
            }
        }).catch((err) => {
            setLoading(false);
            message.err(`Oops! Something went wrong. Server did not respond.`)
            console.log(err);
        })
    }

    const onFinish = (values) => {
        setAddNoteLoading(true);
        const payload = {
            "title" : values?.title,
            "tagline" : values?.tagline,
            "description" : values?.description,
            "isPinned" : values?.isPinned || false
        }
        axios.post(`https://notes-keeper-v1.herokuapp.com/`, payload).then((res) => {
            if(res?.status === 201) {
                setAddNoteLoading(false);
                message.success('Note added successfully');
                setIsAddModalVisible(false);
                getNotes(page);
                form.resetFields();
            }
        }).catch((err) => {
            setAddNoteLoading(false);
            setIsAddModalVisible(false);
            message.error(`Oops! Something went wrong`);
            console.log(err);
        })
    }
    const handleDelete = (id) => {
        axios.delete(`https://notes-keeper-v1.herokuapp.com/delete/${id}`).then((res) => {
            if(res?.status === 200){
                message.success(`Note deleted successfully!`);
                getNotes(page);
            }
        }).catch((err) => {
            message.error(`Oops! Something went wrong`);
            console.log(err);
        });
    }
    const handlePinNote = (id, pinnedStatus) => {
        setSpinner({id, status:true});
       axios.patch(`https://notes-keeper-v1.herokuapp.com/pin/${id}`, {'isPinned': pinnedStatus}).then((res) => {
        if(res?.status === 200) {
           setSpinner({id, status:false});
            getNotes(page);
        }
       }).catch((err) => {
            console.log(err);
           setSpinner({id, status:false});
            message.error(`Something went wrong`);
       })
      }
    return (<>
    <Row align='center'>
        <Title level={2}>Welcome To Notes Keeper 2.0</Title>
    </Row>
    <Row align='center'>
        <Text>Here you can store all of your notes and information in an easy-to-use outline and can quickly find what you need.</Text>
        <Button className='add-notes-btn' type='primary' onClick={() => setIsAddModalVisible(true)}>Add a note</Button>
    </Row><br/>
    {pinnedNotes?.length + otherNotes?.length === 0 && !loading &&
    <Row align='center'>
        <Title className='empty-state' level={5}>Looks like there are no notes added here. Please add some.</Title>
    </Row>
    }
    {loading ? <Row>
        <Skeleton/>
    </Row> : 
    <>
        <NotesCard spinner={spinner} pinnedNotes={pinnedNotes} otherNotes={otherNotes} handleDelete={handleDelete} handlePinNote={handlePinNote}  />
        <Pages page={page} setPage={setPage}/>
        {/* <Row align='center'>
        <Button disabled={page===1} onClick={() => setPage(page-1)}>Prev</Button>
        <Button onClick={() => setPage(page+1)}>Next</Button>
        </Row> */}
   </>
    }
    <AddNotes onFinish={onFinish} form={form} isAddModalVisible={isAddModalVisible} setIsAddModalVisible={setIsAddModalVisible} loading={addNoteLoading}/>
      
    </>)
}