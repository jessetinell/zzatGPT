import { Store } from "tauri-plugin-store-api";
import SavedData from "../types/SavedData";

export default async function (store: Store): Promise<SavedData> {

  return {
    accountNumber: await store.get("accountNumber") || "",
  }

}



function stringToBool(str: string | boolean): boolean {
  if (typeof str === "string") {
    switch (str) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return true;
    }
  }
  return str;
}
