import {
  Form,
  Button,
  Switch,
  Input,
  Row,
  Modal,
  Typography,
  message,
} from "antd";

const { Title } = Typography;
export const AddNotes = ({
  form,
  isAddModalVisible,
  setIsAddModalVisible,
  loading,
  onFinish,
  setImgUrl,
  imgRef,
  resetFileInput,
}) => {
  const handleFileChange = (e) => {
    const image = e?.target.files[0];
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "unsplash-mini-clone");
      data.append("cloud_name", "Unsplash");
      fetch("https://api.cloudinary.com/v1_1/Unsplash/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((d) => {
          setImgUrl(d.url);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Please choose a file");
    }
  };
  return (
    <>
      <Modal
        closable
        onCancel={() => setIsAddModalVisible(false)}
        visible={isAddModalVisible}
        footer={null}
        afterClose={() => {
          form.resetFields();
          resetFileInput();
        }}
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
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input category!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="tagline" label="Tagline">
            <Input />
          </Form.Item>
          <p>Upload image</p>
          <input
            ref={imgRef}
            type="file"
            name="avatar"
            required
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
          <br />
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
