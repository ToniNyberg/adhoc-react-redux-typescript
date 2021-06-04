import { Button, FormControl, FormLabel } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Option, QuestionType } from "../../app/types";
import {
  getAnswer,
  incrementCount,
  resetCorrectAnswer,
  selectCurrentAnswer,
} from "./answers/answerSlice";
import { mockQuestions, selectQuestions } from "./questions/questionsSlice";
import RadioInput from "./RadioInput";
import TextInput from "./TextInput";

export type QuestionFormProps = {
  index: number;
  options?: Option[];
  prompt: string;
  type: QuestionType;
  handleGoBack: (event: React.MouseEvent<HTMLElement>) => void;
  handleGoNext: (event: React.MouseEvent<HTMLElement>) => void;
};

function QuestionForm({
  index,
  options,
  prompt,
  type,
  handleGoBack,
  handleGoNext,
}: QuestionFormProps) {
  const currentAnswer = useAppSelector(selectCurrentAnswer);
  const questions = useAppSelector(selectQuestions);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState("");
  const [correctTextInput, setCorrectTextInput] = useState(false);
  const textAnswer = (mockQuestions[index].options as Option[]).find(
    (opt) => opt.value === currentAnswer
  )?.label;

  useEffect(() => {
    setSelected("");
    dispatch(resetCorrectAnswer());
  }, [index, dispatch]);

  useEffect(() => {
    if (currentAnswer && type === "text") {
      const textAnswer = (mockQuestions[index].options as Option[]).find(
        (opt) => opt.value === currentAnswer
      )?.label;

      if (selected.toLocaleLowerCase() === textAnswer!.toLocaleLowerCase()) {
        setCorrectTextInput(true);
      }
    }
  }, [currentAnswer, type, index, selected]);

  useEffect(() => {
    // if type is radio:
    if (
      currentAnswer &&
      type === "radio" &&
      parseInt(selected) === currentAnswer
    ) {
      dispatch(incrementCount());
    }
    // if type is text: compare
    if (
      currentAnswer &&
      type === "text" &&
      selected.toLocaleLowerCase() === textAnswer!.toLocaleLowerCase()
    ) {
      dispatch(incrementCount());
    }
  }, [currentAnswer, selected, dispatch, textAnswer, type]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected((event.target as HTMLInputElement).value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(getAnswer(index));
  };

  const renderOptions = () => {
    switch (type) {
      case "radio":
        return (
          <RadioInput
            questionIndex={index}
            selected={selected}
            handleChange={handleChange}
            options={options!}
          />
        );
      case "text":
        return (
          <TextInput
            correctTextInput={correctTextInput}
            questionIndex={index}
            selected={selected}
            handleChange={handleChange}
          />
        );
      default:
        return <p>Mammamia!</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{prompt}</FormLabel>
        {renderOptions()}
        <div className="flex flex-col md:flex-row ">
          {/* <Button
            id={`back_btn_${index}`}
            variant="outlined"
            color="default"
            disabled={index === 0}
            onClick={(event) => handleGoBack(event)}
          >
            Back
          </Button> */}
          <Button type="submit" variant="contained" color="primary">
            Check Answer
          </Button>
          <Button
            id={`next_btn_${index}`}
            variant="outlined"
            color="default"
            disabled={
              index === questions.length - 1 || !selected || !currentAnswer
            }
            onClick={(event) => handleGoNext(event)}
          >
            Next
          </Button>
        </div>
        <div className="flex flex-col md:flex-row ">
          <Button
            component={Link}
            to="/results"
            variant="contained"
            color="secondary"
          >
            Finish
          </Button>
        </div>
      </FormControl>
    </form>
  );
}

export default QuestionForm;
