import React from "react";
import JsonViewer from "./JsonViewer";

const jsonResponse = `{
  "res": {
    "date": "2021-10-27T07:49:14.896Z",
    "hasError": false,
    "fields": [
      {
        "id": "4c212130",
        "prop": "iban",
        "value": "DE81200505501265402568",
        "hasError": false
      }
    ]
  }
}`;

const App: React.FC = () => {
  return (
    <div>
      <JsonViewer response={JSON.parse(jsonResponse)} />
    </div>
  );
};

export default App;
