import { collection } from "firebase/firestore";
import { db } from "./firebase-config";
import { TLeg } from "./interfaces";
import { StrikeCriteria } from "./types";

export const handleSwitchParameter = (parameter: StrikeCriteria, leg: TLeg) => {
    switch (parameter) {
      case "Strike Type":
        console.log(leg.strike_type)
        return leg.strike_type;
      case "Closest Premium":
        return leg.premium;
      case "Premium Range":
        return {
          Lower: leg.lower_range,
          Upper: leg.upper_range,
        };
      case "Straddle Width":
        return {
          Adjustment: leg.atm_strike_sign,
          Multiplier: leg.atm_strike_amount,
        };
      default:
        return undefined;
    }
  };

export const collectionRef = collection(db, "legs")