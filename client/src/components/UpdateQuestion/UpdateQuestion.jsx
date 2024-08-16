import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../API/axios";
import styles from "./updateQuestion.module.css";
import { useNavigate } from "react-router-dom";

const EditQuestion = ({ question }) => {
  const [form, setForm] = useState({
    title: question.title,
    description: question.description,
  });
  const [initialForm, setInitialForm] = useState(form);
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    if (form.title !== initialForm.title) updatedFields.title = form.title;
    if (form.description !== initialForm.description)
      updatedFields.description = form.description;

    if (Object.keys(updatedFields).length > 0) {
      try {
        await axiosInstance.put(`/api/question/edit/${question.question_id}`, {
          question_id: question.question_id,
          ...updatedFields,
        });
        alert("Question updated successfully");
        Navigate("/home");
      } catch (error) {
        console.error("Error updating question:", error);
        alert("Failed to update the question");
      }
    } else {
      alert("No changes made");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.edit_qform}>
      <input
        name="title"
        placeholder="title"
        type="text"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="description"
        value={form.description}
        onChange={handleChange}
      ></textarea>
      <button type="submit" className="btn btn-primary">
        Update Question
      </button>
    </form>
  );
};

export default EditQuestion;
