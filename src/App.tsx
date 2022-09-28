import React, { useEffect, useState } from "react";
import "./App.css";
import Leg from "./components/Leg";
import { LegI, TLeg } from "./interfaces";
import { Controllers } from "./types";
import Legs from "./components/Legs";
import { db } from "./firebase-config";
import { collection, addDoc, Timestamp, getDocs, doc, deleteDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { collectionRef, handleSwitchParameter } from "./helpers";

function App() {
  const [controller, setController] = useState<Controllers>("Futures");
  const [allLegs, setAllLegs] = useState([])
  const [leg, setLeg] = useState<TLeg>({
    id: "",
    total_lot: 1,
    position: "Sell",
    option_type: "Call",
    expiry: "Weekly",
    strike_criteria: "Strike Type",
    strike_type: "",
    lower_range: 50,
    upper_range: 200,
    premium: 50,
    atm_strike_sign: "-",
    atm_strike_amount: 0.5,
    leg_stop_loss: {
      type: "",
      value: 0,
    },
    leg_target: {
      type: "",
      value: 0,
    },
    leg_trail_sl: {
      type: "",
      value: {
        instrument_move: 0,
        stop_lost_move: 0,
      },
    },
    leg_momentum: {
      type: "",
      value: 0,
    },
    instrument_kind: "",
    leg_rentry_sl: {
      type: "",
      value: 0,
    },
    leg_rentry_tp: {
      type: "",
      value: 0,
    },
  });
  const legsRef = collection(db, "legs");

  const handleSetEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeg({ ...leg, [e.target.name]: e.target.value });
  };

  const handleSetController = (controller: Controllers) => {
    setController(controller);
  };

  // Fetch Legs
  const handleAddLeg = async () => {
    console.log(process.env.REACT_APP_API_apiKey)
    const legDetails: LegI = {
      id: v4(),
      PositionType: leg.position,
      Lots: leg.total_lot,
      LegStopLoss: {
        Type: "",
        Value: 0,
      },
      LegTarget: {
        Type: "",
        Value: 0,
      },
      LegTrailSL: {
        Type: "",
        Value: {
          InstrumentMove: 0,
          StopLossMove: 0,
        },
      },
      LegMomentum: {
        Type: "",
        Value: 0,
      },
      ExpiryKind: leg.expiry,
      EntryType: leg.strike_criteria,
      StrikeParameter: handleSwitchParameter(leg.strike_criteria, leg),
      InstrumentKind: "",
      LegReentrySL: {
        Type: "",
        Value: 0,
      },
      LegReentryTP: {
        Type: "",
        Value: 1,
      },
    };
    try {
      await addDoc(legsRef, {
        ...legDetails,
        createAt: Timestamp.now(),
      });
      fetchLegs()
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLegs = async () => {
    try {
      const response = await getDocs(collectionRef)
      const mappedResponse = response.docs.map(doc => doc.data())
      setAllLegs(mappedResponse as [])
      // console.log(mappedResponse)
    } catch (error) {
      console.log(error)
    }
  }

  const copyLeg = async (id: string) => {
    const foundLeg = allLegs.filter((leg: TLeg) => leg.id === id)
    // console.log(foundLeg[0] as object)
    try {
      await addDoc(collectionRef, {...foundLeg[0] as object, id: v4()})
      fetchLegs()
      alert("Copied successfully")
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteLeg = async (id: string) => {
    const legRef = doc(db, "legs", id)
    try {
      await deleteDoc(legRef)
      fetchLegs()
      alert("Deleted successfully")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLegs()
  }, [])

  return (
    <div className="App">
      <div className="backtest__controller">
        <div className="app__segment">
          <h5>Select segments</h5>
          <div className="controller">
            <div
              className={
                controller === "Futures"
                  ? "active__controller futures"
                  : "futures"
              }
              onClick={() => handleSetController("Futures")}
            >
              Futures
            </div>
            <div
              className={
                controller === "Options"
                  ? "active__controller options"
                  : "options"
              }
              onClick={() => handleSetController("Options")}
            >
              Options
            </div>
          </div>
        </div>

        {/* Leg Input */}
        {controller === "Options" && (
          <Leg
            leg={leg}
            handleOnChangeEvenet={handleSetEvent}
            handleSubmitLeg={handleAddLeg}
          />
        )}

        {/* All Legs */}
        <Legs allLegs={allLegs as []} copyLeg={copyLeg} deleteLeg={handleDeleteLeg} />
      </div>
    </div>
  );
}

export default App;
