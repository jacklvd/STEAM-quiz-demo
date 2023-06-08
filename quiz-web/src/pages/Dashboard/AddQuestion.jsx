import { useState } from "react";

function AddQuestion(props) {
  const [question, setQuestion] = useState("");
  const [choice, setChoice] = useState("");
  const [choices, setChoices] = useState([]);
  const [type, setType] = useState("");
  const [correctAns, setCorrectAns] = useState("");

  const addQuestionButtonPressed = () => {
    props.addQuestion({
      question: question,
      choices: choices.map(choice => choice.name),
      type: type,
      correctAns: correctAns,
    });
    setQuestion("");
    setChoice("");
    setChoices([]);
    setType("");
    setCorrectAns("");
  };


  return (
    <div className="container">
      <div className="row">
        <h2>Add new question</h2>
      </div>
      <div className="row">
        <label for="question-field">Question</label>
        <input
          id="question-field"
          type="text"
          className="form-control mt-3"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></input>

        <label for="choices-field">Choices</label>
        <input
          id="choices-field"
          type="text"
          className="form-control mt-3"
          value={choice}
          placeholder="Choice"
          onChange={(e) => setChoice(e.target.value)}
        ></input>
        <div>
          <button className="btn btn-primary mt-3" type="button" onClick={() => {
            setChoices([...choices , {name: choice}])
          }}>Add</button>
        </div>
        <div>
          <button className="btn btn-primary mt-3" type="button" onClick={() => {
            setChoice("");
            setChoices([]);
          }}>Clear</button>
        </div>
        <ul>
          {choices.map((choice, index) => (
            <li>Option {index + 1}: {choice.name}</li>
          ))}
        </ul>

        <label for="type-field">Type</label>
        <input
          id="type-field"
          type="text"
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
        ></input>
        <label for="correct-field">Correct Answer</label>
        <input
          id="correct-field"
          type="text"
          className="form-control"
          value={correctAns}
          onChange={(e) => setCorrectAns(e.target.value)}
        ></input>
      </div>
      
      <div className="row mt-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={addQuestionButtonPressed}
        >
          Add Question
        </button>
      </div>
    </div>
  );
}

export default AddQuestion;
