import PREFIX from "../constants/PREFIX";

/* Retrieve a valid HTML attribute. */
export default key => ["data", PREFIX, key].filter(Boolean).join("-");
