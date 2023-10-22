import React, { useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBackground from "./components/ParticlesBackground/ParticlesBackground";
import FaceRecognition from "./components/FaceRecognitio/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import "./App.css";
import Register from "./components/Register/Register";

const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = "011e20b2cf494cf09f0144eac92bae02";
  const USER_ID = "gajabit948";
  const APP_ID = "LearnTest";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return requestOptions;
};

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onButtonSubmit = () => {
    const MODEL_ID = "face-detection";

    setImageUrl(input);
    fetch(
      "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      returnClarifaiRequestOptions(input)
    )
      .then((response) => response.json())
      .then((data) => displayFaceBox(calculateFaceLocation(data)))
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === "signin") {
      setIsSignedIn(false);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <ParticlesBackground className="particles" />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : route === "signin" ? (
        <SignIn onRouteChange={onRouteChange} />
      ) : (
        <Register onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
