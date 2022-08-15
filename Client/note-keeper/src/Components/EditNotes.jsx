import {
  Modal,
  Form,
  Input,
  Switch,
  Row,
  Button,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const { Title } = Typography;
export const EditNotes = ({
  isEditModalVisible,
  setIsEditModalVisible,
  id,
}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (id) {
      getNoteById(id);
    }
  }, [id]);
  const getNoteById = (id) => {
    setLoading(false);
    axios
      .get(`https://notes-keeper-v1.herokuapp.com/${id}`)
      .then((res) => {
        if (res?.status === 200) {
          setData(res?.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        message.error(`Something went wrong`);
        console.log(err);
      });
  };
  // const defaultValues = () => {
  //     if(data){
  //        const { title, tagline, description, isPinned } = data;
  //        const values = {title, tagline, description, isPinned};
  //        form.setFieldValue(values);
  //     }
  // }
  const onFinish = (values) => {};
  return (
    <>
      {data && (
        <Modal
          closable
          onCancel={() => setIsEditModalVisible(false)}
          visible={isEditModalVisible}
          footer={null}
        >
          <Row>
            <Title level={4}>Edit you note...</Title>
          </Row>
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="tagline" label="Tagline">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input />
            </Form.Item>
            <Form.Item
              name="isPinned"
              label="Pin this note"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Row align="center">
              <Button
                htmlType="submit"
                style={{ width: "70%" }}
                //   loading={loading}
              >
                Save changes
              </Button>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
};
