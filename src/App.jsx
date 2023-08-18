import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to have a corresponding CSS file

const initialElements = [
  { name: 'Element 1', tagID: '1100EE00E2000020401302262550CB697740' },
  { name: 'Element 2', tagID: '1100EE00E2000020401302232560CACF6939' },
  { name: 'Element 3', tagID: '1100EE00E2000020401302182510C3D16B04' },
  // ... other elements
];

const stores = [
  { name: 'Store A', latitude: 7.094250, longitude: -73.858397, bodegaID: 'storeA', tbToken: 'tokenA' },
  { name: 'Store B', latitude: 7.123456, longitude: -73.987654, bodegaID: 'storeB', tbToken: 'tokenB' },
  // ... other stores
];

const App = () => {
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [messageSent, setMessageSent] = useState(false);

  const handleStoreSelection = (store) => {
    if (selectedStores.includes(store)) {
      setSelectedStores(selectedStores.filter(s => s !== store));
    } else {
      setSelectedStores([...selectedStores, store]);
    }
  };

  const handleElementSelection = (element, store) => {
    setSelectedElements(prevElements => {
      const updatedElements = prevElements.filter(el => el.store !== store);
      return [...updatedElements, { ...element, store }];
    });
  };

  const handleEmitSignal = async () => {
    setMessageSent(true);
    for (const store of selectedStores) {
      const selectedElementsForStore = selectedElements.filter(el => el.store === store);
      const requestBody = {
        ts: Date.now(),
        Latitude: store.latitude,
        Longitude: store.longitude,
        tagsArray: selectedElementsForStore.map((element, index) => ({
          TagID: element.tagID,
          Rssi: -59,
          Numero: index
        })),
        BodegaID: store.bodegaID
      };

      await fetch(`http://api.sighums.com:8080/api/v1/${store.tbToken}/telemetry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setMessageSent(false);
    setSelectedStores([]);
    setSelectedElements([]);
  };

  return (
    <div className="app">
      <div className="stores">
        <h2>Select Stores:</h2>
        {stores.map(store => (
          <label key={store.name}>
            <input
              type="checkbox"
              checked={selectedStores.includes(store)}
              onChange={() => handleStoreSelection(store)}
            />
            {store.name}
            {selectedStores.includes(store) && (
              <div className="store-elements">
                <h3>Elements in {store.name}:</h3>
                {initialElements.map(element => (
                  !selectedElements.find(el => el.tagID === element.tagID && el.store === store) && (
                    <button
                      key={element.tagID}
                      onClick={() => handleElementSelection(element, store)}
                      disabled={selectedElements.some(el => el.store === store)}
                    >
                      Add {element.name}
                    </button>
                  )
                ))}
              </div>
            )}
          </label>
        ))}
      </div>
      <div className="selected-elements">
        <h2>Selected Elements:</h2>
        {selectedElements.map(element => (
          <div key={element.tagID} className="selected-element">
            <span>{element.name}</span>
            <span>Store: {element.store.name}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleEmitSignal}
        disabled={selectedStores.length === 0 || selectedElements.length === 0 || messageSent}
      >
        Emitir Señal
      </button>
    </div>
  );
};

export default App;
