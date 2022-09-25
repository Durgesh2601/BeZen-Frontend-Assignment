import { useEffect } from "react";
import { Col, Select } from "antd";
import axios from "axios";

export const CategoriesComponent = ({
  categories,
  setSelectedCategory,
  getCategories,
}) => {
  useEffect(() => {
    getCategories();
  }, []);
  const handleChange = (e) => {
    setSelectedCategory(categories[e]);
  };
  return (
    <>
      {categories && categories?.length > 0 && (
        <Col>
          <label>Filter by category : </label>
          <Select
            defaultValue={categories[0]}
            onChange={handleChange}
            style={{ width: 150 }}
          >
            {categories?.map((item, index) => {
              return <Select.Option key={index}>{item}</Select.Option>;
            })}
          </Select>{" "}
        </Col>
      )}
    </>
  );
};
