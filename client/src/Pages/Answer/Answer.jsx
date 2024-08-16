
import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { HiArrowCircleRight } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { axiosInstance } from "../../API/axios";
import styles from "./AnswerPage.module.css";
import { AuthContext } from "../../components/AuthContext/AuthContext";

function PostAnswer() {
  const { token } = useContext(AuthContext);
  const { question_id } = useParams();
  // const token = localStorage.getItem("token");

  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const inputDom = useRef();

  const handleError = (response) => {
    if (response.status === 404) {
      setError("Question not found.");
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/answer/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(data.answers);
    } catch ({ response }) {
      handleError(response);
    }
  };

  const fetchQuestion = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/question/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestion(data);
    } catch ({ response }) {
      handleError(response);
    }
  };

  const postAnswer = async (e) => {
    setMsg("");
    inputDom.current.style.backgroundColor = "#fff";
    const value = inputDom.current.value;
    e.preventDefault();
    if (!value) {
      inputDom.current.style.backgroundColor = "#fee6e6";
      inputDom.current.focus();
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        `/api/answer/${question_id}`,
        {
          question_id: question_id,
          answer: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      inputDom.current.value = "";
      setMsg("Answer posted successfully");
      setTimeout(() => setMsg(""), 5000);
      fetchAnswers(); // Refresh the list of answers after posting
    } catch ({ response }) {
      setLoading(false);
      handleError(response);
    } finally {
      inputDom.current.style.backgroundColor = "#fff";
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [question_id]);

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <div className={`${styles.question} mb-5`}>
          <h2 className="mb-3 mt-4">QUESTION</h2>
          <div className={`${styles.title} mb-2 text`}>
            <span>
              <HiArrowCircleRight />
            </span>
            {question?.title}
            <div className={styles.line}></div>
          </div>
          <div className={`${styles.description} w-75`}>
            <p>{question?.description}</p>
          </div>
        </div>
        <hr />
        <h1>Answer From The Community</h1>
        <hr />
        <div className={`${styles.answerContainer} my-5 w-md-75 mx-auto pt-4`}>
          {answers.length === 0 ? (
            <p>No answers yet. Be the first to answer!</p>
          ) : (
            answers?.map((answer, i) => {
              return (
                <div key={i} className="row">
                  <div className="col-3 col-md-2 col-lg-1 user">
                    <div className={styles.avatar}>
                      <FaUser />
                    </div>
                    <div className={styles.username}>
                      By: {answer.user_name}
                    </div>
                  </div>
                  <div className="col-md-9 col-8 answer">
                    <p>{answer.content}</p>
                  </div>
                  <hr className="w-75 mt-2" />
                </div>
              );
            })
          )}
        </div>

        <div className="post mx-auto w-md-75">
          <p className="text-success">{msg}</p>
          <form onSubmit={postAnswer}>
            <textarea
              ref={inputDom}
              rows="5"
              placeholder="Your answer ..."
              name="answer"
              className="w-100 px-3 pt-3 d-block mb-3"
            ></textarea>
            <button disabled={loading} className="btn btn-primary">
              Post Answer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostAnswer;
