import { doc, updateDoc } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { strikeTypes } from "../data/legs";
import { db } from "../firebase-config";
import { handleSwitchParameter } from "../helpers";
import { LegI, TLeg } from "../interfaces";
import { StrikeCriteria } from "../types";

const SingleLeg: FC<{
  leg: LegI;
  handleDeleteLeg: (id: string) => void;
  handleAddLeg: (id: string) => void;
}> = ({ leg, handleDeleteLeg, handleAddLeg }) => {
  const [singleLeg, setSingleLeg] = useState<TLeg>({
    id: leg.id,
    total_lot: leg.Lots,
    position: leg.PositionType,
    option_type: "Call",
    expiry: leg.ExpiryKind,
    strike_criteria: leg.EntryType as StrikeCriteria,
    strike_type: leg?.StrikeParameter,
    lower_range: leg?.StrikeParameter?.Lower,
    upper_range: leg?.StrikeParameter?.Upper,
    premium: leg?.StrikeParameter,
    atm_strike_sign: leg?.StrikeParameter?.Adjustment,
    atm_strike_amount: leg?.StrikeParameter?.Multiplier,
    leg_stop_loss: {
      type: leg?.LegStopLoss.Type,
      value: leg?.LegStopLoss.Value,
    },
    leg_target: {
      type: leg?.LegStopLoss.Type,
      value: leg?.LegStopLoss.Value,
    },
    leg_trail_sl: {
      type: leg?.LegTrailSL.Type,
      value: {
        instrument_move: leg?.LegTrailSL.Value.InstrumentMove,
        stop_lost_move: leg?.LegTrailSL.Value.StopLossMove,
      },
    },
    leg_momentum: {
      type: leg?.LegMomentum.Type,
      value: leg?.LegMomentum.Value,
    },
    instrument_kind: leg?.InstrumentKind,
    leg_rentry_sl: {
      type: leg?.LegReentrySL.Type,
      value: leg?.LegReentrySL.Value,
    },
    leg_rentry_tp: {
      type: leg?.LegReentryTP.Type,
      value: leg?.LegReentryTP.Value,
    },
  });

  // Check for states
  const [sm, setSm] = useState(false);
  const [tm, setTm] = useState(false);
  const [stopLoss, setStopLoss] = useState(false);
  const [trailSL, setTrailSL] = useState(false);
  const [reEntryTgt, setReEntryTgt] = useState(false);
  const [reEntrySL, setReEntrySL] = useState(false);

  const handleUpdateLeg = async () => {
    const legDetails: LegI = {
      id: singleLeg.id,
      PositionType: singleLeg.position,
      Lots: singleLeg.total_lot,
      LegStopLoss: {
        Type: singleLeg.leg_stop_loss.type,
        Value: singleLeg.leg_stop_loss.value,
      },
      LegTarget: {
        Type: singleLeg.leg_target.type,
        Value: singleLeg.leg_target.value,
      },
      LegTrailSL: {
        Type: singleLeg.leg_trail_sl.type,
        Value: {
          InstrumentMove: singleLeg.leg_trail_sl.value.instrument_move,
          StopLossMove: singleLeg.leg_trail_sl.value.stop_lost_move,
        },
      },
      LegMomentum: {
        Type: singleLeg.leg_momentum.type,
        Value: singleLeg.leg_momentum.value,
      },
      ExpiryKind: singleLeg.expiry,
      EntryType: singleLeg.strike_criteria,
      StrikeParameter: handleSwitchParameter(
        singleLeg.strike_criteria,
        singleLeg
      ),
      InstrumentKind: singleLeg.instrument_kind,
      LegReentrySL: {
        Type: singleLeg.leg_rentry_sl.type,
        Value: singleLeg.leg_rentry_sl.value,
      },
      LegReentryTP: {
        Type: singleLeg.leg_rentry_tp.type,
        Value: singleLeg.leg_rentry_tp.value,
      },
    };

    const legRef = doc(db, "legs", leg.id);
    console.log(legRef);
    try {
      await updateDoc(legRef, { ...legDetails });
      console.log("Updated");
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSingleLeg({ ...singleLeg, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    handleUpdateLeg();
  }, [singleLeg]);

  return (
    <div className="single__leg">
      <i
        className="bx bx-x delete"
        onClick={() => handleDeleteLeg(singleLeg.id)}
      ></i>
      <i
        className="bx bx-copy copy"
        onClick={() => handleAddLeg(singleLeg.id)}
      ></i>
      <div className="leg__options">
        <h5>Lots: </h5>
        <input type="number" name="total_lot" value={singleLeg.total_lot} />
        <select
          name="position"
          value={singleLeg.position}
          onChange={handleOnChange}
        >
          <option value={singleLeg.position}>{singleLeg.position}</option>
          <option value={singleLeg.position === "Buy" ? "Sell" : "Buy"}>
            {singleLeg.position === "Buy" ? "Sell" : "Buy"}
          </option>
        </select>
        <select name="option_type">
          <option value={"Call"}>Call</option>
          <option value="Put">Put</option>
        </select>
        <select
          name="expiry"
          value={singleLeg.expiry}
          onChange={handleOnChange}
        >
          <option value={singleLeg.expiry}>{singleLeg.expiry}</option>
          <option value={singleLeg.expiry === "Weekly" ? "Monthly" : "Weekly"}>
            {singleLeg.expiry === "Weekly" ? "Monthly" : "Weekly"}
          </option>
        </select>

        <h5>Select Strike</h5>
        <div className="option">
          <select
            name="strike_criteria"
            value={singleLeg.strike_criteria}
            defaultValue="Strike Type"
            onChange={handleOnChange}
          >
            <option value="Strike Type">Strike Type</option>
            <option value="Premium Range">Premium Range</option>
            <option value="Closest Premium">Closest Premium</option>
            <option value="Straddle Width">Straddle Width</option>
          </select>
        </div>

        {/* Strike Type. Only show if strike criteria is === Strike Type */}
        {singleLeg.strike_criteria === "Strike Type" && (
          <div className="option">
            {/* <label htmlFor="strike type">Strike Type</label> */}
            <select
              name="strike_type"
              value={singleLeg.strike_type}
              onChange={handleOnChange}
            >
              {strikeTypes.map((strike) => (
                <option value={strike}>{strike}</option>
              ))}
            </select>
          </div>
        )}

        {/* Strike Ranges. Only visible if strike criteria === Premium Range */}
        {singleLeg.strike_criteria === "Premium Range" && (
          <div className="option">
            {/* <label htmlFor="lower range">Lower Range</label> */}
            <input
              type="number"
              name="lower_range"
              value={singleLeg.lower_range}
              onChange={handleOnChange}
            />
          </div>
        )}
        {singleLeg.strike_criteria === "Premium Range" && (
          <div className="option">
            {/* <label htmlFor="upper range">Upper Range</label> */}
            <input
              type="number"
              name="upper_range"
              value={singleLeg.upper_range}
              onChange={handleOnChange}
            />
          </div>
        )}

        {/* Premium. Only visible if strike criteria === Closest Premium */}
        {singleLeg.strike_criteria === "Closest Premium" && (
          <div className="option">
            {/* <label htmlFor="premium">Premium</label> */}
            <input
              type="number"
              name="premium"
              value={singleLeg.premium}
              onChange={handleOnChange}
            />
          </div>
        )}

        {/* ATM Strike */}
        {singleLeg.strike_criteria === "Straddle Width" && (
          <div className="option">
            [ATM Strike{" "}
            <select
              name="option"
              value={singleLeg.atm_strike_sign}
              onChange={handleOnChange}
              defaultValue="-"
            >
              <option value="-">-</option>
              <option value="+">+</option>
            </select>
            (
            <input
              type="number"
              name="strike"
              value={singleLeg.atm_strike_amount}
              onChange={handleOnChange}
            />{" "}
            x ATM Saddle Price) ]
          </div>
        )}
      </div>

      {/* Additional Settings */}
      <div className="additional__settings">
        <div className="setting">
          <div className="name">
            <input
              type="checkbox"
              name="simple_momentum"
              checked={sm}
              onChange={(e) => setSm(!sm)}
            />
            <label htmlFor="simple_momentum">Simple Momentum</label>
          </div>{" "}
          <br />
          <div className="setting__value">
            <select
              name="simple_momentum_value"
              value={singleLeg.leg_momentum?.type}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_momentum: {
                    ...singleLeg.leg_momentum,
                    type: e.target.value as string,
                  },
                })
              }
              disabled={!sm}
            >
              <option value="Point Up">
                Points <i className="bx bxs-up-arrow-alt"></i>
              </option>
              <option value="Point Down">
                Points <i className="bx bxs-down-arrow-alt"></i>
              </option>
              <option value="Percentage Up">
                Percentage <i className="bx bxs-up-arrow-alt"></i>
              </option>
              <option value="Percentage Down">
                Percentage <i className="bx bxs-down-arrow-alt"></i>
              </option>
              <option value="Underlying Point Up">
                Underlying Points <i className="bx bxs-up-arrow-alt"></i>
              </option>
              <option value="Underlying Point Down">
                Underlying Points <i className="bx bxs-down-arrow-alt"></i>
              </option>
              <option value="Underlying Percentage Up">
                Underlying Percentage <i className="bx bxs-up-arrow-alt"></i>
              </option>
              <option value="Underlying Percentage Down">
                Underlying Percentage <i className="bx bxs-down-arrow-alt"></i>
              </option>
            </select>
            <input
              type="number"
              name="value"
              value={singleLeg.leg_momentum?.value}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_momentum: {
                    ...singleLeg.leg_momentum,
                    value: parseInt(e.target.value),
                  },
                })
              }
              disabled={!sm}
            />
          </div>
        </div>

        <div className="setting">
          <div className="name">
            <input
              type="checkbox"
              name="target_profit"
              checked={tm}
              onChange={() => setTm(!tm)}
            />
            <label htmlFor="target_profit">Target Profit</label>
          </div>{" "}
          <br />
          <div className="setting__value">
            <select
              name="target_profit_value"
              value={singleLeg.leg_stop_loss.type}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_stop_loss: {
                    ...singleLeg.leg_stop_loss,
                    type: e.target.value,
                  },
                })
              }
              disabled={!tm}
            >
              <option value="Points">Points</option>
              <option value="Underlying Points">Underlying Points</option>
              <option value="Points">Percentage</option>
              <option value="Underlying Percentage">
                Underlying Percentage
              </option>
            </select>
            <input
              type="number"
              name="value"
              value={singleLeg.leg_stop_loss.value}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_stop_loss: {
                    ...singleLeg.leg_stop_loss,
                    value: parseInt(e.target.value),
                  },
                })
              }
              disabled={!tm}
            />
          </div>
        </div>

        <div className="setting">
          <div className="name">
            <input
              type="checkbox"
              name="stop_loss"
              checked={stopLoss}
              onChange={() => setStopLoss(!stopLoss)}
            />
            <label htmlFor="stop_loss">Stop Loss</label>
          </div>{" "}
          <br />
          <div className="setting__value">
            <select
              name="stop_loss_value"
              value={singleLeg.leg_stop_loss.type}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_stop_loss: {
                    ...singleLeg.leg_stop_loss,
                    type: e.target.value,
                  },
                })
              }
              disabled={!stopLoss}
            >
              <option value="Points">Points</option>
              <option value="Underlying Points">Underlying Points</option>
              <option value="Points">Percentage</option>
              <option value="Underlying Percentage">
                Underlying Percentage
              </option>
            </select>
            <input
              type="number"
              name="value"
              value={singleLeg.leg_stop_loss.value}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_stop_loss: {
                    ...singleLeg.leg_stop_loss,
                    value: parseInt(e.target.value),
                  },
                })
              }
              disabled={!stopLoss}
            />
          </div>
        </div>

        <div className="setting">
          <div className="name">
            <input
              type="checkbox"
              name="trail_sl"
              checked={trailSL}
              onChange={() => setTrailSL(!trailSL)}
            />
            <label htmlFor="trail_sl">Trail SL</label>
          </div>{" "}
          <br />
          <div className="setting__value">
            <select
              name="trail_sl_value"
              value={singleLeg.leg_trail_sl.type}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_trail_sl: {
                    ...singleLeg.leg_trail_sl,
                    type: e.target.value,
                  },
                })
              }
              disabled={!trailSL}
            >
              <option value="Point Up">Point</option>
              <option value="Percentage">Percentage</option>
            </select>
            <input
              type="number"
              name="value"
              value={singleLeg.leg_trail_sl.value.instrument_move}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_trail_sl: {
                    ...singleLeg.leg_trail_sl,
                    value: {
                      ...singleLeg.leg_trail_sl.value,
                      instrument_move: parseInt(e.target.value),
                    },
                  },
                })
              }
              disabled={!trailSL}
            />
            <input
              type="number"
              name="value"
              value={singleLeg.leg_trail_sl.value.stop_lost_move}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_trail_sl: {
                    ...singleLeg.leg_trail_sl,
                    value: {
                      ...singleLeg.leg_trail_sl.value,
                      stop_lost_move: parseInt(e.target.value),
                    },
                  },
                })
              }
              disabled={!trailSL}
            />
          </div>
        </div>

        <div className="setting">
          <div className="name">
            <input
              type="checkbox"
              name="re_entry_tgt"
              checked={reEntryTgt}
              onChange={() => setReEntryTgt(!reEntryTgt)}
            />
            <label htmlFor="re_entry_tgt">Re-entry on Tgt</label>
          </div>{" "}
          <br />
          <div className="setting__value">
            <select
              name="re_entry_tgt"
              value={singleLeg.leg_rentry_tp.type}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_rentry_tp: {
                    ...singleLeg.leg_rentry_tp,
                    type: e.target.value,
                  },
                })
              }
              disabled={!reEntryTgt}
            >
              <option value="RE ASAP">RE ASAP</option>
              <option value="RE ASAP LEFT">
                RE ASAP <i className="bx bxs-chevron-left"></i>
              </option>
              <option value="RE MOMENTUM">RE MOMENTUM</option>
              <option value="RE MOMENTUM LEFT">
                RE MOMENTUM <i className="bx bxs-chevron-left"></i>
              </option>
              <option value="RE COST">RE COST</option>
              <option value="RE COST LEFT">
                RE COST <i className="bx bxs-chevron-left"></i>
              </option>
            </select>
            <input
              type="number"
              name="value"
              value={singleLeg.leg_rentry_tp.value}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_rentry_tp: {
                    ...singleLeg.leg_rentry_tp,
                    value: parseInt(e.target.value),
                  },
                })
              }
              disabled={!reEntryTgt}
            />
          </div>
        </div>

        <div className="setting">
          <div className="name">
            <input
              type="checkbox"
              name="re_entry_sl"
              checked={reEntrySL}
              onChange={() => setReEntrySL(!reEntrySL)}
            />
            <label htmlFor="re_entry">Re-entry on SL</label>
          </div>{" "}
          <br />
          <div className="setting__value">
            <select
              name="re_entry_sl"
              value={singleLeg.leg_rentry_sl.type}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_rentry_sl: {
                    ...singleLeg.leg_rentry_sl,
                    type: e.target.value,
                  },
                })
              }
              disabled={!reEntrySL}
            >
              <option value="RE ASAP">RE ASAP</option>
              <option value="RE ASAP LEFT">
                RE ASAP <i className="bx bxs-chevron-left"></i>
              </option>
              <option value="RE MOMENTUM">RE MOMENTUM</option>
              <option value="RE MOMENTUM LEFT">
                RE MOMENTUM <i className="bx bxs-chevron-left"></i>
              </option>
              <option value="RE COST">RE COST</option>
              <option value="RE COST LEFT">
                RE COST <i className="bx bxs-chevron-left"></i>
              </option>
            </select>
            <input
              type="number"
              name="value"
              value={singleLeg.leg_rentry_sl.value}
              onChange={(e) =>
                setSingleLeg({
                  ...singleLeg,
                  leg_rentry_sl: {
                    ...singleLeg.leg_rentry_sl,
                    value: parseInt(e.target.value),
                  },
                })
              }
              disabled={!reEntrySL}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLeg;
