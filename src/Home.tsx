import { useEffect } from "react";
import axios from "axios";

function Home() {
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/test-api", {
        headers: {
            "Content-Type": "application/json"
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to the home page!</p>
    </div>
  );
}

export default Home;
