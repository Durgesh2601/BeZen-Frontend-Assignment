import { useState } from "react";
import {
  PushpinOutlined,
  EditOutlined,
  DeleteOutlined,
  PushpinTwoTone,
} from "@ant-design/icons";
import { Row, Col, Typography, Card, Popconfirm, Spin, Tooltip } from "antd";
import { EditNotes } from "./EditNotes";

const { Title, Text } = Typography;
export const NotesCard = ({
  pinnedNotes,
  otherNotes,
  handleDelete,
  handlePinNote,
  spinner,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const handleEditNote = (item) => {
    setIsEditModalVisible(true);
    setSelectedItem(item);
  };
  return (
    <>
      {selectedItem && (
        <EditNotes
          isEditModalVisible={isEditModalVisible}
          setIsEditModalVisible={setIsEditModalVisible}
          data={selectedItem}
        />
      )}
      {pinnedNotes?.length > 0 && (
        <>
          <Title className="title-category-notes" level={4}>
            Pinned
          </Title>
          <Row className="cards-container">
            {pinnedNotes?.map((item) => {
              return (
                <Col className="cards-col" key={item?._id}>
                  <Card
                    className="card-notes"
                    hoverable
                    title={item?.title}
                    cover={
                      <img
                        height={200}
                        width={150}
                        alt="alt_img"
                        src={item?.img}
                      />
                    }
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditNote(item)}
                      />,
                      spinner?.id === item?._id && spinner?.status ? (
                        <Spin />
                      ) : item?.isPinned ? (
                        <Tooltip title="Click to unpin this note">
                          <PushpinTwoTone
                            onClick={() => handlePinNote(item?._id, "false")}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Click to pin this note">
                          <PushpinOutlined
                            key="pin"
                            onClick={() => handlePinNote(item?._id, "true")}
                          />
                        </Tooltip>
                      ),
                      <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => handleDelete(item?._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>,
                    ]}
                  >
                    <Row>
                      <Text>
                        <strong>Category</strong> : {item?.category}
                      </Text>
                    </Row>
                    <Row>
                      <Text>
                        <strong>Tagline</strong> : {item?.tagline}
                      </Text>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>{" "}
        </>
      )}
      {otherNotes?.length > 0 && (
        <>
          {pinnedNotes?.length > 0 && (
            <Title className="title-category-notes" level={4}>
              Other Notes
            </Title>
          )}
          <Row className="cards-container">
            {otherNotes?.map((item) => {
              return (
                <Col className="cards-col" key={item?._id}>
                  <Card
                    className="card-notes"
                    hoverable
                    title={item?.title}
                    cover={
                      <img
                        height={200}
                        width={150}
                        alt="alt_img"
                        src={item.img}
                      />
                    }
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditNote(item)}
                      />,
                      spinner?.id === item?._id && spinner?.status ? (
                        <Spin />
                      ) : item?.isPinned ? (
                        <Tooltip title="Click to unpin this note">
                          <PushpinTwoTone
                            onClick={() => handlePinNote(item?._id, "false")}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Click to pin this note">
                          <PushpinOutlined
                            key="pin"
                            onClick={() => handlePinNote(item?._id, "true")}
                          />
                        </Tooltip>
                      ),
                      <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => handleDelete(item?._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined />
                      </Popconfirm>,
                    ]}
                  >
                    <Row>
                      <Text>
                        <strong>Category</strong> : {item?.category}
                      </Text>
                    </Row>
                    <Row>
                      <Text>
                        <strong>Tagline</strong> : {item?.tagline}
                      </Text>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </>
  );
};
