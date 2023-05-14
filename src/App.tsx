import { useState } from 'react';
import Title from './components/Title';
import Form from './components/Form';
import Results from './components/Results';
import Loading from './components/Loading';
import './App.css';

export type ResultsStateType = {
  country: string;
  cityName: string;
  temperature:string;
  conditionText: string;
  icon: string;
};

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>('');
  const [results, setResults] = useState<ResultsStateType>({
    country: '',
    cityName: '',
    temperature:'',
    conditionText: '',
    icon: ''
  });
  const getWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetch(`https://api.weatherapi.com/v1/current.json?key=a24a9b728c8a409198d81312230605&q=${city}&aqi=no`)
    .then(res => res.json())
    .then(data => {
      if('error' in data){
        throw data.error;
      }
      setResults({
        country: data.location.country,
        cityName: data.location.name,
        temperature: data.current.temp_c,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon
      });
      setCity('');
      setLoading(false);
    }).catch(err => {
      if(!('code' in err)){
        alert('エラーが発生しました。ページをリロードして、もう一度トライしてください。')
      } else {
        switch (err.code){
          case 1003:
            alert('都市名を入力してください');
            break;
          case 1006:
            alert('一致する都市が見つかりません');
            break;
          default:
            alert(err.message);
        }
        setLoading(false);
      }
    });
  };
  return (
    <div className="wrapper">
      <div className="container">
        <Title />
        <Form city={city} setCity={setCity} getWeather={getWeather} />
        {loading ? <Loading /> : <Results results={results} />}
      </div>
    </div>
  );
}

export default App;
