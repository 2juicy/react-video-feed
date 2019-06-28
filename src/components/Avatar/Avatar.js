import React from "react";

const styles = {
  display: "inline-block",
  padding: "5px",
  borderRadius: "999px",
  height: "50px",
  width: "50px"
};

export default ({ thumbnail }) => (
  <img style={styles} src={thumbnail} alt="Nothing found" />
);
