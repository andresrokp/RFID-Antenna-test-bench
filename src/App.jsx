import { useState } from 'react';

// Initial data
const initialStores = [
  {
    name: 'Store A',
    latitude: 7.094250,
    longitude: -73.858397,
    BodegaId: 'storeA',
    tbToken: 'tbTokenA',
    ready: false,
    elements: []
  },
  {
    name: 'Store B',
    latitude: 7.094250,
    longitude: -73.858397,
    BodegaId: 'storeB',
    tbToken: 'tbTokenB',
    ready: false,
    elements: []
  },
  // Add more stores here...
];

const initialIdleElements = [
  { name: 'Element 1', TagID: '1100EE00E2000020401302262550CB697740' },
  { name: 'Element 2', TagID: '1100EE00E2000020401302232560CACF6939' },
  { name: 'Element 3', TagID: '1100EE00E2000020401302182510C3D16B04' },
  // Add more elements here...
];

const App = () => {
  const [stores, setStores] = useState(initialStores);
  const [idleElements, setIdleElements] = useState(initialIdleElements);

  const handleAddElementToStore = (element, storeIndex) => {
    const updatedStores = [...stores];
    updatedStores[storeIndex].elements.push(element);
    setIdleElements(idleElements.filter(el => el.TagID !== element.TagID));
    setStores(updatedStores);
  };

  const handleRemoveElementFromStore = (storeIndex, elementIndex) => {
    const updatedStores = [...stores];
    const removedElement = updatedStores[storeIndex].elements.splice(elementIndex, 1)[0];
    setIdleElements([...idleElements, removedElement]);
    setStores(updatedStores);
  };

  const handleToggleReady = (storeIndex) => {
    const updatedStores = [...stores];
    updatedStores[storeIndex].ready = !updatedStores[storeIndex].ready;
    setStores(updatedStores);
  };

  const handleSendMessage = async (store) => {
    const url = `http://api.sighums.com:8080/api/v1/${store.tbToken}/telemetry`;
    const message = {
      ts: Date.now(),
      Latitude: store.latitude,
      Longitude: store.longitude,
      tagsArray: store.elements.map((element, index) => ({
        TagID: element.TagID,
        Rssi: -59,
        Numero: index
      })),
      BodegaID: store.BodegaId
    };

    // Simulate sending message
    console.log('Sending message:', url, message);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div>
      {stores.map((store, storeIndex) => (
        <div key={storeIndex}>
          <h2>{store.name}</h2>
          <label>
            Ready:
            <input
              type="checkbox"
              checked={store.ready}
              onChange={() => handleToggleReady(storeIndex)}
            />
          </label>
          <ul>
            {store.elements.map((element, elementIndex) => (
              <li key={elementIndex}>
                {element.name} - {element.TagID}
                <button onClick={() => handleRemoveElementFromStore(storeIndex, elementIndex)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <h2>Idle Elements</h2>
        <ul>
          {idleElements.map((element, elementIndex) => (
            <li key={elementIndex}>
              {element.name} - {element.TagID}
              <button onClick={() => handleAddElementToStore(element, 0)}>Add to Store A</button>
              {/* Add more buttons to select different stores */}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={async () => {
        for (const store of stores) {
          if (store.ready) {
            await handleSendMessage(store);
          }
        }
      }}>
        Emitir Señal
      </button>
    </div>
  );
};

export default App;
