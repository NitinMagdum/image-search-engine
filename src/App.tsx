import React, { useState, FC, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

let page = 1;
let query = "";
let currentList: any = [];

const App: FC = () => {
  const [filter, setFilter] = useState("");
  const limit = useRef(10);
  const total = useRef(0);
  const [imageList, setImageList] = useState<any[]>([]);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const callApi = () => {
    const url = `https://api.unsplash.com/search/photos?client_id=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=${page}&per_page=${limit.current}`;

    axios
      .get(url)
      .then((res) => {
        if (page === 1) {
          setImageList([...res.data.results]);
          currentList = [...res.data.results];
        } else {
          setImageList([...currentList, ...res.data.results]);
          currentList = [...currentList, ...res.data.results];
        }

        total.current = res.data.total;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchHandler = () => {
    page = 1;
    query = filter;
    console.log(imageList);
    //setImageList([]);
    callApi();
  };

  const observer = React.useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting === true) {
          //setPage(page + 1);
          ++page;
          callApi();
        }
      },
      { threshold: 0.1 }
    )
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement !== null) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement != null) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

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
        {imageList.length !== 0 && imageList.length !== total.current && (
          <div ref={setElement} className="loading">
            <p>Loading More...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
