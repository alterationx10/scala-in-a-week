import Axios from 'axios';
import { randomInt } from 'crypto';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


interface ImageResponse  {
  etag: string;
  lastModified: string;
  name: string;
  size: number;
}

interface Stat {
  id: string;
  views: number;
  likes: number;
  comments: number;
}

function randomIndex(max: number) {  
  return Math.floor(
    Math.random() * max
  )
}

function App() {

  const emptyStats = {id: '', views: 0, likes: 0, comments: 0};

  const [ logoId, setLogoId ] = useState('');
  const [ logoUrl, setLogoUrl ] = useState('./scala.svg');
  const [ stats, setStats ] = useState(emptyStats);


  useEffect(() => {
    if (logoId) {
      setLogoUrl(`http://localhost:3001/api/images/${logoId}`);
      loadStats();
    }
  }, [logoId])

  const loadRandom = () => {
    Axios.get('http://localhost:3001/api/images')
    .then( (response) => {
      const images: ImageResponse[] =response.data as ImageResponse[];
      const { name } = images[randomIndex(images.length)];       
      setLogoId(name);
      console.log(`Setting picuture to ${name}`);
    });
  };

  const loadStats = () => {
    if (logoId) {
      Axios.get(`http://localhost:3001/api/stats/${logoId}`)
      .then( (response) => {
        setStats(response.data ?? emptyStats);
      });
    }
  };

  const likeImage = () => {
    if (logoId) {
      Axios.post(`http://localhost:3001/api/images/${logoId}/like`).then(() => loadStats());
    }
  }

  let ws = new WebSocket('ws://localhost:3001');
  const reconnect = () => {
    ws = new WebSocket('ws://localhost:3001');
  }
  useEffect( () => {
    ws.onopen = () => {
      console.log('ws connected');
    }
    ws.onmessage = (event) => {
      const stat = JSON.parse(event.data) as Stat;
      console.log(stat);
      if (logoId && logoId === stat.id) {
        setStats(stat);
      }
    };
    ws.onclose = () => {
      console.log('ws disconnected');
      reconnect();
    };
  }, []);


  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={loadRandom}>Load a Random Image</Button>
        <img src={logoUrl} className="App-logo" alt="logo" />

        <Badge variant="danger" onClick={likeImage}>{stats.likes ?? 0} Likes</Badge>

        <Badge variant="success">{stats.views ?? 0} Views</Badge>

        <Badge variant="warning">{stats.comments ?? 0} Comments</Badge>
      </header>

    </div>
  );
}

export default App;
