import { useState, useEffect } from "react";
import AddQuestion from "./AddQuestion";
import QuestionDisplay from "./QuestionDisplay";
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [data, setData] = useState({ items: [] });

  useEffect(() => {
    fetch("http://localhost:5000/question", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setData({ items: data });
      });
  }, []);


  const deleteItem = (question) => {
    const items = data["items"];
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:5000/question/${question.id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          const idx = items.indexOf(question);
          items.splice(idx, 1);
          setData({ items: items });
        }
      }
    );
  };

  const AddQuestionToData = (item) => {
    let items = data["items"];

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
    fetch("http://localhost:5000/question", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => ({
          items: [...prevData.items, data],
        }));
      });
  };

  return (
    <div className="container">
      <div>
        <Link to='/'><button className='btn btn-primary' type="button">Home</button></Link>
      </div>  

      <div className="row mt-3">
        <QuestionDisplay
          deleteQuestion={deleteItem}
          Questions={data["items"]}
        />
      </div>

      <div className="row mt-3">
        <AddQuestion addQuestion={AddQuestionToData} />
      </div>
    </div>
  );
}



export default Dashboard