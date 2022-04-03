import { useState, Fragment } from "react";

import classes from "./ChartForm.module.css";

const ChartForm = (props) => {
  const [inputs, setInputs] = useState({ errpct: props.errpct });
  const [errors, setErrors] = useState({ errpct: false });

  const changeInputsHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Validation
    if (value >= 0.005 && value <= 0.25) {
      if (errors.errpct === true) {
        changeErrorsHandler("errpct");
      }
      props.changeErrpct(value);
    } else {
      if (errors.errpct === false) {
        changeErrorsHandler("errpct");
      }
    }
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const changeErrorsHandler = (input) => {
    setErrors((prevErrors) => ({ ...prevErrors, [input]: !prevErrors[input] }));
  };

  return (
    <Fragment>
      <div className={classes.input_param}>
        <label htmlFor="stock">Stock</label>
        <select onChange={props.changeStock}>
          <option value={0}>Bitcoin (BTC)</option>
          <option value={1}>General Electric (GE)</option>
        </select>
      </div>

      <div className={classes.input_param}>
        <label htmlFor="errpct">Error Percentage</label>
        <input
          className={classes.errpct_input}
          type="number"
          name="errpct"
          value={inputs.errpct}
          onChange={changeInputsHandler}
        />
        <input
          type="range"
          name="errpct"
          min="0.005"
          max="0.25"
          value={inputs.errpct}
          onChange={changeInputsHandler}
          step="0.005"
        />
      </div>
      {errors.errpct && (
          <p className={classes.error_text}>
            Please enter a valid error percentage between 0.005 and 0.25.
          </p>
        )}
    </Fragment>
  );
};

export default ChartForm;
