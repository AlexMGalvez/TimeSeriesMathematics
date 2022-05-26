import { useState, useEffect } from "react";
import Card from "../UI/Card";
import * as tf from "@tensorflow/tfjs";

const Model = () => {
  const [model, setModel] = useState();

  const loadModel = async () => {
    try {
      let model;

      if (process.env.PUBLIC_URL) {
        // production enviornment
        model = await tf.loadLayersModel(
          process.env.PUBLIC_URL + "/model/wyckoff-ai-model.json"
        );
      } else {
        // development enviornment
        model = await tf.loadLayersModel(
          window.location.origin + "/model/wyckoff-ai-model.json"
        );
      }
      setModel(model);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  return <Card></Card>;
};

export default Model;
