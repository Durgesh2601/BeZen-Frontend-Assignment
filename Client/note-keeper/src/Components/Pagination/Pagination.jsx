import { Row, Pagination, message, Skeleton } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
export const Pages = ({ page, setPage }) => {
  const [loading, setLoading] = useState(false);
  const [totalLength, setTotalLength] = useState(null);
  useEffect(() => {
    getTotalPages();
  }, []);
  const getTotalPages = () => {
    setLoading(true);
    axios
      .get(`https://notes-keeper-v1.herokuapp.com`)
      .then((res) => {
        if (res?.status === 200) {
          setLoading(false);
          setTotalLength(res?.data?.length);
        }
      })
      .catch((err) => {
        setLoading(false);
        message.error(`Unable to fetch pages`);
        console.log(err);
      });
  };
  const handleChange = (e) => {
    setPage(e);
  };
  return (
    <Row align="center" className="pagination-row">
      {loading ? (
        <Row className="loading-state-row">
          <Skeleton />
        </Row>
      ) : (
        totalLength > 0 && (
          <Pagination
            defaultCurrent={page}
            total={totalLength}
            pageSize={6}
            onChange={handleChange}
          />
        )
      )}
    </Row>
  );
};
