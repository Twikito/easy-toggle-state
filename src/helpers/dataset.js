import PREFIX from "../constants/PREFIX";

/* Retrieve a valid HTML attribute. */
export default key => `data-${PREFIX}${PREFIX != "" ? "-" : ""}${key}`;
