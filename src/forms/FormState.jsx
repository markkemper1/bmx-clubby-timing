import React, { useState, useEffect } from "react";
import { useFormState } from "react-final-form";

const collapsedKey = "aux/formState/collapsed";
const selectStateKey = "aux/formState/selectedState";
export default function FormState() {
  const initialSelectedState = (localStorage.getItem(selectStateKey) && JSON.parse(localStorage.getItem(selectStateKey))) || {
    values: true,
  };

  const [seletectedState, setSelectedState] = useState(initialSelectedState);
  const state = useFormState();
  const stateToShow = { ...state };

  for (let key in state) {
    if (!seletectedState[key]) {
      delete stateToShow[key];
    }
  }

  const [collapsed, setCollapsed] = useState(localStorage.getItem(collapsedKey) === true + "");

  localStorage.setItem(collapsedKey, collapsed);
  localStorage.setItem(selectStateKey, JSON.stringify(seletectedState));

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    body.style.transition = "margin 1s";
    body.style.marginRight = collapsed ? 0 : "500px";
    return () => (body.style.marginRight = 0);
  });

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0 }}>
      <div
        style={{
          position: "fixed",
          zIndex: 99999,
          bottom: 0,
          right: collapsed ? "-500px" : "0",
          transition: "right 1s",
          width: "500px",
          top: 0,
          padding: "9px 0 9px 20px",
          background: "#f3f3f3",
          border: "solid 1px grey",
          whiteSpace: "pre-wrap",
          overflow: "visible",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          type="button"
          style={{
            background: "pink",
            color: "#333",
            fontWeight: "bold",
            border: "solid 1px grey",
            position: "absolute",
            width: "150px",
            height: "50px",
            bottom: "100px",
            left: "-150px",
            display: "block",
            textAlign: "center",
            zIndex: 99999,
          }}
        >
          Form State &nbsp;
          {collapsed ? <span style={{ fontSize: "150%" }}>&laquo;</span> : <span style={{ fontSize: "150%" }}>&raquo;</span>}
        </button>
        <div style={{ overflowY: "scroll", padding: "0px", height: "89vh" }}>
          <h4 style={{ fontSize: "18px", margin: "9px 0" }}>Form state to display</h4>
          <div style={{ overflow: "hidden" }}>
            {stateKeys.map((key) => (
              <label
                key={`label_${key}`}
                style={{
                  padding: "3px 10px ",
                  width: "25%",
                  overflow: "hidden",
                  display: "block",
                  float: "left",
                  whiteSpace: "nowrap",
                }}
                title={key}
              >
                <input
                  key={`input_${key}`}
                  type="checkbox"
                  name={key}
                  value="true"
                  onChange={(e) => setSelectedState({ ...seletectedState, [key]: e.target.checked })}
                  checked={seletectedState[key]}
                />
                {key}
              </label>
            ))}
          </div>
          <pre
            style={{
              width: "100%",
              background: "#ccc",
              padding: "10px",
              border: "solid 1px grey",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(stateToShow, null, 4)}
          </pre>
        </div>
      </div>
    </div>
  );
}

const stateKeys = [
  "active",
  "dirty",
  "dirtyFields",
  "dirtyFieldsSinceLastSubmit",
  "dirtySinceLastSubmit",
  "modifiedSinceLastSubmit",
  "error",
  "errors",
  "hasSubmitErrors",
  "hasValidationErrors",
  "initialValues",
  "invalid",
  "modified",
  "pristine",
  "submitError",
  "submitErrors",
  "submitFailed",
  "submitting",
  "submitSucceeded",
  "touched",
  "valid",
  "validating",
  "values",
  "visited",
];
