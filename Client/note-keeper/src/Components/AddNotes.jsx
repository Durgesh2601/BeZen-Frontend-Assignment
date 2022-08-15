import { Form, Button, Switch, Input, Row, Modal, Typography } from "antd";

const { Title } = Typography;
export const AddNotes = ({
  form,
  isAddModalVisible,
  setIsAddModalVisible,
  loading,
  onFinish,
}) => {
  return (
    <>
      <Modal
        closable
        onCancel={() => setIsAddModalVisible(false)}
        visible={isAddModalVisible}
        footer={null}
      >
        <Row>
          <Title level={4}>Add you note here...</Title>
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
              loading={loading}
            >
              Add note
            </Button>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
