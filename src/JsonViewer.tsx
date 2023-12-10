import React, { useState } from "react";
import "./JsonViewer.css";

interface Response {
  res: FetchedData;
}

interface Field {
  id: string;
  prop: string;
  value: string;
  hasError: boolean;
}

interface FetchedData {
  date: string;
  hasError: boolean;
  fields: Field[];
}

const JsonViewer: React.FC<{ response: Response }> = ({ response }) => {
  const [selectedKey, setSelectedKey] = useState<string>("");

  const handleSelectKey = (key: string) => {
    setSelectedKey(key);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedKey(event.target.value);

  const retrieveValue = (selectedPath: string): any => {
    if (
      (selectedKey.includes("[") && !selectedKey.includes("]")) ||
      selectedKey.endsWith(".")
    ) {
      return "undefined";
    }
    const keys = selectedPath
      .split(/\.|\[|\]/)
      .filter((part) => part.trim() !== "")
      .map((part) => (!isNaN(Number(part)) ? parseInt(part, 10) : part));

    const result = keys.reduce((acc: any, key: number | string) => {
      if (acc && typeof acc === "object" && key in acc) {
        return acc[key];
      } else {
        return "undefined";
      }
    }, response);

    return typeof result === "object" ? "" : result;
  };

  const renderValue = (
    value: any,
    parentKeys: string = ""
  ): React.ReactNode => {
    if (typeof value === "object" && value !== null) {
      return Array.isArray(value) ? (
        <>
          {"["}
          {value.map((item, index) => (
            <div key={index} style={{ marginLeft: "20px" }}>
              {renderValue(item, `${parentKeys}[${index}]`)}
            </div>
          ))}
          {"]"}
        </>
      ) : (
        <>
          {"{"}
          {Object.entries(value).map(
            ([key, innerValue], innerIndex, innerArray) => (
              <div key={key}>
                <span
                  className="json-key"
                  onClick={() => handleSelectKey(`${parentKeys}.${key}`)}
                >{`${key}: `}</span>
                {renderValue(innerValue, parentKeys)}
                {innerIndex < innerArray.length - 1 ? "," : ""}
              </div>
            )
          )}
          {"}"}
        </>
      );
    } else {
      return (
        <span>
          {typeof value === "string" ? `'${value}'` : JSON.stringify(value)}
        </span>
      );
    }
  };

  return (
    <div className="container">
      <div className="input-wrapper">
        <h2>Property</h2>
        <input
          type="text"
          value={selectedKey}
          onChange={(event) => onChangeHandler(event)}
        />
        <span className="result-value">
          {selectedKey && retrieveValue(selectedKey).toString()}
        </span>
      </div>
      <h2>Response</h2>
      {Object.keys(response).map((mainKey) => (
        <div key={mainKey} className="json-data">
          {Object.entries(response.res).map(([key, value], index, array) => (
            <div key={key}>
              <span
                className={`json-key ${
                  Array.isArray(value) ? "exclude-key" : ""
                }`}
                onClick={() => {
                  if (!Array.isArray(value)) {
                    handleSelectKey(`${mainKey}.${key}`);
                  }
                }}
              >{`${key}: `}</span>
              {renderValue(value, `${mainKey}.${key}`)}
              {index < array.length - 1 ? "," : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default JsonViewer;
