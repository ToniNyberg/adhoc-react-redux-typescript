import { Button } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCorrectAnswerCount } from "../answers/answerSlice";

const Results = () => {
  const correctAnswerCount = useAppSelector(selectCorrectAnswerCount);
  const history = useHistory();

  const handleHistory = () => {
    history.push("/");
  };

  return (
    <Router>
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="flex flex-col">
          <h3>Quiz results</h3>
          <h4>You Scored: {correctAnswerCount}</h4>
        </div>
        <div>
          <Button onClick={handleHistory} variant="contained" color="secondary">
            Try a new Quiz!
          </Button>
        </div>
      </div>
    </Router>
  );
};

export default Results;