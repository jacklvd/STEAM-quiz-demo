function QuestionDisplay({ Questions, deleteQuestion }) {
  const showQuestion = (Question) => {
    return (
      <tr key={Question.id}>
        <th scope="row">{Question.id}</th>
        <td>{Question.question}</td>
        
        <td>
          {Question.choices.map((choice, index) => (
            <li key={index}>{choice}</li>
          ))}
        </td>

        <td>{Question.type}</td>
        <td>{Question.correctAns}</td>
        <td>
          <button className="btn btn-danger" onClick={() => deleteQuestion(Question)}>
            Delete
          </button>
        </td>
      </tr>
    );
  };
  return (
    <div className="container">
      <div className="row">
        <h2>Questions</h2>
      </div>
      <div className="row">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Question ID</th>
              <th scope="col">Question</th>
              <th scope="col">Choice</th>
              <th scope="col">Type</th>
              <th scope="col">Correct Answer</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>{Questions.map(showQuestion)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default QuestionDisplay;
