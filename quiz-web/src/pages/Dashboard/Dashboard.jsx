import { useState, useEffect } from "react";
import AddQuestion from "./AddQuestion";
import QuestionDisplay from "./QuestionDisplay";

const Dashboard = () => {
  const [data, setData] = useState({ items: [] });

  useEffect(() => {
    fetch("http://localhost:3000/items")
      .then((response) => response.json())
      .then((data) => {
        setData({ items: data });
      });
  }, []);


  const deleteItem = (item) => {
    const items = data["items"];
    const requestOptions = {
      method: "DELETE",
    };
    fetch(`http://localhost:3000/items/${item.id}`, requestOptions).then(
      (response) => {
        if (response.ok) {
          const idx = items.indexOf(item);
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
    fetch("http://localhost:3000/items", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        items.push(data);
        setData({ items: items }); //?
      });
  };

  return (
    <div className="container">
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