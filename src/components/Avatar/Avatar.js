import React from "react";

const styles = {
  display: "inline-block",
  border: "black 1px solid",
  borderRadius: "999px",
  height: "55px",
  width: "55px"
};

export default ({ thumbnail }) => (
  <img style={styles} src={thumbnail} alt="Nothing found" />
);
