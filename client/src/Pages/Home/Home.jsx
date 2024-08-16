
import React, { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../../API/axios";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonSharp } from "react-icons/io5";
import { AuthContext } from "../../components/AuthContext/AuthContext";
import EditIcon from "@mui/icons-material/Edit";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page
  const { user } = useContext(AuthContext); // Access user info from context
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axiosInstance
      .get("/api/question/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuestions(response.data.questions);
        setFilteredQuestions(response.data.questions);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  useEffect(() => {
    const results = questions.filter((question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, questions]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleQuestionClick = (question_id) => {
    navigate(`/question/${question_id}`);
  };

  const editQuestionHandler = (question_id) => {
    navigate(`/question/edit/${question_id}`);
  };

  return (
    <section className="questions_section mt-3">
      <div className="container mt-3 mb-5 pl-5">
        <div className="row mt-4 mb-5 pl-5 d-flex align-items-center">
          <div className="col-md-6 d-flex">
            <Link to={"/ask"}>
              <button className="btn btn-primary">Ask Question</button>
            </Link>
          </div>
          <div className="col-md-6 col-4 pt-2 welcome_message text-md-right text-center">
            Welcome: <span>{user.username}</span>
          </div>
        </div>

        <div className="search_questions mb-3">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
          />
        </div>

        <div className="mt-4 ml-0">
          {currentItems.map((question, index) => (
            <div key={index}>
              <Link
                to={`/question/${question.question_id}`}
                onClick={() => handleQuestionClick(question.question_id)}
              >
                <div className="row single-question d-flex justify-content-between align-items-center">
                  <div className="col-12 col-md-2 user">
                    <div className="profile_icon">
                      <IoPersonSharp />
                    </div>
                    <div className="user_name align-item-end">
                      By: <span>{question.user_name}</span>
                    </div>
                  </div>
                  <div className="col-10 col-md-9 my-md-4">
                    <p className="question_title">{question.title}</p>
                  </div>
                  <div className="col-2 col-md-1">
                    <div className="next_arrow">
                      <NavigateNextIcon />
                    </div>
                  </div>
                </div>
              </Link>
              {user.username === question.user_name && (
                <div className="row mt-2">
                  <div className="col-12 d-flex justify-content-end mb-3">
                    <button
                      className="edit-question btn btn-link text-decoration-none"
                      onClick={() => editQuestionHandler(question.question_id)}
                    >
                      Edit <EditIcon />
                    </button>
                  </div>
                </div>
              )}
              <hr />
            </div>
          ))}
        </div>

        <div className="pagination-controls d-flex justify-content-center mt-5">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`page-item btn btn-sm ${
                currentPage === index + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;