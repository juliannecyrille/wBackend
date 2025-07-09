import React from 'react'
import {useState, useEffect} from 'react';

function App() {
      //Backend functton
  useEffect(()=>{
    fetch('server/test')
    .then(res => res.json())
    .then(data => console.log(data.message))
  }, []);

  return (
    <div>
        <h1>
            {msg}
        </h1>
    </div>
  )
}

export default App