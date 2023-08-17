document.addEventListener("DOMContentLoaded", function () {
    const storeSelect = document.getElementById("storeSelect");
    const elementsList = document.getElementById("elementsList");
    const emitButton = document.getElementById("emitButton");
  
    const stores = [
      // Replace with your actual store data
      // Example: 
      { name: "Store A", latitude: 123.456, longitude: -78.901, bodegaId: "storeA", tbToken: "tokenA" },
      { name: "Store B", latitude: 123.456, longitude: -78.901, bodegaId: "storeB", tbToken: "tokenB" },
      { name: "Store C", latitude: 123.456, longitude: -78.901, bodegaId: "storeC", tbToken: "tokenC" },
      { name: "Store D", latitude: 123.456, longitude: -78.901, bodegaId: "storeD", tbToken: "tokenD" },
      { name: "Store E", latitude: 123.456, longitude: -78.901, bodegaId: "storeE", tbToken: "tokenE" },
    ];
  
    const elements = [
      // Replace with your actual element data
      // Example: 
      { name: "Element 1", tagId: "1" },
      { name: "Element 2", tagId: "2" },
      { name: "Element 3", tagId: "3" },
      { name: "Element 4", tagId: "4" },
      { name: "Element 5", tagId: "5" },
      { name: "Element 6", tagId: "6" },
      { name: "Element 7", tagId: "7" },
      { name: "Element 8", tagId: "8" },
    ];
  
    stores.forEach((store) => {
      const option = document.createElement("option");
      option.value = store.tbToken;
      option.textContent = store.name;
      storeSelect.appendChild(option);
    });
  
    elements.forEach((element) => {
      const li = document.createElement("li");
      li.textContent = `${element.name} - ${element.tagId}`;
      elementsList.appendChild(li);
    });
  
    emitButton.addEventListener("click", async () => {
      const selectedStores = Array.from(storeSelect.selectedOptions).map(
        (option) => option.value
        );
        
      for await (const store of selectedStores) {
        console.log('hola')
        const storeData = stores.find((s) => s.tbToken === store);
  
        const message = {
          ts: Date.now(),
          Latitude: storeData.latitude,
          Longitude: storeData.longitude,
          tagsArray: elements.map((element, index) => ({
            TagID: element.tagId,
            Rssi: -59,
            Numero: index,
          })),
          BodegaID: storeData.bodegaId,
        };
  
        sendPostRequest(storeData.tbToken, message);
        await delay(1000); // 1 second delay
      }
    });
  
    async function sendPostRequest(tbToken, message) {

      const url = `http://api.sighums.com:8080/api/v1/${tbToken}/telemetry`;

      console.log('url',url)
      console.log('message',message)
    //   try {
    //     const response = await fetch(url, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(message),
    //     });
  
    //     if (response.ok) {
    //       console.log("Message sent successfully");
    //     } else {
    //       console.error("Error sending message");
    //     }
    //   } catch (error) {
    //     console.error("An error occurred:", error);
    //   }
    }
  
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  });
  