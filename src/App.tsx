import React, { useState, FC, useRef } from "react";
import axios from "axios";
import "./App.css";
let page = 1;
const App: FC = () => {
  const [filter, setFilter] = useState("");
  const limit = useRef(10);
  const [imageList, setImageList] = useState<any[]>([]);

  const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const callApi = () => {
    const url = `https://api.unsplash.com/search/photos?client_id=${process.env.REACT_APP_ACCESS_KEY}&query=${filter}&page=${page}&per_page=${limit.current}`;

    axios
      .get(url)
      .then((res) => {
        setImageList([...res.data.results]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchHandler = () => {
    setImageList([]);
    callApi();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Welcome to Image Search Engine</h2>
        <div>
          <input
            type="text"
            placeholder="Search Images"
            onChange={filterHandler}
          />
          <button onClick={searchHandler}>Search</button>
        </div>
      </header>
      <div className="container">
        {imageList.length <= 0 ? (
          <h1> Enter Keyword and Click Search for Images </h1>
        ) : (
          <div className="gridList">
            {imageList.map((elm: any) => {
              return (
                <img
                  src={elm.urls.small}
                  alt={elm?.alt_description}
                  key={elm.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
