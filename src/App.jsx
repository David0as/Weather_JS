import { CircularProgress, Slide, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Hook to track states in functions components
  // Default city
  const [cityName, setCityName] = useState("Cartagena");
  // For search box
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=82eb5efb558f47217d75522735d52bce&units=metric
    `)
    .then((res) => {
      if (res.status === 200) {
        error && setError(false);
        return res.json();
      } else {
        throw new Error("Something went wrong");
      }
    })
    .then((data) => {
      setData(data);
    })
    .catch(() => setError(true))
    .finally(() => setLoading(false))
    // Array. If empty, will run only once. This array checks to watch changes
    // If it finds changes, will run again
  }, [cityName, error]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("")
    }
  }

  return (
    <div className="bg_img">
      {
        // If not loading, show page
        !loading ? (
          <>
          <TextField variant="filled"
      label="Search Location"
      className="input"
      error={error}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      onKeyDown={handleSearch}
      />
      <h1 className="city">{data.name}</h1>
      <div className="group">
        {/* Img for time state (Cloud, sunny...) */}
        <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="" />
        <h1>{data.weather[0].main}</h1>
      </div>
      <h1 className="temp">{data.main.temp.toFixed()}</h1>

      {/* If not loading, slide the boxes in place. COOL */}
      <Slide direction="right" timeout={800} in={!loading}>
        <div className="box_container">
          <div className="box">
            <p>Humidity</p>
            <h1>{data.main.humidity.toFixed()}%</h1>
          </div>
          <div className="box">
            <p>Wind</p>
            <h1>{data.wind.speed.toFixed()} km/h</h1>
          </div>
          <div className="box">
            <p>Feels like</p>
            <h1>{data.main.feels_like.toFixed()} °C</h1>
          </div>
        </div>
      </Slide>
          </>
        ) : (
          // If loading, show circular loading progress
          <CircularProgress />
        )
      }
    </div>
  );
}

export default App;
