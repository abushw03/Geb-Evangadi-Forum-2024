import { useParams } from "react-router-dom";
import EditQuestion from "../../components/UpdateQuestion/UpdateQuestion";
import { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../../API/axios";

const QuestionEditPage = () => {
  const { question_id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/question/${question_id}`
        );
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [question_id]);

  return (
    <div>
      {question ? <EditQuestion question={question} /> : <p>Loading...</p>}
    </div>
  );
};

export default QuestionEditPage;
