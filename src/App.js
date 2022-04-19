import { useEffect, useState } from 'react';
import './App.css';
import DOMPurify from 'dompurify';

function App() {

  //setup state variables for data, loading and errors
  const [legoData, setLegoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    //since we are using the proxy, (see setupProxy.js) we don't need to use the full URL
    //anytime the create react app server sees /api in the URL it will proxy the requests for us.
    const endpoint = "api/v3.asmx/getSets?apiKey=3-4uGw-zdRu-WA76e&params={'setNumber':'75325-1'}&userHash="

    //make the get request
    fetch(endpoint)
    .then((response) => {
      //this is a good way to handel errors
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      return response.json();
    })
    //if we successfully get data, setLegoData to state
    .then((data) => {
      setLegoData(data);
      setError(null);
    })
    //if we get an error, setError state to tell the user
    .catch((err) => {
      setError(err.message);
      setLegoData(null);
    })
    //this happens regardless of error or success
    .finally(() => {
      setLoading(false);
    })
  }, [])


  return (
  <div className="panel panel-default">
    <h1>Lego Data</h1>
    {/* This is contitional rendering in React. See this for more info:  https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator */}
    {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
    {/* Again, this is conditional rendering. It is saying, if legoData then do that. */}
    {legoData &&
    <>
      {/* Now we just render out the data we want from legoData */}
      <h3>{legoData.sets[0].name}</h3> 
      <img src={legoData.sets[0].image.imageURL} />
      {/* The API returns raw HTML data so I insert it into the DOM */}
      {/* it is dangerous to set HTML directly into the DOM from an api like this. It opens the app to cross site scripting. */}
      {/* To makeup for this, I use DOMPurify to sanitize the raw HTML and prevent attacks. */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(legoData.sets[0].extendedData.description) }} />
    </>
    }
  </div>
  );
}

export default App;
