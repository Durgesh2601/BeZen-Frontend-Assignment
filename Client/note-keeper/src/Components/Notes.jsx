import { Typography, Row } from 'antd';
import './Styles/Notes.styles.css'
const { Title, Text } = Typography;
export const Notes = () => {
    return (<>
        <Row>
        <Title align='center' level={1}>Welcome To Note Keeper</Title>
        </Row>
        <Row align='center'>
        <Text style={{textAlign:"center"}} className='header-subtext'>Add your notes here and customize as per your convenience</Text>
        </Row>

    </>)
}