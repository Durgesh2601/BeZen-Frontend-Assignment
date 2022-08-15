import {
  Modal,
  Form,
  Input,
  Switch,
  Row,
  Button,
  Typography,
  Checkbox,
  message,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const { Title } = Typography;
export const EditNotes = ({
  isEditModalVisible,
  setIsEditModalVisible,
  data,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      defaultValues();
    }
  }, [data]);
  const defaultValues = () => {
    const { title, tagline, description, isPinned } = data;
    const values = { title, tagline, description, isPinned };
    form.setFieldsValue(values);
  };
  const onFinish = (values) => {
    setLoading(true);
    const payload = { ...values, isPinned: data?.isPinned };
    axios
      .put(`https://notes-keeper-v1.herokuapp.com/edit/${data?._id}`, payload)
      .then((res) => {
        if (res?.status === 200) {
          setLoading(false);
          setIsEditModalVisible(false);
          message.success(`Note edited successfully`);
          form.resetFields();
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        form.resetFields();
        setIsEditModalVisible(false);
        message.error(`Something went wrong`);
        window.location.reload();
      });
  };
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
          <Form
            layout="vertical"
            onFinish={onFinish}
            form={form}
            initialValues={defaultValues}
          >
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
            <Row align="center">
              <Button
                htmlType="submit"
                style={{ width: "70%" }}
                loading={loading}
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
