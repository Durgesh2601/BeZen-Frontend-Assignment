import { useState } from "react";
import {
  Row,
  Skeleton,
  Typography,
  message,
  Form,
  Button,
  Empty,
  Col,
  Select,
} from "antd";
import axios from "axios";
import "./Styles/Notes.styles.css";
import { useEffect } from "react";
import { NotesCard } from "./NotesCard";
import { AddNotes } from "./AddNotes";
import { Pages } from "./Pagination/Pagination";
import { useRef } from "react";
import { CategoriesComponent } from "./FilterByCategory/Categories";
const { Title, Text } = Typography;
export const Notes = () => {
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [otherNotes, setOtherNotes] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [categories, setCategories] = useState(["All categories"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const imgRef = useRef(null);
  const [addNoteLoading, setAddNoteLoading] = useState(false);
  const [spinner, setSpinner] = useState({ id: "", status: false });
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();
  useEffect(() => {
    getNotes(page, sortBy);
  }, [page, sortBy]);

  useEffect(() => {
    if (selectedCategory !== "") {
      getFilteredNotes(selectedCategory);
    }
  }, [selectedCategory]);
  const getFilteredNotes = (selectedCategory) => {
    if (selectedCategory === "All categories") {
      getNotes(page, sortBy);
    } else {
      setLoading(true);
      axios
        .get(
          `https://notes-keeper-v1.herokuapp.com?category=${selectedCategory}`
        )
        .then((res) => {
          const data = res?.data?.sort(
            (a, b) => Number(b?.isPinned) - Number(a?.isPinned)
          );
          const pinnedNotes = data?.filter((item) => item?.isPinned === true);
          setPinnedNotes(pinnedNotes);
          const otherNotes = data?.filter((item) => item?.isPinned === false);
          setOtherNotes(otherNotes);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          message.err(`Oops! Something went wrong. Server did not respond.`);
          console.log(err);
        });
    }
  };
  const getNotes = (page = 1, sortBy) => {
    setLoading(true);
    axios
      .get(
        `https://notes-keeper-v1.herokuapp.com/?page=${page}&size=6&sortBy=${sortBy}`
      )
      .then((res) => {
        if (res?.status === 200) {
          const data = res?.data?.sort(
            (a, b) => Number(b?.isPinned) - Number(a?.isPinned)
          );
          const pinnedNotes = data?.filter((item) => item?.isPinned === true);
          setPinnedNotes(pinnedNotes);
          const otherNotes = data?.filter((item) => item?.isPinned === false);
          setOtherNotes(otherNotes);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        message.err(`Oops! Something went wrong. Server did not respond.`);
        console.log(err);
      });
  };
  const onFinish = (values) => {
    if (imgUrl) {
      setAddNoteLoading(true);
      const payload = {
        title: values?.title,
        tagline: values?.tagline,
        category: values?.category,
        isPinned: values?.isPinned || false,
        img: imgUrl || "",
      };
      axios
        .post(`https://notes-keeper-v1.herokuapp.com/`, payload)
        .then((res) => {
          if (res?.status === 201) {
            setAddNoteLoading(false);
            message.success("Note added successfully");
            setIsAddModalVisible(false);
            getNotes(page, sortBy);
            getCategories();
            form.resetFields();
          }
        })
        .catch((err) => {
          setAddNoteLoading(false);
          setIsAddModalVisible(false);
          message.error(`Oops! Something went wrong`);
          console.log(err);
        });
    } else {
      message.error(`Image upload failed`);
    }
  };
  const getCategories = () => {
    axios
      .get(`https://notes-keeper-v1.herokuapp.com/categories`)
      .then((res) => {
        if (res?.status === 200) {
          const data = res?.data;
          setCategories([...categories, ...data]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (id) => {
    axios
      .delete(`https://notes-keeper-v1.herokuapp.com/delete/${id}`)
      .then((res) => {
        if (res?.status === 200) {
          message.success(`Note deleted successfully!`);
          getNotes(page, sortBy);
          getCategories();
        }
      })
      .catch((err) => {
        message.error(`Oops! Something went wrong`);
        console.log(err);
      });
  };
  const handlePinNote = (id, pinnedStatus) => {
    setSpinner({ id, status: true });
    axios
      .patch(`https://notes-keeper-v1.herokuapp.com/pin/${id}`, {
        isPinned: pinnedStatus,
      })
      .then((res) => {
        if (res?.status === 200) {
          setSpinner({ id, status: false });
          getNotes(page);
        }
      })
      .catch((err) => {
        console.log(err);
        setSpinner({ id, status: false });
        message.error(`Something went wrong`);
      });
  };
  const resetFileInput = () => {
    imgRef.current.value = null;
  };
  return (
    <>
      <Row align="center">
        <Title level={2}>Welcome To Notes Keeper 2.0</Title>
      </Row>
      <Row align="center">
        <Text>
          Here you can store all of your notes and information in an easy-to-use
          outline and can quickly find what you need.
        </Text>
        <Button
          className="add-notes-btn"
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
        >
          Add a note
        </Button>
      </Row>
      <br />
      {categories && (
        <Row align="center" style={{ gap: "5%" }}>
          <CategoriesComponent
            getCategories={getCategories}
            setCategories={setCategories}
            categories={categories}
            setSelectedCategory={setSelectedCategory}
          />
          <Col>
            <label>Sort by : </label>
            <Select
              defaultValue={sortBy}
              style={{ width: 180 }}
              onChange={(e) => setSortBy(e)}
            >
              <Select.Option value="asc">Date created(Asc.)</Select.Option>
              <Select.Option value="desc">Date created(Desc.)</Select.Option>
            </Select>
          </Col>
        </Row>
      )}
      <br />
      {pinnedNotes?.length + otherNotes?.length === 0 && !loading && (
        <>
          <Row align="center" className="empty-row-state">
            <Empty />
          </Row>
          <Row align="center">
            <Title className="empty-state" level={5}>
              Looks like there are no notes added here. Please add some.
            </Title>
          </Row>
        </>
      )}
      {loading ? (
        <Row className="loading-state-row">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Row>
      ) : (
        <>
          <NotesCard
            spinner={spinner}
            pinnedNotes={pinnedNotes}
            otherNotes={otherNotes}
            handleDelete={handleDelete}
            handlePinNote={handlePinNote}
          />
          <Row className="pagination-row" align="center">
            <Pages page={page} setPage={setPage} />
          </Row>
        </>
      )}
      <AddNotes
        onFinish={onFinish}
        form={form}
        isAddModalVisible={isAddModalVisible}
        setIsAddModalVisible={setIsAddModalVisible}
        loading={addNoteLoading}
        setImgUrl={setImgUrl}
        imgRef={imgRef}
        resetFileInput={resetFileInput}
      />
    </>
  );
};
